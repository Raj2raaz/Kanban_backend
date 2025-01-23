import express from 'express';
import { authenticate } from '../middlewares/auth.middlware.js';
import { createColumn, getColumnsByBoard, getColumnById, updateColumn, deleteColumn } from '../controllers/column.controller.js';

const router = express.Router({ mergeParams: true }); // To merge params like boardId

// Route for creating a new column
router.post('/', authenticate, createColumn);

// Route for getting all columns of a specific board
router.get('/', authenticate, getColumnsByBoard);

// Route for getting a specific column by ID
router.get('/:id', authenticate, getColumnById);

// Route for updating a column
router.put('/:id', authenticate, updateColumn);

// Route for deleting the column
router.delete('/:id', authenticate, deleteColumn);

export default router;