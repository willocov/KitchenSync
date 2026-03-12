import { useRef, useState } from 'react'
import { Clock } from 'lucide-react'
import { usePlan } from '../../store/useMealPlanStore'
import { scheduleTasks, getTimeRange, formatTime } from '../../utils/scheduling'
import { colorWithOpacity } from '../../utils/colors'
import type { ScheduledTask } from '../../types'
import { EmptyState } from '../shared/EmptyState'

const LABEL_WIDTH = 120 // px for dish name column
const ROW_HEIGHT = 52  // px per dish row
const HEADER_HEIGHT = 40 // px for time axis
const MIN_TIMELINE_WIDTH = 600 // minimum px for scrollable content

function getTickMinutes(totalMinutes: number): number {
  if (totalMinutes <= 60) return 10
  if (totalMinutes <= 180) return 15
  if (totalMinutes <= 360) return 30
  return 60
}

interface TooltipState {
  x: number
  y: number
  task: ScheduledTask
}

export function TimelineView() {
  const plan = usePlan()
  const containerRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  if (!plan) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <EmptyState
          icon={Clock}
          title="No meal plan"
          description="Create a meal plan in the Plan tab to see the timeline."
        />
      </div>
    )
  }

  const scheduled = scheduleTasks(plan)
  const range = getTimeRange(scheduled)

  const dishesWithTasks = plan.dishes.filter((d) => d.tasks.length > 0)

  if (!range || dishesWithTasks.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-800 mb-6">{plan.name}</h1>
        <EmptyState
          icon={Clock}
          title="No tasks to display"
          description="Add dishes with steps in the Plan tab to see the timeline."
        />
      </div>
    )
  }

  // Extend range by a small buffer
  const bufferMs = 10 * 60 * 1000
  const timeMin = new Date(range.min.getTime() - bufferMs)
  const timeMax = new Date(range.max.getTime() + bufferMs)
  const totalMs = timeMax.getTime() - timeMin.getTime()
  const totalMinutes = totalMs / 60000

  const tickMinutes = getTickMinutes(totalMinutes)
  const timelineWidth = Math.max(MIN_TIMELINE_WIDTH, totalMinutes * 3)

  // Generate tick marks aligned to nice boundaries
  const ticks: Date[] = []
  const firstTickMs = Math.ceil(timeMin.getTime() / (tickMinutes * 60000)) * (tickMinutes * 60000)
  for (let ms = firstTickMs; ms <= timeMax.getTime(); ms += tickMinutes * 60000) {
    ticks.push(new Date(ms))
  }

  function timeToX(date: Date): number {
    return ((date.getTime() - timeMin.getTime()) / totalMs) * timelineWidth
  }

  const totalHeight = HEADER_HEIGHT + dishesWithTasks.length * ROW_HEIGHT

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800">{plan.name}</h1>
        <span className="text-xs text-gray-400 hidden sm:block">
          {formatTime(range.min)} — {formatTime(range.max)}
        </span>
      </div>

      <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto" ref={containerRef}>
          <div style={{ minWidth: LABEL_WIDTH + timelineWidth + 'px' }}>
            <svg
              width={LABEL_WIDTH + timelineWidth}
              height={totalHeight}
              className="block"
              onMouseLeave={() => setTooltip(null)}
            >
              {/* === Time axis header === */}
              {/* Header background */}
              <rect
                x={0}
                y={0}
                width={LABEL_WIDTH + timelineWidth}
                height={HEADER_HEIGHT}
                fill="#f9fafb"
              />
              {/* Tick labels */}
              {ticks.map((tick) => {
                const x = LABEL_WIDTH + timeToX(tick)
                return (
                  <g key={tick.getTime()}>
                    <line
                      x1={x}
                      y1={HEADER_HEIGHT - 6}
                      x2={x}
                      y2={HEADER_HEIGHT}
                      stroke="#d1d5db"
                      strokeWidth={1}
                    />
                    <text
                      x={x}
                      y={HEADER_HEIGHT - 10}
                      textAnchor="middle"
                      fontSize={10}
                      fill="#9ca3af"
                      fontFamily="system-ui, sans-serif"
                    >
                      {formatTime(tick)}
                    </text>
                  </g>
                )
              })}
              {/* Divider line */}
              <line
                x1={0}
                y1={HEADER_HEIGHT}
                x2={LABEL_WIDTH + timelineWidth}
                y2={HEADER_HEIGHT}
                stroke="#e5e7eb"
                strokeWidth={1}
              />

              {/* === Dish rows === */}
              {dishesWithTasks.map((dish, rowIdx) => {
                const rowY = HEADER_HEIGHT + rowIdx * ROW_HEIGHT
                const dishTasks = scheduled.filter((s) => s.dish.id === dish.id)

                return (
                  <g key={dish.id}>
                    {/* Row background (alternate) */}
                    <rect
                      x={0}
                      y={rowY}
                      width={LABEL_WIDTH + timelineWidth}
                      height={ROW_HEIGHT}
                      fill={rowIdx % 2 === 0 ? '#ffffff' : '#f9fafb'}
                    />

                    {/* Dish label */}
                    <foreignObject x={0} y={rowY} width={LABEL_WIDTH} height={ROW_HEIGHT}>
                      <div
                        style={{
                          height: ROW_HEIGHT + 'px',
                          paddingLeft: '12px',
                          paddingRight: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          borderLeft: `3px solid ${dish.color}`,
                        }}
                        title={dish.name}
                      >
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#374151',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: LABEL_WIDTH - 20 + 'px',
                          }}
                        >
                          {dish.name}
                        </span>
                      </div>
                    </foreignObject>

                    {/* Vertical grid lines */}
                    {ticks.map((tick) => (
                      <line
                        key={tick.getTime()}
                        x1={LABEL_WIDTH + timeToX(tick)}
                        y1={rowY}
                        x2={LABEL_WIDTH + timeToX(tick)}
                        y2={rowY + ROW_HEIGHT}
                        stroke="#f3f4f6"
                        strokeWidth={1}
                      />
                    ))}

                    {/* Task blocks */}
                    {dishTasks.map((st) => {
                      const x = LABEL_WIDTH + timeToX(st.startTime)
                      const w = Math.max(
                        4,
                        ((st.endTime.getTime() - st.startTime.getTime()) / totalMs) * timelineWidth,
                      )
                      const blockY = rowY + 8
                      const blockH = ROW_HEIGHT - 16
                      const isCompleted = st.task.completed

                      return (
                        <g
                          key={st.task.id}
                          onMouseEnter={(e) => {
                            const rect = containerRef.current?.getBoundingClientRect()
                            if (rect) {
                              setTooltip({
                                x: e.clientX - rect.left,
                                y: e.clientY - rect.top,
                                task: st,
                              })
                            }
                          }}
                          onMouseLeave={() => setTooltip(null)}
                          style={{ cursor: 'default' }}
                        >
                          <rect
                            x={x}
                            y={blockY}
                            width={w}
                            height={blockH}
                            rx={4}
                            fill={isCompleted ? colorWithOpacity(dish.color, 0.25) : dish.color}
                            opacity={isCompleted ? 0.7 : 1}
                          />
                          {/* Task label if wide enough */}
                          {w > 40 && (
                            <foreignObject x={x + 4} y={blockY + 2} width={w - 8} height={blockH - 4}>
                              <div
                                style={{
                                  fontSize: '10px',
                                  color: isCompleted ? '#6b7280' : '#ffffff',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  height: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  fontWeight: 500,
                                  textDecoration: isCompleted ? 'line-through' : 'none',
                                }}
                              >
                                {st.task.description}
                              </div>
                            </foreignObject>
                          )}
                          {/* Completed overlay strikethrough line */}
                          {isCompleted && (
                            <line
                              x1={x + 4}
                              y1={blockY + blockH / 2}
                              x2={x + w - 4}
                              y2={blockY + blockH / 2}
                              stroke="#9ca3af"
                              strokeWidth={1.5}
                            />
                          )}
                        </g>
                      )
                    })}

                    {/* Row separator */}
                    <line
                      x1={0}
                      y1={rowY + ROW_HEIGHT}
                      x2={LABEL_WIDTH + timelineWidth}
                      y2={rowY + ROW_HEIGHT}
                      stroke="#f3f4f6"
                      strokeWidth={1}
                    />
                  </g>
                )
              })}
            </svg>
          </div>
        </div>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute z-50 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl pointer-events-none max-w-xs"
            style={{ left: tooltip.x + 12, top: tooltip.y - 10 }}
          >
            <div className="font-semibold mb-0.5">{tooltip.task.task.description}</div>
            <div className="text-gray-300">
              {formatTime(tooltip.task.startTime)} → {formatTime(tooltip.task.endTime)}
            </div>
            <div className="text-gray-400">{tooltip.task.task.durationMinutes} min</div>
            {tooltip.task.task.completed && (
              <div className="text-green-400 mt-0.5">Completed</div>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3">
        {dishesWithTasks.map((dish) => (
          <div key={dish.id} className="flex items-center gap-1.5 text-xs text-gray-600">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: dish.color }} />
            {dish.name}
          </div>
        ))}
      </div>
    </div>
  )
}
