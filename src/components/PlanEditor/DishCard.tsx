import { useState } from 'react'
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react'
import type { Dish } from '../../types'
import { useMealPlanStore } from '../../store/useMealPlanStore'
import { TaskRow } from './TaskRow'
import { DISH_COLORS } from '../../utils/colors'
import { TimeInput } from '../shared/TimeInput'

interface DishCardProps {
  dish: Dish
}

export function DishCard({ dish }: DishCardProps) {
  const [expanded, setExpanded] = useState(true)
  const { updateDish, removeDish, addTask } = useMealPlanStore()

  const totalMinutes = dish.tasks.reduce((sum, t) => sum + t.durationMinutes, 0)
  const hours = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60
  const durationLabel = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Dish header */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
        style={{ borderLeft: `4px solid ${dish.color}` }}
        onClick={() => setExpanded(!expanded)}
      >
        <span className="text-gray-400">{expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>

        {/* Color picker */}
        <div className="relative group/color" onClick={(e) => e.stopPropagation()}>
          <div
            className="w-5 h-5 rounded-full cursor-pointer ring-2 ring-offset-1 ring-gray-200 hover:ring-orange-400 transition-all"
            style={{ backgroundColor: dish.color }}
          />
          <div className="absolute left-0 top-7 z-10 hidden group-hover/color:flex flex-wrap gap-1 bg-white shadow-lg rounded-lg p-2 border border-gray-200 w-28">
            {DISH_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => updateDish(dish.id, { color: c })}
                className="w-5 h-5 rounded-full cursor-pointer transition-transform hover:scale-110"
                style={{
                  backgroundColor: c,
                  outline: dish.color === c ? `2px solid ${c}` : 'none',
                  outlineOffset: '2px',
                }}
              />
            ))}
          </div>
        </div>

        {/* Name */}
        <input
          type="text"
          value={dish.name}
          onChange={(e) => updateDish(dish.id, { name: e.target.value })}
          onClick={(e) => e.stopPropagation()}
          onFocus={(e) => e.target.select()}
          placeholder="Dish name"
          className="flex-1 font-semibold text-gray-800 bg-transparent border-none outline-none focus:bg-gray-50 focus:ring-2 focus:ring-orange-300 rounded px-1 py-0.5 text-sm"
        />

        {/* Target time */}
        <div
          className="flex items-center gap-1.5 text-sm text-gray-500"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-xs text-gray-400 hidden sm:inline">Ready by</span>
          <TimeInput
            value={dish.targetCompletionTime}
            onChange={(v) => updateDish(dish.id, { targetCompletionTime: v })}
            className="w-28 border border-gray-200 rounded-md px-2 py-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
          />
        </div>

        {/* Duration badge */}
        {dish.tasks.length > 0 && (
          <span className="text-xs text-gray-400 hidden sm:block shrink-0">
            {dish.tasks.length} steps · {durationLabel}
          </span>
        )}

        {/* Delete dish */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            removeDish(dish.id)
          }}
          className="p-1 text-gray-300 hover:text-red-500 cursor-pointer transition-colors"
          title="Remove dish"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Tasks */}
      {expanded && (
        <div className="px-4 pb-3 border-t border-gray-100">
          {dish.tasks.length === 0 ? (
            <p className="text-sm text-gray-400 py-3 text-center">
              No steps yet. Add the first step below.
            </p>
          ) : (
            <div className="mt-2 divide-y divide-gray-50">
              {dish.tasks.map((task, idx) => (
                <TaskRow
                  key={task.id}
                  dishId={dish.id}
                  task={task}
                  isFirst={idx === 0}
                  isLast={idx === dish.tasks.length - 1}
                />
              ))}
            </div>
          )}
          <button
            onClick={() => addTask(dish.id)}
            className="mt-2 flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 font-medium cursor-pointer transition-colors"
          >
            <Plus size={15} />
            Add step
          </button>
        </div>
      )}
    </div>
  )
}
