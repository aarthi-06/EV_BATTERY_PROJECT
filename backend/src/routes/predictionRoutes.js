const express = require("express");
const router = express.Router();
const { predictBattery } = require("../controllers/predictionController");

// POST /api/predict
router.post("/predict", predictBattery);

module.exports = router;