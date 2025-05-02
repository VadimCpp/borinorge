import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoadingIndicator } from './loading-indicator';

describe('LoadingIndicator Component', () => {
  // Test props
  const props = {
    label: 'Loading weather data...'
  };

  describe('Rendering', () => {
    it('should render the loading indicator with label', () => {
      render(<LoadingIndicator {...props} />);
      
      // Check that the label is displayed
      expect(screen.getByText(props.label)).toBeInTheDocument();
    });

    it('should have a spinning loader element', () => {
      render(<LoadingIndicator {...props} />);
      
      // Check for the spinner (div with animate-spin class)
      const spinnerElement = document.querySelector('.animate-spin');
      expect(spinnerElement).toBeInTheDocument();
    });

    it('should apply appropriate styling to the container', () => {
      const { container } = render(<LoadingIndicator {...props} />);
      
      // Get the main container div
      const mainDiv = container.querySelector('.flex.flex-col.items-center.justify-center');
      expect(mainDiv).toHaveClass('pt-24');
    });

    it('should style the label correctly', () => {
      const { container } = render(<LoadingIndicator {...props} />);
      
      // Find the div containing the text
      const labelDiv = container.querySelector('.mt-4.text-sm.text-gray-600');
      expect(labelDiv).toBeInTheDocument();
      expect(labelDiv).toHaveTextContent(props.label);
    });
  });
}); 