import Column from "../models/column.model.js";
import Board from "../models/board.model.js";
import mongoose from "mongoose";
import Task from "../models/task.model.js";

// Create a new column
const createColumn = async (req, res) => {
  try {
    console.log("Full Request Params:", req.params);
    console.log("boardId from params:", req.params.boardId);
    const { title, color } = req.body;
    // const { boardId } = req.params; // Get boardId from URL params
    // Validate boardId
    if (!mongoose.Types.ObjectId.isValid(req.params.boardId)) {
      return res.status(400).json({ message: "Invalid board ID" });
    }

    const boardId = req.params.boardId;
    console.log(boardId);

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
      color: color || 'blue'
    });

    await newColumn.save();

    // Optionally, update the board's columns array
    board.columns.push(newColumn._id);
    // console.log('Columns Pushed Successfully')
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
    const { title, color } = req.body;

    const column = await Column.findById(id);
    if (!column) {
      return res.status(404).json({ message: "Column not found." });
    }

    // Update column title
    if (title) {
      column.title = title;
    }
    if (color) {
      column.color = color;
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
      $pull: { columns: column._id },
    });

    // Delete all tasks within the column
    await Task.deleteMany({ columnId: id });

    // Delete the column itself
    await column.deleteOne();

    res
      .status(200)
      .json({ message: "Column and associated tasks deleted successfully." });
  } catch (error) {
    console.error("Error deleting column:", error.message);
    res
      .status(500)
      .json({ message: "Failed to delete column.", error: error.message });
  }
};

// Update the order of the columns in a board
const updateColumnOrder = async (req, res) => {
  console.log("Received columns:", req.body);
  const { boardId } = req.params;
  const { columns } = req.body;

  try {
    // Validate if columns array is provided
    if (!columns || !Array.isArray(columns)) {
      return res
        .status(400)
        .json({ message: "Invalid columns array provided" });
    }

    // Find the board and update its columns order
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    board.columns = columns; // Assigning new order of columns
    await board.save();
    
    res
      .status(200)
      .json({ message: "Column order updated successfully", board });
  } catch (error) {
    console.error("Error updating column order:", error.message);
    res
      .status(500)
      .json({ message: "Failed to update column order", error: error.message });
  }
};

// Function fo updating the task order in column 
const updateTaskOrder = async (req, res) => {
  console.log("Received tasks:", req.body);
  const { columnId } = req.params;
  const { tasks } = req.body;

  try {
    // Validate if tasks array is provided
    if (!tasks || !Array.isArray(tasks)) {
      return res.status(400).json({ message: "Invalid tasks array provided" });
    }

    // Find the column and update its tasks order
    const column = await Column.findById(columnId);
    if (!column) {
      return res.status(404).json({ message: "Column not found" });
    }

    column.tasks = tasks; // Assigning new order of tasks
    await column.save();

    res.status(200).json({ message: "Task order updated successfully", column });
  } catch (error) {
    console.error("Error updating task order:", error.message);
    res.status(500).json({ message: "Failed to update task order", error: error.message });
  }
};

// Functions for updating the task within different columns
const moveTaskToAnotherColumn = async (req, res) => {
  console.log("Moving task:", req.body);
  const { taskId } = req.params;
  const { newColumnId, newIndex } = req.body;

  try {
    // Validate input
    if (!newColumnId || typeof newIndex !== "number") {
      return res.status(400).json({ message: "Invalid newColumnId or newIndex provided" });
    }

    // Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Find the current and new column
    const currentColumn = await Column.findById(task.columnId);
    const newColumn = await Column.findById(newColumnId);

    if (!currentColumn) {
      return res.status(404).json({ message: "Current column not found" });
    }

    if (!newColumn) {
      return res.status(404).json({ message: "New column not found" });
    }

    // Remove the task from the current column
    currentColumn.tasks = currentColumn.tasks.filter(
      (id) => id.toString() !== task._id.toString()
    );
    await currentColumn.save();

    // Update task to new column
    task.columnId = newColumnId;
    await task.save();

    // Insert task into new column at the specified position
    newColumn.tasks.splice(newIndex, 0, task._id);
    await newColumn.save();

    res.status(200).json({ message: "Task moved successfully", task });
  } catch (error) {
    console.error("Error moving task:", error.message);
    res.status(500).json({ message: "Error moving task", error: error.message });
  }
};


export {
  createColumn,
  getColumnsByBoard,
  getColumnById,
  updateColumn,
  deleteColumn,
  updateColumnOrder,
  updateTaskOrder,
  moveTaskToAnotherColumn
};
