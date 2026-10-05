import { useEffect, useState } from "react";

import {
  getEvents,
  createRegistration
} from "../api/api";

function RegistrationForm({ onRegistered }) {

  const [events, setEvents] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    event_id: "",
    registration_date:
      new Date().toISOString().split("T")[0],
    status: "Registered"
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  useEffect(() => {
    loadEvents();
  }, []);


  const loadEvents = async () => {

    try {

      const response = await getEvents();

      setEvents(response.data);

    } catch (error) {

      setError("Failed to load events");

    }

  };


  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");


    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.event_id ||
      !form.registration_date
    ) {

      setError("All fields are required");
      return;

    }


    try {

      const response =
        await createRegistration(form);

      setSuccess(
        `Registration successful! Registration ID: ${response.data.registrationId}`
      );


      setForm({
        name: "",
        email: "",
        phone: "",
        event_id: "",
        registration_date:
          new Date().toISOString().split("T")[0],
        status: "Registered"
      });


    } catch (error) {

      setError(
        error.response?.data?.error ||
        "Registration failed"
      );

    }

  };


  return (
    <div>

      <h1>Event Registration</h1>


      {error && (
        <p className="error">{error}</p>
      )}

      {success && (
        <p className="success">{success}</p>
      )}


      <form
        className="form"
        onSubmit={handleSubmit}
      >

        <label>Full Name</label>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
        />


        <label>Email</label>

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />


        <label>Phone Number</label>

        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />


        <label>Event</label>

        <select
          name="event_id"
          value={form.event_id}
          onChange={handleChange}
        >

          <option value="">
            Select Event
          </option>

          {events.map((event) => (

            <option
              key={event.id}
              value={event.id}
              disabled={
                event.available_seats === 0 ||
                event.status === "Cancelled"
              }
            >

              {event.event_name}
              {" - "}
              {event.available_seats} seats

            </option>

          ))}

        </select>


        <label>Registration Date</label>

        <input
          type="date"
          name="registration_date"
          value={form.registration_date}
          onChange={handleChange}
        />


        <button type="submit">
          Register
        </button>

      </form>

    </div>
  );
}

export default RegistrationForm;