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
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Completed'],  // Define allowed status values
    default: 'To Do',  // Default status for a new task
  },
  color: {
    type: String,
    enum: ['red', 'blue', 'green', 'yellow', 'purple'],  // Allowed colors
    default: 'blue',  // Default color
  },
});

const Task = mongoose.model('Task', taskSchema);
export default Task;
