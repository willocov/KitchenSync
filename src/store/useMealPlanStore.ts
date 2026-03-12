import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MealPlan, Dish, Task } from '../types'
import { nextColor } from '../utils/colors'

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

type ActiveView = 'editor' | 'tasks' | 'timeline' | 'guide'

interface MealPlanStore {
  plan: MealPlan | null
  activeView: ActiveView
  setActiveView: (view: ActiveView) => void
  createPlan: (name: string, date: string) => void
  updatePlan: (updates: Partial<Pick<MealPlan, 'name' | 'date'>>) => void
  importPlan: (plan: MealPlan) => void
  clearPlan: () => void
  addDish: () => void
  updateDish: (dishId: string, updates: Partial<Omit<Dish, 'id' | 'tasks'>>) => void
  removeDish: (dishId: string) => void
  addTask: (dishId: string) => void
  updateTask: (dishId: string, taskId: string, updates: Partial<Omit<Task, 'id'>>) => void
  removeTask: (dishId: string, taskId: string) => void
  moveTaskUp: (dishId: string, taskId: string) => void
  moveTaskDown: (dishId: string, taskId: string) => void
  toggleTaskComplete: (dishId: string, taskId: string) => void
}

export const useMealPlanStore = create<MealPlanStore>()(
  persist(
    (set, get) => ({
      plan: null,
      activeView: 'editor',

      setActiveView: (view) => set({ activeView: view }),

      createPlan: (name, date) => {
        set({
          plan: { id: uid(), name, date, dishes: [] },
          activeView: 'editor',
        })
      },

      updatePlan: (updates) => {
        const { plan } = get()
        if (!plan) return
        set({ plan: { ...plan, ...updates } })
      },

      importPlan: (plan) => set({ plan, activeView: 'editor' }),

      clearPlan: () => set({ plan: null }),

      addDish: () => {
        const { plan } = get()
        if (!plan) return
        const existingColors = plan.dishes.map((d) => d.color)
        const newDish: Dish = {
          id: uid(),
          name: 'New Dish',
          targetCompletionTime: '18:00',
          color: nextColor(existingColors),
          tasks: [],
        }
        set({ plan: { ...plan, dishes: [...plan.dishes, newDish] } })
      },

      updateDish: (dishId, updates) => {
        const { plan } = get()
        if (!plan) return
        set({
          plan: {
            ...plan,
            dishes: plan.dishes.map((d) => (d.id === dishId ? { ...d, ...updates } : d)),
          },
        })
      },

      removeDish: (dishId) => {
        const { plan } = get()
        if (!plan) return
        set({ plan: { ...plan, dishes: plan.dishes.filter((d) => d.id !== dishId) } })
      },

      addTask: (dishId) => {
        const { plan } = get()
        if (!plan) return
        const newTask: Task = {
          id: uid(),
          description: 'New step',
          durationMinutes: 15,
          completed: false,
        }
        set({
          plan: {
            ...plan,
            dishes: plan.dishes.map((d) =>
              d.id === dishId ? { ...d, tasks: [...d.tasks, newTask] } : d,
            ),
          },
        })
      },

      updateTask: (dishId, taskId, updates) => {
        const { plan } = get()
        if (!plan) return
        set({
          plan: {
            ...plan,
            dishes: plan.dishes.map((d) =>
              d.id === dishId
                ? {
                    ...d,
                    tasks: d.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
                  }
                : d,
            ),
          },
        })
      },

      removeTask: (dishId, taskId) => {
        const { plan } = get()
        if (!plan) return
        set({
          plan: {
            ...plan,
            dishes: plan.dishes.map((d) =>
              d.id === dishId ? { ...d, tasks: d.tasks.filter((t) => t.id !== taskId) } : d,
            ),
          },
        })
      },

      moveTaskUp: (dishId, taskId) => {
        const { plan } = get()
        if (!plan) return
        set({
          plan: {
            ...plan,
            dishes: plan.dishes.map((d) => {
              if (d.id !== dishId) return d
              const idx = d.tasks.findIndex((t) => t.id === taskId)
              if (idx <= 0) return d
              const tasks = [...d.tasks]
              ;[tasks[idx - 1], tasks[idx]] = [tasks[idx], tasks[idx - 1]]
              return { ...d, tasks }
            }),
          },
        })
      },

      moveTaskDown: (dishId, taskId) => {
        const { plan } = get()
        if (!plan) return
        set({
          plan: {
            ...plan,
            dishes: plan.dishes.map((d) => {
              if (d.id !== dishId) return d
              const idx = d.tasks.findIndex((t) => t.id === taskId)
              if (idx < 0 || idx >= d.tasks.length - 1) return d
              const tasks = [...d.tasks]
              ;[tasks[idx], tasks[idx + 1]] = [tasks[idx + 1], tasks[idx]]
              return { ...d, tasks }
            }),
          },
        })
      },

      toggleTaskComplete: (dishId, taskId) => {
        const { plan } = get()
        if (!plan) return
        set({
          plan: {
            ...plan,
            dishes: plan.dishes.map((d) =>
              d.id === dishId
                ? {
                    ...d,
                    tasks: d.tasks.map((t) =>
                      t.id === taskId ? { ...t, completed: !t.completed } : t,
                    ),
                  }
                : d,
            ),
          },
        })
      },
    }),
    {
      name: 'kitchensync-v2',
    },
  ),
)

export function usePlan() {
  return useMealPlanStore((s) => s.plan)
}

export function useActiveView() {
  return useMealPlanStore((s) => s.activeView)
}

// Re-export today helper for use in components
export { today }
