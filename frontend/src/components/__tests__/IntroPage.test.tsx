import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import IntroPage from '../IntroPage'

describe('IntroPage', () => {
  it('calls onStart when button clicked', async () => {
    const start = vi.fn()
    render(<IntroPage onStart={start} />)
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /Rozpocznij/ }))
    expect(start).toHaveBeenCalled()
  })
})
