'use client'

import { ReactNode } from 'react'
import { DragDropProvider } from '@dnd-kit/react'
import { useSortable } from '@dnd-kit/react/sortable'
import { PointerSensor, PointerActivationConstraints } from '@dnd-kit/dom'
import { arrayMove } from '@dnd-kit/sortable'

interface DraggableItem {
  id: string
}

interface SortableItemProps {
  id: string
  index: number
  children: (props: { handleRef: React.Ref<any>; isDragging: boolean }) => ReactNode
}

function SortableItem({ id, index, children }: SortableItemProps) {
  const { ref, handleRef, isDragging } = useSortable({ id, index })

  return (
    <li ref={ref}>
      {children({ handleRef, isDragging })}
    </li>
  )
}

interface DraggableListProps<T extends DraggableItem> {
  items: T[]
  onReorder: (items: T[]) => void
  renderItem: (item: T, props: { handleRef: React.Ref<any>; isDragging: boolean }) => ReactNode
}

export function DraggableList<T extends DraggableItem>({ items, onReorder, renderItem }: DraggableListProps<T>) {
  function handleDragEnd(event: any) {
    const { source } = event.operation
    onReorder(arrayMove(items, source.sortable.initialIndex, source.sortable.index))
  }

  return (
    <DragDropProvider onDragEnd={handleDragEnd} sensors={[PointerSensor.configure({ activationConstraints: [new PointerActivationConstraints.Delay({ value: 100, tolerance: 5 })] })]}>
      <ul className="flex flex-col gap-1">
        {items.map((item, index) => (
          <SortableItem key={item.id} id={item.id} index={index}>
            {(props) => renderItem(item, props)}
          </SortableItem>
        ))}
      </ul>
    </DragDropProvider>
  )
}
