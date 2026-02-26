'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import db from '@/lib/db'
import { uuid } from '@/lib/utils'

export async function list(date: string) {
  const session = await auth()
  const todos = await db('todo')
    .select(
      'todo.*',
      db('todo_checklist').where('todo', db.ref('todo.id')).count('id').as('checklist_total'),
      db('todo_checklist').where('todo', db.ref('todo.id')).sum('done').as('checklist_done'),
    )
    .where({ date, user: session?.user?.id })
    .orderBy('order', 'asc')
  return todos.map((t: any) => ({
    ...t,
    done: t.done === 1,
    checklist_total: Number(t.checklist_total),
    checklist_done: Number(t.checklist_done),
  }))
}

export async function get(id: string) {
  const session = await auth()
  const results = await Promise.all([
    db('todo').where({ id, user: session?.user?.id }).first(),
    db('todo_checklist').select('id', 'title', 'done').where('todo', id).orderBy('order', 'asc'),
  ])
  return {
    ...results[0],
    done: results[0].done === 1,
    time: results[0].time || '',
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
    done: Boolean(formData.get('done')),
    date: formData.get('date'),
    time: formData.get('time'),
    checklist: JSON.parse(formData.get('checklist') as string),
  }
  const validation = z.object({
    id: z.literal('new').or(z.uuid()),
    user: z.uuid(),
    title: z.string().trim().min(1, 'Title is required'),
    description: z.string().trim(),
    done: z.boolean(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date is required'),
    time: z.string().regex(/^(\d{2}:\d{2})?$/, 'Time must be in hh:mm format'),
    checklist: z.array(z.object({
      title: z.string().trim().min(1, 'Checklist is required'),
      done: z.boolean(),
    })),
  }).safeParse(data)
  if (!validation.success) {
    return {
      todo: data,
      errors: z.flattenError(validation.error).fieldErrors,
    }
  }

  if (validation.data.id === 'new') {
    const id = uuid()
    const maxOrder = await db('todo').where({ date: validation.data.date, user: validation.data.user }).max('order as max').first()
    await db.transaction(async (trx) => {
      await db('todo').transacting(trx).insert({
        id,
        user: validation.data.user,
        title: validation.data.title,
        description: validation.data.description,
        done: validation.data.done ? 1 : 0,
        date: validation.data.date,
        time: validation.data.time,
        order: (maxOrder?.max ?? -1) + 1,
      })
      if (validation.data.checklist.length) {
        await db('todo_checklist').transacting(trx).insert(validation.data.checklist.map((checklist, index) => ({
          id: uuid(),
          todo: id,
          title: checklist.title,
          done: checklist.done ? 1 : 0,
          order: index,
        })))
      }
    })
  } else {
    await db.transaction(async (trx) => {
      await db('todo')
        .transacting(trx)
        .update({
          user: validation.data.user,
          title: validation.data.title,
          description: validation.data.description,
          done: validation.data.done ? 1 : 0,
          date: validation.data.date,
          time: validation.data.time,
        })
        .where({
          id: validation.data.id,
          user: validation.data.user,
        })
      await db('todo_checklist')
        .transacting(trx)
        .where('todo', validation.data.id)
        .delete()
      if (validation.data.checklist.length) {
        await db('todo_checklist')
          .transacting(trx)
          .insert(validation.data.checklist.map((checklist, index) => ({
            id: uuid(),
            todo: validation.data.id,
            title: checklist.title,
            done: checklist.done ? 1 : 0,
            order: index,
          })))
      }
    })
  }

  redirect(`/app/todo?date=${validation.data.date}`)
}

export async function reorder(ids: string[]) {
  const session = await auth()
  await db.transaction(async (trx) => {
    await Promise.all(
      ids.map((id, index) => db('todo').transacting(trx).update({ order: index }).where({ id, user: session?.user?.id }))
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
      todo: data,
      errors: z.flattenError(validation.error).fieldErrors,
    }
  }
  const date = formData.get('date') || ''
  await db('todo').delete().where({ ...validation.data })
  redirect(`/app/todo?date=${date}`)
}
