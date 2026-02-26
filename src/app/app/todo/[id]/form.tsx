'use client'

import { useActionState, useState, useRef, useMemo } from 'react'
import Link from 'next/link'
import { CalendarIcon, X } from 'lucide-react'
import { Checklist } from './checklist'
import { save, remove } from '@/actions/todo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SerializedEditorState } from 'lexical'
import { Editor } from '@/components/blocks/editor-00/editor'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { formatDateString, parseDateString } from '@/lib/date'
import { Todo, TodoChecklist } from '@/interfaces/todo'

function tryParseJSON(str: string): SerializedEditorState | undefined {
  try {
    return JSON.parse(str) as SerializedEditorState
  } catch {
    return undefined
  }
}

interface TodoFormProps {
  todo: Todo
}

export default function TodoForm({ todo }: TodoFormProps) {
  const [saveState, saveAction, savePending] = useActionState<any, FormData>(save, { todo, errors: {} })
  const [removeState, removeAction, removePending] = useActionState(remove, null)
  const [checklist, setChecklist] = useState<TodoChecklist[]>(todo.checklist ?? [])
  const [date, setDate] = useState<Date | undefined>(parseDateString(todo.date))
  const [dateOpen, setDateOpen] = useState(false)
  const [time, setTime] = useState(todo.time || '00:00')
  const [done, setDone] = useState(todo.done || false)
  const [description, setDescription] = useState(todo.description || '')

  const formRef = useRef<HTMLFormElement>(null)

  const checklistJSON = useMemo(() => JSON.stringify(checklist.map((item) => ({
    title: item.title,
    done: item.done,
  }))), [checklist])

  function toggleDone() {
    setDone(prev => !prev)
    setTimeout(() => formRef.current?.requestSubmit(), 100)
  }

  return (
    <>
      <form action={saveAction} ref={formRef} id="todo-form" className="flex flex-col gap-4">
        <input type="hidden" name="id" value={todo?.id ?? 'new'} />
        <input type="hidden" name="done" value={String(done)} />
        <input type="hidden" name="date" value={date ? formatDateString(date) : ''} />
        <input type="hidden" name="checklist" value={checklistJSON} />
        <div className="flex justify-between align-center gap-2">
          <Input
            id="title"
            name="title"
            placeholder="Title"
            defaultValue={saveState?.todo?.title ?? ''}
            aria-invalid={!!saveState?.errors?.title}
            className="text-xl font-bold"
          />
          <Link href={`/app/todo?date=${todo.date}`}>
            <Button type="button" variant="outline" size="icon"><X /></Button>
          </Link>
        </div>
        <div className="w-full flex gap-2">
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" type="button" className={`flex-grow bg-background justify-between text-left font-normal text-base md:text-sm ${!date ? 'text-muted-foreground' : ''}`}>
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
        <input type="hidden" name="description" value={description} />
        <Editor
          editorSerializedState={description ? tryParseJSON(description) : undefined}
          onSerializedChange={(state) => setDescription(JSON.stringify(state))}
          placeholder="Description..."
        />
        <Checklist items={checklist} onChange={setChecklist} />
      </form>
      <div className="flex flex-col gap-2">
        <Button type="submit" form="todo-form" disabled={savePending} className="w-full">
          {savePending ? 'Saving...' : 'Save'}
        </Button>
        {todo?.id !== 'new' && (
          <>
            <Button type="button" variant="outline" onClick={toggleDone} disabled={savePending} className="w-full">
              {savePending ? 'Saving...' : todo.done ? 'Undone' : 'Done'}
            </Button>
            <form action={removeAction} className="w-full">
              <input type="hidden" name="id" value={todo.id} />
              <input type="hidden" name="date" value={todo.date} />
              <Button type="submit" variant="destructive" disabled={removePending} className="w-full">
                {removePending ? 'Deleting...' : 'Delete'}
              </Button>
            </form>
          </>
        )}
      </div>
    </>
  )
}
