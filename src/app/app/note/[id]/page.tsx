import { notFound } from 'next/navigation'
import { get } from '@/actions/note'
import { Note } from '@/interfaces/note'
import NoteForm from './form'

export default async function NoteCrudPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const note: Note = {
    id,
    title: '',
    description: '',
    order: 0,
    checklist: [],
  }

  if (id !== 'new') {
    const result = await get(id)
    if (!result) notFound()
    note.title = result?.title || ''
    note.description = result?.description || ''
    note.order = result?.order ?? 0
    note.checklist = result?.checklist || []
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-full flex flex-col gap-4">
      <NoteForm note={note} />
    </div>
  )
}
