import Link from 'next/link'
import { Plus } from 'lucide-react'
import { list } from '@/actions/note'
import { Button } from '@/components/ui/button'
import NoteList from './list'

export default async function NoteListPage() {
  const notes = await list()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-3">
        <Link href="/app/note/new" className="w-full">
          <Button className="flex items-center gap-2 w-full">
            <Plus className="h-4 w-4" />
            New note
          </Button>
        </Link>
        {notes.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
            <p className="text-gray-600 mb-4">Create your first note</p>
          </div>
        ) : (
          <NoteList notes={notes} />
        )}
      </div>
    </div>
  )
}
