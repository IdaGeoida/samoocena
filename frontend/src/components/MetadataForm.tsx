import { useForm, Controller } from 'react-hook-form'
import { Form, Button } from 'react-bootstrap'

interface Props {
  onSubmit: (values: { employees_range: string; volunteers_range: string }) => void
}

export default function MetadataForm({ onSubmit }: Props) {
  const { control, handleSubmit } = useForm({})
  const submit = handleSubmit((data) => {
    onSubmit(data as any)
  })

  const empOptions = ['0-10', '11-50', '51-250', '251+']
  const volOptions = ['0', '1-9', '10-49', '50+']

  return (
    <Form onSubmit={submit} className="mt-4">
      <Form.Group className="mb-3">
        <Form.Label>Liczba pracowników</Form.Label>
        <Controller
          name="employees_range"
          control={control}
          defaultValue="0-10"
          render={({ field }) => (
            <Form.Select {...field}>
              {empOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </Form.Select>
          )}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Liczba wolontariuszy</Form.Label>
        <Controller
          name="volunteers_range"
          control={control}
          defaultValue="0"
          render={({ field }) => (
            <Form.Select {...field}>
              {volOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </Form.Select>
          )}
        />
      </Form.Group>
      <Button type="submit">Dalej</Button>
    </Form>
  )
}
