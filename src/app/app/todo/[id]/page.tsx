import { notFound } from 'next/navigation'
import { X } from 'lucide-react'
import Link from 'next/link'
import { get } from '@/actions/todo'
import { Button } from '@/components/ui/button'
import TodoForm from './todo-form'

export default async function TodoCrudPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const todo = {
    id,
    title: '',
    description: '',
    done: false
  }

  if (id !== 'new') {
    const result = await get(id)
    if (!result) notFound()
    todo.title = result?.title || ''
    todo.description = result?.description || ''
    todo.done = result?.done || false
  }

  return (
    <div className="container mx-auto px-4 py-8 h-full flex flex-col gap-8">
      <div className="flex justify-between align-center">
        <h1 className="text-3xl font-bold text-gray-900">{id === 'new' ? 'New todo' : 'Edit todo'}</h1>
        <Link href="/app/todo">
          <Button variant="outline" size="icon-lg"><X /></Button>
        </Link>
      </div>
      <TodoForm todo={todo} />
    </div>
  )
}
