import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect } from 'vitest'
import ProcessImprovement from '../ProcessImprovement'
import { CategoryGroup, Score } from '../../types'

vi.mock('../../api/subcategories', () => ({
  getSubcategories: vi.fn(() => Promise.resolve([
    { id: 1, name: 'Sub1', category_id: 1 }
  ]))
}))

const category: CategoryGroup = { id: 1, name: 'Cat1', ids: [1] }
const question = { id: 1, description: 'Proc1', category_id: 1, subcategory_id: 1 }
const results: Score[] = [{ question, value: 4 }]

describe('ProcessImprovement', () => {
  it('handles hierarchical selection and summary', async () => {
    render(
      <ProcessImprovement
        onBack={() => {}}
        results={results}
        categories={[category]}
      />
    )
    const user = userEvent.setup()
    const catCheck = await screen.findByRole('checkbox', { name: /Cat1/ })
    const subCheck = screen.getByRole('checkbox', { name: /Sub1/ })
    await user.click(catCheck)
    expect(subCheck).toBeDisabled()
    await user.click(catCheck)
    await user.click(subCheck)
    expect(screen.getByText(/Podkategoria Sub1/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Generuj/ }))
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(textarea.value).toContain('1 Podkategoria Sub1')
  })
})
