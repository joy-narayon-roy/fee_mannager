const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const router = require("./routes");
const { globalErrorHandeler } = require("./middlewares");

const app = express();

// Core middleware FIRST
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

// Serve static files BEFORE routes
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use(router);

// Error handler LAST
app.use(globalErrorHandeler);

module.exports = app;
