import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { getQuestions } from '../api/questions'
import { getSubcategories } from '../api/subcategories'
import { Question, Subcategory, CategoryGroup, Score } from '../types'
import { Form, Button, ProgressBar } from 'react-bootstrap'

interface Props {
  category: CategoryGroup
  index: number
  total: number
  onSubmit: (values: Score[]) => void
}

export default function CategoryQuestionsForm({ category, index, total, onSubmit }: Props) {
  const { register, handleSubmit } = useForm<Record<string, string>>({})
  const [questions, setQuestions] = useState<Question[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])

  useEffect(() => {
    getQuestions(category.ids).then(setQuestions)
    getSubcategories(category.ids).then(setSubcategories)
  }, [category.ids])

  const submit = handleSubmit((data) => {
    const scores: Score[] = questions.map((q) => {
      const val = data[`${q.category_id}_${q.subcategory_id}_${q.id}`]
      const num = val === 'NA' || val === undefined || val === '' ? 0 : Number(val)
      return { question: q, value: num }
    })
    onSubmit(scores)
  })

  return (
    <Form onSubmit={submit}>
      <h3>{category.name}</h3>
      <ProgressBar now={((index + 1) / total) * 100} label={`${index + 1}/${total}`} className="mb-3" />
      {subcategories.map((sub) => (
        <div key={sub.id} className="mb-4">
          <Form.Group>
            <Form.Label as="h5" className="mb-0">
              {sub.name}
            </Form.Label>
            {sub.description && (
              <Form.Text className="text-muted d-block mb-2">
                {sub.description}
              </Form.Text>
            )}
          </Form.Group>
          {questions.filter((q) => q.subcategory_id === sub.id).map((q) => (
            <Form.Group key={q.id} className="mb-3">
              <Form.Label>{q.description}</Form.Label>
              {q.detail && (
                <Form.Text className="text-muted d-block mb-1" style={{ fontSize: 'smaller' }}>
                  {q.detail}
                </Form.Text>
              )}
              {(q.scale_min_text || q.scale_max_text) && (
                <Form.Text className="text-muted d-block mb-2" style={{ fontSize: 'smaller' }}>
                  Odpowiedz na skali od 1 do 5, gdzie 1 oznacza <em>{q.scale_min_text}</em> a 5 oznacza <em>{q.scale_max_text}</em>. N/A oznacza, że dany proces nie dotyczy Twojej organizacji i nie będzie uwzględniony w badaniu.
                </Form.Text>
              )}
              <div className="d-flex align-items-center">
                <div className="d-flex flex-grow-1 justify-content-between me-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Form.Check
                      key={n}
                      type="radio"
                      id={`${q.category_id}_${q.subcategory_id}_${q.id}_${n}`}
                      label={String(n)}
                      value={n}
                      {...register(`${q.category_id}_${q.subcategory_id}_${q.id}`)}
                    />
                  ))}
                </div>
                <Form.Check
                  type="radio"
                  id={`${q.category_id}_${q.subcategory_id}_${q.id}_na`}
                  label="N/A"
                  value="NA"
                  className="text-secondary"
                  {...register(`${q.category_id}_${q.subcategory_id}_${q.id}`)}
                />
              </div>
            </Form.Group>
          ))}
        </div>
      ))}
      <Button type="submit">{index + 1 === total ? 'Zakończ' : 'Dalej'}</Button>
    </Form>
  )
}
