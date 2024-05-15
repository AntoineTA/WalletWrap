import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Settings from "./page"

describe('Profile Settings', () => {
  it('renders a card', () => {
    render(<Settings />)
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Manage your profile settings.')).toBeInTheDocument()
  })
  it('contains a username field', () => {
    render(<Settings />)
    expect(screen.getByText('Username')).toBeInTheDocument()
  })
})

describe.skip('Username settings field', () => {
  it('contains a button to edit the username', () => {
    render(<Settings />)
    expect(screen.getByText('Edit')).toBeInTheDocument()
  })
  it('toggles the edit mode when clicking the edit button', async () => {
    render(<Settings />)
    const editButton = screen.getByText('Edit')
    await userEvent.click(editButton)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})