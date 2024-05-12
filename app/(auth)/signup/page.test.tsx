import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Signup from "./page"

const user = userEvent.setup()

describe('Signup', () => {
  it('renders a signup card', () => {
    render(<Signup />)
    expect(screen.getByTestId('signup-card')).toBeInTheDocument()
  })
  it('contains a link to log in', () => {
    render(<Signup />)
    const link = screen.getByText('Log in')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/login')
  })
})

describe('Signup', () => {
  it('renders a form', () => {
    render(<Signup />)
    expect(screen.getByRole('form')).toBeInTheDocument()
  })
  it('contains an email field', () => {
    render(<Signup />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })
  it('contains a password field', () => {
    render(<Signup />)
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })
  it('contains a submit button', () => {
    render(<Signup />)
    expect(screen.getByRole('button', { name: 'Create an account' })).toBeInTheDocument()
  })
  it('displays a message if the email is invalid', async () => {
    render(<Signup />)
    const emailInput = screen.getByLabelText('Email')
    await user.type(emailInput, 'invalid-email')
    await userEvent.tab()
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument()
  })
  it('displays a message if the password is too short', async () => {
    render(<Signup />)
    const passwordInput = screen.getByLabelText('Password')
    await user.type(passwordInput, 'short')
    await userEvent.tab()
    expect(screen.getByText('Password must be at least 8 characters long.')).toBeInTheDocument()
  })
})