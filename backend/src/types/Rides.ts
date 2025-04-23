
export interface Ride {
  id: number;
  name: string;
  distanceKm: number;
  duration_minutes?: number;
  type?: string;
  notes?: string;
}

export interface RideInput {
  name: string;
  distanceKm: number;
  duration_minutes?: number;
  type?: string;
  notes?: string;
}
