import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
      get: (v) => v / 100,
      set: (v) => v * 100,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: {
        values: [
          'Food',
          'Transportation',
          'Entertainment',
          'Shopping',
          'Bills',
          'Healthcare',
          'Education',
          'Other'
        ],
        message: '{VALUE} is not a valid category'
      }
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      validate: {
        validator: function(v) {
          return v <= new Date(Date.now() + 86400000);
        },
        message: 'Date cannot be in the future'
      }
    },
    idempotencyKey: {
      type: String,
      unique: true,
      sparse: true,
      index: true
    }
  },
  {
    timestamps: true, 
    toJSON: { getters: true }, 
    toObject: { getters: true }
  }
);

expenseSchema.index({ category: 1, date: -1 });
expenseSchema.index({ date: -1 });

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;