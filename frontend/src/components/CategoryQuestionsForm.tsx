import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { getQuestions } from '../api/questions'
import { getSubcategories } from '../api/subcategories'
import { Question, Subcategory, Category } from '../types'
import { Form, Button, ProgressBar } from 'react-bootstrap'

interface Props {
  category: Category
  index: number
  total: number
  onSubmit: (values: number[]) => void
}

export default function CategoryQuestionsForm({ category, index, total, onSubmit }: Props) {
  const { register, handleSubmit } = useForm<Record<string, string>>({})
  const [questions, setQuestions] = useState<Question[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])

  useEffect(() => {
    getQuestions([category.id]).then(setQuestions)
    getSubcategories([category.id]).then(setSubcategories)
  }, [category.id])

  const submit = handleSubmit((data) => {
    const values = Object.values(data).map((v) => (v === 'NA' ? 0 : Number(v)))
    onSubmit(values)
  })

  return (
    <Form onSubmit={submit}>
      <h3>{category.name}</h3>
      <ProgressBar now={((index + 1) / total) * 100} label={`${index + 1}/${total}`} className="mb-3" />
      {subcategories.map((sub) => (
        <div key={sub.id} className="mb-4">
          <h5>{sub.name}</h5>
          {sub.description && <p className="text-muted">{sub.description}</p>}
          {questions.filter((q) => q.subcategory_id === sub.id).map((q) => (
            <div key={q.id} className="mb-3">
              <Form.Label>{q.description}</Form.Label>
              {q.detail && <div className="text-muted mb-1" style={{ fontSize: 'smaller' }}>{q.detail}</div>}
              <div className="d-flex align-items-center">
                <div className="me-2">
                  {[1,2,3,4,5].map((n) => (
                    <Form.Check
                      key={n}
                      inline
                      type="radio"
                      id={`${q.id}_${n}`}
                      label={String(n)}
                      value={n}
                      {...register(String(q.id))}
                    />
                  ))}
                </div>
                <Form.Check
                  inline
                  type="radio"
                  id={`${q.id}_na`}
                  label="N/A"
                  value="NA"
                  className="text-secondary"
                  {...register(String(q.id))}
                />
              </div>
            </div>
          ))}
        </div>
      ))}
      <Button type="submit">{index + 1 === total ? 'Zakończ' : 'Dalej'}</Button>
    </Form>
  )
}
