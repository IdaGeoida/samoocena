import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import axios from 'axios'
import { Category } from '../types'
import { Form, Button } from 'react-bootstrap'

interface Props {
  onSubmit: (categoryIds: number[]) => void
}

export default function CategoryForm({ onSubmit }: Props) {
  const { control, handleSubmit, watch } = useForm<Record<string, string>>({})
  const [categories, setCategories] = React.useState<Category[]>([])

  useEffect(() => {
    axios.get<Category[]>('/api/categories/').then(res => setCategories(res.data))
  }, [])

  const submit = handleSubmit((data) => {
    const ids: number[] = []
    categories.forEach((c) => {
      const applies = data[`applies_${c.id}`] === 'yes'
      const implemented = data[`impl_${c.id}`] === 'yes'
      const want = data[`want_${c.id}`] === 'yes'
      if (applies && (implemented || want)) {
        ids.push(c.id)
      }
    })
    onSubmit(ids)
  })

  return (
    <Form onSubmit={submit}>
      {categories.map((c) => {
        const applies = watch(`applies_${c.id}`)
        const impl = watch(`impl_${c.id}`)
        return (
          <div key={c.id} className="mb-3">
            <h3>{c.name}</h3>
            <Form.Label>Czy ma zastosowanie?</Form.Label>
            <Controller
              name={`applies_${c.id}`}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Form.Select {...field}>
                  <option value="">-- wybierz --</option>
                  <option value="yes">Tak</option>
                  <option value="no">Nie</option>
                </Form.Select>
              )}
            />
            {applies === 'yes' && (
              <>
                <Form.Label className="mt-2">Czy organizacja realizuje u siebie te procesy?</Form.Label>
                <Controller
                  name={`impl_${c.id}`}
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Form.Select {...field}>
                      <option value="">-- wybierz --</option>
                      <option value="yes">Tak</option>
                      <option value="no">Nie</option>
                    </Form.Select>
                  )}
                />
                {impl === 'no' && (
                  <>
                    <Form.Label className="mt-2">Czy organizacja chciałaby je realizować?</Form.Label>
                    <Controller
                      name={`want_${c.id}`}
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Form.Select {...field}>
                          <option value="">-- wybierz --</option>
                          <option value="yes">Tak</option>
                          <option value="no">Nie</option>
                        </Form.Select>
                      )}
                    />
                  </>
                )}
              </>
            )}
          </div>
        )
      })}
      <Button type="submit">Dalej</Button>
    </Form>
  )
}
