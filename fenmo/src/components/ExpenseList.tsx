import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Badge } from "./ui/badge"
import { Card } from "./ui/card"
import type { Expense } from "../types/expense"

type Props = {
  expenses: Expense[]
}

const categoryColors: Record<string, string> = {
  Food: "bg-orange-100 text-orange-800 border-orange-200",
  Transportation: "bg-blue-100 text-blue-800 border-blue-200",
  Entertainment: "bg-purple-100 text-purple-800 border-purple-200",
  Shopping: "bg-pink-100 text-pink-800 border-pink-200",
  Bills: "bg-red-100 text-red-800 border-red-200",
  Healthcare: "bg-green-100 text-green-800 border-green-200",
  Education: "bg-indigo-100 text-indigo-800 border-indigo-200",
  Other: "bg-gray-100 text-gray-800 border-gray-200",
}

export function ExpenseList({ expenses }: Props) {
  return (
    <Card className="shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-bold py-4">Date</TableHead>
              <TableHead className="font-bold py-4">Category</TableHead>
              <TableHead className="font-bold py-4">Description</TableHead>
              <TableHead className="text-right font-bold py-4">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12">
                  <div className="">
                    <p className="text-lg font-semibold">No expenses yet</p>
                    <p className="text-sm mt-1">Add your first expense using the form</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              expenses.map((e) => (
                <TableRow key={e.id} className="hover:bg-gray-80 transition-colors">
                  <TableCell className="py-4 font-medium">
                    {new Date(e.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge 
                      variant="secondary" 
                      className={`${categoryColors[e.category] || categoryColors.Other} border font-medium`}
                    >
                      {e.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 max-w-xs truncate" title={e.description}>
                    {e.description}
                  </TableCell>
                  <TableCell className="text-right py-4 font-bold text-lg ">
                    ₹ {typeof e.amount === 'number' ? e.amount.toFixed(2) : '0.00'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}