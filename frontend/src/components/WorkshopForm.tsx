import { useForm, Controller } from 'react-hook-form'
import { Form, Button, Container, InputGroup } from 'react-bootstrap'

export interface WorkshopData {
  area: string
  budget: string
  hours: string
  participants: string
}

interface Props {
  onSubmit: (data: WorkshopData) => void
}

export default function WorkshopForm({ onSubmit }: Props) {
  const { control, handleSubmit } = useForm<WorkshopData>({})
  const submit = handleSubmit(data => onSubmit(data))

  return (
    <Container className="mt-4 d-flex flex-column align-items-center">
      <h2 className="mb-3">Kwestionariusz warsztatowy</h2>
      <Form onSubmit={submit} className="w-100" style={{ maxWidth: '500px' }}>
        <Form.Group className="mb-3" controlId="area">
          <Form.Label>Obszar działania</Form.Label>
          <Controller
            name="area"
            control={control}
            defaultValue=""
            render={({ field }) => <Form.Control {...field} required />}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="budget">
          <Form.Label>Budżet na szkolenia i narzędzia (PLN)</Form.Label>
          <Controller
            name="budget"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <InputGroup>
                <InputGroup.Text>PLN</InputGroup.Text>
                <Form.Control {...field} placeholder="np. 10000" required />
              </InputGroup>
            )}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="hours">
          <Form.Label>Czas zespołu na warsztaty (godziny)</Form.Label>
          <Controller
            name="hours"
            control={control}
            defaultValue=""
            render={({ field }) => <Form.Control {...field} required />}
          />
        </Form.Group>
        <Form.Group className="mb-4" controlId="participants">
          <Form.Label>Liczba uczestników warsztatów</Form.Label>
          <Controller
            name="participants"
            control={control}
            defaultValue=""
            render={({ field }) => <Form.Control {...field} required />}
          />
        </Form.Group>
        <div className="text-center">
          <Button type="submit">Dalej</Button>
        </div>
      </Form>
    </Container>
  )
}
