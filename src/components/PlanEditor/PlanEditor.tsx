import { useRef, useState } from 'react'
import { Download, Plus, QrCode, Trash2, UtensilsCrossed, Upload } from 'lucide-react'
import { useMealPlanStore, usePlan, today } from '../../store/useMealPlanStore'
import { DishCard } from './DishCard'
import { EmptyState } from '../shared/EmptyState'
import { exportPlan, importPlan } from '../../utils/exportImport'
import { buildShareUrl, checkShareUrlFitsQR } from '../../utils/shareUrl'
import { QRModal } from '../shared/QRModal'
import { ConfirmModal } from '../shared/ConfirmModal'
import { samplePlan } from '../../data/samplePlan'

type Dialog = 'loadSample' | 'clearPlan' | 'exportPlan' | null

export function PlanEditor() {
  const plan = usePlan()
  const { createPlan, updatePlan, addDish, importPlan: loadPlan, clearPlan } = useMealPlanStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showQR, setShowQR] = useState(false)
  const [dialog, setDialog] = useState<Dialog>(null)

  const handleLoadSample = () => {
    if (plan) {
      setDialog('loadSample')
    } else {
      loadPlan({ ...samplePlan, date: today() })
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const imported = await importPlan(file)
      loadPlan(imported)
    } catch (err) {
      alert((err as Error).message)
    }
    e.target.value = ''
  }

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 gap-4">
        <EmptyState
          icon={UtensilsCrossed}
          title="No meal plan yet"
          description="Create a new plan to start coordinating your dishes, or import an existing plan from a JSON file."
          action={
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => createPlan('Meal Plan Name', today())}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors cursor-pointer"
              >
                <Plus size={16} />
                New Meal Plan
              </button>
              <button
                onClick={handleLoadSample}
                className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-medium hover:bg-orange-200 transition-colors cursor-pointer"
              >
                <UtensilsCrossed size={16} />
                Try Sample Plan
              </button>
              <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer">
                <Upload size={16} />
                Import Meal Plan
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImport}
                />
              </label>
            </div>
          }
        />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Plan header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-1">
          <input
            type="text"
            value={plan.name}
            onChange={(e) => updatePlan({ name: e.target.value })}
            placeholder="Meal plan name"
            className="text-2xl font-bold text-gray-800 bg-transparent border-b-2 border-transparent hover:border-gray-200 focus:border-orange-400 focus:outline-none py-0.5 w-full sm:flex-1"
          />
          <div className="flex items-center gap-2 shrink-0">
            <input
              type="date"
              value={plan.date}
              onChange={(e) => updatePlan({ date: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <button
            onClick={() => setDialog('exportPlan')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Download size={14} />
            Export Recipe
          </button>
          <label className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <Upload size={14} />
            Import Recipe
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
          </label>
          <button
            onClick={() => setShowQR(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer"
          >
            <QrCode size={14} />
            Share via QR
          </button>
          <button
            onClick={handleLoadSample}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <UtensilsCrossed size={14} />
            Sample Plan
          </button>
          <button
            onClick={() => setDialog('clearPlan')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
            Clear Plan
          </button>
        </div>
      </div>

      {showQR && (
        <QRModal
          url={buildShareUrl(plan)}
          planName={plan.name}
          fits={checkShareUrlFitsQR(plan)}
          onClose={() => setShowQR(false)}
        />
      )}

      {dialog === 'loadSample' && (
        <ConfirmModal
          title="Load Sample Plan"
          message="Loading the sample plan will overwrite your current meal plan. Continue?"
          confirmLabel="Load Sample"
          onConfirm={() => { setDialog(null); loadPlan({ ...samplePlan, date: today() }) }}
          onCancel={() => setDialog(null)}
        />
      )}

      {dialog === 'clearPlan' && (
        <ConfirmModal
          title="Clear Meal Plan"
          message="Clear the entire meal plan? This cannot be undone."
          confirmLabel="Clear Plan"
          danger
          onConfirm={() => { setDialog(null); clearPlan() }}
          onCancel={() => setDialog(null)}
        />
      )}

      {dialog === 'exportPlan' && (
        <ConfirmModal
          title="Export Recipe"
          message="Save this recipe as:"
          confirmLabel="Export"
          inputDefault={plan.name}
          onConfirm={(name) => { setDialog(null); exportPlan(plan, name || plan.name) }}
          onCancel={() => setDialog(null)}
        />
      )}

      {/* Dishes */}
      <div className="flex flex-col gap-4">
        {plan.dishes.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p className="text-sm">No dishes yet. Add your first dish below.</p>
          </div>
        ) : (
          plan.dishes.map((dish) => <DishCard key={dish.id} dish={dish} />)
        )}

        <button
          onClick={addDish}
          className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 rounded-xl hover:border-orange-400 hover:text-orange-500 transition-colors cursor-pointer font-medium"
        >
          <Plus size={18} />
          Add Dish
        </button>
      </div>
    </div>
  )
}
