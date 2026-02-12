import Link from 'next/link'
import { Plus } from 'lucide-react'
import { list } from '@/actions/todo'
import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'

export default async function TodoListPage() {
  const todos = await list()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold text-gray-900">My todos</h1>
        <p className="text-gray-600 -mt-2 mb-2">Manage your tasks and stay organized</p>
        <Link href="/app/todo/new" className="w-full">
          <Button className="flex items-center gap-2 w-full">
            <Plus className="h-4 w-4" />
            New Todo
          </Button>
        </Link>
        {todos.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No todos yet</h3>
            <p className="text-gray-600 mb-4">Create your first todo to get started!</p>
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
