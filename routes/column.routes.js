import express from "express";
import { authenticate } from "../middlewares/auth.middlware.js";
import {
  createColumn,
  getColumnsByBoard,
  getColumnById,
  updateColumn,
  deleteColumn,
  updateColumnOrder,
  updateTaskOrder,
  moveTaskToAnotherColumn
} from "../controllers/column.controller.js";

const router = express.Router({ mergeParams: true }); // To merge params like boardId

// Route for creating a new column
router.post("/", authenticate, createColumn);

// Route for getting all columns of a specific board
router.get("/", authenticate, getColumnsByBoard);

// Route for getting a specific column by ID
router.get("/:id", authenticate, getColumnById);

// Route for updating a column
router.put("/:id", authenticate, updateColumn);

// Route for deleting the column
router.delete("/:id", authenticate, deleteColumn);

// Route to update the order of columns within a board
router.put("/", authenticate, updateColumnOrder);

// Route to update the order of tasks within a column
router.put("/:columnId/tasks/order", authenticate, updateTaskOrder);

// Route to move a task to another column
router.put("/tasks/:taskId/move", authenticate, moveTaskToAnotherColumn);

export default router;
