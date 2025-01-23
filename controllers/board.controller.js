import Board from "../models/board.model.js";
import User from "../models/user.model.js";
import Column from "../models/column.model.js";
import Task from "../models/task.model.js";
import mongoose from "mongoose";

// Create a new board
const createBoard = async (req, res) => {
  try {
    const { name, description, members } = req.body;

    // Validate input
    if (!name) {
      return res.status(400).json({ message: "Board name is required." });
    }

    // Create the new board with description
    const newBoard = new Board({
      name,
      description: description || "", // Ensure description is properly set
      createdBy: req.user.id, // Assuming `req.user.id` is set by the authentication middleware
      members: members ? [req.user.id, ...members] : [req.user.id],
    });

    await newBoard.save();

    // Update the user's boards array
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.boards.push(newBoard._id);
    await user.save();

    res.status(201).json({
      message: "Board created successfully.",
      board: newBoard,
    });
  } catch (error) {
    console.error("Error creating board:", error.message);
    res.status(500).json({ message: "Failed to create board.", error: error.message });
  }
};

// Get all boards for the logged-in user
const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({
      $or: [{ createdBy: req.user.id }, { members: req.user.id }],
    }).populate("createdBy members columns");

    res.status(200).json({ boards });
  } catch (error) {
    console.error("Error retrieving boards:", error.message);
    res.status(500).json({ message: "Failed to retrieve boards.", error: error.message });
  }
};

// Get a single board by ID
const getBoardById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid board ID" });
    }

    const board = await Board.findById(id).populate("createdBy members columns");
    if (!board) {
      return res.status(404).json({ message: "Board not found." });
    }

    console.log("Logged-in User ID:", req.user.id);
    console.log("Board Created By:", board.createdBy);
    console.log("Board Members:", board.members);

    // Fix the ObjectId comparison issue
    if (
      !board.createdBy.equals(new mongoose.Types.ObjectId(req.user.id)) &&
      !board.members.some((member) =>
        member._id.equals(new mongoose.Types.ObjectId(req.user.id))
      )
    ) {
      return res.status(403).json({ message: "Access denied." });
    }

    res.status(200).json({ board });
  } catch (error) {
    console.error("Error retrieving board:", error.message);
    res
      .status(500)
      .json({ message: "Failed to retrieve board.", error: error.message });
  }
};

// Update a board
const updateBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, members } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid board ID" });
    }

    const board = await Board.findById(id);
    if (!board) {
      return res.status(404).json({ message: "Board not found." });
    }

    // Check if the user is the creator of the board
    if (!board.createdBy.equals(new mongoose.Types.ObjectId(req.user.id))) {
      return res.status(403).json({ message: "Only the creator can update the board." });
    }

    // Update fields
    if (name) board.name = name;
    if (description !== undefined) board.description = description; // Allow empty descriptions
    if (members) board.members = members;

    await board.save();

    res.status(200).json({
      message: "Board updated successfully.",
      board,
    });
  } catch (error) {
    console.error("Error updating board:", error.message);
    res.status(500).json({ message: "Failed to update board.", error: error.message });
  }
};

// Delete a board
const deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid board ID" });
    }

    const board = await Board.findById(id);
    if (!board) {
      return res.status(404).json({ message: "Board not found." });
    }

    // Check if the user is the creator of the board
    if (!board.createdBy.equals(new mongoose.Types.ObjectId(req.user.id))) {
      return res.status(403).json({ message: "Only the creator can delete the board." });
    }

     // Find and delete all columns related to this board
    const columns = await Column.find({ boardId: id });

    for (const column of columns) {
      // Delete all tasks related to this column
      await Task.deleteMany({ columnId: column._id });

      // Delete the column itself
      await column.deleteOne();
    }

    await board.deleteOne();
    res.status(200).json({ message: "Board deleted successfully." });
  } catch (error) {
    console.error("Error deleting board:", error.message);
    res.status(500).json({ message: "Failed to delete board.", error: error.message });
  }
};

export { createBoard, getBoards, getBoardById, updateBoard, deleteBoard };
