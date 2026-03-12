import type { ScheduledTask } from '../../types'
import { useMealPlanStore } from '../../store/useMealPlanStore'
import { formatTime } from '../../utils/scheduling'
import { colorWithOpacity } from '../../utils/colors'

interface TaskItemProps {
  scheduled: ScheduledTask
  isNext: boolean
}

export function TaskItem({ scheduled, isNext }: TaskItemProps) {
  const toggleTaskComplete = useMealPlanStore((s) => s.toggleTaskComplete)
  const { task, dish } = scheduled

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 transition-colors ${
        task.completed ? 'opacity-50' : ''
      } ${isNext ? 'bg-orange-50 border-l-4 border-orange-400' : 'border-l-4 border-transparent'}`}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleTaskComplete(dish.id, task.id)}
        className="mt-0.5 w-4 h-4 rounded border-gray-300 text-orange-500 cursor-pointer accent-orange-500 shrink-0"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-0.5">
          {/* Dish badge */}
          <span
            className="text-xs font-medium px-1.5 py-0.5 rounded-full"
            style={{
              color: dish.color,
              backgroundColor: colorWithOpacity(dish.color, 0.12),
            }}
          >
            {dish.name}
          </span>
          {/* Start time */}
          <span className="text-xs text-gray-400">{formatTime(scheduled.startTime)}</span>
          {/* Duration */}
          <span className="text-xs text-gray-400">{task.durationMinutes} min</span>
        </div>
        <p className={`text-sm text-gray-800 ${task.completed ? 'line-through text-gray-400' : ''}`}>
          {task.description}
        </p>
      </div>
    </div>
  )
}
