import { useEffect, useState } from 'react'
import { Accordion, ListGroup, Card } from 'react-bootstrap'
import CategoryIcon from './CategoryIcon'
import { CategoryGroup, Score, Subcategory } from '../types'
import { getSubcategories } from '../api/subcategories'

interface Props {
  results: Score[]
  categories: CategoryGroup[]
}

export default function ResultsView({ results, categories }: Props) {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])

  useEffect(() => {
    const ids = categories.flatMap(c => c.ids)
    getSubcategories(ids).then(setSubcategories)
  }, [categories])

  const valid = results.filter(r => r.value > 0)
  const overall = valid.length ? valid.reduce((s, r) => s + r.value, 0) / valid.length : 0

  const catData = categories.map((c) => {
    const scores = results.filter(r => c.ids.includes(r.question.category_id))
    const validScores = scores.filter(r => r.value > 0)
    const avg = validScores.length ? validScores.reduce((s, r) => s + r.value, 0) / validScores.length : 0
    const subs = subcategories
      .filter(sc => c.ids.includes(sc.category_id))
      .map(sc => {
        const scScores = scores.filter(s => s.question.subcategory_id === sc.id)
        const scValid = scScores.filter(s => s.value > 0)
        const scAvg = scValid.length ? scValid.reduce((s, r) => s + r.value, 0) / scValid.length : 0
        return { subcategory: sc, avg: scAvg, scores: scScores }
      })
    return { category: c, avg, scores, subs }
  })

  const scoreClass = (value: number) => {
    if (value >= 4) return 'text-success'
    if (value >= 3) return 'text-warning'
    if (value > 0) return 'text-danger'
    return 'text-secondary'
  }

  const highlightLevels = () => {
    if (overall <= 0) return [] as number[]
    const base = Math.floor(overall)
    if (base >= 5) return [5]
    const lvl = Math.max(1, base)
    return [lvl, lvl + 1]
  }

  const highlightClass = (level: number) =>
    highlightLevels().includes(level) ? 'list-group-item-info' : ''

  return (
    <div className="w-100">
      <h4>
        Średni wynik całości:{' '}
        <span className={scoreClass(overall)}>{overall.toFixed(2)}/5.0</span>
      </h4>
      <Accordion className="mt-3" alwaysOpen>
        {catData.map((c, idx) => (
          <Accordion.Item eventKey={String(idx)} key={c.category.id}>
            <Accordion.Header>
              <CategoryIcon id={c.category.id} className="me-2" />
              {c.category.name} –{' '}
              <span className={scoreClass(c.avg)}>{c.avg.toFixed(2)}/5.0</span>
            </Accordion.Header>
            <Accordion.Body>
              {c.subs.map(sub => (
                <div key={`${sub.subcategory.category_id}_${sub.subcategory.id}`} className="mb-3">
                  <h6>
                    {sub.subcategory.name} –{' '}
                    <span className={scoreClass(sub.avg)}>{sub.avg.toFixed(2)}/5.0</span>
                  </h6>
                  <ListGroup className="mb-2">
                    {sub.scores.map(s => (
                      <ListGroup.Item
                        key={`${s.question.category_id}_${s.question.subcategory_id}_${s.question.id}`}
                        className="d-flex justify-content-between"
                      >
                        <span>{s.question.description}</span>
                        {s.value > 0 ? (
                          <span className={scoreClass(s.value)}>{s.value}/5.0</span>
                        ) : (
                          <span className="text-secondary">N/D</span>
                        )}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              ))}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      <Card className="mt-4">
        <Card.Body>
          <Card.Title as="h5">Co oznacza mój wynik?</Card.Title>
          <ListGroup variant="flush" className="mt-2">
            <ListGroup.Item className={highlightClass(1)}>
              <strong>Poziom 1 – Początkowy</strong>
              <div>Na tym etapie Twoje procesy są w dużej mierze improwizowane. Brakuje stałych procedur i dokumentacji, a to, czy zadania zostaną wykonane poprawnie, zależy głównie od indywidualnych umiejętności kluczowych osób. W rezultacie praca bywa chaotyczna, a wyniki nieprzewidywalne.</div>
            </ListGroup.Item>
            <ListGroup.Item className={highlightClass(2)}>
              <strong>Poziom 2 – Powtarzalny</strong>
              <div>Masz już zdefiniowane najważniejsze kroki procesów, dzięki czemu zespół może je odtwarzać w podobny sposób za każdym razem. To umożliwia bardziej wiarygodne planowanie i oszacowanie zasobów w oparciu o wcześniejsze doświadczenia. Nadal jednak dopracowanie szczegółów odbywa się głównie „w locie”.</div>
            </ListGroup.Item>
            <ListGroup.Item className={highlightClass(3)}>
              <strong>Poziom 3 – Zdefiniowany</strong>
              <div>Twoje procesy zostały sformalizowane i udokumentowane w całej organizacji. Każdy wie, jakie kroki powinien podjąć, a narzędzia, role i odpowiedzialności są jasno określone. Daje to spójność wykonania, lepszą kontrolę nad kosztami, terminami i jakością dostarczanych usług.</div>
            </ListGroup.Item>
            <ListGroup.Item className={highlightClass(4)}>
              <strong>Poziom 4 – Zarządzany</strong>
              <div>Procesy są nie tylko stosowane, ale też mierzone w czasie rzeczywistym. Regularnie zbierasz dane o wydajności i odchyleniach od założeń, co pozwala prognozować potencjalne problemy i podejmować korekty, zanim zbyt mocno odbiegniesz od oczekiwań. Decyzje opierają się na spójnych analizach.</div>
            </ListGroup.Item>
            <ListGroup.Item className={highlightClass(5)}>
              <strong>Poziom 5 – Optymalizujący</strong>
              <div>Twoja organizacja działa w trybie ciągłego doskonalenia: regularnie identyfikujecie słabe ogniwa, eksperymentujecie z ulepszeniami i wdrażacie innowacje, które podnoszą efektywność. Zespoły samodzielnie proponują usprawnienia, a kultura organizacyjna sprzyja szybkiemu testowaniu i skalowaniu najlepszych praktyk.</div>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  )
}
