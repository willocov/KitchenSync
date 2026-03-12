export interface Task {
  id: string
  description: string
  durationMinutes: number
  completed: boolean
}

export interface Dish {
  id: string
  name: string
  targetCompletionTime: string // "HH:MM" 24h format, e.g. "18:00"
  color: string
  tasks: Task[]
}

export interface MealPlan {
  id: string
  name: string
  date: string // ISO date string "YYYY-MM-DD"
  dishes: Dish[]
}

// Computed at runtime, not stored
export interface ScheduledTask {
  task: Task
  dish: Dish
  startTime: Date
  endTime: Date
}
