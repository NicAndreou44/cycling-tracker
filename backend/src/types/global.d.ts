
import { Ride } from "./Ride";

declare global {
  namespace Express {
    interface Request {
      ride?: Ride;
    }
  }
}
