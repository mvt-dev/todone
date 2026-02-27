'use client'

import Link from 'next/link'
import { useState } from 'react'
import { GripVertical } from 'lucide-react'
import { DraggableList } from '@/components/draggable-list'
import { reorder } from '@/actions/note'
import { Note } from '@/interfaces/note'

interface NoteListProps {
  notes: Note[]
}

export default function NoteList({ notes }: NoteListProps) {
  const [items, setItems] = useState(notes)

  async function handleReorder(reordered: Note[]) {
    setItems(reordered)
    await reorder(reordered.map((n) => n.id))
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
          <Link href={`/app/note/${item.id}`} className="flex-1 min-w-0 flex items-center justify-between gap-2">
            <span className="text-sm font-medium">{item.title}</span>
            {item.checklist_total ? (
              <span className="text-xs text-gray-400 flex-shrink-0">
                {item.checklist_done}/{item.checklist_total}
              </span>
            ) : null}
          </Link>
        </div>
      )}
    />
  )
}
