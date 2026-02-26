'use client'

import Link from 'next/link'
import { useState } from 'react'
import { GripVertical } from 'lucide-react'
import { DraggableList } from '@/components/draggable-list'
import { reorder } from '@/actions/todo'
import { Todo } from '@/interfaces/todo'

interface TodoListProps {
  todos: Todo[]
}

export default function TodoList({ todos }: TodoListProps) {
  const [items, setItems] = useState(todos)

  async function handleReorder(reordered: Todo[]) {
    setItems(reordered)
    await reorder(reordered.map((t) => t.id))
  }

  return (
    <DraggableList
      items={items}
      onReorder={handleReorder}
      renderItem={(item, { handleRef, isDragging }) => (
        <div className={`flex items-center gap-2 rounded-md border px-3 py-2 bg-background ${isDragging ? 'opacity-50' : ''}`}>
          <button type="button" ref={handleRef} className="cursor-grab touch-none text-gray-400 hover:text-gray-600">
            <GripVertical className="h-4 w-4" />
          </button>
          <Link href={`/app/todo/${item.id}`} className="flex-1 min-w-0 flex items-center justify-between gap-2">
            <span className={`text-sm font-medium ${item.done ? 'line-through text-gray-400' : ''}`}>
              {item.title}
            </span>
            {item.checklist_total ? (
              <span className="text-xs text-gray-400 flex-shrink-0">
                {item.checklist_done}/{item.checklist_total}
              </span>
            ) : item.time && item.time !== '00:00' ? (
              <span className="text-xs text-gray-400 flex-shrink-0">{item.time}</span>
            ) : null}
          </Link>
        </div>
      )}
    />
  )
}
