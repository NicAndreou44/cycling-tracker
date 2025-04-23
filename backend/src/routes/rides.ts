
import { Router } from "express";
import {
  getRides,
  addRide,
  updateRideById,
  deleteRideById,
} from "../services/rideService";
import { validateRideData } from "../middleware/validateRideData";
import { validateRideId }   from "../middleware/validateRideId";

const router = Router();

router.get("/", async (req, res, next) => {
  try { res.json(await getRides()); }
  catch (err) { next(err); }
});

router.post("/", validateRideData, async (req, res, next) => {
  try { res.status(201).json(await addRide(req.body)); }
  catch (err) { next(err); }
});

router.get("/:id", validateRideId, (req, res) => {
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
