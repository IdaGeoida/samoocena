import { useEffect, useState, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { getQuestions } from '../api/questions'
import { getCategories } from '../api/categories'
import { getSubcategories } from '../api/subcategories'
import { Question, Category, Subcategory } from '../types'
import { Form, Button, ProgressBar, Card } from 'react-bootstrap'

interface Props {
  questions: Question[]
  setQuestions: (q: Question[]) => void
  onSubmit: (results: number[]) => void
  categoryIds: number[]
}

export default function GeneralForm({ questions, setQuestions, onSubmit, categoryIds }: Props) {
  const { control, handleSubmit } = useForm<Record<string, string>>({})
  const [categories, setCategories] = useState<Category[]>([])
  const [subcats, setSubcats] = useState<Subcategory[]>([])
  const [page, setPage] = useState(0)

  useEffect(() => {
    getQuestions(categoryIds).then(setQuestions)
    getCategories().then(setCategories)
    getSubcategories(categoryIds).then(setSubcats)
  }, [categoryIds])

  const grouped = useMemo(() => {
    const map: Record<number, Record<number, Question[]>> = {}
    questions.forEach((q) => {
      if (!map[q.category_id]) map[q.category_id] = {}
      if (!map[q.category_id][q.subcategory_id]) map[q.category_id][q.subcategory_id] = []
      map[q.category_id][q.subcategory_id].push(q)
    })
    return categoryIds.map((id) => ({
      id,
      name: categories.find((c) => c.id === id)?.name || `Category ${id}`,
      subcategories: subcats
        .filter((s) => s.category_id === id)
        .map((s) => ({
          ...s,
          questions: map[id]?.[s.id] || []
        }))
    }))
  }, [questions, categoryIds, categories, subcats])

  const submit = handleSubmit((data) => {
    const values = Object.values(data).map((v) => (v === 'NA' ? 0 : Number(v)))
    onSubmit(values)
  })

  const current = grouped[page]
  const total = grouped.length
  const progress = Math.round((page / total) * 100)

  return (
    <Form onSubmit={submit}>
      <ProgressBar now={progress} label={`${page}/${total}`} className="mb-3" />
      <h4 className="mb-3">{current?.name}</h4>
      {current?.subcategories.map((sc) => (
        <Card key={sc.id} className="mb-4">
          <Card.Body>
            <Card.Title>{sc.name}</Card.Title>
            {sc.description && (
              <Card.Text className="text-muted">{sc.description}</Card.Text>
            )}
            {sc.questions.map((q) => (
              <div key={q.id} className="mb-3">
                <Form.Label><strong>{q.description}</strong></Form.Label>
                {q.details && (
                  <div className="text-muted small mb-2">{q.details}</div>
                )}
                <Controller
                  name={String(q.id)}
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <div>
                      <div className="d-flex align-items-center mb-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Form.Check
                            key={n}
                            inline
                            type="radio"
                            id={`${q.id}_${n}`}
                            label={n}
                            value={n}
                            checked={field.value === String(n)}
                            onChange={() => field.onChange(String(n))}
                          />
                        ))}
                        <Form.Check
                          inline
                          type="radio"
                          id={`${q.id}_na`}
                          label="Nie dotyczy"
                          value="NA"
                          checked={field.value === 'NA'}
                          onChange={() => field.onChange('NA')}
                          className="ms-3 text-secondary"
                        />
                      </div>
                      <div className="small text-muted">Skala 1-5 - lorem ipsum</div>
                    </div>
                  )}
                />
              </div>
            ))}
          </Card.Body>
        </Card>
      ))}
      <div className="d-flex justify-content-between">
        {page > 0 && (
          <Button variant="secondary" onClick={() => setPage(page - 1)}>
            Wstecz
          </Button>
        )}
        {page < total - 1 ? (
          <Button onClick={() => setPage(page + 1)}>
            Dalej
          </Button>
        ) : (
          <Button type="submit">Zatwierdź</Button>
        )}
      </div>
    </Form>
  )
}
