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

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Create an HTTP server instance
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "*",
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

// WebSocket setup
io.on("connection", (socket) => {
  // Get the custom user ID from query params
  const userId = socket.handshake.query.userId || socket.id;
  console.log(`New client connected with ID: ${userId}`);

  // Listen for task updates from the client
  socket.on("taskUpdated", (data) => {
    console.log(`Task updated by user ${userId}:`, data);
    io.emit("taskUpdated", data);
  });

  // Listen for column updates
  socket.on("columnUpdated", (data) => {
    console.log(`Column updated by user ${userId}:`, data);
    io.emit("columnUpdated", data);
  });

  // Listen for board updates
  socket.on("boardUpdated", (data) => {
    console.log(`Board updated by user ${userId}:`, data);
    io.emit("boardUpdated", data);
  });

  // Handle client disconnection
  socket.on("disconnect", () => {
    console.log(`Client disconnected with ID: ${userId}`);
  });
});

// Start the server and database connection
httpServer.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
  dbConnect();
});
