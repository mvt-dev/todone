'use client'

import { useActionState, useState, useMemo } from 'react'
import Link from 'next/link'
import { X, ChevronUp, ChevronDown } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Checklist } from './checklist'
import { save, remove } from '@/actions/note'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SerializedEditorState } from 'lexical'
import { Editor } from '@/components/blocks/editor-00/editor'
import { Note, NoteChecklist } from '@/interfaces/note'

function tryParseJSON(str: string): SerializedEditorState | undefined {
  try {
    return JSON.parse(str) as SerializedEditorState
  } catch {
    return undefined
  }
}

interface NoteFormProps {
  note: Note
}

export default function NoteForm({ note }: NoteFormProps) {
  const [saveState, saveAction, savePending] = useActionState<any, FormData>(save, { note, errors: {} })
  const [removeState, removeAction, removePending] = useActionState(remove, null)
  const [checklist, setChecklist] = useState<NoteChecklist[]>(note.checklist ?? [])
  const [description, setDescription] = useState(note.description || '')
  const [descriptionOpen, setDescriptionOpen] = useState(!!note.description)

  const checklistJSON = useMemo(() => JSON.stringify(checklist.map((item) => ({
    title: item.title,
    done: item.done,
  }))), [checklist])

  return (
    <>
      <form action={saveAction} id="note-form" className="flex flex-col gap-4">
        <input type="hidden" name="id" value={note?.id ?? 'new'} />
        <input type="hidden" name="checklist" value={checklistJSON} />
        <div className="flex justify-between align-center gap-2">
          <Input
            id="title"
            name="title"
            placeholder="Title"
            defaultValue={saveState?.note?.title ?? ''}
            aria-invalid={!!saveState?.errors?.title}
            className="text-xl font-bold"
          />
          <Link href="/app/note">
            <Button type="button" variant="outline" size="icon"><X /></Button>
          </Link>
        </div>
        <input type="hidden" name="description" value={description} />
        <Collapsible open={descriptionOpen} onOpenChange={setDescriptionOpen} className="rounded-md border border-input p-2 shadow-xs">
          <CollapsibleTrigger asChild>
            <div className="w-full flex justify-between items-center px-1 py-1">
              <span className="text-sm font-medium">Description</span>
              {descriptionOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 px-1 pb-2">
            <Editor
              editorSerializedState={description ? tryParseJSON(description) : undefined}
              onSerializedChange={(state) => setDescription(JSON.stringify(state))}
              placeholder="Description..."
            />
          </CollapsibleContent>
        </Collapsible>
        <Checklist items={checklist} onChange={setChecklist} />
      </form>
      <div className="flex flex-col gap-2">
        <Button type="submit" form="note-form" disabled={savePending} className="w-full">
          {savePending ? 'Saving...' : 'Save'}
        </Button>
        {note?.id !== 'new' && (
          <form action={removeAction} className="w-full">
            <input type="hidden" name="id" value={note.id} />
            <Button type="submit" variant="destructive" disabled={removePending} className="w-full">
              {removePending ? 'Deleting...' : 'Delete'}
            </Button>
          </form>
        )}
      </div>
    </>
  )
}
