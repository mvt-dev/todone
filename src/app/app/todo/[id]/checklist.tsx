'use client'

import { useState, useRef } from 'react'
import { Trash2, Plus, GripVertical, ChevronUp, ChevronDown } from 'lucide-react'
import { DraggableList } from '@/components/draggable-list'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { TodoChecklist } from '@/interfaces/todo'

interface ChecklistProps {
  items: TodoChecklist[]
  onChange: (items: TodoChecklist[]) => void
}

export function Checklist({ items, onChange }: ChecklistProps) {
  const [open, setOpen] = useState(items.length > 0)
  const [newItemTitle, setNewItemTitle] = useState('')
  const newItemRef = useRef<HTMLInputElement>(null)

  function addItem() {
    const title = newItemTitle.trim()
    if (!title) return
    onChange([...items, { id: `new:${new Date()}`, title, done: false }])
    setNewItemTitle('')
    newItemRef.current?.focus()
  }

  function toggleItem(id: string) {
    onChange(items.map((item) => item.id === id ? { ...item, done: !item.done } : item))
  }

  function removeItem(id: string) {
    onChange(items.filter((item) => item.id !== id))
  }

  function updateItemTitle(id: string, title: string) {
    onChange(items.map((item) => item.id === id ? { ...item, title } : item))
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="rounded-md border border-input p-2 shadow-xs">
      <CollapsibleTrigger asChild>
        <div className="w-full flex justify-between items-center px-1 py-1">
          <span className="text-base font-medium">Checklist{items.length ? ` (${items.filter(i => i.done).length}/${items.length})` : ''}</span>
          {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-2 my-2 px-1">
        <DraggableList
          items={items}
          onReorder={onChange}
          renderItem={(item, { handleRef, isDragging }) => (
            <div className={`flex items-center gap-2 rounded-md border px-3 py-2 bg-background ${isDragging ? 'opacity-50' : ''}`}>
              <button type="button" ref={handleRef} className="cursor-grab touch-none text-gray-400 hover:text-gray-600">
                <GripVertical className="h-4 w-4" />
              </button>
              <Checkbox
                checked={item.done}
                onCheckedChange={() => toggleItem(item.id)}
              />
              <Input
                value={item.title}
                onChange={e => updateItemTitle(item.id, e.target.value)}
                className={`flex-1 border-0 shadow-none h-auto p-0 focus-visible:ring-0 text-sm ${item.done ? 'line-through text-gray-400' : ''}`}
              />
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="text-gray-400 hover:text-destructive transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        />
        <div className="flex gap-2">
          <Input
            ref={newItemRef}
            value={newItemTitle}
            onChange={e => setNewItemTitle(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addItem() } }}
            placeholder="Add checklist item..."
          />
          <Button type="button" variant="outline" onClick={addItem}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
