import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { getQuestions } from '../api/questions'
import { Question } from '../types'

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
    <form onSubmit={submit}>
      {questions.map((q) => (
        <div key={q.id}>
          <label>{q.description}</label>
          <Controller
            name={String(q.id)}
            control={control}
            defaultValue="NA"
            render={({ field }) => (
              <select {...field}>
                <option value="NA">N/A</option>
                {[1,2,3,4,5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            )}
          />
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  )
}
