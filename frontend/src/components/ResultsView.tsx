import { Accordion, Table } from 'react-bootstrap'
import { CategoryGroup, Score } from '../types'

interface Props {
  results: Score[]
  categories: CategoryGroup[]
}

export default function ResultsView({ results, categories }: Props) {
  const valid = results.filter(r => r.value > 0)
  const overall = valid.length ? valid.reduce((s, r) => s + r.value, 0) / valid.length : 0

  const catData = categories.map((c) => {
    const scores = results.filter(r => c.ids.includes(r.question.category_id))
    const validScores = scores.filter(r => r.value > 0)
    const avg = validScores.length ? validScores.reduce((s, r) => s + r.value, 0) / validScores.length : 0
    return { category: c, avg, scores }
  })

  const scoreClass = (value: number) => {
    if (value >= 4) return 'text-success'
    if (value >= 3) return 'text-warning'
    if (value > 0) return 'text-danger'
    return 'text-secondary'
  }

  return (
    <div>
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
              <Table striped bordered size="sm" className="w-auto">
                <tbody>
                  {c.scores.map(s => (
                    <tr key={`${s.question.category_id}_${s.question.subcategory_id}_${s.question.id}`}>
                      <td>{s.question.description}</td>
                      <td>
                        {s.value > 0 ? (
                          <span className={scoreClass(s.value)}>{s.value}/5.0</span>
                        ) : (
                          <span className="text-secondary">N/D</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}
