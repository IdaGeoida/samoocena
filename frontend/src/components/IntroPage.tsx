import { Container, Button } from 'react-bootstrap'

interface Props {
  onStart: () => void
}

export default function IntroPage({ onStart }: Props) {
  return (
    <Container className="mt-4 text-center d-flex flex-column align-items-center">
      <h1>Badanie samooceny</h1>
      <p>
        Niniejszy kwestionariusz pozwala ocenić stopień wdrożenia standardów
        w Twojej organizacji. Odpowiadaj szczerze na kolejne pytania. Jeśli
        dane zagadnienie Cię nie dotyczy, wybierz opcję "N/A".
      </p>
      <div className="d-flex gap-2 mt-3">
        <Button onClick={onStart}>Rozpocznij badanie</Button>
      </div>
    </Container>
  )
}
