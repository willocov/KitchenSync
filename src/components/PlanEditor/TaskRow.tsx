import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react'
import type { Task } from '../../types'
import { useMealPlanStore } from '../../store/useMealPlanStore'

interface TaskRowProps {
  dishId: string
  task: Task
  isFirst: boolean
  isLast: boolean
}

export function TaskRow({ dishId, task, isFirst, isLast }: TaskRowProps) {
  const { updateTask, removeTask, moveTaskUp, moveTaskDown } = useMealPlanStore()

  return (
    <div className="flex items-center gap-2 py-1.5 group">
      {/* Reorder buttons */}
      <div className="flex flex-col gap-0.5">
        <button
          onClick={() => moveTaskUp(dishId, task.id)}
          disabled={isFirst}
          className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-0 disabled:cursor-default cursor-pointer transition-colors"
          title="Move up"
        >
          <ArrowUp size={13} />
        </button>
        <button
          onClick={() => moveTaskDown(dishId, task.id)}
          disabled={isLast}
          className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-0 disabled:cursor-default cursor-pointer transition-colors"
          title="Move down"
        >
          <ArrowDown size={13} />
        </button>
      </div>

      {/* Task number */}
      <span className="text-xs text-gray-400 w-5 text-right shrink-0">
        {/* shown by parent */}
      </span>

      {/* Description */}
      <input
        type="text"
        value={task.description}
        onChange={(e) => updateTask(dishId, task.id, { description: e.target.value })}
        onFocus={(e) => e.target.select()}
        placeholder="Step description"
        className="flex-1 text-sm border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
      />

      {/* Duration */}
      <div className="flex items-center gap-1 shrink-0">
        <input
          type="number"
          min={1}
          max={999}
          value={task.durationMinutes}
          onChange={(e) =>
            updateTask(dishId, task.id, { durationMinutes: Math.max(1, Number(e.target.value)) })
          }
          className="w-14 text-sm border border-gray-200 rounded-md px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
        />
        <span className="text-xs text-gray-400">min</span>
      </div>

      {/* Delete */}
      <button
        onClick={() => removeTask(dishId, task.id)}
        className="p-1 text-gray-300 hover:text-red-500 cursor-pointer transition-colors opacity-0 group-hover:opacity-100"
        title="Delete step"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}
