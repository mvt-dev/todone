'use client'

import { useActionState, useState, useRef, useMemo } from 'react'
import { Trash2, Plus, CalendarIcon, GripVertical } from 'lucide-react'
import { DraggableList } from '@/components/draggable-list'
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

export default function TodoForm({ todo }: TodoFormProps) {
  const [saveState, saveAction, savePending] = useActionState<any, FormData>(save, { todo, errors: {} })
  const [removeState, removeAction, removePending] = useActionState(remove, null)
  const [checklist, setChecklist] = useState<TodoChecklist[]>(todo.checklist ?? [])
  const [newItemTitle, setNewItemTitle] = useState('')
  const newItemRef = useRef<HTMLInputElement>(null)
  const [date, setDate] = useState<Date | undefined>(parseDateString(todo.date))
  const [dateOpen, setDateOpen] = useState(false)
  const [time, setTime] = useState(todo.time || '00:00')

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
          <Field className="flex-1">
            <FieldLabel>Date</FieldLabel>
            <div className="w-full flex gap-2">
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" type="button" className={`flex-grow bg-transparent justify-between text-left font-normal text-base md:text-sm ${!date ? 'text-muted-foreground' : ''}`}>
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
              <Input
                name="time"
                className="flex-shrink-0 w-17"
                value={time}
                maxLength={5}
                placeholder="00:00"
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '').slice(0, 4)
                  if (raw.length >= 3) {
                    setTime(raw.slice(0, 2) + ':' + raw.slice(2))
                  } else {
                    setTime(raw)
                  }
                }}
              />
            </div>
          </Field>
          <Field orientation="horizontal">
            <Switch id="done" name="done" defaultChecked={saveState?.todo?.done ?? false} />
            <FieldLabel htmlFor="done">Done</FieldLabel>
          </Field>
          <Separator />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">Checklist</span>
            <DraggableList
              items={checklist}
              onReorder={setChecklist}
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
