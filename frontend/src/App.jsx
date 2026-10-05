import { useState } from "react";

import Dashboard from "./components/Dashboard";
import EventList from "./components/EventList";
import EventForm from "./components/EventForm";
import RegistrationList from "./components/RegistrationList";
import RegistrationForm from "./components/RegistrationForm";

import "./App.css";

function App() {
  const [page, setPage] = useState("dashboard");
  const [editingEvent, setEditingEvent] = useState(null);

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setPage("event-form");
  };

  const handleEventSaved = () => {
    setEditingEvent(null);
    setPage("events");
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
    setPage("events");
  };

  return (
    <div className="app">

      <nav className="navbar">

        <h2>Event Management System</h2>

        <div className="nav-buttons">

          <button onClick={() => setPage("dashboard")}>
            Dashboard
          </button>

          <button onClick={() => setPage("events")}>
            Events
          </button>

          <button onClick={() => {
            setEditingEvent(null);
            setPage("event-form");
          }}>
            Add Event
          </button>

          <button onClick={() => setPage("register")}>
            Register
          </button>

          <button onClick={() => setPage("registrations")}>
            Registrations
          </button>

        </div>

      </nav>


      <main className="container">

        {page === "dashboard" && (
          <Dashboard />
        )}

        {page === "events" && (
          <EventList
            onEdit={handleEditEvent}
            onRegister={() => setPage("register")}
          />
        )}

        {page === "event-form" && (
          <EventForm
            editingEvent={editingEvent}
            onSaved={handleEventSaved}
            onCancel={handleCancelEdit}
          />
        )}

        {page === "register" && (
          <RegistrationForm
            onRegistered={() => setPage("registrations")}
          />
        )}

        {page === "registrations" && (
          <RegistrationList />
        )}

      </main>

    </div>
  );
}

export default App;