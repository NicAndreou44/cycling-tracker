
import { Router } from "express";
import {
  getAllRides,
  createRide,
  getRideDetails,
  updateRide,
  deleteRide,
} from "../controllers/ridesController.js"; 
import { validateRideData } from "../middleware/validateRideData.js";
import { validateRideId } from "../middleware/validateRideId.js";
import { authenticateJWT } from "../middleware/authmiddleware.js";

const router = Router();

router.use(authenticateJWT);


router.get("/", getAllRides);
router.post("/", validateRideData, createRide);
router.get("/:id", validateRideId, getRideDetails);
router.put("/:id", validateRideId, validateRideData, updateRide);
router.delete("/:id", validateRideId, deleteRide);

export default router;