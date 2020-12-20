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
//Route files
// const bootcamps = require("./routes/bootcamps");
// const courses = require("./routes/courses");
const auth = require("./routes/auth");
// const users = require("./routes/users");
// const reviews = require("./routes/reviews");

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
  max: 100,
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

// app.use("/api/v1/bootcamps", bootcamps);
// app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
// app.use("/api/v1/users", users);
// app.use("/api/v1/reviews", reviews);
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
