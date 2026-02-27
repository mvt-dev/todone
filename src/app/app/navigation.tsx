'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ListTodo, Target, StickyNote } from 'lucide-react'

const items = [
  { href: '/app/todo', label: 'Todos', icon: ListTodo },
  { href: '/app/goal', label: 'Goals', icon: Target },
  { href: '/app/note', label: 'Notes', icon: StickyNote },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background">
      <div className="flex items-center justify-around h-14">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-xs transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
