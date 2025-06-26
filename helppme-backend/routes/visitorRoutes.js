const express = require("express");
const { visitorCounts, getVisitorData } = require("../controllers/visitorController");
const router = express.Router();

// Route to handle visitor counts
router.post("/website-visitors", visitorCounts);

// Route to get visitor data for a specific range
router.get("/website-visitors", getVisitorData);

module.exports = router;