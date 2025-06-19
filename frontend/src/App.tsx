import { useState } from 'react'
import GeneralForm from './components/GeneralForm'
import ResultsView from './components/ResultsView'
import { Process } from './types'

export default function App() {
  const [step, setStep] = useState<'general' | 'results'>('general')
  const [processes, setProcesses] = useState<Process[]>([])
  const [results, setResults] = useState<number[] | null>(null)

  if (step === 'general') {
    return (
      <GeneralForm
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
