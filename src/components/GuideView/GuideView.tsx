import { Calendar, CheckSquare, Clock, Download, Upload, ChevronRight } from 'lucide-react'

interface SectionProps {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}

function Section({ icon, title, children }: SectionProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <div className="text-orange-500">{icon}</div>
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      </div>
      <div className="text-sm text-gray-600 leading-relaxed space-y-2">{children}</div>
    </div>
  )
}

function Step({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-xs font-bold flex items-center justify-center mt-0.5">
        {number}
      </span>
      <p>{text}</p>
    </div>
  )
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 text-sm text-orange-900">
      {children}
    </div>
  )
}

export function GuideView() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">How KitchenSync Works</h1>
        <p className="text-gray-500 text-sm">
          KitchenSync helps you coordinate multiple dishes so everything lands on the table at the
          right time — no more cold sides or overcooked mains.
        </p>
      </div>

      <Section icon={<Calendar size={20} />} title="What is a Meal Plan?">
        <p>
          A <strong>Meal Plan</strong> is a collection of dishes you're cooking for a specific
          occasion — a Thanksgiving dinner, a dinner party, Sunday meal prep, etc. You give it a
          name and a date.
        </p>
        <p>
          Each <strong>Dish</strong> in your plan has a <strong>target completion time</strong>{' '}
          (the time it should be ready), and a list of <strong>steps</strong> with estimated
          durations.
        </p>
        <Callout>
          Example: "Roast Turkey" is due at 5:00 PM. It has steps: Brine (overnight, not tracked
          here), Bring to room temp (60 min), Roast (180 min), Rest (30 min).
        </Callout>
      </Section>

      <Section icon={<Clock size={20} />} title="Backwards Scheduling">
        <p>
          The core idea: KitchenSync works <strong>backwards</strong> from each dish's target
          completion time to calculate when you need to start each step.
        </p>
        <p>
          If your turkey is due at 5:00 PM and needs 30 min to rest, 180 min to roast, and 60 min
          to come to room temperature, KitchenSync automatically figures out:
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 font-mono text-xs space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">4:30 PM</span>
            <ChevronRight size={12} className="text-gray-300" />
            <span>Rest (30 min)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">1:30 PM</span>
            <ChevronRight size={12} className="text-gray-300" />
            <span>Roast (180 min)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">12:30 PM</span>
            <ChevronRight size={12} className="text-gray-300" />
            <span>Bring to room temp (60 min)</span>
          </div>
        </div>
        <p>
          Steps are entered in the order you do them (first to last). KitchenSync schedules them
          backwards so the last step ends exactly at your target time.
        </p>
      </Section>

      <Section icon={<CheckSquare size={20} />} title="The Three Views">
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-gray-700 mb-1">Plan — Build your meal plan</p>
            <p>
              Add dishes, set their target completion times, and add the steps for each dish in
              the order you'll do them. Each step needs a description and an estimated duration
              in minutes.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-1">Tasks — Your real-time to-do list</p>
            <p>
              All steps from all dishes are sorted chronologically by when you need to start
              them. The next incomplete task is highlighted. Check off steps as you go to track
              your progress.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-1">Timeline — Visual overview</p>
            <p>
              A Gantt-style chart showing all dishes as rows on a time axis. Each step appears
              as a colored block. Great for spotting overlaps — moments when you need to be in
              two places at once.
            </p>
          </div>
        </div>
      </Section>

      <Section icon={<Download size={20} />} title="Saving & Sharing">
        <p>
          KitchenSync has no accounts or cloud sync. Your plan is automatically saved in your
          browser and will be there when you return.
        </p>
        <p>
          To share a plan or back it up, use <strong>Export JSON</strong> in the Plan tab. This
          downloads a file you can save or send to someone. To load it back, use{' '}
          <strong>Import JSON</strong>.
        </p>
        <Callout>
          <strong>Tip:</strong> Export your Thanksgiving plan once and reuse it every year. Just
          adjust the date and target times.
        </Callout>
      </Section>

      <Section icon={<Upload size={20} />} title="Quick Start">
        <div className="space-y-2">
          <Step number={1} text='Go to the Plan tab and click "New Meal Plan". Give it a name and set the date.' />
          <Step number={2} text={"Click \"Add Dish\" for each dish you're cooking."} />
          <Step number={3} text="For each dish, set the target completion time — when it should be ready to serve." />
          <Step number={4} text={"Add steps to each dish in the order you'll do them. Enter the description and how many minutes each step takes."} />
          <Step number={5} text="Switch to the Tasks tab to see everything in chronological order. Check off steps as you cook." />
          <Step number={6} text="Use the Timeline tab to spot any moments where too many things need attention at once." />
        </div>
      </Section>

      <div className="mt-8 pt-6 border-t border-gray-200 text-xs text-gray-400 text-center">
        KitchenSync V2 · Your data stays in your browser · No account needed
      </div>
    </div>
  )
}
