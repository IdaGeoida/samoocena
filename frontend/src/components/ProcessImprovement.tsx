import { useEffect, useState } from 'react'
import {
  Container,
  Button,
  Row,
  Col,
  Accordion,
  ListGroup,
  Form,
  InputGroup,
} from 'react-bootstrap'
import { CategoryGroup, Score, Subcategory } from '../types'
import { getSubcategories } from '../api/subcategories'

interface Item {
  id: string
  type: 'category' | 'subcategory' | 'process'
  name: string
  score: number
  parent?: string
}

interface Props {
  onBack: () => void
  results: Score[]
  categories: CategoryGroup[]
}

export default function ProcessImprovement({ onBack, results, categories }: Props) {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [order, setOrder] = useState<string[]>([])
  const [summary, setSummary] = useState('')
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  useEffect(() => {
    const ids = categories.flatMap(c => c.ids)
    getSubcategories(ids).then(setSubcategories)
  }, [categories])

  const items: Record<string, Item> = {}

  categories.forEach(c => {
    const scores = results.filter(r => c.ids.includes(r.question.category_id))
    const valid = scores.filter(r => r.value > 0)
    const avg = valid.length ? valid.reduce((s, r) => s + r.value, 0) / valid.length : 0
    const cid = `cat_${c.id}`
    items[cid] = { id: cid, type: 'category', name: c.name, score: avg }
    subcategories
      .filter(sc => c.ids.includes(sc.category_id))
      .forEach(sc => {
        const scScores = scores.filter(s => s.question.subcategory_id === sc.id)
        const scValid = scScores.filter(s => s.value > 0)
        const scAvg = scValid.length ? scValid.reduce((s, r) => s + r.value, 0) / scValid.length : 0
        const sid = `sub_${sc.category_id}_${sc.id}`
        items[sid] = { id: sid, type: 'subcategory', name: sc.name, score: scAvg, parent: cid }
        scScores.forEach(s => {
          const qid = `proc_${s.question.category_id}_${s.question.subcategory_id}_${s.question.id}`
          items[qid] = {
            id: qid,
            type: 'process',
            name: s.question.description,
            score: s.value,
            parent: sid,
          }
        })
      })
  })

  const getChildren = (id: string): string[] => {
    const direct = Object.values(items).filter(i => i.parent === id).map(i => i.id)
    return direct.reduce<string[]>((acc, c) => [...acc, c, ...getChildren(c)], [])
  }

  const toggle = (id: string) => {
    const remove = (ids: string[], target: string[]) => ids.filter(i => !target.includes(i))
    const toRemove = [id, ...getChildren(id)]
    setSelected(prev =>
      prev.includes(id) ? remove(prev, toRemove) : [...remove(prev, toRemove), id],
    )
    setOrder(prev =>
      prev.includes(id)
        ? remove(prev, toRemove)
        : [...remove(prev, toRemove), id],
    )
  }

  const hasParentSelected = (id: string): boolean => {
    const item = items[id]
    if (!item || !item.parent) return false
    if (selected.includes(item.parent)) return true
    return hasParentSelected(item.parent)
  }

  const typeLabel = (t: Item['type']) =>
    t === 'category' ? 'Kategoria' : t === 'subcategory' ? 'Podkategoria' : 'Proces'

  const handleDragOver = (idx: number) => {
    if (dragIndex === null || dragIndex === idx) return
    setOrder(prev => {
      const arr = [...prev]
      const [m] = arr.splice(dragIndex, 1)
      arr.splice(idx, 0, m)
      setDragIndex(idx)
      return arr
    })
  }

  const scoreClass = (value: number) => {
    if (value >= 4) return 'text-success'
    if (value >= 3) return 'text-warning'
    if (value > 0) return 'text-danger'
    return 'text-secondary'
  }

  const generateSummary = () => {
    const lines: string[] = []
    const details: string[] = []
    order.forEach(id => {
      const item = items[id]
      if (!item) return
      lines.push(`${typeLabel(item.type)} ${item.name}`)
      const children = getChildren(id)
      if (children.length) {
        const names = children.map(cid => items[cid].name).join(', ')
        details.push(`${typeLabel(item.type)} ${item.name}: ${names}`)
      }
    })
    setSummary(lines.join('\n') + '\n\n' + details.join('\n'))
  }

  const copySummary = () => {
    navigator.clipboard.writeText(summary)
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-3 text-center">Usprawnienie procesów</h2>
      <Row>
        <Col md={6}>
          <Accordion alwaysOpen>
            {categories.map((c, idx) => {
              const cid = `cat_${c.id}`
              const cat = items[cid]
              return (
                <Accordion.Item eventKey={String(idx)} key={cid}>
                  <Accordion.Header>
                    <Form.Check
                      type="checkbox"
                      className="me-2"
                      checked={selected.includes(cid)}
                      onChange={() => toggle(cid)}
                      aria-label={c.name}
                    />
                    {c.name} – {cat ? cat.score.toFixed(2) : '0.00'}/5.0
                  </Accordion.Header>
                  <Accordion.Body>
                    {subcategories
                      .filter(sc => c.ids.includes(sc.category_id))
                      .map(sc => {
                        const sid = `sub_${sc.category_id}_${sc.id}`
                        const sub = items[sid]
                        return (
                          <div key={sid} className="mb-3 ms-3">
                            <Form.Check
                              type="checkbox"
                              label={`${sc.name} – ${sub ? sub.score.toFixed(2) : '0.00'}/5.0`}
                              id={sid}
                              checked={selected.includes(sid)}
                              disabled={hasParentSelected(sid)}
                              onChange={() => toggle(sid)}
                            />
                            <ListGroup className="mt-2 ms-4">
                              {results
                                .filter(r =>
                                  r.question.category_id === sc.category_id &&
                                  r.question.subcategory_id === sc.id,
                                )
                                .map(r => {
                                  const pid = `proc_${r.question.category_id}_${r.question.subcategory_id}_${r.question.id}`
                                  return (
                                    <ListGroup.Item key={pid} className="d-flex align-items-center">
                                      <Form.Check
                                        type="checkbox"
                                        className="me-2"
                                        checked={selected.includes(pid)}
                                        disabled={hasParentSelected(pid)}
                                        onChange={() => toggle(pid)}
                                        label={
                                          <span className="me-2">{r.question.description}</span>
                                        }
                                      />
                                      <span className="ms-auto">
                                        {r.value > 0 ? `${r.value}/5.0` : 'N/D'}
                                      </span>
                                    </ListGroup.Item>
                                  )
                                })}
                            </ListGroup>
                          </div>
                        )
                      })}
                  </Accordion.Body>
                </Accordion.Item>
              )
            })}
          </Accordion>
        </Col>
        <Col md={6}>
          <h5>Priorytety</h5>
          <ListGroup>
            {order.map((id, idx) => {
              const item = items[id]
              if (!item) return null
              return (
                <ListGroup.Item
                  key={id}
                  draggable
                  onDragStart={() => setDragIndex(idx)}
                  onDragOver={e => {
                    e.preventDefault()
                    handleDragOver(idx)
                  }}
                  onDrop={() => setDragIndex(null)}
                  className="d-flex justify-content-between clickable"
                >
                  <span className="d-flex flex-column">
                    <small className="text-muted">{typeLabel(item.type)}</small>
                    <span>{item.name}</span>
                  </span>
                  <span className={item.score > 0 ? scoreClass(item.score) : 'text-secondary'}>
                    {item.score > 0 ? `${item.score.toFixed(2)}/5.0` : 'N/D'}
                  </span>
                </ListGroup.Item>
              )
            })}
          </ListGroup>
          <Button className="mt-3" onClick={generateSummary} disabled={order.length === 0}>
            Generuj podsumowanie
          </Button>
          {summary && (
            <InputGroup className="mt-3">
              <Form.Control as="textarea" value={summary} readOnly rows={5} />
              <Button variant="secondary" onClick={copySummary}>
                Kopiuj
              </Button>
            </InputGroup>
          )}
        </Col>
      </Row>
      <div className="text-center mt-3">
        <Button onClick={onBack}>Powrót</Button>
      </div>
    </Container>
  )
}
