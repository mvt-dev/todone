import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-full flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {/* Title + close button */}
        <div className="flex justify-between items-center gap-2">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 w-9 shrink-0" />
        </div>
        {/* Date + time */}
        <div className="flex gap-2">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 w-17" />
        </div>
        {/* Editor */}
        <Skeleton className="h-[200px] rounded-lg" />
        {/* Checklist */}
        <Skeleton className="h-11 rounded-md" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  )
}
