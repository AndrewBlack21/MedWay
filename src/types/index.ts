import type { FeatureCollection } from "geojson";

export interface Doctor {
  id: string;
  user_id: string;
  name: string;
  specialty: string;
  address: string;
  lat: number;
  lng: number;
  hours: string | null;
  created_at: string;
}

export interface DoctorFormData {
  name: string;
  specialty: string;
  address: string;
  hours: string;
}

export type VisitStatus = "visited" | "not_visited" | "pending";

export interface VisitLog {
  id: string;
  user_id: string;
  doctorId: string;
  visit_date: string;
  status: VisitStatus;
  comment: string | null;
  created_at: string;
}

export interface Daylog {
  date: string;
  logs: VisitLog[];
}

export interface RouteStop {
  doctor: Doctor;
  order: number;
  estimated_arrival?: string;
  distance_from_prev_km?: number;
}

export interface RouteResult {
  stops: RouteStop[];
  total_distance_km: number;
  geojson?: FeatureCollection;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export type RootStackParamList = {
  Login: undefined;
  DoctorsList: undefined;
  DoctorForm: { doctor?: Doctor };
  Map: undefined;
  Route: undefined;
  Import: undefined; // nova rota de importação
  Calendar: undefined;
};
