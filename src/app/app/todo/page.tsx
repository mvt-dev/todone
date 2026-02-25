import Link from 'next/link'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { list } from '@/actions/todo'
import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'
import { todayString, formatDisplayDate, addDays } from '@/lib/date'

interface Props {
  searchParams: Promise<{ date?: string }>
}

export default async function TodoListPage({ searchParams }: Props) {
  const params = await searchParams
  const selectedDate = params.date || todayString()
  const todos = await list(selectedDate)

  const prevDate = addDays(selectedDate, -1)
  const nextDate = addDays(selectedDate, 1)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Link href={`/app/todo?date=${prevDate}`}>
            <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
          </Link>
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900">{formatDisplayDate(selectedDate)}</h1>
            <p className="text-sm text-gray-500">{selectedDate}</p>
          </div>
          <Link href={`/app/todo?date=${nextDate}`}>
            <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
          </Link>
        </div>
        <Link href={`/app/todo/new?date=${selectedDate}`} className="w-full">
          <Button className="flex items-center gap-2 w-full">
            <Plus className="h-4 w-4" />
            New Todo
          </Button>
        </Link>
        {todos.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No todos for this day</h3>
            <p className="text-gray-600 mb-4">Add a todo or navigate to another date</p>
          </div>
        ) : (
          todos.map((t: any) => (
            <Link key={t.id} href={`/app/todo/${t.id}`}>
              <Card className="w-full hover:shadow-md transition-shadow cursor-pointer py-2 px-4">
                <CardTitle className={`text-lg ${t.done ? 'line-through text-gray-500' : ''}`}>
                  {t.title}
                </CardTitle>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
