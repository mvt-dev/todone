'use client'

import { useActionState, useState, useRef, useMemo } from 'react'
import { DragDropProvider } from '@dnd-kit/react'
import { useSortable } from '@dnd-kit/react/sortable'
import { PointerSensor, PointerActivationConstraints } from '@dnd-kit/dom'
import { arrayMove } from '@dnd-kit/sortable'
import { Trash2, Plus, CalendarIcon, GripVertical } from 'lucide-react'
import { save, remove } from '@/actions/todo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { formatDateString, parseDateString } from '@/lib/date'
import { Todo, TodoChecklist } from '@/interfaces/todo'

interface TodoFormProps {
  todo: Todo
}

interface SortableChecklistItemProps {
  item: TodoChecklist
  index: number
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onUpdateTitle: (id: string, title: string) => void
}

function SortableChecklistItem({ item, index, onToggle, onRemove, onUpdateTitle }: SortableChecklistItemProps) {
  const { ref, handleRef, isDragging } = useSortable({ id: item.id, index })

  return (
    <li ref={ref} className={`flex items-center gap-2 rounded-md border px-3 py-2 bg-background ${isDragging ? 'opacity-50' : ''}`}>
      <button type="button" ref={handleRef} className="cursor-grab touch-none text-gray-400 hover:text-gray-600">
        <GripVertical className="h-4 w-4" />
      </button>
      <Checkbox
        checked={item.done}
        onCheckedChange={() => onToggle(item.id)}
      />
      <Input
        value={item.title}
        onChange={e => onUpdateTitle(item.id, e.target.value)}
        className={`flex-1 border-0 shadow-none h-auto p-0 focus-visible:ring-0 text-sm ${item.done ? 'line-through text-gray-400' : ''}`}
      />
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="text-gray-400 hover:text-destructive transition-colors"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  )
}

export default function TodoForm({ todo }: TodoFormProps) {
  const [saveState, saveAction, savePending] = useActionState<any, FormData>(save, { todo, errors: {} })
  const [removeState, removeAction, removePending] = useActionState(remove, null)
  const [checklist, setChecklist] = useState<TodoChecklist[]>(todo.checklist ?? [])
  const [newItemTitle, setNewItemTitle] = useState('')
  const newItemRef = useRef<HTMLInputElement>(null)
  const [date, setDate] = useState<Date | undefined>(parseDateString(todo.date))
  const [dateOpen, setDateOpen] = useState(false)

  const checklistJSON = useMemo(() => JSON.stringify(checklist.map((item) => ({
    title: item.title,
    done: item.done,
  }))), [checklist])

  function addItem() {
    const title = newItemTitle.trim()
    if (!title) return
    setChecklist(prev => [...prev, { id: `new:${new Date()}`, title, done: false }])
    setNewItemTitle('')
    newItemRef.current?.focus()
  }

  function toggleItem(id: string) {
    setChecklist(prev => prev.map((item) => item.id === id ? { ...item, done: !item.done } : item))
  }

  function removeItem(id: string) {
    setChecklist(prev => prev.filter((item) => item.id !== id))
  }

  function updateItemTitle(id: string, title: string) {
    setChecklist(prev => prev.map((item) => item.id === id ? { ...item, title } : item))
  }

  function handleDragEnd(event: any) {
    const { source } = event.operation
    setChecklist(prev => arrayMove(prev, source.sortable.initialIndex, source.sortable.index))
  }

  return (
    <>
      <form action={saveAction} id="todo-form">
        <input type="hidden" name="id" value={todo?.id ?? 'new'} />
        <input type="hidden" name="date" value={date ? formatDateString(date) : ''} />
        <input type="hidden" name="checklist" value={checklistJSON} />
        <FieldGroup>
          <Field data-invalid={!!saveState?.errors?.title}>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <Input id="title" name="title" defaultValue={saveState?.todo?.title ?? ''} aria-invalid={!!saveState?.errors?.title} />
            {saveState?.errors?.title && <FieldError>{saveState?.errors?.title[0]}</FieldError>}
          </Field>
          <Field data-invalid={!!saveState?.errors?.description}>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea id="description" name="description" defaultValue={saveState?.todo?.description ?? ''} aria-invalid={!!saveState?.errors?.description} />
            {saveState?.errors?.description && <FieldError>{saveState?.errors?.description[0]}</FieldError>}
          </Field>
          <Field>
            <FieldLabel>Date</FieldLabel>
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" type="button" className={`bg-transparent w-full justify-between text-left font-normal ${!date ? 'text-muted-foreground' : ''}`}>
                  {date ? formatDateString(date) : 'Pick a date'}
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => { setDate(d); setDateOpen(false) }}
                />
              </PopoverContent>
            </Popover>
          </Field>
          <Field orientation="horizontal">
            <Switch id="done" name="done" defaultChecked={saveState?.todo?.done ?? false} />
            <FieldLabel htmlFor="done">Done</FieldLabel>
          </Field>
          <Separator />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">Checklist</span>
            <DragDropProvider onDragEnd={handleDragEnd} sensors={[PointerSensor.configure({ activationConstraints: [new PointerActivationConstraints.Delay({ value: 100, tolerance: 5 })] })]}>
              <ul className="flex flex-col gap-1">
                {checklist.length === 0 && (
                  <li className="text-sm text-gray-500">No checklist items yet.</li>
                )}
                {checklist.map((item, index) => (
                  <SortableChecklistItem
                    key={item.id}
                    item={item}
                    index={index}
                    onToggle={toggleItem}
                    onRemove={removeItem}
                    onUpdateTitle={updateItemTitle}
                  />
                ))}
              </ul>
            </DragDropProvider>
            <div className="flex gap-1">
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
          </div>
        </FieldGroup>
      </form>
      <div className="flex flex-col gap-2">
        <Button type="submit" form="todo-form" disabled={savePending} className="w-full">
          {savePending ? 'Saving...' : 'Save'}
        </Button>
        {todo?.id !== 'new' && (
          <form action={removeAction} className="w-full">
            <input type="hidden" name="id" value={todo.id} />
            <input type="hidden" name="date" value={todo.date} />
            <Button type="submit" variant="destructive" disabled={removePending} className="w-full">
              {removePending ? 'Deleting...' : 'Delete'}
            </Button>
          </form>
        )}
      </div>
    </>
  )
}
