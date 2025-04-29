mport { DynamoDBClient, PutItemCommand, ScanCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "ap-southeast-2" });
const tableName = "rides";

export const handler = async (event) => {
  const method = event.requestContext.http.method;

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (method === "OPTIONS") {
    return { statusCode: 200, headers, body: JSON.stringify({}) };
  }

  if (method === "POST") {
    const body = JSON.parse(event.body || "{}");
    const { distance, duration, type, notes } = body;

    if (!distance || !duration || !type) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing required fields: distance, duration, type" }),
      };
    }

    const item = {
      id: { N: new Date().getTime().toString() },
      distance: { N: distance.toString() },
      duration: { N: duration.toString() },
      type: { S: type },
      notes: { S: notes || "" },
      timestamp: { S: new Date().toISOString() },
    };

    try {
      await client.send(new PutItemCommand({
        TableName: tableName,
        Item: item,
      }));

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ message: "Ride stored successfully", ride: item }),
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Failed to store ride" }),
      };
    }
  }

  if (method === "GET") {
    try {
      const result = await client.send(new ScanCommand({ TableName: tableName }));

      const rides = (result.Items || []).map(item => ({
        id: item.id.N,
        distance: Number(item.distance.N),
        duration: Number(item.duration.N),
        type: item.type?.S || "",
        notes: item.notes?.S || "",
        timestamp: item.timestamp?.S || "",
      }));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(rides),
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Failed to fetch rides" }),
      };
    }
  }

  if (method === "DELETE") {
    const params = event.queryStringParameters || {};
    const id = params.id;

    if (!id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing ride ID for deletion" }),
      };
    }

    try {
      await client.send(new DeleteItemCommand({
        TableName: tableName,
        Key: { id: { N: id } },
      }));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: Ride ${id} deleted successfully }),
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Failed to delete ride" }),
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: "Method not allowed" }),
  };
};