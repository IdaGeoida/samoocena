All frontend components use React Bootstrap for styling.
Import `'bootstrap/dist/css/bootstrap.min.css'` in `frontend/src/main.tsx` and use `react-bootstrap` components such as `Form`, `Button`, and `Container` instead of raw HTML tags wherever possible.

Frontend guidelines for the question flow:
- Questions are grouped first by category and then by subcategory.
- Each category is shown on its own page with a progress bar indicating how many categories have been completed.
- Subcategories display their name and description before the related questions and are visually separated using React Bootstrap components such as `Card` or `ListGroup`.
- Each question shows a description and optional details. Answers are collected on a 1–5 radio-button scale with a colour coded „Nie dotyczy” option.
