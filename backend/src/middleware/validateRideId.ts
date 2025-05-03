import { Request, Response, NextFunction } from "express";

export const validateRideId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const id = Number(req.params.id);

  if (!id || isNaN(id)) {
    res.status(400).json({ error: "Invalid ride ID" });
    return;
  }

  next();
  return;
};
