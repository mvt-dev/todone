export interface Note {
  id: string
  title: string
  description: string
  order: number
  checklist: NoteChecklist[]
  checklist_total?: number
  checklist_done?: number
}

export interface NoteChecklist {
  id: string
  title: string
  done: boolean
}
