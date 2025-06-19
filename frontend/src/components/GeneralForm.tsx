import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { getQuestions } from '../api/questions'
import { Question } from '../types'
import { Form, Button } from 'react-bootstrap'

interface Props {
  questions: Question[]
  setQuestions: (q: Question[]) => void
  onSubmit: (results: number[]) => void
  categoryIds: number[]
}

export default function GeneralForm({ questions, setQuestions, onSubmit, categoryIds }: Props) {
  const { control, handleSubmit } = useForm<Record<string, string>>({})

  useEffect(() => {
    getQuestions(categoryIds).then(setQuestions)
  }, [categoryIds])

  const submit = handleSubmit((data) => {
    const values = Object.values(data).map((v) => (v === 'NA' ? 0 : Number(v)))
    onSubmit(values)
  })

  return (
    <Form onSubmit={submit}>
      {questions.map((q) => (
        <div key={q.id} className="mb-3">
          <Form.Label>{q.description}</Form.Label>
          <Controller
            name={String(q.id)}
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Form.Select {...field}>
                <option value="">-- wybierz --</option>
                <option value="NA">N/A</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </Form.Select>
            )}
          />
        </div>
      ))}
      <Button type="submit">Submit</Button>
    </Form>
  )
}
