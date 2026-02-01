import { useState } from "react"
import { useCreateExpense } from "../hooks/useExpenses"
import { EXPENSE_CATEGORIES } from "../types/expense"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"

export function ExpenseForm() {
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [description, setDescription] = useState("")

  const { mutate: createExpense, isPending, error } = useCreateExpense()

  const handleSubmit = async () => {
    if (!amount || !category || !date || !description) {
      alert('Please fill in all fields');
      return;
    }

    createExpense(
      {
        amount: parseFloat(amount),
        category,
        description,
        date,
      },
      {
        onSuccess: () => {
          setAmount("")
          setCategory("")
          setDate(new Date().toISOString().split('T')[0])
          setDescription("")
        },
        onError: (err) => {
          console.error('Failed to create expense:', err);
        }
      }
    )
  }

  return (
    <Card className="shadow-lg sticky top-8">
      <CardHeader className=" rounded-t-lg">
        <CardTitle className="text-xl">➕ Add New Expense</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded text-red-700 text-sm">
            <strong>Error:</strong> {(error as Error).message}
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-sm font-semibold">Amount (₹)</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="text-lg h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {EXPENSE_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">Date</Label>
          <Input
            type="date"
            value={date}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDate(e.target.value)}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What was this expense for?"
            maxLength={500}
            className="min-h-25 resize-none"
          />
        </div>

        <Button 
          disabled={isPending || !amount || !category || !date || !description} 
          onClick={handleSubmit}
          className="w-full h-12 text-base font-semibold "
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2"></div>
              Saving...
            </span>
          ) : (
            "Add Expense"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}