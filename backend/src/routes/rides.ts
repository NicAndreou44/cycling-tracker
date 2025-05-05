
import { Router } from "express";
import {
  getAllRides,
  createRide,
  getRideDetails,
  updateRide,
  deleteRide,
} from "../controllers/ridesController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { validateIdParam } from "../middleware/validateidparam.js";  

const router = Router();

router.get    ("/",    requireAuth, getAllRides);
router.post   ("/",    requireAuth, createRide);
router.get    ("/:id", requireAuth, validateIdParam("id"), getRideDetails);
router.put    ("/:id", requireAuth, validateIdParam("id"), updateRide);
router.delete ("/:id", requireAuth, validateIdParam("id"), deleteRide);

export default router;
