import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { getProcesses } from '../api/processes'
import { Applicability, Process } from '../types'

interface Props {
  processes: Process[]
  setProcesses: (p: Process[]) => void
  onSubmit: (results: number[]) => void
}

export default function GeneralForm({ processes, setProcesses, onSubmit }: Props) {
  const { control, handleSubmit } = useForm<Record<string, Applicability>>({})

  useEffect(() => {
    getProcesses().then(setProcesses)
  }, [])

  const submit = handleSubmit((data) => {
    const values = Object.values(data).map((v) => (v === Applicability.NZ ? 0 : 1))
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
            defaultValue={Applicability.MZ}
            render={({ field }) => (
              <select {...field}>
                {Object.values(Applicability).map((a) => (
                  <option key={a} value={a}>{a}</option>
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
