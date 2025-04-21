const { getRideById } = require("../services/rideService");

const validateRideId = async (req, res, next) => {
  const id = parseInt(req.params.id);

  try {
    const ride = await getRideById(id);
    req.ride = ride;
    next();
  } catch (error) {
    res.status(404).json({ error: "Ride not found" });
  }
};

module.exports = validateRideId;
