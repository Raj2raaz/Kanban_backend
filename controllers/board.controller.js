import Board from "../models/board.model.js";
import User from "../models/user.model.js";

// Create a new board
const createBoard = async (req, res) => {
  try {
    const { name, members } = req.body;

    // Validate input
    if (!name) {
      return res.status(400).json({ message: "Board name is required." });
    }

    // Create the new board
    const newBoard = new Board({
      name,
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
    
    res.status(201).json({ message: "Board created successfully.", board: newBoard });
  } catch (error) {
    console.error("Error creating board:", error.message);
    res.status(500).json({ message: "Failed to create board.", error: error.message });
  }
};

// Get all boards for the logged-in user
const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ 
      $or: [
        { createdBy: req.user.id }, 
        { members: req.user.id }
      ] 
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

    const board = await Board.findById(id).populate("createdBy members columns");
    if (!board) {
      return res.status(404).json({ message: "Board not found." });
    }

    // Check if the user has access to this board
    if (
      board.createdBy.toString() !== req.user.id &&
      !board.members.includes(req.user.id)
    ) {
      return res.status(403).json({ message: "Access denied." });
    }

    res.status(200).json({ board });
  } catch (error) {
    console.error("Error retrieving board:", error.message);
    res.status(500).json({ message: "Failed to retrieve board.", error: error.message });
  }
};

// Update a board
const updateBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, members } = req.body;

    const board = await Board.findById(id);
    if (!board) {
      return res.status(404).json({ message: "Board not found." });
    }

    // Check if the user is the creator of the board
    if (board.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only the creator can update the board." });
    }

    // Update fields
    if (name) board.name = name;
    if (members) board.members = members;

    await board.save();
    res.status(200).json({ message: "Board updated successfully.", board });
  } catch (error) {
    console.error("Error updating board:", error.message);
    res.status(500).json({ message: "Failed to update board.", error: error.message });
  }
};

// Delete a board
const deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;

    const board = await Board.findById(id);
    if (!board) {
      return res.status(404).json({ message: "Board not found." });
    }

    // Check if the user is the creator of the board
    if (board.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only the creator can delete the board." });
    }

    await board.deleteOne();
    res.status(200).json({ message: "Board deleted successfully." });
  } catch (error) {
    console.error("Error deleting board:", error.message);
    res.status(500).json({ message: "Failed to delete board.", error: error.message });
  }
};

export {
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard
};
