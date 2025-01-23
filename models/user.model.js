import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    avatar: {
      type: String, // URL to the user's avatar image (optional)
      default: "", 
    },
    role: {
      type: String,
      enum: ["admin", "user"], // Define roles for your app
      default: "user",
    },
    boards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board", // Reference to the user's boards
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields automatically
  }
);

export default mongoose.model("User", UserSchema);
