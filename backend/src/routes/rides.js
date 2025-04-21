const express = require("express");
const router = express.Router();

const {
  getAllRides,
  createRide,
  getRideDetails,
  updateRide,
  deleteRide,

} = require("../controllers/ridesController");

const validateRideId = require("../middleware/validateRideId");

router.get("/", getAllRides);
router.post("/", createRide);

router.get("/:id", validateRideId, getRideDetails);
router.put("/:id", validateRideId, updateRide);
router.delete("/:id", validateRideId, deleteRide);


module.exports = router;
