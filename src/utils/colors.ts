export const DISH_COLORS = [
  '#3b82f6', // blue-500
  '#f97316', // orange-500
  '#22c55e', // green-500
  '#a855f7', // purple-500
  '#ef4444', // red-500
  '#14b8a6', // teal-500
  '#eab308', // yellow-500
  '#ec4899', // pink-500
]

export function nextColor(existingColors: string[]): string {
  const used = new Set(existingColors)
  const available = DISH_COLORS.find((c) => !used.has(c))
  return available ?? DISH_COLORS[existingColors.length % DISH_COLORS.length]
}

/** Returns a light background version of the color for use in badges/chips */
export function colorWithOpacity(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}
