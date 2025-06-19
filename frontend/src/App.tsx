import { useState } from 'react'
import CategoryQuestionsForm from './components/CategoryQuestionsForm'
import CategoryForm from './components/CategoryForm'
import ResultsView from './components/ResultsView'
import { Category } from './types'
import { Container, Button } from 'react-bootstrap'

export default function App() {
  const [step, setStep] = useState<'start' | 'categories' | 'questions' | 'results'>('start')
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [results, setResults] = useState<number[]>([])

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
          onSubmit={(cats) => {
            setSelectedCategories(cats)
            setCurrentIndex(0)
            setResults([])
            setStep('questions')
          }}
        />
      </Container>
    )
  }

  if (step === 'questions') {
    const category = selectedCategories[currentIndex]
    return (
      <Container className="mt-4">
        <CategoryQuestionsForm
          category={category}
          index={currentIndex}
          total={selectedCategories.length}
          onSubmit={(vals) => {
            setResults((prev) => [...prev, ...vals])
            if (currentIndex + 1 < selectedCategories.length) {
              setCurrentIndex(currentIndex + 1)
            } else {
              setStep('results')
            }
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
