import { body, query, validationResult } from 'express-validator';

// Validation rules for creating an expense
export const validateCreateExpense = [
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number')
    .custom((value) => {
      // Check if amount has more than 2 decimal places
      const decimalPlaces = (value.toString().split('.')[1] || '').length;
      if (decimalPlaces > 2) {
        throw new Error('Amount cannot have more than 2 decimal places');
      }
      return true;
    }),
  
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isString()
    .trim()
    .isIn(['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Other'])
    .withMessage('Invalid category'),
  
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      const date = new Date(value);
      const now = new Date();
      // Allow up to 1 day in future for timezone differences
      if (date > new Date(now.getTime() + 86400000)) {
        throw new Error('Date cannot be in the future');
      }
      return true;
    })
];

// Validation rules for query parameters
export const validateGetExpenses = [
  query('category')
    .optional()
    .isString()
    .trim()
    .isIn(['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Other'])
    .withMessage('Invalid category'),
  
  query('sort')
    .optional()
    .isIn(['date_desc', 'date_asc'])
    .withMessage('Invalid sort parameter. Use date_desc or date_asc')
];

// Middleware to check validation results
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: errors.array().map(err => err.msg)
    });
  }
  
  next();
};