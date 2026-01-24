import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { ReviewScreen } from '../ReviewScreen';


describe('ReviewScreen', () => {
    beforeAll(() => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation(query => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: vi.fn(), 
                removeListener: vi.fn(), 
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });
    });

  const mockPhotos = [
    'blob:photo1',
    'blob:photo2',
    'blob:photo3',
    'blob:photo4',
  ];
  const mockOnRetake = vi.fn();
  const mockOnSave = vi.fn();

  it('renders all photos', () => {
    // 4 photos fit in 'strip' layout
    const stripPhotos = mockPhotos.slice(0, 4);
    render(<ReviewScreen photos={stripPhotos} onRetake={mockOnRetake} initialLayout="grid" />);
    // With grid layout, default is 4 photos
    const images = screen.getAllByAltText(/Selected Photo/);
    expect(images).toHaveLength(4);
  });

  it('applies default filter (none)', () => {
    render(<ReviewScreen photos={mockPhotos} onRetake={mockOnRetake} initialLayout="strip" />);
    const images = screen.getAllByAltText(/Selected Photo/);
    images.forEach(img => {
      expect(img.className).toContain('filter-none');
    });
  });

  it('changes filter when button is clicked', () => {
    render(<ReviewScreen photos={mockPhotos} onRetake={mockOnRetake} initialLayout="strip" />);
    
    const sepiaBtn = screen.getByText('Sepia');
    fireEvent.click(sepiaBtn);

    const images = screen.getAllByAltText(/Selected Photo/);
    images.forEach(img => {
      expect(img.className).toContain('filter-sepia');
      expect(img.className).not.toContain('filter-none');
    });
  });

  it('calls onRetake when retake button is clicked', () => {
    render(<ReviewScreen photos={mockPhotos} onRetake={mockOnRetake} initialLayout="strip" />);
    
    const retakeBtn = screen.getByRole('button', { name: /retake/i });
    fireEvent.click(retakeBtn);

    expect(mockOnRetake).toHaveBeenCalled();
  });
});
