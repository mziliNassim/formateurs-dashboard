const express = require("express");
// const serverless = require("serverless-http");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db.js");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
dotenv.config();

// Routes
app.use("/", require("./routes/endpoint.js"));

app.use("/api/auth", require("./routes/auth.js"));
app.use("/api/users", require("./routes/users.js"));
app.use("/api/courses", require("./routes/courses.js"));
app.use("/api/modules", require("./routes/modules.js"));
app.use("/api/activities", require("./routes/activities.js"));

// Database connection and serverless function export
// let isDatabaseConnected = false;
// const handler = async (req, res) => {
//   if (!isDatabaseConnected) {
//     try {
//       await connectDB();
//       isDatabaseConnected = true;
//       console.log("Database connected successfully!");
//     } catch (err) {
//       console.error("Database connection error:", err);
//       return res.status(500).send("Database connection failed");
//     }
//   }

//   // Pass the request to the Express app
//   return app(req, res);
// };

// module.exports.handler = serverless(handler);

// Database connection and serverless function export
const startServer = async () => {
  if (await connectDB()) {
    try {
      console.log("Database connected successfully!");
      const port = process.env.PORT || 5000;
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    } catch (err) {
      console.error("Database connection error:", err);
      return res.status(500).send("Database connection failed");
    }
  }
};

startServer();
