import { useEffect, useState } from "react";

import {
  getRegistrations,
  updateRegistration,
  cancelRegistration
} from "../api/api";

function RegistrationList() {

  const [registrations, setRegistrations] =
    useState([]);

  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] =
    useState("");

  const [error, setError] = useState("");


  useEffect(() => {
    loadRegistrations();
  }, []);


  const loadRegistrations = async () => {

    try {

      const response =
        await getRegistrations();

      setRegistrations(response.data);

    } catch (error) {

      setError(
        "Failed to load registrations"
      );

    }

  };


  const handleCancel = async (id) => {

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this registration?"
    );

    if (!confirmCancel) {
      return;
    }


    try {

      await cancelRegistration(id);

      loadRegistrations();

    } catch (error) {

      setError(
        error.response?.data?.error ||
        "Failed to cancel registration"
      );

    }

  };


  const handleStatusChange = async (
    registration
  ) => {

    try {

      await updateRegistration(
        registration.id,
        {
          name: registration.name,
          email: registration.email,
          phone: registration.phone,
          event_id: registration.event_id,
          registration_date:
            registration.registration_date,
          status: registration.status === "Registered"
            ? "Attended"
            : "Registered"
        }
      );

      loadRegistrations();

    } catch (error) {

      setError(
        error.response?.data?.error ||
        "Failed to update status"
      );

    }

  };


  const filteredRegistrations =
    registrations.filter((registration) => {

      const searchText =
        search.toLowerCase();

      const matchesSearch =
        registration.name
          .toLowerCase()
          .includes(searchText) ||
        registration.email
          .toLowerCase()
          .includes(searchText);

      const matchesEvent =
        eventFilter === "" ||
        registration.event_name === eventFilter;

      return (
        matchesSearch &&
        matchesEvent
      );

    });


  const eventNames = [
    ...new Set(
      registrations.map(
        (registration) =>
          registration.event_name
      )
    )
  ];


  return (
    <div>

      <h1>Registrations</h1>


      {error && (
        <p className="error">{error}</p>
      )}


      <div className="filters">

        <input
          placeholder="Search name or email"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />


        <select
          value={eventFilter}
          onChange={(e) =>
            setEventFilter(e.target.value)
          }
        >

          <option value="">
            All Events
          </option>

          {eventNames.map((name) => (

            <option
              key={name}
              value={name}
            >
              {name}
            </option>

          ))}

        </select>

      </div>


      <div className="table-container">

        <table>

          <thead>

            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Event</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>

          </thead>


          <tbody>

            {filteredRegistrations.map(
              (registration) => (

                <tr key={registration.id}>

                  <td>
                    {registration.id}
                  </td>

                  <td>
                    {registration.name}
                  </td>

                  <td>
                    {registration.email}
                  </td>

                  <td>
                    {registration.phone}
                  </td>

                  <td>
                    {registration.event_name}
                  </td>

                  <td>
                    {registration.registration_date}
                  </td>

                  <td>
                    {registration.status}
                  </td>

                  <td>

                    {registration.status !==
                      "Cancelled" && (

                      <>
                        <button
                          onClick={() =>
                            handleStatusChange(
                              registration
                            )
                          }
                        >
                          {registration.status ===
                          "Registered"
                            ? "Mark Attended"
                            : "Mark Registered"}
                        </button>

                        <button
                          onClick={() =>
                            handleCancel(
                              registration.id
                            )
                          }
                        >
                          Cancel
                        </button>
                      </>

                    )}

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default RegistrationList;