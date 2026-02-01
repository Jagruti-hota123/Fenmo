import type { Expense } from "../types/expense"
import { Card, CardContent } from "./ui/card"

type Props = {
  expenses: Expense[]
  total?: number
}

export function TotalBar({ expenses, total }: Props) {
  const calculatedTotal = total || expenses.reduce((sum, e) => sum + (e.amount || 0), 0)

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90">Total Expenses</p>
            <p className="text-4xl font-bold mt-1">₹ {calculatedTotal.toFixed(2)}</p>
          </div>
          <div className="text-6xl opacity-20">💰</div>
        </div>
        <div className="mt-4 text-sm opacity-90">
          {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'} recorded
        </div>
      </CardContent>
    </Card>
  )
}