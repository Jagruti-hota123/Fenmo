import { useState } from "react"
import { ExpenseForm } from "../components/ExpenseForm"
import { FilterBar } from "../components/FilterBar"
import { ExpenseList } from "../components/ExpenseList"
import { TotalBar } from "../components/TotalBar"
import { useExpenses } from "../hooks/useExpenses"
import { Card, CardContent } from "../components/ui/card"
import { ThemeToggle } from "../components/ThemeToggle"

export default function Home() {
  const [category, setCategory] = useState("ALL")
  const [dateDesc, setDateDesc] = useState(true)

  const sort = dateDesc ? 'date_desc' : 'date_asc';
  const { data, isLoading, error } = useExpenses(
    category === 'ALL' ? undefined : category,
    sort
  );

  if (error) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="">
            <CardContent className="p-6">
              <p className="font-semibold">Error loading expenses</p>
              <p className=" text-sm mt-2">{(error as Error).message}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold ">
                💰 Expense Tracker
              </h1>
              <p className="mt-2">Track your spending, manage your budget</p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-1">
            <ExpenseForm />
          </div>

          {/* Right Column - List */}
          <div className="lg:col-span-2 space-y-6">
            <FilterBar
              category={category}
              onCategoryChange={setCategory}
              onSortToggle={() => setDateDesc((p) => !p)}
              dateDesc={dateDesc}
            />

            {isLoading ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"></div>
                  <p className=" mt-4">Loading expenses...</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <ExpenseList expenses={data?.expenses || []} />
                <TotalBar expenses={data?.expenses || []} total={data?.total || 0} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}