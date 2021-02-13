const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

const aquariums = require("./routes/aquariums");
const auth = require("./routes/auth");
const livestock = require("./routes/livestock");
const waterchanges = require("./routes/waterchanges");
const plants = require("./routes/plants");
const parameterChecks = require("./routes/parameterChecks");
const stats = require("./routes/stats");
const maintenanceTasks = require("./routes/maintenanceTasks");

const errorHandler = require("./middleware/error");

const connectDB = require("./config/db");

dotenv.config({ path: "./config/config.env" });

connectDB();

const app = express();

// Body Parser
app.use(express.json());

//cookie parser
app.use(cookieParser());

//security
app.use(mongoSanitize());

//set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 1000,
});

app.use(limiter);

app.use(hpp());

//enable CORS
app.use(cors());

//dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//file uploading

app.use(fileupload());

//set static folder
app.use(express.static(path.join(__dirname, "public")));
//Mount routers

app.use("/api/v1/auth", auth);
app.use("/api/v1/aquariums", aquariums);
app.use("/api/v1/livestock", livestock);
app.use("/api/v1/waterchanges", waterchanges);
app.use("/api/v1/plants", plants);
app.use("/api/v1/parameters", parameterChecks);
app.use("/api/v1/maintenanceTasks", maintenanceTasks);
app.use("/api/v1/stats", stats);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

//handle unhandled promise rejections

process.on("unHandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);

  server.close(() => process.exit(1));
});
