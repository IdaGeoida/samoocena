import { useState } from 'react'
import GeneralForm from './components/GeneralForm'
import CategoryForm from './components/CategoryForm'
import ResultsView from './components/ResultsView'
import { Process } from './types'

export default function App() {
  const [step, setStep] = useState<'start' | 'categories' | 'processes' | 'results'>('start')
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [processes, setProcesses] = useState<Process[]>([])
  const [results, setResults] = useState<number[] | null>(null)

  if (step === 'start') {
    return <button onClick={() => setStep('categories')}>Start</button>
  }

  if (step === 'categories') {
    return (
      <CategoryForm
        onSubmit={(ids) => {
          setSelectedCategories(ids)
          setStep('processes')
        }}
      />
    )
  }

  if (step === 'processes') {
    return (
      <GeneralForm
        categoryIds={selectedCategories}
        processes={processes}
        setProcesses={setProcesses}
        onSubmit={(res) => {
          setResults(res)
          setStep('results')
        }}
      />
    )
  }

  return <ResultsView results={results || []} />
}
