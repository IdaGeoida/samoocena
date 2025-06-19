import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { getProcesses } from '../api/processes'
import { Process } from '../types'

interface Props {
  processes: Process[]
  setProcesses: (p: Process[]) => void
  onSubmit: (results: number[]) => void
}

export default function GeneralForm({ processes, setProcesses, onSubmit }: Props) {
  const { control, handleSubmit } = useForm<Record<string, string>>({})

  useEffect(() => {
    getProcesses().then(setProcesses)
  }, [])

  const submit = handleSubmit((data) => {
    const values = Object.values(data).map((v) => (v === 'NA' ? 0 : Number(v)))
    onSubmit(values)
  })

  return (
    <form onSubmit={submit}>
      {processes.map((p) => (
        <div key={p.id}>
          <label>{p.name}</label>
          <Controller
            name={String(p.id)}
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
