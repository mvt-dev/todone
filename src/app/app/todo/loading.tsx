import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-3">
        {/* Nav arrows + day header */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-9" />
          <div className="flex flex-col items-center gap-1">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-9 w-9" />
        </div>
        {/* New todo button */}
        <Skeleton className="h-9 w-full" />
        {/* Todo items */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-12 w-full rounded-md" />
          <Skeleton className="h-12 w-full rounded-md" />
          <Skeleton className="h-12 w-full rounded-md" />
        </div>
      </div>
    </div>
  )
}
