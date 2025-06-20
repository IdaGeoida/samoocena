All frontend components use React Bootstrap for styling.
Import `'bootstrap/dist/css/bootstrap.min.css'` in `frontend/src/main.tsx` and use `react-bootstrap` components such as `Form`, `Button`, and `Container` instead of raw HTML tags wherever possible.

Forms displaying questions should organise them by category. Only one category is shown per page and a progress bar indicates answered categories versus total.
Within each category, questions are grouped by subcategory. Subcategory name and description appear before its questions and should visually separate groups.
Every question consists of main text and an additional description displayed in smaller type.
Ratings are provided with radio buttons on a 1–5 scale plus a colour coded "N/A" option placed to the right of the scale.

IDs for questions are unique only in combination with their category and subcategory. Numbering of question IDs restarts within each subcategory, and numbering of subcategory IDs restarts within each category.
# Lessons from composite ID implementation
- Define composite primary keys for `subcategories` (category_id + id) and `questions` (category_id + subcategory_id + id).
- Lookup and update records using the full composite key to prevent duplicate key errors.
- Data seeding starts numbering subcategories at 1 for each category and questions at 1 for each subcategory.
