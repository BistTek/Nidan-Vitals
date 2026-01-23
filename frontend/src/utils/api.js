import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

export const saveObservation = (data) =>
  API.post("/api/fhir/observation", data);

export const getObservations = (params) =>
  API.get("/api/fhir/observation", { params });
