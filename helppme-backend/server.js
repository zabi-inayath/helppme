const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const serviceRoutes = require("./routes/serviceRoutes");
const adminRoutes = require("./routes/adminRoutes");
const downloadsRoutes = require("./routes/downloadsRoutes");
const pool = require("./models/service");
const pool1 = require("./models/admin");

dotenv.config();
const app = express();

const allowedOrigins = [
  "http://103.235.106.138",
  "https://api.helppme.in",
  "https://admin.helppme.in",
  "https://helppme-in-frontend.vercel.app",
  "http://localhost:5173",
  "http://localhost:5001",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(bodyParser.json());

// API Routes
app.use("/api/services", serviceRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/downloadbeta", downloadsRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("Helppme.in API is Running");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server!",
    error: err.message || "Internal Server Error"
  });
});

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT"]
  },
  transports: ["websocket", "polling"]
});


io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("applicationApproved", (id) => {
    try {
      // Emit event to all clients
      io.emit("applicationUpdated", id);
    } catch (error) {
      console.error("Error in applicationApproved event:", error);
    }
  });

  socket.on("applicationRejected", (id) => {
    try {
      // Emit event to all clients
      io.emit("applicationUpdated", id);
    } catch (error) {
      console.error("Error in applicationRejected event:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  // Optionally, exit the process
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // Optionally, exit the process
  process.exit(1);
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
