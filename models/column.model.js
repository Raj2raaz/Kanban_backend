import mongoose from "mongoose";

const columnSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    color: {
      type: String,
      enum: ['red', 'blue', 'green', 'yellow', 'purple'],  // Allowed colors
      // default: 'blue',  // Default color
    },
  },
  { timestamps: true }
);

const Column = mongoose.model("Column", columnSchema);

export default Column;
