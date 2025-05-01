import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorLocation } from './error-location';

describe('ErrorLocation Component', () => {
  // Common setup
  const props = {
    labelTryAgain: 'Retry Location',
    labelManualInput: 'Manual Location',
    message: 'Location access denied',
    onRetry: jest.fn(),
    onManualLocation: jest.fn()
  };

  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the component with all elements', () => {
      render(<ErrorLocation {...props} />);
      
      // Check that the error message is displayed
      expect(screen.getByText(props.message)).toBeInTheDocument();
      
      // Check that both buttons are rendered
      const retryButton = screen.getByText(props.labelTryAgain);
      const manualButton = screen.getByText(props.labelManualInput);
      
      expect(retryButton).toBeInTheDocument();
      expect(manualButton).toBeInTheDocument();
    });

    it('should apply appropriate styling to the container', () => {
      render(<ErrorLocation {...props} />);
      
      // Find the main container and check its classes
      const container = screen.getByText(props.message).closest('div');
      expect(container).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center');
    });

    it('should display the error message with correct styling', () => {
      render(<ErrorLocation {...props} />);
      
      const errorMessage = screen.getByText(props.message);
      expect(errorMessage).toHaveClass('text-red-700');
    });
  });

  describe('Interactions', () => {
    it('should call onRetry when clicking the retry button', () => {
      render(<ErrorLocation {...props} />);
      
      // Find and click the retry button
      const retryButton = screen.getByText(props.labelTryAgain);
      fireEvent.click(retryButton);
      
      // Verify the onRetry callback was called
      expect(props.onRetry).toHaveBeenCalledTimes(1);
      expect(props.onManualLocation).not.toHaveBeenCalled();
    });

    it('should call onManualLocation when clicking the manual location button', () => {
      render(<ErrorLocation {...props} />);
      
      // Find and click the manual location button
      const manualButton = screen.getByText(props.labelManualInput);
      fireEvent.click(manualButton);
      
      // Verify the onManualLocation callback was called
      expect(props.onManualLocation).toHaveBeenCalledTimes(1);
      expect(props.onRetry).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility and layout', () => {
    it('should have buttons with appropriate roles', () => {
      render(<ErrorLocation {...props} />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
    });

    it('should have a responsive button layout', () => {
      render(<ErrorLocation {...props} />);
      
      const buttonContainer = screen.getByText(props.labelTryAgain).parentElement;
      expect(buttonContainer).toHaveClass('flex', 'flex-col', 'sm:flex-row');
    });
  });
}); 