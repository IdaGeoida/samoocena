import { useState, useEffect } from 'react'
import CategoryQuestionsForm from './components/CategoryQuestionsForm'
import CategoryForm from './components/CategoryForm'
import ResultsView from './components/ResultsView'
import MetadataForm from './components/MetadataForm'
import ReportView from './components/ReportView'
import { createAssessment } from './api/assessments'
import { CategoryGroup } from './types'
import { Container, Button } from 'react-bootstrap'

export default function App() {
  const [step, setStep] = useState<'start' | 'categories' | 'questions' | 'results' | 'report'>('start')
  const [selectedCategories, setSelectedCategories] = useState<CategoryGroup[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [results, setResults] = useState<number[]>([])
  const [metadata, setMetadata] = useState<{ employees_range: string; volunteers_range: string } | null>(null)

  useEffect(() => {
    if (step === 'results' && metadata) {
      createAssessment({ ...metadata, results }).catch(() => {})
    }
  }, [step])

  if (step === 'start') {
    return (
      <Container className="mt-4">
        <MetadataForm onSubmit={(m) => { setMetadata(m); setStep('categories') }} />
        <Button variant="link" className="mt-3" onClick={() => setStep('report')}>Raporty</Button>
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

  if (step === 'results') {
    return (
      <Container className="mt-4">
        <ResultsView results={results || []} />
        <Button className="mt-3" onClick={() => setStep('start')}>Strona główna</Button>
      </Container>
    )
  }

  return (
    <Container className="mt-4">
      <ReportView />
      <Button className="mt-3" onClick={() => setStep('start')}>Powrót</Button>
    </Container>
  )
}
