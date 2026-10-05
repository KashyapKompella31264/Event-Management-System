const db = require("../config/db");


function getEvents(req, res) {
    const sql = "SELECT * FROM events";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to fetch events"
            });
        }

        res.json(results);
    });
}


function getEventById(req, res) {
    const { id } = req.params;

    const sql = "SELECT * FROM events WHERE id = ?";

    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to fetch event"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                error: "Event not found"
            });
        }

        res.json(results[0]);
    });
}



function createEvent(req, res) {
    const {
        event_name,
        description,
        event_date,
        event_time,
        location,
        total_seats,
        available_seats,
        status
    } = req.body;

    if (
        !event_name ||
        !description ||
        !event_date ||
        !event_time ||
        !location ||
        total_seats === undefined ||
        available_seats === undefined ||
        !status
    ) {
        return res.status(400).json({
            error: "All fields are required"
        });
    }

    const sql = `
        INSERT INTO events
        (
            event_name,
            description,
            event_date,
            event_time,
            location,
            total_seats,
            available_seats,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            event_name,
            description,
            event_date,
            event_time,
            location,
            total_seats,
            available_seats,
            status
        ],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: "Failed to create event"
                });
            }

            res.status(201).json({
                message: "Event created successfully",
                eventId: result.insertId
            });
        }
    );
}


function updateEvent(req, res) {
    const { id } = req.params;

    const {
        event_name,
        description,
        event_date,
        event_time,
        location,
        total_seats,
        available_seats,
        status
    } = req.body;

    if (
        !event_name ||
        !description ||
        !event_date ||
        !event_time ||
        !location ||
        total_seats === undefined ||
        available_seats === undefined ||
        !status
    ) {
        return res.status(400).json({
            error: "All fields are required"
        });
    }

    const sql = `
        UPDATE events
        SET
            event_name = ?,
            description = ?,
            event_date = ?,
            event_time = ?,
            location = ?,
            total_seats = ?,
            available_seats = ?,
            status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            event_name,
            description,
            event_date,
            event_time,
            location,
            total_seats,
            available_seats,
            status,
            id
        ],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: "Failed to update event"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: "Event not found"
                });
            }

            res.json({
                message: "Event updated successfully"
            });
        }
    );
}


function deleteEvent(req, res) {
    const { id } = req.params;

    const sql = "DELETE FROM events WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to delete event"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Event not found"
            });
        }

        res.json({
            message: "Event deleted successfully"
        });
    });
}


module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};