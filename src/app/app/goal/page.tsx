import { Construction } from 'lucide-react'

export default function GoalPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
        <Construction className="h-10 w-10" />
        <h1 className="text-lg font-medium">Under construction</h1>
        <p className="text-sm">Goals are coming soon</p>
      </div>
    </div>
  )
}
