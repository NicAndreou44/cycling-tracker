import { Ride } from "../types/Rides"; 

declare global {
  namespace Express {
    interface Request {
      ride?: Ride;    
      user?: { userId: number }; 
    }
  }
}

export {};
