import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-3">
        {/* New note button */}
        <Skeleton className="h-9 w-full" />
        {/* Note items */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  )
}
