const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");

const connectDB = require("./config/db");

// Load config vars
dotenv.config({ path: "./config/dev.env" });

// Connect to DB
connectDB();

// Routes
const bootcampRoutes = require("./routes/bootcamp");
const courseRoutes = require("./routes/course");

// Middleware
const logError = require("./middlware/log-error");
const errorHandler = require("./middlware/error-handler");

const PORT = process.env.PORT || 5000;

const app = express();

if (process.env.NODE_ENV === "dev") app.use(morgan("dev"));

// Body Parser
app.use(express.json());

app.use("/api/v1.0/bootcamps", bootcampRoutes);
app.use("/api/v1.0/courses", courseRoutes);

app.use(logError);
app.use(errorHandler);

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode & on port ${PORT}`.yellow
      .bold
  )
);

// Handling unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.log(`Error : ${reason.message}`);
  server.close(() => process.exit(1));
});
