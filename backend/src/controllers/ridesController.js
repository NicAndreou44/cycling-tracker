const {
  getRides,
  addRide: addRideToDb,
  getRideById,
  updateRideById,
  deleteRideById,
} = require("../services/rideService");
const { rideSchema } = require("../validation/rideSchema");

const getAllRides = async (req, res) => {
  try {
    const allRides = await getRides();
    res.status(200).json(allRides);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createRide = async (req, res) => {
  try {
    const parsed = rideSchema.parse(req.body);
    const addedRide = await addRideToDb(parsed);
    res.status(201).json(addedRide);
  } catch (error) {
    res.status(400).json({ error: error.errors || error.message });
  }
};

const updateRide = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const parsed = rideSchema.parse(req.body);
    const ride = await updateRideById(id, parsed);
    res.status(200).json(ride);
  } catch (error) {
    const status = error.errors ? 400 : 404;
    res.status(status).json({ error: error.errors || error.message });
  }
};

const getRideDetails = async (req, res) => {
  res.status(200).json(req.ride);
};

const deleteRide = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const deletedRide = await deleteRideById(id);
    res.status(200).json(deletedRide);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  getAllRides,
  createRide,
  getRideDetails,
  updateRide,
  deleteRide,
};
