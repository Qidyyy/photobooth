import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UploadScreen } from '../UploadScreen';

describe('UploadScreen', () => {
    const mockOnUpload = vi.fn();
    const mockOnCancel = vi.fn();

    beforeEach(() => {
        mockOnUpload.mockClear();
        mockOnCancel.mockClear();
    });

    it('renders correctly', () => {
        render(<UploadScreen onUploadComplete={mockOnUpload} onCancel={mockOnCancel} />);
        // Header text changed
        expect(screen.getByText('⤷ ゛𝓊𝓅𝓁𝑜𝒶𝒹 𝓅𝒽𝑜𝓉𝑜𝓈 ˎˊ˗')).toBeDefined(); 
        // Label text changed
        expect(screen.getByText('🖱️: ̗̀➛ 𝕔𝕝𝕚𝕔𝕜 𝕥𝕠 𝕤𝕖𝕝𝕖𝕔𝕥')).toBeDefined();
    });

    it('shows error if wrong number of files selected', async () => {
        render(<UploadScreen onUploadComplete={mockOnUpload} onCancel={mockOnCancel} />);
        
        // Find input by label text 
        // We need to use the exact fancy text because regex /click/ won't match fancy unicode chars
        // The input is hidden but associated with the label.
        // We can just query the DOM for the input directly since we used getElementById below anyway.
        
        const input = document.getElementById('photo-upload') as HTMLInputElement;
        const file = new File(['dummy'], 'test.png', { type: 'image/png' });
        
        fireEvent.change(input, { target: { files: [file, file] } }); // Only 2 files

        await waitFor(() => {
            expect(screen.getByText('Please select exactly 4 photos.')).toBeDefined();
        });
        expect(mockOnUpload).not.toHaveBeenCalled();
    });

    it('calls onCancel when Back button is clicked', () => {
        render(<UploadScreen onUploadComplete={mockOnUpload} onCancel={mockOnCancel} />);
        
        const backBtn = screen.getByRole('button', { name: /back/i });
        fireEvent.click(backBtn);
        expect(mockOnCancel).toHaveBeenCalled();
    });
});
