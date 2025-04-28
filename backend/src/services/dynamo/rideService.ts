import { DynamoDBClient, PutItemCommand, ScanCommand, DeleteItemCommand, GetItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { Ride, RideInput } from "../../types/Rides";

const client = new DynamoDBClient({ region: "ap-southeast-2" });
const tableName = "rides";

export const addRide = async (input: RideInput): Promise<Ride> => {
  const { name, distanceKm, duration_minutes, type, notes } = input;

  const item = {
    id: { S: new Date().getTime().toString() }, 
    name: { S: name },
    distance: { N: distanceKm.toString() },
    duration_minutes: { N: (duration_minutes ?? 0).toString() },
    type: { S: type ?? "" },
    notes: { S: notes ?? "" },
    timestamp: { S: new Date().toISOString() },
  };

  await client.send(new PutItemCommand({
    TableName: tableName,
    Item: item,
  }));

  return {
    id: parseInt(item.id.S ?? "0"), 
    name,
    distanceKm,
    duration_minutes: duration_minutes ?? 0,
    type: type ?? "",
    notes: notes ?? "",
  };
};

export const getRides = async (): Promise<Ride[]> => {
  const result = await client.send(new ScanCommand({ TableName: tableName }));

  return (result.Items || []).map(item => ({
    id: parseInt(item.id?.S ?? "0"), 
    name: item.name?.S ?? "",
    distanceKm: Number(item.distance?.N ?? 0),
    duration_minutes: Number(item.duration_minutes?.N ?? 0),
    type: item.type?.S ?? "",
    notes: item.notes?.S ?? "",
  }));
};

export const getRideById = async (id: number): Promise<Ride> => {
  const result = await client.send(new GetItemCommand({
    TableName: tableName,
    Key: { id: { S: id.toString() } }, 
  }));

  const item = result.Item;

  if (!item || !item.id?.S) {
    throw new Error("Ride not found");
  }

  return {
    id: parseInt(item.id.S),
    name: item.name?.S ?? "",
    distanceKm: Number(item.distance?.N ?? 0),
    duration_minutes: Number(item.duration_minutes?.N ?? 0),
    type: item.type?.S ?? "",
    notes: item.notes?.S ?? "",
  };
};

export const updateRideById = async (id: number, input: RideInput): Promise<Ride> => {
  const { name, distanceKm, duration_minutes, type, notes } = input;

  await client.send(new UpdateItemCommand({
    TableName: tableName,
    Key: { id: { S: id.toString() } }, 
    UpdateExpression: "SET #name = :name, distance = :distance, duration_minutes = :duration_minutes, #type = :type, notes = :notes",
    ExpressionAttributeNames: {
      "#name": "name",
      "#type": "type",
    },
    ExpressionAttributeValues: {
      ":name": { S: name },
      ":distance": { N: distanceKm.toString() },
      ":duration_minutes": { N: (duration_minutes ?? 0).toString() },
      ":type": { S: type ?? "" },
      ":notes": { S: notes ?? "" },
    },
  }));

  return getRideById(id);
};

export const deleteRideById = async (id: number): Promise<void> => {
  
  const existingItem = await client.send(new GetItemCommand({
    TableName: tableName,
    Key: { id: { S: id.toString() } },
  }));
  
  if (!existingItem.Item || !existingItem.Item.id?.S) {
    throw new Error("Ride not found");
  }

  await client.send(new DeleteItemCommand({
    TableName: tableName,
    Key: { id: { S: id.toString() } },
  }));
};
