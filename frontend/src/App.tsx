import { useState } from 'react'
import GeneralForm from './components/GeneralForm'
import CategoryForm from './components/CategoryForm'
import ResultsView from './components/ResultsView'
import { Question } from './types'

export default function App() {
  const [step, setStep] = useState<'start' | 'categories' | 'questions' | 'results'>('start')
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [results, setResults] = useState<number[] | null>(null)

  if (step === 'start') {
    return <button onClick={() => setStep('categories')}>Start</button>
  }

  if (step === 'categories') {
    return (
      <CategoryForm
        onSubmit={(ids) => {
          setSelectedCategories(ids)
          setStep('questions')
        }}
      />
    )
  }

  if (step === 'questions') {
    return (
      <GeneralForm
        categoryIds={selectedCategories}
        questions={questions}
        setQuestions={setQuestions}
        onSubmit={(res) => {
          setResults(res)
          setStep('results')
        }}
      />
    )
  }

  return <ResultsView results={results || []} />
}
