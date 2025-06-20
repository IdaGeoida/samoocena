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

  return (
    <div>
      <h4>Średni wynik całości: {overall.toFixed(2)}</h4>
      <Accordion className="mt-3">
        {catData.map((c, idx) => (
          <Accordion.Item eventKey={String(idx)} key={c.category.id}>
            <Accordion.Header>
              {c.category.name} – {c.avg.toFixed(2)}
            </Accordion.Header>
            <Accordion.Body>
              <Table striped bordered size="sm" className="w-auto">
                <tbody>
                  {c.scores.map(s => (
                    <tr key={`${s.question.category_id}_${s.question.subcategory_id}_${s.question.id}`}> 
                      <td>{s.question.description}</td>
                      <td>{s.value > 0 ? s.value : 'N/D'}</td>
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
