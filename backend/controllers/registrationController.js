const db = require("../config/db");


// GET all registrations
function getRegistrations(req, res) {
    const sql = `
        SELECT
            registrations.id,
            registrations.name,
            registrations.email,
            registrations.phone,
            registrations.event_id,
            registrations.registration_date,
            registrations.status,
            events.event_name
        FROM registrations
        JOIN events
            ON registrations.event_id = events.id
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to fetch registrations"
            });
        }

        res.json(results);
    });
}


// CREATE registration
function createRegistration(req, res) {
    const {
        name,
        email,
        phone,
        event_id,
        registration_date,
        status
    } = req.body;

    // Required fields
    if (
        !name ||
        !email ||
        !phone ||
        !event_id ||
        !registration_date ||
        !status
    ) {
        return res.status(400).json({
            error: "All fields are required"
        });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            error: "Invalid email format"
        });
    }

    // Check event
    const eventSql = `
        SELECT id, available_seats
        FROM events
        WHERE id = ?
    `;

    db.query(eventSql, [event_id], (err, events) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to check event"
            });
        }

        if (events.length === 0) {
            return res.status(404).json({
                error: "Event not found"
            });
        }

        // Check available seats
        if (events[0].available_seats <= 0) {
            return res.status(400).json({
                error: "No available seats"
            });
        }

        // Check duplicate registration
        const duplicateSql = `
            SELECT id
            FROM registrations
            WHERE email = ?
            AND event_id = ?
            AND status != 'Cancelled'
        `;

        db.query(
            duplicateSql,
            [email, event_id],
            (err, existingRegistrations) => {
                if (err) {
                    return res.status(500).json({
                        error: "Failed to check duplicate registration"
                    });
                }

                if (existingRegistrations.length > 0) {
                    return res.status(400).json({
                        error: "User already registered for this event"
                    });
                }

                // Insert registration
                const registrationSql = `
                    INSERT INTO registrations
                    (
                        name,
                        email,
                        phone,
                        event_id,
                        registration_date,
                        status
                    )
                    VALUES (?, ?, ?, ?, ?, ?)
                `;

                db.query(
                    registrationSql,
                    [
                        name,
                        email,
                        phone,
                        event_id,
                        registration_date,
                        status
                    ],
                    (err, result) => {
                        if (err) {
                            return res.status(500).json({
                                error: "Failed to create registration"
                            });
                        }

                        // Decrease available seats
                        const seatSql = `
                            UPDATE events
                            SET available_seats = available_seats - 1
                            WHERE id = ?
                        `;

                        db.query(
                            seatSql,
                            [event_id],
                            (err) => {
                                if (err) {
                                    return res.status(500).json({
                                        error: "Registration created but failed to update seats"
                                    });
                                }

                                res.status(201).json({
                                    message: "Registration successful",
                                    registrationId: result.insertId
                                });
                            }
                        );
                    }
                );
            }
        );
    });
}


// UPDATE registration
function updateRegistration(req, res) {
    const { id } = req.params;

    const {
        name,
        email,
        phone,
        event_id,
        registration_date,
        status
    } = req.body;

    if (
        !name ||
        !email ||
        !phone ||
        !event_id ||
        !registration_date ||
        !status
    ) {
        return res.status(400).json({
            error: "All fields are required"
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            error: "Invalid email format"
        });
    }

    const sql = `
        UPDATE registrations
        SET
            name = ?,
            email = ?,
            phone = ?,
            event_id = ?,
            registration_date = ?,
            status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            name,
            email,
            phone,
            event_id,
            registration_date,
            status,
            id
        ],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: "Failed to update registration"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: "Registration not found"
                });
            }

            res.json({
                message: "Registration updated successfully"
            });
        }
    );
}


// CANCEL / DELETE registration
function deleteRegistration(req, res) {
    const { id } = req.params;

    // First find the registration
    const findSql = `
        SELECT event_id, status
        FROM registrations
        WHERE id = ?
    `;

    db.query(findSql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to find registration"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                error: "Registration not found"
            });
        }

        const eventId = results[0].event_id;
        const currentStatus = results[0].status;

        // Already cancelled
        if (currentStatus === "Cancelled") {
            return res.status(400).json({
                error: "Registration is already cancelled"
            });
        }

        // Mark as cancelled
        const updateSql = `
            UPDATE registrations
            SET status = 'Cancelled'
            WHERE id = ?
        `;

        db.query(updateSql, [id], (err) => {
            if (err) {
                return res.status(500).json({
                    error: "Failed to cancel registration"
                });
            }

            // Return seat to event
            const seatSql = `
                UPDATE events
                SET available_seats = available_seats + 1
                WHERE id = ?
            `;

            db.query(seatSql, [eventId], (err) => {
                if (err) {
                    return res.status(500).json({
                        error: "Registration cancelled but failed to update seats"
                    });
                }

                res.json({
                    message: "Registration cancelled successfully"
                });
            });
        });
    });
}




module.exports = {
    getRegistrations,
    createRegistration,
    updateRegistration,
    deleteRegistration,
};