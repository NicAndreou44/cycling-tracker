import { Router, Request } from "express";
import {
  getRides,
  addRide,
  updateRideById,
  deleteRideById,
} from "../services/rideService.js";
import { validateRideData } from "../middleware/validateRideData.js";
import { validateRideId } from "../middleware/validateRideId.js";
import { authenticateJWT } from "../middleware/authmiddleware.js";

const router = Router();
router.use(authenticateJWT);


interface RideRequest extends Request {
  ride?: any;
}

router.get("/", async (req, res, next) => {
  try { res.json(await getRides()); }
  catch (err) { next(err); }
});

router.post("/", validateRideData, async (req, res, next) => {
  try { res.status(201).json(await addRide(req.body)); }
  catch (err) { next(err); }
});

router.get("/:id", validateRideId, (req: RideRequest, res) => {
  res.json(req.ride);
});

router.put("/:id", validateRideId, validateRideData, async (req, res, next) => {
  try {
    res.json(
      await updateRideById(Number(req.params.id), req.body)
    );
  } catch (err) { next(err); }
});

router.delete("/:id", validateRideId, async (req, res, next) => {
  try {
    res.json(await deleteRideById(Number(req.params.id)));
  } catch (err) { next(err); }
});

export default router;
