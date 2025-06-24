import { Container, Button } from 'react-bootstrap'

interface Props {
  onBack: () => void
}

export default function ProcessImprovement({ onBack }: Props) {
  return (
    <Container className="mt-4 d-flex flex-column align-items-center">
      <h2 className="mb-3">Usprawnienie procesów</h2>
      <p>Tutaj pojawią się wskazówki dotyczące usprawniania procesów.</p>
      <Button className="mt-3" onClick={onBack}>Powrót</Button>
    </Container>
  )
}
