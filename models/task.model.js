// models/task.model.js
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Assuming you have a User model for task assignments
  },
  columnId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Column',  // A task belongs to a column
    required: true,
  },
});

const Task = mongoose.model('Task', taskSchema);
export default Task;
