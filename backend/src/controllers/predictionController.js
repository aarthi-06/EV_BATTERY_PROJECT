const { getBatteryPrediction } = require("../services/mlService");

const predictBattery = async (req, res) => {
  try {
    const result = await getBatteryPrediction(req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Prediction error:", error.message);
    return res.status(500).json({ error: "Prediction failed" });
  }
};

module.exports = { predictBattery };