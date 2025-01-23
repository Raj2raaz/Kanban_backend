import express from "express";
import { authenticate } from "../middlewares/auth.middlware.js";
import {
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
} from "../controllers/board.controller.js";

const router = express.Router();

// Route for creating a new board (authentication required)
router.post("/", authenticate, createBoard);

// Route for getting all boards for the logged-in user (authentication required)
router.get("/", authenticate, getBoards);

// Route for getting a specific board by ID (authentication required)
router.get("/:id", authenticate, getBoardById);

// Route for updating a board (authentication required)
router.put("/:id", authenticate, updateBoard);

// Route for deleting a board (authentication required)
router.delete("/:id", authenticate, deleteBoard);

export default router;
