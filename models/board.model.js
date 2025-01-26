import mongoose from "mongoose";

const { Schema } = mongoose;

// Board Schema
const boardSchema = new Schema(
  {
    name: {
      type: String,
      required: true, // Board name is required
      trim: true, // Removes unnecessary whitespaces
    },
    description: {
      type: String,
      default: "", // Optional description for the board
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the User model (creator of the board)
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // List of users who are members of this board
      },
    ],
    columns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Column", // References the Column model associated with this board
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now, // Timestamp for when the board was created
    },
    updatedAt: {
      type: Date,
      default: Date.now, // Timestamp for when the board was last updated
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

export default mongoose.model("Board", boardSchema);
