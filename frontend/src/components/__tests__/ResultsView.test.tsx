import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect } from 'vitest'
import ResultsView from '../ResultsView'
import { CategoryGroup, Score } from '../../types'

vi.mock('../../api/subcategories', () => ({
  getSubcategories: vi.fn(() => Promise.resolve([
    { id: 1, name: 'Sub1', category_id: 1 },
    { id: 1, name: 'Sub2', category_id: 2 },
  ]))
}))

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
  it('shows scores with /5.0 suffix', async () => {
    render(<ResultsView results={results} categories={[categories[0]]} onImprove={() => {}} />)
    expect(await screen.findByText('4/5.0')).toBeInTheDocument()
  })

  it('allows opening multiple categories', async () => {
    render(<ResultsView results={results} categories={categories} onImprove={() => {}} />)
    const user = userEvent.setup()
    await user.click(await screen.findByRole('button', { name: /Cat1/ }))
    await user.click(await screen.findByRole('button', { name: /Cat2/ }))
    expect(await screen.findByText('Q1')).toBeVisible()
    expect(await screen.findByText('Q2')).toBeVisible()
  })

  it('shows subcategory averages', async () => {
    render(<ResultsView results={results} categories={[categories[0]]} onImprove={() => {}} />)
    await userEvent.setup().click(await screen.findByRole('button', { name: /Cat1/ }))
    expect(await screen.findByText(/Sub1/)).toBeInTheDocument()
    expect((await screen.findAllByText('4.00/5.0')).length).toBeGreaterThan(0)
  })

  it('displays explanation section with highlighted levels', async () => {
    render(<ResultsView results={results} categories={[categories[0]]} onImprove={() => {}} />)
    expect(await screen.findByRole('heading', { name: /Co oznacza mój wynik\?/ })).toBeInTheDocument()
    const lvl3 = screen.getByText(/Poziom 3/)
    const lvl4 = screen.getByText(/Poziom 4/)
    expect(lvl3.closest('.list-group-item')).toHaveClass('list-group-item-info')
    expect(lvl4.closest('.list-group-item')).toHaveClass('list-group-item-info')
  })

  it('calls onImprove when button clicked', async () => {
    const fn = vi.fn()
    render(<ResultsView results={results} categories={[categories[0]]} onImprove={fn} />)
    const user = userEvent.setup()
    await user.click(await screen.findByRole('button', { name: /Usprawnij procesy/ }))
    expect(fn).toHaveBeenCalled()
  })
})
