import React from 'react'
import { render, screen } from '@testing-library/react'
import ArticleImage from './ArticleImage'

describe('ArticleImage', () => {
  it('renders with alt taken from src', () => {
    render(<ArticleImage src="test.jpg" />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'test.jpg')
    expect(img).toHaveAttribute('alt', 'test')
  })

  it('renders with custom alt text', () => {
    render(<ArticleImage src="test.jpg" alt="custom alt text" />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('alt', 'custom alt text')
  })

  it('renders with custom class name', () => {
    render(<ArticleImage src="test.jpg" className="custom-class" />)
    const img = screen.getByRole('img')
    expect(img).toHaveClass('custom-class')
  })

  it('generates alt text from filename with multiple words', () => {
    render(<ArticleImage src="test-image.jpg" />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('alt', 'test image')
  })

  it('generates alt text from filename in subdirectory', () => {
    render(<ArticleImage src="path/source/images/test.jpg" />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('alt', 'test')
  })

  it('generates alt text from filename in subdirectory even if it starts with slash', () => {
    render(<ArticleImage src="/path/source/images/test.jpg" />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('alt', 'test')
  })
})
