import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { EXPENSE_CATEGORIES } from "../types/expense"
import { ArrowUpDown } from "lucide-react"

type Props = {
  category: string
  onCategoryChange: (val: string) => void
  onSortToggle: () => void
  dateDesc?: boolean
}

export function FilterBar({
  category,
  onCategoryChange,
  onSortToggle,
  dateDesc = true
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-white p-4 rounded-lg shadow-md">
      <div className="flex-1 w-full sm:w-auto">
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full h-11">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">📊 All Categories</SelectItem>
            {EXPENSE_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button 
        variant="outline" 
        onClick={onSortToggle}
        className="h-11 w-full sm:w-auto"
      >
        <ArrowUpDown className="mr-2 h-4 w-4" />
        {dateDesc ? "Newest First" : "Oldest First"}
      </Button>
    </div>
  )
}