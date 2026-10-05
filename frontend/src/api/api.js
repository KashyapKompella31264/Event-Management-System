import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

// EVENTS

export const getEvents = () =>
  API.get("/events");

export const getEventById = (id) =>
  API.get(`/events/${id}`);

export const createEvent = (data) =>
  API.post("/events", data);

export const updateEvent = (id, data) =>
  API.put(`/events/${id}`, data);

export const deleteEvent = (id) =>
  API.delete(`/events/${id}`);


// REGISTRATIONS

export const getRegistrations = () =>
  API.get("/registrations");

export const createRegistration = (data) =>
  API.post("/registrations", data);

export const updateRegistration = (id, data) =>
  API.put(`/registrations/${id}`, data);

export const cancelRegistration = (id) =>
  API.delete(`/registrations/${id}`);


// DASHBOARD

export const getDashboard = () =>
  API.get("/dashboard");