# 💰 Expense Tracker (Full-Stack)

A minimal full-stack **Expense Tracker** that allows users to record, view, filter, and analyze personal expenses.  
Built with **real-world conditions** in mind such as retries, browser refreshes, and unreliable networks.

This project is designed as a **maintainable base system**, not a throwaway prototype.

---

## ✨ Features

### Frontend
- Add a new expense (amount, category, description, date)
- View a list of expenses
- Filter expenses by category
- Sort expenses by date (newest first)
- Display total of currently visible expenses
- Light / Dark theme toggle (shadcn + Tailwind v4)
- Clean, minimal UI focused on correctness

### Backend
- Create expense (`POST /api/expenses`)
- Fetch expenses (`GET /api/expenses`)
- Filter and sort via query parameters
- Idempotent request handling (safe retries)
- MongoDB persistence
- Rate limiting and security headers
- CORS-safe for frontend usage

---

## 🏗️ Tech Stack

### Frontend
- **Vite + React + TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui**
- **next-themes** (dark/light theme)
- **@tanstack/react-query**

### Backend
- **Node.js**
- **Express**
- **MongoDB + Mongoose**
- **cors**
- **helmet**
- **express-rate-limit**

---

## 📁 Project Structure

```text
expense-tracker/
├── fenmo_backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── server.js
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── types/
│   │   └── main.tsx
│   ├── package.json
│   └── README.md
│
└── README.md


⸻

🧠 Key Design Decisions

Money Handling
	•	Expense amounts are stored as integer paise
	•	Example: ₹100.50 → 10050
	•	Prevents floating-point precision errors

Idempotent API
	•	Each create-expense request uses an idempotency key
	•	Prevents duplicate records during:
	•	Network retries
	•	Page refresh after submit
	•	Multiple submit clicks
	•	Enforced using MongoDB unique constraints

Frontend Architecture
	•	Clear separation of concerns:
	•	UI components are stateless
	•	Business logic lives in page-level components
	•	Easy to switch from local state to React Query

Theme System
	•	Uses next-themes with Tailwind v4
	•	Dark mode handled via CSS variables
	•	Fully compatible with shadcn and tweakcn themes

⸻

🔐 Security & Reliability
	•	CORS configured for frontend origin
	•	Rate limiting on API routes
	•	Helmet for common HTTP security headers
	•	Safe handling of preflight (OPTIONS) requests
	•	Centralized error handling middleware

⸻

⚙️ Environment Variables

Backend (fenmo_backend/.env)

PORT=5000
MONGODB_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173
NODE_ENV=development


⸻

▶️ Running the Project Locally

Backend

cd fenmo_backend
npm install
npm run dev

Server runs at:

http://localhost:5000


⸻

Frontend

cd frontend
npm install
npm run dev

Frontend runs at:

http://localhost:5173


⸻

🧪 API Endpoints

Create Expense

POST /api/expenses

Request body:

{
  "amount": 199.99,
  "category": "Food",
  "description": "Lunch",
  "date": "2026-02-01"
}


⸻

Get Expenses

GET /api/expenses?category=Food&sort=date_desc


⸻

🚧 Trade-offs & Intentional Omissions

To keep the scope focused and realistic, the following were intentionally skipped:
	•	Authentication / user accounts
	•	Pagination
	•	Charts and advanced analytics
	•	Multi-currency support

The focus is on correctness, reliability, and maintainability.

⸻

🚀 Possible Improvements
	•	Category-wise summary view
	•	Pagination for large datasets
	•	Authentication and multi-user support
	•	Export expenses (CSV)
	•	Analytics dashboard

⸻

✅ Evaluation Notes

This project emphasizes:
	•	Correct behavior under retries and refreshes
	•	Safe money handling
	•	Real-world API robustness
	•	Clean and maintainable code structure

⸻
