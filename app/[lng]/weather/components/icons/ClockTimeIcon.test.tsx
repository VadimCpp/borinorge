import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ClockTimeIcon } from './ClockTimeIcon';

// Mock console.warn to avoid clutter in tests
const originalConsoleWarn = console.warn;
beforeAll(() => {
  console.warn = jest.fn();
});

afterAll(() => {
  console.warn = originalConsoleWarn;
});

describe('ClockTimeIcon Component', () => {
  it('should render without crashing', () => {
    const { container } = render(<ClockTimeIcon />);
    expect(container).toBeInTheDocument();
    expect(screen.getByTestId('clock-time-icon')).toBeInTheDocument();
  });

  it('should render with custom class', () => {
    const { container } = render(<ClockTimeIcon className="custom-class" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('custom-class');
  });

  it('should render hour and minute hands based on provided time string', () => {
    // Mock time to 10:30
    const { container } = render(<ClockTimeIcon time="10:30" />);
    
    const hourHand = screen.getByTestId('hour-hand');
    const minuteHand = screen.getByTestId('minute-hand');
    
    expect(hourHand).toBeInTheDocument();
    expect(minuteHand).toBeInTheDocument();
    
    // The exact coordinates depend on the calculations in the component, but we can verify
    // that coordinates are being set
    expect(hourHand).toHaveAttribute('x2');
    expect(hourHand).toHaveAttribute('y2');
    expect(minuteHand).toHaveAttribute('x2');
    expect(minuteHand).toHaveAttribute('y2');
  });

  it('should render hour and minute hands based on provided Date object', () => {
    const mockDate = new Date(2023, 0, 1, 15, 45); // Jan 1, 2023, 15:45
    render(<ClockTimeIcon time={mockDate} />);
    
    const hourHand = screen.getByTestId('hour-hand');
    const minuteHand = screen.getByTestId('minute-hand');
    
    expect(hourHand).toBeInTheDocument();
    expect(minuteHand).toBeInTheDocument();
  });

  it('should update hands for 12-hour format correctly', () => {
    // Test 12 PM (noon)
    const { rerender } = render(<ClockTimeIcon time="12:00" />);
    const hourHand12 = screen.getByTestId('hour-hand');
    
    // For noon, hour hand should point directly up (y2 should be less than 12)
    expect(parseFloat(hourHand12.getAttribute('y2') || '12')).toBeLessThan(12);
    
    // Test 00:00 (midnight)
    rerender(<ClockTimeIcon time="00:00" />);
    const hourHand0 = screen.getByTestId('hour-hand');
    
    // For midnight, hour hand should also point directly up
    expect(parseFloat(hourHand0.getAttribute('y2') || '12')).toBeLessThan(12);
  });

  describe('Edge cases', () => {
    it('should handle invalid time string format', () => {
      // Invalid format: not HH:MM
      render(<ClockTimeIcon time="invalid" />);
      expect(console.warn).toHaveBeenCalled();
      expect(screen.getByTestId('hour-hand')).toBeInTheDocument();
    });

    it('should handle time string with invalid hours', () => {
      render(<ClockTimeIcon time="25:30" />);
      expect(console.warn).toHaveBeenCalled();
      expect(screen.getByTestId('hour-hand')).toBeInTheDocument();
    });

    it('should handle time string with invalid minutes', () => {
      render(<ClockTimeIcon time="10:70" />);
      expect(console.warn).toHaveBeenCalled();
      expect(screen.getByTestId('hour-hand')).toBeInTheDocument();
    });

    it('should handle time string with non-numeric values', () => {
      render(<ClockTimeIcon time="ab:cd" />);
      expect(console.warn).toHaveBeenCalled();
      expect(screen.getByTestId('hour-hand')).toBeInTheDocument();
    });

    it('should handle correctly various hour positions', () => {
      // Test several hour positions to ensure the angles are calculated correctly
      const hourPositions = [
        { time: "03:00", expectedX: (x: number) => x > 12 }, // Right side
        { time: "06:00", expectedY: (y: number) => y > 12 }, // Bottom
        { time: "09:00", expectedX: (x: number) => x < 12 }  // Left side
      ];

      const { rerender } = render(<ClockTimeIcon time="12:00" />);
      
      for (const { time, expectedX, expectedY } of hourPositions) {
        rerender(<ClockTimeIcon time={time} />);
        const hourHand = screen.getByTestId('hour-hand');
        
        if (expectedX) {
          expect(expectedX(parseFloat(hourHand.getAttribute('x2') || '12'))).toBeTruthy();
        }
        
        if (expectedY) {
          expect(expectedY(parseFloat(hourHand.getAttribute('y2') || '12'))).toBeTruthy();
        }
      }
    });
  });
}); 