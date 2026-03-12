import { CheckCircle, ClipboardList } from 'lucide-react'
import { usePlan } from '../../store/useMealPlanStore'
import { scheduleTasks } from '../../utils/scheduling'
import { TaskItem } from './TaskItem'
import { EmptyState } from '../shared/EmptyState'

export function TaskListView() {
  const plan = usePlan()

  if (!plan) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <EmptyState
          icon={ClipboardList}
          title="No meal plan"
          description="Create a meal plan in the Plan tab to see your task list."
        />
      </div>
    )
  }

  const scheduled = scheduleTasks(plan)

  if (scheduled.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-800 mb-6">{plan.name}</h1>
        <EmptyState
          icon={ClipboardList}
          title="No tasks yet"
          description="Add dishes and steps in the Plan tab to see them here."
        />
      </div>
    )
  }

  const completedCount = scheduled.filter((s) => s.task.completed).length
  const allDone = completedCount === scheduled.length
  // The "next" task is the first incomplete one
  const nextIdx = scheduled.findIndex((s) => !s.task.completed)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800">{plan.name}</h1>
        <span className="text-sm text-gray-500">
          {completedCount}/{scheduled.length} done
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-orange-400 rounded-full transition-all duration-300"
          style={{ width: `${(completedCount / scheduled.length) * 100}%` }}
        />
      </div>

      {allDone ? (
        <div className="flex flex-col items-center py-12 text-center">
          <CheckCircle size={48} className="text-green-500 mb-3" />
          <h2 className="text-lg font-bold text-gray-800">All done!</h2>
          <p className="text-sm text-gray-500 mt-1">Time to enjoy your meal.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
          {scheduled.map((s, idx) => (
            <TaskItem key={`${s.dish.id}-${s.task.id}`} scheduled={s} isNext={idx === nextIdx} />
          ))}
        </div>
      )}
    </div>
  )
}
