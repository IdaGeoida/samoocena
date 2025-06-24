import { useEffect, useState } from 'react'
import { Accordion, ListGroup } from 'react-bootstrap'
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
    </div>
  )
}
