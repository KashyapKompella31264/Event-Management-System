import { useEffect, useState } from "react";
import { getDashboard } from "../api/api";

function Dashboard() {

  const [data, setData] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalRegistrations: 0,
    availableSeats: 0,
    cancelledRegistrations: 0
  });

  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await getDashboard();
      setData(response.data);
    } catch (error) {
      setError("Failed to load dashboard");
    }
  };

  return (
    <div>

      <h1>Dashboard</h1>

      {error && <p className="error">{error}</p>}

      <div className="dashboard-grid">

        <div className="card">
          <h3>Total Events</h3>
          <p>{data.totalEvents}</p>
        </div>

        <div className="card">
          <h3>Upcoming Events</h3>
          <p>{data.upcomingEvents}</p>
        </div>

        <div className="card">
          <h3>Total Registrations</h3>
          <p>{data.totalRegistrations}</p>
        </div>

        <div className="card">
          <h3>Available Seats</h3>
          <p>{data.availableSeats}</p>
        </div>

        <div className="card">
          <h3>Cancelled Registrations</h3>
          <p>{data.cancelledRegistrations}</p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;