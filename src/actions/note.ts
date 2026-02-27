'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import db from '@/lib/db'
import { uuid } from '@/lib/utils'

export async function list() {
  const session = await auth()
  const notes = await db('note')
    .select(
      'note.*',
      db('note_checklist').where('note', db.ref('note.id')).count('id').as('checklist_total'),
      db('note_checklist').where('note', db.ref('note.id')).sum('done').as('checklist_done'),
    )
    .where({ user: session?.user?.id })
    .orderBy('order', 'asc')
  return notes.map((n: any) => ({
    ...n,
    checklist_total: Number(n.checklist_total),
    checklist_done: Number(n.checklist_done),
  }))
}

export async function get(id: string) {
  const session = await auth()
  const results = await Promise.all([
    db('note').where({ id, user: session?.user?.id }).first(),
    db('note_checklist').select('id', 'title', 'done').where('note', id).orderBy('order', 'asc'),
  ])
  return {
    ...results[0],
    checklist: results[1].map((item: any) => ({ ...item, done: item.done === 1 })),
  }
}

export async function save(prevState: unknown, formData: FormData) {
  const session = await auth()

  const data = {
    id: formData.get('id'),
    user: session?.user?.id,
    title: formData.get('title'),
    description: formData.get('description'),
    checklist: JSON.parse(formData.get('checklist') as string),
  }

  const validation = z.object({
    id: z.literal('new').or(z.uuid()),
    user: z.uuid(),
    title: z.string().trim().min(1, 'Title is required'),
    description: z.string().trim(),
    checklist: z.array(z.object({
      title: z.string().trim().min(1, 'Checklist is required'),
      done: z.boolean(),
    })),
  }).safeParse(data)

  if (!validation.success) {
    return {
      note: data,
      errors: z.flattenError(validation.error).fieldErrors,
    }
  }

  if (validation.data.id === 'new') {
    const id = uuid()
    const maxOrder = await db('note').where({ user: validation.data.user }).max('order as max').first()
    await db.transaction(async (trx) => {
      await db('note').transacting(trx).insert({
        id,
        user: validation.data.user,
        title: validation.data.title,
        description: validation.data.description,
        order: (maxOrder?.max ?? -1) + 1,
      })
      if (validation.data.checklist.length) {
        await db('note_checklist').transacting(trx).insert(validation.data.checklist.map((checklist, index) => ({
          id: uuid(),
          note: id,
          title: checklist.title,
          done: checklist.done ? 1 : 0,
          order: index,
        })))
      }
    })
  } else {
    await db.transaction(async (trx) => {
      await db('note')
        .transacting(trx)
        .update({
          title: validation.data.title,
          description: validation.data.description,
        })
        .where({
          id: validation.data.id,
          user: validation.data.user,
        })
      await db('note_checklist')
        .transacting(trx)
        .where('note', validation.data.id)
        .delete()
      if (validation.data.checklist.length) {
        await db('note_checklist')
          .transacting(trx)
          .insert(validation.data.checklist.map((checklist, index) => ({
            id: uuid(),
            note: validation.data.id,
            title: checklist.title,
            done: checklist.done ? 1 : 0,
            order: index,
          })))
      }
    })
  }

  redirect('/app/note')
}

export async function reorder(ids: string[]) {
  const session = await auth()
  await db.transaction(async (trx) => {
    await Promise.all(
      ids.map((id, index) => db('note').transacting(trx).update({ order: index }).where({ id, user: session?.user?.id }))
    )
  })
}

export async function remove(prevState: unknown, formData: FormData) {
  const session = await auth()
  const data = {
    id: formData.get('id'),
    user: session?.user?.id,
  }
  const validation = z.object({
    id: z.uuid(),
    user: z.uuid(),
  }).safeParse(data)
  if (!validation.success) {
    return {
      note: data,
      errors: z.flattenError(validation.error).fieldErrors,
    }
  }
  await db('note').delete().where({ ...validation.data })
  redirect('/app/note')
}
