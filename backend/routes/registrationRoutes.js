const express = require("express");

const {
    getRegistrations,
    createRegistration,
    updateRegistration,
    deleteRegistration
} = require("../controllers/registrationController");

const router = express.Router();

router.get("/", getRegistrations);
router.post("/", createRegistration);
router.put("/:id", updateRegistration);
router.delete("/:id", deleteRegistration);


module.exports = router;