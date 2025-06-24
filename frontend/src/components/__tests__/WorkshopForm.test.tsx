import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import WorkshopForm from '../WorkshopForm'

describe('WorkshopForm', () => {
  it('submits entered values', async () => {
    const submit = vi.fn()
    render(<WorkshopForm onSubmit={submit} />)
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/Obszar działania/), 'IT')
    await user.type(screen.getByLabelText(/Budżet/), '5000')
    await user.type(screen.getByLabelText(/Czas zespołu/), '10')
    await user.type(screen.getByLabelText(/Liczba uczestników/), '5')

    await user.click(screen.getByRole('button', { name: /Dalej/ }))
    expect(submit).toHaveBeenCalledWith({
      area: 'IT',
      budget: '5000',
      hours: '10',
      participants: '5',
    })
  })
})
