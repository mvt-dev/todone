'use client'

import { useActionState } from 'react'
import { save, remove } from '@/actions/todo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Switch } from '@/components/ui/switch'

interface TodoFormProps {
  todo: {
    id: string
    title: string
    description: string
    done: boolean
  }
}

export default function TodoForm({ todo }: TodoFormProps) {
  const isNew = todo?.id === 'new'
  const [saveState, saveAction, savePending] = useActionState<any, FormData>(save, { todo, errors: {} })
  const [removeState, removeAction, removePending] = useActionState(remove, null)

  return (
    <>
      <form action={saveAction} id="todo-form">
        <input type="hidden" name="id" value={todo?.id ?? 'new'} />
        <FieldGroup>
          <Field data-invalid={!!saveState?.errors?.title}>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <Input id="title" name="title" defaultValue={saveState?.todo?.title ?? ''} aria-invalid={!!saveState?.errors?.title} />
            {saveState?.errors?.title && <FieldError>{ saveState?.errors?.title[0] }</FieldError>}
          </Field>
          <Field data-invalid={!!saveState?.errors?.description}>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea id="description" name="description" defaultValue={saveState?.todo?.description ?? ''} aria-invalid={!!saveState?.errors?.description} />
            {saveState?.errors?.description && <FieldError>{ saveState?.errors?.description[0] }</FieldError>}
          </Field>
          <Field orientation="horizontal">
            <Switch id="done" name="done" defaultChecked={saveState?.todo?.done ?? false} />
            <FieldLabel htmlFor="done">Done</FieldLabel>
          </Field>
        </FieldGroup>
      </form>
      <div className="flex flex-col gap-2">
        <Button type="submit" form="todo-form" disabled={savePending} className="w-full">
          {savePending ? 'Saving...' : 'Save'}
        </Button>
        {!isNew && (
          <form action={removeAction} className="w-full">
            <input type="hidden" name="id" value={todo.id} />
            <Button type="submit" variant="destructive" disabled={removePending} className="w-full">
              {removePending ? 'Deleting...' : 'Delete'}
            </Button>
          </form>
        )}
      </div>
    </>
  )
}
