import { render, screen } from "@testing-library/react"
import VerifyEmail from "./page"

describe('VerifyEmail', () => {
  it('renders a heading', () => {
    render(<VerifyEmail />)
    expect(screen.getByRole('heading', { level: 2, name: 'Email Confirmation' })).toBeInTheDocument()
  })
})