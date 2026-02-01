import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/database.js";
import expenseRoutes from "./routes/expenses.js";
import errorHandler from "./middleware/errorHandler.js";
import idempotencyMiddleware from "./middleware/idempotency.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key']
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  console.log(`🔍 Body:`, req.body);
  next();
});


app.use((req, res, next) => {
  if (req.method === "OPTIONS") return next();
  return idempotencyMiddleware(req, res, next);
});

app.use("/api/expenses", expenseRoutes);


app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server running", timestamp: new Date() });
});

app.get("/", (req, res) => {
  res.json({ success: true, message: "Expense Tracker API" });
});


app.use((req, res) => {
  console.log("404:", req.url);
  res.status(404).json({ success: false, error: "Not found" });
});


app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
