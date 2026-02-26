import { notFound } from 'next/navigation'
import { get } from '@/actions/todo'
import { todayString } from '@/lib/date'
import { Todo } from '@/interfaces/todo'
import TodoForm from './form'

export default async function TodoCrudPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ date?: string }> }) {
  const { id } = await params
  const query = await searchParams

  const todo: Todo = {
    id,
    title: '',
    description: '',
    done: false,
    date: query.date || todayString(),
    time: '00:00',
    order: 0,
    checklist: [],
  }

  if (id !== 'new') {
    const result = await get(id)
    if (!result) notFound()
    todo.title = result?.title || ''
    todo.description = result?.description || ''
    todo.done = result?.done || false
    todo.date = result?.date || todayString()
    todo.time = result?.time || '00:00'
    todo.order = result?.order ?? 0
    todo.checklist = result?.checklist || []
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-full flex flex-col gap-4">
      <TodoForm todo={todo} />
    </div>
  )
}
