const db = require("../config/db");

function getDashboard(req, res) {

    const dashboard = {};

    // Total Events
    db.query(
        "SELECT COUNT(*) AS totalEvents FROM events",
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    error: "Failed to fetch dashboard data"
                });
            }

            dashboard.totalEvents = result[0].totalEvents;

            // Upcoming Events
            db.query(
                `SELECT COUNT(*) AS upcomingEvents
                 FROM events
                 WHERE event_date >= CURDATE()
                 AND status != 'Cancelled'`,
                (err, result) => {

                    if (err) {
                        return res.status(500).json({
                            error: "Failed to fetch dashboard data"
                        });
                    }

                    dashboard.upcomingEvents =
                        result[0].upcomingEvents;

                    // Total Registrations
                    db.query(
                        `SELECT COUNT(*) AS totalRegistrations
                         FROM registrations`,
                        (err, result) => {

                            if (err) {
                                return res.status(500).json({
                                    error: "Failed to fetch dashboard data"
                                });
                            }

                            dashboard.totalRegistrations =
                                result[0].totalRegistrations;

                            // Available Seats
                            db.query(
                                `SELECT COALESCE(SUM(available_seats), 0)
                                 AS availableSeats
                                 FROM events`,
                                (err, result) => {

                                    if (err) {
                                        return res.status(500).json({
                                            error: "Failed to fetch dashboard data"
                                        });
                                    }

                                    dashboard.availableSeats =
                                        result[0].availableSeats;

                                    // Cancelled Registrations
                                    db.query(
                                        `SELECT COUNT(*) AS cancelledRegistrations
                                         FROM registrations
                                         WHERE status = 'Cancelled'`,
                                        (err, result) => {

                                            if (err) {
                                                return res.status(500).json({
                                                    error: "Failed to fetch dashboard data"
                                                });
                                            }

                                            dashboard.cancelledRegistrations =
                                                result[0].cancelledRegistrations;

                                            res.json(dashboard);
                                        }
                                    );
                                }
                            );
                        }
                    );
                }
            );
        }
    );
}

module.exports = {
    getDashboard
};