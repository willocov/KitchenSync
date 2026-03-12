import type { MealPlan, ScheduledTask } from '../types'

/**
 * Parse "HH:MM" time string and apply it to the given date string.
 */
function parseTime(date: string, time: string): Date {
  const [year, month, day] = date.split('-').map(Number)
  const [hours, minutes] = time.split(':').map(Number)
  return new Date(year, month - 1, day, hours, minutes, 0, 0)
}

/**
 * Schedule all tasks in a meal plan using backwards scheduling.
 * Tasks are placed back-to-back ending at the dish's targetCompletionTime.
 * Returns all scheduled tasks sorted by startTime ascending.
 */
export function scheduleTasks(plan: MealPlan): ScheduledTask[] {
  const result: ScheduledTask[] = []

  for (const dish of plan.dishes) {
    if (dish.tasks.length === 0) continue

    let endTime = parseTime(plan.date, dish.targetCompletionTime)

    // Iterate tasks in reverse to schedule backwards
    for (let i = dish.tasks.length - 1; i >= 0; i--) {
      const task = dish.tasks[i]
      const startTime = new Date(endTime.getTime() - task.durationMinutes * 60 * 1000)
      result.push({ task, dish, startTime, endTime: new Date(endTime) })
      endTime = startTime
    }
  }

  return result.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
}

/**
 * Format a Date as "h:mm AM/PM"
 */
export function formatTime(date: Date): string {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${ampm}`
}

/**
 * Get the time range (min start, max end) across all scheduled tasks.
 */
export function getTimeRange(scheduled: ScheduledTask[]): { min: Date; max: Date } | null {
  if (scheduled.length === 0) return null
  const min = new Date(Math.min(...scheduled.map((s) => s.startTime.getTime())))
  const max = new Date(Math.max(...scheduled.map((s) => s.endTime.getTime())))
  return { min, max }
}
