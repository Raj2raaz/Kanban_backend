import Task from '../models/task.model.js';
import Column from '../models/column.model.js';

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, assignedTo } = req.body;
    const { columnId } = req.params;

    if (!title || !description || !dueDate || !columnId) {
      return res.status(400).json({ message: "Title, description, dueDate, and columnId are required." });
    }

    // Check if the column exists
    const column = await Column.findById(columnId);
    if (!column) {
      return res.status(404).json({ message: "Column not found." });
    }

    // Create the task
    const newTask = new Task({
      title,
      description,
      dueDate,
      assignedTo,
      columnId,
    });

    await newTask.save();

     // Update the column's tasks array by adding the new task ID
     column.tasks.push(newTask._id);
     await column.save();

    res.status(201).json({ message: "Task created successfully.", task: newTask });
  } catch (error) {
    console.error("Error creating task:", error.message);
    res.status(500).json({ message: "Failed to create task.", error: error.message });
  }
};

// Get all tasks for a specific column
const getTasksByColumn = async (req, res) => {
  try {
    const { columnId } = req.params;

    const tasks = await Task.find({ columnId }).populate("assignedTo");
    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error retrieving tasks:", error.message);
    res.status(500).json({ message: "Failed to retrieve tasks.", error: error.message });
  }
};

// Get a task by ID
const getTaskById = async (req, res) => {
  try {
    const { columnId, id } = req.params;

    const task = await Task.findOne({ _id: id, columnId }).populate("assignedTo");
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json({ task });
  } catch (error) {
    console.error("Error retrieving task:", error.message);
    res.status(500).json({ message: "Failed to retrieve task.", error: error.message });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, assignedTo } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    // Update task properties
    if (title) task.title = title;
    if (description) task.description = description;
    if (dueDate) task.dueDate = dueDate;
    if (assignedTo) task.assignedTo = assignedTo;

    await task.save();
    res.status(200).json({ message: "Task updated successfully.", task });
  } catch (error) {
    console.error("Error updating task:", error.message);
    res.status(500).json({ message: "Failed to update task.", error: error.message });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    await task.remove();
    res.status(200).json({ message: "Task deleted successfully." });
  } catch (error) {
    console.error("Error deleting task:", error.message);
    res.status(500).json({ message: "Failed to delete task.", error: error.message });
  }
};

export { createTask, getTasksByColumn, getTaskById, updateTask, deleteTask };
