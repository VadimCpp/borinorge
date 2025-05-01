import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorMessage } from './error-weather';

describe('ErrorMessage', () => {
  const mockLabel = 'Try Again';
  const mockMessage = 'Failed to load weather data';
  const mockOnRetry = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the error message and label correctly', () => {
    render(
      <ErrorMessage
        label={mockLabel}
        message={mockMessage}
        onRetry={mockOnRetry}
      />
    );

    expect(screen.getByText(mockMessage)).toBeInTheDocument();
    expect(screen.getByText(mockLabel)).toBeInTheDocument();
  });

  it('calls onRetry when the retry button is clicked', () => {
    render(
      <ErrorMessage
        label={mockLabel}
        message={mockMessage}
        onRetry={mockOnRetry}
      />
    );

    const retryButton = screen.getByText(mockLabel);
    fireEvent.click(retryButton);

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('applies the correct CSS classes', () => {
    render(
      <ErrorMessage
        label={mockLabel}
        message={mockMessage}
        onRetry={mockOnRetry}
      />
    );

    const container = screen.getByText(mockMessage).parentElement;
    expect(container).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center', 'pt-24', 'px-6');

    const messageElement = screen.getByText(mockMessage);
    expect(messageElement).toHaveClass('text-red-700', 'pb-8');

    const buttonElement = screen.getByText(mockLabel);
    expect(buttonElement).toHaveClass('target-action__link');
  });
}); 