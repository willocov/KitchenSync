import { useEffect } from 'react'
import { useActiveView, useMealPlanStore } from './store/useMealPlanStore'
import { Layout } from './components/Layout/Layout'
import { PlanEditor } from './components/PlanEditor/PlanEditor'
import { TaskListView } from './components/TaskListView/TaskListView'
import { TimelineView } from './components/TimelineView/TimelineView'
import { GuideView } from './components/GuideView/GuideView'
import { readPlanFromHash, clearPlanHash } from './utils/shareUrl'

function App() {
  const activeView = useActiveView()
  const importPlan = useMealPlanStore((s) => s.importPlan)

  // On first load, check if a shared plan is encoded in the URL hash
  useEffect(() => {
    const shared = readPlanFromHash()
    if (shared) {
      importPlan(shared)
      clearPlanHash()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Layout>
      {activeView === 'editor' && <PlanEditor />}
      {activeView === 'tasks' && <TaskListView />}
      {activeView === 'timeline' && <TimelineView />}
      {activeView === 'guide' && <GuideView />}
    </Layout>
  )
}

export default App
