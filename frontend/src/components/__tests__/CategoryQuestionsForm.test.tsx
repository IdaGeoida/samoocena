import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect } from 'vitest'
import CategoryQuestionsForm from '../CategoryQuestionsForm'
import { CategoryGroup } from '../../types'

vi.mock('../../api/questions', () => ({
  getQuestions: vi.fn(() => Promise.resolve([
    {
      id: 1,
      description: 'Q1',
      detail: 'qd1',
      category_id: 1,
      subcategory_id: 10,
      scale_min_text: 'min',
      scale_max_text: 'max',
    },
    { id: 2, description: 'Q2', detail: 'qd2', category_id: 1, subcategory_id: 20 },
  ]))
}))

vi.mock('../../api/subcategories', () => ({
  getSubcategories: vi.fn(() => Promise.resolve([
    { id: 10, name: 'Sub1', description: 'subdesc1', category_id: 1 },
    { id: 20, name: 'Sub2', description: 'subdesc2', category_id: 1 },
  ]))
}))

describe('CategoryQuestionsForm', () => {
  const category: CategoryGroup = { id: 1, name: 'Cat', ids: [1] }

  it('shows one subcategory at a time and allows navigation', async () => {
    render(<CategoryQuestionsForm category={category} index={0} total={1} onSubmit={() => {}} />)
    const user = userEvent.setup()

    // only first subcategory visible
    expect(await screen.findByText('subdesc1')).toBeInTheDocument()
    expect(screen.queryByText('subdesc2')).toBeNull()

    // answer first subcategory and go next
    const radios = await screen.findAllByRole('radio', { name: '1' })
    await user.click(radios[0])
    await user.click(screen.getByRole('button', { name: /Dalej/ }))

    // second subcategory now visible
    expect(await screen.findByText('subdesc2')).toBeInTheDocument()
  })

  it('shows scale labels below 1 and 5', async () => {
    render(<CategoryQuestionsForm category={category} index={0} total={1} onSubmit={() => {}} />)
    expect(await screen.findByText('min')).toBeInTheDocument()
    expect(screen.getByText('max')).toBeInTheDocument()
  })

  it('disables submit button until questions in each subcategory answered', async () => {
    const submit = vi.fn()
    render(<CategoryQuestionsForm category={category} index={0} total={1} onSubmit={submit} />)
    const user = userEvent.setup()

    // first subcategory
    const next = await screen.findByRole('button', { name: /Dalej/ })
    expect(next).toBeDisabled()
    let radios = await screen.findAllByRole('radio', { name: '1' })
    await user.click(radios[0])
    expect(next).toBeEnabled()
    await user.click(next)

    // second subcategory
    const finish = await screen.findByRole('button', { name: /Zakończ/ })
    expect(finish).toBeDisabled()
    radios = await screen.findAllByRole('radio', { name: '1' })
    await user.click(radios[0])
    expect(finish).toBeEnabled()
    await user.click(finish)
    expect(submit).toHaveBeenCalled()
  })
})
