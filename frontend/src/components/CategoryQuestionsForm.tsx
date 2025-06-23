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
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [subIndex, setSubIndex] = useState(0)

  useEffect(() => {
    getQuestions(category.ids).then(setQuestions)
    getSubcategories(category.ids).then(setSubcategories)
    setSubIndex(0)
  }, [category.ids])

  const currentSub = subcategories[subIndex]
  const currentAnswered = currentSub
    ? questions
        .filter(q => q.subcategory_id === currentSub.id)
        .every(q => answers[`${q.category_id}_${q.subcategory_id}_${q.id}`])
    : false

  const submit = handleSubmit((data) => {
    if (!currentAnswered) {
      return
    }
    if (subIndex + 1 < subcategories.length) {
      setSubIndex(subIndex + 1)
    } else {
      const scores: Score[] = questions.map((q) => {
        const val = data[`${q.category_id}_${q.subcategory_id}_${q.id}`]
        const num = val === 'NA' || val === undefined || val === '' ? 0 : Number(val)
        return { question: q, value: num }
      })
      onSubmit(scores)
    }
  })

  return (
    <Form onSubmit={submit} className="w-100">
      <h3>{category.name}</h3>
      <ProgressBar now={((index + 1) / total) * 100} label={`${index + 1}/${total}`} className="mb-2" />
      {subcategories.length > 0 && (
        <ProgressBar
          now={((subIndex + 1) / subcategories.length) * 100}
          label={`${subIndex + 1}/${subcategories.length}`}
          className="mb-3"
          variant="secondary"
        />
      )}
        {currentSub && (
          <div key={currentSub.id} className="mb-5">
          <Form.Group>
            <Form.Label as="h5" className="mb-0">
              {currentSub.name}
            </Form.Label>
            {currentSub.description && (
              <Form.Text className="text-muted d-block mb-2">
                {currentSub.description}
              </Form.Text>
            )}
          </Form.Group>
            {questions.filter((q) => q.subcategory_id === currentSub.id).map((q) => (
              <Form.Group key={q.id} className="mb-4 ms-4">
              <Form.Label>{q.description}</Form.Label>
              {q.detail && (
                <Form.Text className="text-muted d-block mb-1" style={{ fontSize: 'smaller' }}>
                  {q.detail}
                </Form.Text>
              )}
              {(q.scale_min_text || q.scale_max_text) && (
                <Form.Text className="text-muted d-block mb-2" style={{ fontSize: 'smaller' }}>
                  Odpowiedz na skali od 1 do 5. N/A oznacza, że dany proces nie dotyczy Twojej organizacji i nie będzie uwzględniony w badaniu.
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
                      className="text-center mx-1"
                      {...register(`${q.category_id}_${q.subcategory_id}_${q.id}`)}
                      onChange={(e) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [`${q.category_id}_${q.subcategory_id}_${q.id}`]: (e.target as HTMLInputElement).value,
                        }))
                      }
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
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [`${q.category_id}_${q.subcategory_id}_${q.id}`]: (e.target as HTMLInputElement).value,
                    }))
                  }
                />
              </div>
              {(q.scale_min_text || q.scale_max_text) && (
                <div className="d-flex justify-content-between scale-labels px-1 mt-1">
                  {q.scale_min_text && (
                    <Form.Text className="text-muted">{q.scale_min_text}</Form.Text>
                  )}
                  {q.scale_max_text && (
                    <Form.Text className="text-muted text-end">{q.scale_max_text}</Form.Text>
                  )}
                </div>
              )}
            </Form.Group>
          ))}
        </div>
      )}
      <div className="d-flex justify-content-between">
        {subIndex > 0 && (
          <Button variant="secondary" onClick={() => setSubIndex(subIndex - 1)}>
            Wstecz
          </Button>
        )}
        <Button type="submit" disabled={!currentAnswered}>
          {subIndex + 1 === subcategories.length && index + 1 === total ? 'Zakończ' : 'Dalej'}
        </Button>
      </div>
    </Form>
  )
}
