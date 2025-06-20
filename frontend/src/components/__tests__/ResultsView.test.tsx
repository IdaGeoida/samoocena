import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ResultsView from '../ResultsView'
import { CategoryGroup, Score } from '../../types'

const categories: CategoryGroup[] = [
  { id: 1, name: 'Cat1', ids: [1] },
  { id: 2, name: 'Cat2', ids: [2] }
]

const questions = [
  { id: 1, description: 'Q1', category_id: 1, subcategory_id: 1 },
  { id: 2, description: 'Q2', category_id: 2, subcategory_id: 1 }
]

const results: Score[] = [
  { question: questions[0], value: 4 },
  { question: questions[1], value: 3 }
]

describe('ResultsView', () => {
  it('shows scores with /5.0 suffix', () => {
    render(<ResultsView results={results} categories={[categories[0]]} />)
    expect(screen.getByText('4/5.0')).toBeInTheDocument()
  })

  it('allows opening multiple categories', async () => {
    render(<ResultsView results={results} categories={categories} />)
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /Cat1/ }))
    await user.click(screen.getByRole('button', { name: /Cat2/ }))
    expect(screen.getByText('Q1')).toBeVisible()
    expect(screen.getByText('Q2')).toBeVisible()
  })
})
