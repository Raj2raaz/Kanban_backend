import express from "express";
import dbConnect from "./db/db.config.js";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import userRoutes from "./routes/user.routes.js";
import boardRoutes from "./routes/board.routes.js";
import columnRoutes from "./routes/column.routes.js";
import taskRoutes from "./routes/task.routes.js";
import socketHandler from "./socket/socketHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Create an HTTP server instance
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());

// Define your API routes
app.use("/users", userRoutes);
app.use("/boards", boardRoutes);
app.use("/boards/:boardId/columns", columnRoutes);
app.use("/boards/:boardId/columns/:columnId/tasks", taskRoutes);

// Apply socket handlers
socketHandler(io);

// Catch-all route
app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start the server and database connection
httpServer.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
  dbConnect();
});
