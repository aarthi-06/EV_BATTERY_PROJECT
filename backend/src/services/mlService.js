const axios = require("axios");

const getBatteryPrediction = async (inputData) => {
  const response = await axios.post(process.env.ML_API_URL, inputData);
  return response.data;
};

module.exports = { getBatteryPrediction };