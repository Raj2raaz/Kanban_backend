import express from 'express';
import { authenticate } from '../middlewares/auth.middlware.js';
import { createTask, getTasksByColumn, getTaskById, updateTask, deleteTask } from '../controllers/task.controller.js';

const router = express.Router({ mergeParams: true }); // To merge params like columnId

// Route for creating a new task
router.post('/', authenticate, createTask);

// Route for getting all tasks of a specific column
router.get('/', authenticate, getTasksByColumn);

// Route for getting a specific task by ID
router.get('/:id', authenticate, getTaskById);

// Route for updating a task
router.put('/:id', authenticate, updateTask);

// Route for deleting a task
router.delete('/:id', authenticate, deleteTask);

export default router;
