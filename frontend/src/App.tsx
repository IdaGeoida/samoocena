import { useState, useEffect } from 'react'
import CategoryQuestionsForm from './components/CategoryQuestionsForm'
import CategoryForm from './components/CategoryForm'
import ResultsView from './components/ResultsView'
import ProcessImprovement from './components/ProcessImprovement'
import MetadataForm from './components/MetadataForm'
import WorkshopForm, { WorkshopData } from './components/WorkshopForm'
import ReportView from './components/ReportView'
import IntroPage from './components/IntroPage'
import { createAssessment } from './api/assessments'
import { CategoryGroup, Score } from './types'
import { Container, Button } from 'react-bootstrap'

export default function App() {
  const [step, setStep] = useState<'intro' | 'start' | 'categories' | 'questions' | 'results' | 'workshop' | 'improvement' | 'report'>('intro')
  const [selectedCategories, setSelectedCategories] = useState<CategoryGroup[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [results, setResults] = useState<Score[]>([])
  const [metadata, setMetadata] = useState<{ employees_range: string; volunteers_range: string } | null>(null)
  const [workshop, setWorkshop] = useState<WorkshopData | null>(null)

  useEffect(() => {
    if (step === 'results' && metadata) {
      createAssessment({ ...metadata, results: results.map(r => r.value) }).catch(() => {})
    }
  }, [step])

  if (step === 'intro') {
    return (
      <IntroPage onStart={() => setStep('start')} />
    )
  }

  if (step === 'start') {
    return (
      <Container className="mt-4 d-flex flex-column align-items-center">
        <h2 className="mb-3">Metryczka organizacji</h2>
        <p className="text-center mb-3">
          Kilka kluczowych informacji o Twojej organizacji pozwoli nam
          przygotować spersonalizowane rekomendacje i wsparcie.
        </p>
        <h4 className="mb-3">Liczebność zespołu</h4>
        <MetadataForm onSubmit={(m) => { setMetadata(m); setStep('categories') }} />
        <p className="text-center mt-3">
          Podaj nam te dane, żebyśmy mogli lepiej zrozumieć kontekst Twojej
          organizacji i dostarczyć Ci jak najlepsze rozwiązania!
        </p>
      </Container>
    )
  }

  if (step === 'categories') {
    return (
      <Container className="mt-4 d-flex flex-column align-items-center">
        <h2 className="mb-3">Kategorie</h2>
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
      <Container className="mt-4 d-flex flex-column align-items-center">
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
      <Container className="mt-4 d-flex flex-column align-items-center">
        <h2 className="mb-3">Wyniki</h2>
        <ResultsView results={results || []} categories={selectedCategories} onImprove={() => setStep('workshop')} />
        <Button className="mt-3" onClick={() => setStep('intro')}>Strona główna</Button>
      </Container>
    )
  }

  if (step === 'workshop') {
    return (
      <WorkshopForm onSubmit={data => { setWorkshop(data); setStep('improvement') }} />
    )
  }

  if (step === 'improvement') {
    return (
      <ProcessImprovement
        onBack={() => setStep('results')}
        results={results}
        categories={selectedCategories}
      />
    )
  }

  return (
    <Container className="mt-4 d-flex flex-column align-items-center">
      <ReportView />
      <Button className="mt-3" onClick={() => setStep('intro')}>Powrót</Button>
    </Container>
  )
}
