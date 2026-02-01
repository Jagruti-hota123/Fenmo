import express from 'express';
import Expense from '../models/Expense.js';
import {
  validateCreateExpense,
  validateGetExpenses,
  handleValidationErrors
} from '../utils/validators.js';

const router = express.Router();

/**
 * @route   GET /api/expenses/summary/by-category
 * @desc    Get expense summary grouped by category
 * @access  Public
 * IMPORTANT: This must come BEFORE /:id route
 */
router.get('/summary/by-category', async (req, res, next) => {
  try {
    const summary = await Expense.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          category: '$_id',
          total: { $divide: ['$total', 100] },
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    const grandTotal = summary.reduce((sum, item) => sum + item.total, 0);

    res.status(200).json({
      success: true,
      total: grandTotal,
      data: summary
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/expenses
 * @desc    Get all expenses with optional filtering and sorting
 * @access  Public
 */
router.get(
  '/',
  validateGetExpenses,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { category, sort } = req.query;

      const query = {};
      if (category) {
        query.category = category;
      }

      let sortOption = { date: -1 };
      if (sort === 'date_asc') {
        sortOption = { date: 1 };
      }

      const expenses = await Expense.find(query).sort(sortOption);
      const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

      res.status(200).json({
        success: true,
        count: expenses.length,
        total: total,
        data: expenses
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   POST /api/expenses
 * @desc    Create a new expense
 * @access  Public
 */
router.post(
  '/',
  validateCreateExpense,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      console.log('📦 Request Body:', req.body);
      console.log('📦 Amount:', req.body.amount, typeof req.body.amount);
      console.log('📦 Category:', req.body.category);
      console.log('📦 Description:', req.body.description);
      console.log('📦 Date:', req.body.date);
      
      const { amount, category, description, date } = req.body;
      const idempotencyKey = req.headers['idempotency-key'];

      const expenseData = {
        amount,
        category,
        description,
        date: new Date(date)
      };

      if (idempotencyKey) {
        expenseData.idempotencyKey = idempotencyKey;
      }

      const expense = await Expense.create(expenseData);

      res.status(201).json({
        success: true,
        data: expense
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/expenses/:id
 * @desc    Get single expense by ID
 * @access  Public
 */
router.get('/:id', async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found'
      });
    }

    res.status(200).json({
      success: true,
      data: expense
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/expenses/:id
 * @desc    Delete an expense
 * @access  Public
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
      data: expense
    });
  } catch (error) {
    next(error);
  }
});

export default router;
