import { useEffect, useState } from "react";
import {
  getEvents,
  deleteEvent
} from "../api/api";

function EventList({ onEdit, onRegister }) {

  const [events, setEvents] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [error, setError] = useState("");

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

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      await deleteEvent(id);

      loadEvents();

    } catch (error) {

      setError(
        error.response?.data?.error ||
        "Failed to delete event"
      );

    }
  };


  const filteredEvents = events.filter((event) => {

    const matchesSearch =
      event.event_name
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "" ||
      event.status === statusFilter;

    const matchesDate =
      dateFilter === "" ||
      event.event_date === dateFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesDate
    );
  });


  return (
    <div>

      <h1>Events</h1>

      {error && (
        <p className="error">{error}</p>
      )}

      <div className="filters">

        <input
          type="text"
          placeholder="Search event name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="">All Status</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) =>
            setDateFilter(e.target.value)
          }
        />

      </div>


      <div className="event-grid">

        {filteredEvents.length === 0 ? (

          <p>No events found.</p>

        ) : (

          filteredEvents.map((event) => (

            <div
              className="event-card"
              key={event.id}
            >

              <h2>{event.event_name}</h2>

              <p>
                {event.description}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {event.event_date}
              </p>

              <p>
                <strong>Time:</strong>{" "}
                {event.event_time}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {event.location}
              </p>

              <p>
                <strong>Seats:</strong>{" "}
                {event.available_seats}
                {" / "}
                {event.total_seats}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {event.status}
              </p>


              <div className="actions">

                <button
                  onClick={() => onEdit(event)}
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(event.id)
                  }
                >
                  Delete
                </button>

                {event.available_seats > 0 &&
                  event.status !== "Cancelled" && (

                  <button
                    onClick={onRegister}
                  >
                    Register
                  </button>

                )}

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default EventList;