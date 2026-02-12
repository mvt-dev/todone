'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import db from '@/lib/db'
import { uuid } from '@/lib/utils'

export async function list() {
  const session = await auth()
  const todos = await db('todo')
    .where('user', session?.user?.id)
  return todos
}

export async function get(id: string) {
  const session = await auth()
  const todo = await db('todo')
    .where({
      id,
      user: session?.user?.id,
    })
    .first()
  return {
    ...todo,
    done: todo?.done === 1,
  }
}

export async function save(prevState: unknown, formData: FormData) {
  const session = await auth()
  const data = {
    id: formData.get('id'),
    user: session?.user?.id,
    title: formData.get('title'),
    description: formData.get('description'),
    done: Boolean(formData.get('done'))
  }
  const validation = z.object({
    id: z.literal('new').or(z.uuid()),
    user: z.uuid(),
    title: z.string().trim().min(1, 'Title is required'),
    description: z.string().trim(),
    done: z.boolean(),
  }).safeParse(data)
  console.log(validation)
  if (!validation.success) {
    return {
      todo: data,
      errors: z.flattenError(validation.error).fieldErrors,
    }
  }
  if (validation.data.id === 'new') {
    await db('todo').insert({
      ...validation.data,
      id: uuid(),
      done: validation.data.done ? 1 : 0,
    })
  } else {
    await db('todo').update({
      title: validation.data.title,
      description: validation.data.description,
      done: validation.data.done ? 1 : 0,
    }).where({
      id: validation.data.id,
      user: validation.data.user,
    })
  }
  redirect('/app/todo')
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
  await db('todo').delete().where({ ...validation.data })
  redirect('/app/todo')
}
