export interface Todo {
  id: string
  title: string
  description: string
  done: boolean
  date: string
  time: string
  order: number
  checklist: TodoChecklist[]
  checklist_total?: number
  checklist_done?: number
}

export interface TodoChecklist {
  id: string
  title: string
  done: boolean
}
