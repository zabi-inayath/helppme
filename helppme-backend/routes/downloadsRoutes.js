const express = require("express");
const router = express.Router();
const { submitForm } = require("../controllers/downloadController");

router.post("/submit", submitForm);

module.exports = router;
