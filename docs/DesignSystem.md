# System Design dla Aplikacji Samoocena

Ten dokument opisuje zalecenia projektowe oraz wskazówki dotyczące interfejsu użytkownika, zgodne z heurystykami Nielsena i Molicha. Wszystkie komponenty frontendu korzystają z biblioteki **React Bootstrap** zgodnie z instrukcjami z `AGENTS.md`.

## Ogólne zasady

- Importuj `bootstrap/dist/css/bootstrap.min.css` w pliku `frontend/src/main.tsx`.
- Zamiast surowych tagów HTML używaj komponentów `react-bootstrap` takich jak `Form`, `Button` i `Container`.
- Formularze prezentują jedną kategorię pytań na stronę, a pasek postępu wskazuje liczbę wypełnionych kategorii względem wszystkich.
- Pytania w obrębie kategorii są grupowane według podkategorii. Nazwa i opis podkategorii powinny być wyraźnie oddzielone od pytań.
- Każde pytanie składa się z głównego tekstu oraz krótkiego opisu w mniejszym kroju pisma.
- Skala ocen używa przycisków radio w zakresie 1–5 oraz kolorową opcję "N/A" po prawej stronie.

## Heurystyki Nielsena i Molicha

1. **Widoczność statusu systemu** – użytkownik zawsze powinien wiedzieć, na jakim etapie wypełniania formularza się znajduje. Umożliwia to m.in. pasek postępu oraz komunikaty potwierdzające zapisanie danych.
2. **Zgodność pomiędzy systemem a rzeczywistością** – kategorie i podkategorie opisują realne procesy w sposób zrozumiały dla użytkownika. Nazewnictwo powinno być spójne z terminologią branżową.
3. **Kontrola i swoboda użytkownika** – umożliwiaj powrót do poprzednich ekranów oraz zmianę odpowiedzi przed ostatecznym zapisem formularza.
4. **Spójność i standardy** – układ stron i nazewnictwo przycisków powinny być identyczne w całej aplikacji. Korzystanie z React Bootstrap pomaga zachować jednolity wygląd.
5. **Zapobieganie błędom** – przed wysłaniem formularza sprawdzaj poprawność danych. Ogranicz możliwość wyboru niepoprawnych wartości dzięki odpowiednim kontrolkom (np. lista rozwijana, pola typu number).
6. **Rozpoznawanie zamiast przypominania** – przy wypełnianiu formularza użytkownik widzi pełne treści pytań i podpowiedzi, dzięki czemu nie musi pamiętać wcześniejszych instrukcji.
7. **Elastyczność i efektywność** – pamiętaj odpowiedzi w lokalnym stanie, aby użytkownik mógł w dowolnym momencie kontynuować ocenę bez utraty danych. W przyszłości można dodać skróty klawiaturowe do nawigacji.
8. **Estetyka i minimalizm** – unikaj zbędnych elementów. Pytania i podkategorie powinny być jasno odseparowane, a na stronie musi panować przejrzysty układ.
9. **Pomoc w rozpoznawaniu, diagnozowaniu i usuwaniu błędów** – komunikaty o błędach powinny wskazywać, które pola należy poprawić oraz jak to zrobić.
10. **Pomoc i dokumentacja** – udostępnij prosty przewodnik po aplikacji (np. sekcję „Pomoc” w menu), w którym opiszesz zasady wypełniania formularza i kontakt do administratora.

## Kolorystyka i typografia

- Utrzymuj spójne, kontrastowe kolory zgodne z paletą React Bootstrap (domyślnie `primary`, `secondary`, `success`, itp.).
- Stosuj czytelne kroje pisma zdefiniowane w stylach Bootstrap – nagłówki (`h1`, `h2`, itp.) i tekst standardowy (`p`).
- W miarę potrzeby definiuj własne zmienne kolorystyczne w arkuszach SCSS, aby zachować spójność wizualną całej aplikacji.

## Komponenty i układ

- Wykorzystuj `Container`, `Row` i `Col` do tworzenia elastycznych layoutów.
- Przyciski akcji (`Zapisz`, `Dalej`, `Wstecz`) umieszczaj w dolnej części strony, wyrównując je do prawej strony kontenera.
- Każda strona powinna mieć widoczny nagłówek z nazwą aktualnej kategorii oraz numeracją, np. „Krok 2 z 5 – Procesy wewnętrzne”.
- Dla list pytań stosuj komponent `Form` z `Form.Group` dla każdego zestawu radio buttons.

Wdrożenie powyższych zasad pozwoli stworzyć spójny i elegancki interfejs aplikacji spełniający heurystyki Nielsena i Molicha.

