import { render, screen, fireEvent } from '@testing-library/react'
import { StartScreen } from '../StartScreen'
import { describe, it, expect, vi } from 'vitest'

describe('StartScreen', () => {
  it('renders correctly', () => {
    const onUseCamera = vi.fn()
    const onUpload = vi.fn()
    render(<StartScreen onUseCamera={onUseCamera} onUpload={onUpload} />)

    expect(screen.getByText('Photobooth')).toBeInTheDocument()
    expect(screen.getByText('Capture your moment in time')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /use camera/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /upload photos/i })).toBeInTheDocument()
  })

  it('calls correct handlers when buttons are clicked', () => {
    const onUseCamera = vi.fn()
    const onUpload = vi.fn()
    render(<StartScreen onUseCamera={onUseCamera} onUpload={onUpload} />)

    fireEvent.click(screen.getByRole('button', { name: /use camera/i }))
    expect(onUseCamera).toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: /upload photos/i }))
    expect(onUpload).toHaveBeenCalled()
  })
})
