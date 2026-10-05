import { useEffect, useState } from "react";

import {
  createEvent,
  updateEvent
} from "../api/api";

function EventForm({
  editingEvent,
  onSaved,
  onCancel
}) {

  const [form, setForm] = useState({
    event_name: "",
    description: "",
    event_date: "",
    event_time: "",
    location: "",
    total_seats: "",
    available_seats: "",
    status: "Upcoming"
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  useEffect(() => {

    if (editingEvent) {

      setForm({
        event_name: editingEvent.event_name,
        description: editingEvent.description,
        event_date: editingEvent.event_date,
        event_time: editingEvent.event_time,
        location: editingEvent.location,
        total_seats: editingEvent.total_seats,
        available_seats: editingEvent.available_seats,
        status: editingEvent.status
      });

    }

  }, [editingEvent]);


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
      !form.event_name ||
      !form.description ||
      !form.event_date ||
      !form.event_time ||
      !form.location ||
      !form.total_seats ||
      form.available_seats === "" ||
      !form.status
    ) {

      setError("All fields are required");
      return;

    }


    if (
      Number(form.available_seats) >
      Number(form.total_seats)
    ) {

      setError(
        "Available seats cannot exceed total seats"
      );

      return;
    }


    try {

      if (editingEvent) {

        await updateEvent(
          editingEvent.id,
          {
            ...form,
            total_seats: Number(form.total_seats),
            available_seats:
              Number(form.available_seats)
          }
        );

        setSuccess(
          "Event updated successfully"
        );

      } else {

        await createEvent({
          ...form,
          total_seats: Number(form.total_seats),
          available_seats:
            Number(form.available_seats)
        });

        setSuccess(
          "Event created successfully"
        );

      }


      setTimeout(() => {
        onSaved();
      }, 500);

    } catch (error) {

      setError(
        error.response?.data?.error ||
        "Failed to save event"
      );

    }

  };


  return (
    <div>

      <h1>
        {editingEvent
          ? "Edit Event"
          : "Add Event"}
      </h1>


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

        <label>Event Name</label>

        <input
          name="event_name"
          value={form.event_name}
          onChange={handleChange}
        />


        <label>Description</label>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />


        <label>Event Date</label>

        <input
          type="date"
          name="event_date"
          value={form.event_date}
          onChange={handleChange}
        />


        <label>Event Time</label>

        <input
          type="time"
          name="event_time"
          value={form.event_time}
          onChange={handleChange}
        />


        <label>Location</label>

        <input
          name="location"
          value={form.location}
          onChange={handleChange}
        />


        <label>Total Seats</label>

        <input
          type="number"
          name="total_seats"
          min="1"
          value={form.total_seats}
          onChange={handleChange}
        />


        <label>Available Seats</label>

        <input
          type="number"
          name="available_seats"
          min="0"
          value={form.available_seats}
          onChange={handleChange}
        />


        <label>Status</label>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >

          <option value="Upcoming">
            Upcoming
          </option>

          <option value="Completed">
            Completed
          </option>

          <option value="Cancelled">
            Cancelled
          </option>

        </select>


        <div className="actions">

          <button type="submit">
            {editingEvent
              ? "Update Event"
              : "Create Event"}
          </button>

          {editingEvent && (

            <button
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>

          )}

        </div>

      </form>

    </div>
  );
}

export default EventForm;