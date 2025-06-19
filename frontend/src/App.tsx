import { useState } from 'react'
import GeneralForm from './components/GeneralForm'
import CategoryForm from './components/CategoryForm'
import ResultsView from './components/ResultsView'
import { Question } from './types'
import { Container, Button } from 'react-bootstrap'

export default function App() {
  const [step, setStep] = useState<'start' | 'categories' | 'questions' | 'results'>('start')
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [results, setResults] = useState<number[] | null>(null)

  if (step === 'start') {
    return (
      <Container className="text-center mt-5">
        <Button onClick={() => setStep('categories')}>Start</Button>
      </Container>
    )
  }

  if (step === 'categories') {
    return (
      <Container className="mt-4">
        <CategoryForm
          onSubmit={(ids) => {
            setSelectedCategories(ids)
            setStep('questions')
          }}
        />
      </Container>
    )
  }

  if (step === 'questions') {
    return (
      <Container className="mt-4">
        <GeneralForm
          categoryIds={selectedCategories}
          questions={questions}
          setQuestions={setQuestions}
          onSubmit={(res) => {
            setResults(res)
            setStep('results')
          }}
        />
      </Container>
    )
  }

  return (
    <Container className="mt-4">
      <ResultsView results={results || []} />
    </Container>
  )
}
