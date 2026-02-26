export interface Todo {
  id: string
  title: string
  description: string
  done: boolean
  date: string
  checklist: TodoChecklist[]
}

export interface TodoChecklist {
  id: string
  title: string
  done: boolean
}
