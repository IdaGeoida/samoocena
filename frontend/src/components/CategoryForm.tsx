import { useEffect, useState } from 'react'
import axios from 'axios'
import { CategoryGroup, Category } from '../types'
import { Form, Button, Row, Col, Card } from 'react-bootstrap'
import CategoryIcon from './CategoryIcon'

interface Props {
  onSubmit: (categories: CategoryGroup[]) => void
}

export default function CategoryForm({ onSubmit }: Props) {
  const [categories, setCategories] = useState<CategoryGroup[]>([])
  const [selected, setSelected] = useState<number[]>([])

  useEffect(() => {
    axios.get<Category[]>('/api/categories/').then(res => {
      const map = new Map<string, CategoryGroup>()
      res.data.forEach((c) => {
        const existing = map.get(c.name)
        if (existing) {
          existing.ids.push(c.id)
        } else {
          map.set(c.name, { ...c, ids: [c.id] })
        }
      })
      setCategories(Array.from(map.values()))
    })
  }, [])

  const toggle = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected.length) return
    onSubmit(categories.filter(c => selected.includes(c.id)))
  }


  return (
    <Form onSubmit={submit} className="w-100 text-center">
      <p className="mb-4">
        Wybierz kategorie, które chcesz zbadać dla swojej organizacji. Zalecane jest wybranie kategorii, które mają zastosowanie dla Twojej organizacji i które w niej realizujesz lub chcesz realizować.
      </p>
      <Row xs={1} sm={2} md={3} className="g-4 justify-content-center">
        {categories.map((c) => (
          <Col key={c.id}>
            <Card
              className={`category-card h-100 ${selected.includes(c.id) ? 'selected' : ''}`}
              onClick={() => toggle(c.id)}
            >
              {selected.includes(c.id) && <span className="check-icon">✓</span>}
              <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                <CategoryIcon id={c.id} />
                <span className="category-label">{c.name}</span>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Button type="submit" className="mt-3" disabled={!selected.length}>Dalej</Button>
    </Form>
  )
}
