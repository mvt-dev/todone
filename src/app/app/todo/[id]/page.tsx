import { notFound } from 'next/navigation'
import { X } from 'lucide-react'
import Link from 'next/link'
import { get } from '@/actions/todo'
import { Button } from '@/components/ui/button'
import { todayString } from '@/lib/date'
import TodoForm from './todo-form'

interface Todo {
  id: string
  title: string
  description: string
  done: boolean
  date: string
  checklist: { title: string; done: boolean }[]
}

export default async function TodoCrudPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ date?: string }> }) {
  const { id } = await params
  const query = await searchParams

  const todo:Todo = {
    id,
    title: '',
    description: '',
    done: false,
    date: query.date || todayString(),
    checklist: [],
  }

  if (id !== 'new') {
    const result = await get(id)
    if (!result) notFound()
    todo.title = result?.title || ''
    todo.description = result?.description || ''
    todo.done = result?.done || false
    todo.date = result?.date || todayString()
    todo.checklist = result?.checklist || []
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-full flex flex-col gap-8">
      <div className="flex justify-between align-center">
        <h1 className="text-3xl font-bold text-gray-900">{id === 'new' ? 'New todo' : 'Edit todo'}</h1>
        <Link href={`/app/todo?date=${todo.date}`}>
          <Button variant="outline" size="icon"><X /></Button>
        </Link>
      </div>
      <TodoForm todo={todo} />
    </div>
  )
}
