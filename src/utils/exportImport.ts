import type { MealPlan } from '../types'

export function exportPlan(plan: MealPlan, filename: string): void {
  const json = JSON.stringify(plan, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename.trim().replace(/\s+/g, '-') || 'meal-plan'}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importPlan(file: File): Promise<MealPlan> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string)
        if (!parsed.id || !parsed.name || !parsed.dishes) {
          reject(new Error('Invalid meal plan file'))
          return
        }
        resolve(parsed as MealPlan)
      } catch {
        reject(new Error('Could not parse JSON file'))
      }
    }
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.readAsText(file)
  })
}
