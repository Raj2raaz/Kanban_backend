import Column from "../models/column.model.js";
import Board from "../models/board.model.js";
import mongoose from "mongoose";
import Task from "../models/task.model.js";

// Create a new column
const createColumn = async (req, res) => {
  try {
    console.log("Full Request Params:", req.params);
    console.log("boardId from params:", req.params.boardId);
    const { title } = req.body;
    // const { boardId } = req.params; // Get boardId from URL params
    // Validate boardId
    if (!mongoose.Types.ObjectId.isValid(req.params.boardId)) {
      return res.status(400).json({ message: "Invalid board ID" });
    }

    const boardId = req.params.boardId;
    console.log(boardId)

    if (!title) {
      return res.status(400).json({ message: "Title is required." });
    }

    // Check if the board exists
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found." });
    }

    // Create a new column
    const newColumn = new Column({
      title,
      boardId,
    });

    await newColumn.save();

    // Optionally, update the board's columns array
    board.columns.push(newColumn._id);
    await board.save();

    res
      .status(201)
      .json({ message: "Column created successfully.", column: newColumn });
  } catch (error) {
    console.error("Error creating column:", error.message);
    res
      .status(500)
      .json({ message: "Failed to create column.", error: error.message });
  }
};

// Get all columns for a specific board
const getColumnsByBoard = async (req, res) => {
  try {
    const { boardId } = req.params;

    const columns = await Column.find({ boardId }).populate("tasks");
    res.status(200).json({ columns });
  } catch (error) {
    console.error("Error retrieving columns:", error.message);
    res
      .status(500)
      .json({ message: "Failed to retrieve columns.", error: error.message });
  }
};

// Get a column by ID
const getColumnById = async (req, res) => {
  try {
    const { boardId, id } = req.params;

    const column = await Column.findOne({ _id: id, boardId }).populate("tasks");
    if (!column) {
      return res.status(404).json({ message: "Column not found." });
    }

    res.status(200).json({ column });
  } catch (error) {
    console.error("Error retrieving column:", error.message);
    res
      .status(500)
      .json({ message: "Failed to retrieve column.", error: error.message });
  }
};

// Update a column
const updateColumn = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const column = await Column.findById(id);
    if (!column) {
      return res.status(404).json({ message: "Column not found." });
    }

    // Update column title
    if (title) {
      column.title = title;
    }

    await column.save();
    res.status(200).json({ message: "Column updated successfully.", column });
  } catch (error) {
    console.error("Error updating column:", error.message);
    res
      .status(500)
      .json({ message: "Failed to update column.", error: error.message });
  }
};

// Delete a column
const deleteColumn = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the column by ID
    const column = await Column.findById(id);
    if (!column) {
      return res.status(404).json({ message: "Column not found." });
    }

    // Remove the column from the associated board
    await Board.findByIdAndUpdate(column.boardId, {
      $pull: { columns: column._id }
    });

    // Delete all tasks within the column
    await Task.deleteMany({ columnId: id });

    // Delete the column itself
    await column.deleteOne();

    res.status(200).json({ message: "Column and associated tasks deleted successfully." });
  } catch (error) {
    console.error("Error deleting column:", error.message);
    res
      .status(500)
      .json({ message: "Failed to delete column.", error: error.message });
  }
};

export { createColumn, getColumnsByBoard, getColumnById, updateColumn, deleteColumn };
