const express = require("express");
const cors = require("cors");
const predictionRoutes = require("./routes/predictionRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// main route
app.use("/api", predictionRoutes);

module.exports = app;