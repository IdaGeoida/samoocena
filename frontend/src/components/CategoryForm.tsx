import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import axios from 'axios'
import { Category } from '../types'

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
    <form onSubmit={submit}>
      {categories.map(c => {
        const applies = watch(`applies_${c.id}`)
        const impl = watch(`impl_${c.id}`)
        return (
          <div key={c.id}>
            <h3>{c.name}</h3>
            <label>Czy ma zastosowanie?</label>
            <Controller
              name={`applies_${c.id}`}
              control={control}
              defaultValue="no"
              render={({ field }) => (
                <select {...field}>
                  <option value="yes">Tak</option>
                  <option value="no">Nie</option>
                </select>
              )}
            />
            {applies === 'yes' && (
              <>
                <label>Czy organizacja realizuje u siebie te procesy?</label>
                <Controller
                  name={`impl_${c.id}`}
                  control={control}
                  defaultValue="no"
                  render={({ field }) => (
                    <select {...field}>
                      <option value="yes">Tak</option>
                      <option value="no">Nie</option>
                    </select>
                  )}
                />
                {impl === 'no' && (
                  <>
                    <label>Czy organizacja chciałaby je realizować?</label>
                    <Controller
                      name={`want_${c.id}`}
                      control={control}
                      defaultValue="no"
                      render={({ field }) => (
                        <select {...field}>
                          <option value="yes">Tak</option>
                          <option value="no">Nie</option>
                        </select>
                      )}
                    />
                  </>
                )}
              </>
            )}
          </div>
        )
      })}
      <button type="submit">Dalej</button>
    </form>
  )
}
