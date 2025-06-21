import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect } from 'vitest'
import CategoryQuestionsForm from '../CategoryQuestionsForm'
import { CategoryGroup } from '../../types'

vi.mock('../../api/questions', () => ({
  getQuestions: vi.fn(() => Promise.resolve([
    { id: 1, description: 'Q1', detail: 'qd1', category_id: 1, subcategory_id: 10 },
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

  it('loads and displays subcategory and question descriptions', async () => {
    render(<CategoryQuestionsForm category={category} index={0} total={1} onSubmit={() => {}} />)

    // subcategory descriptions
    expect(await screen.findByText('subdesc1')).toBeInTheDocument()
    expect(await screen.findByText('subdesc2')).toBeInTheDocument()

    // question details
    expect(await screen.findByText('qd1')).toBeInTheDocument()
    expect(await screen.findByText('qd2')).toBeInTheDocument()
  })

  it('disables submit button until all questions answered', async () => {
    const submit = vi.fn()
    render(<CategoryQuestionsForm category={category} index={0} total={1} onSubmit={submit} />)
    const user = userEvent.setup()
    const button = await screen.findByRole('button', { name: /Zakończ/ })
    expect(button).toBeDisabled()
    const radios = await screen.findAllByRole('radio', { name: '1' })
    await user.click(radios[0])
    expect(button).toBeDisabled()
    await user.click(radios[1])
    expect(button).toBeEnabled()
    await user.click(button)
    expect(submit).toHaveBeenCalled()
  })
})
