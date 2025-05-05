import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ClockTimeIcon } from './ClockTimeIcon';

describe('ClockTimeIcon Component', () => {
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

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

  it('should render only the clock face circle without time markers', () => {
    const { container } = render(<ClockTimeIcon />);
    
    // There should be only one clock face circle and one center dot
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(2); // One for clock face, one for center dot
    
    // Check that there are no tick lines
    const allLines = container.querySelectorAll('line');
    // Should only have two lines - hour and minute hands
    expect(allLines.length).toBe(2);
    
    const hourHand = screen.getByTestId('hour-hand');
    const minuteHand = screen.getByTestId('minute-hand');
    
    // Verify the lines have correct attributes for hands, not ticks
    expect(hourHand).toHaveAttribute('x1', '12');
    expect(hourHand).toHaveAttribute('y1', '12');
    expect(minuteHand).toHaveAttribute('x1', '12');
    expect(minuteHand).toHaveAttribute('y1', '12');
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

  it('should have shortened hour hand', () => {
    // At 3:00, hour hand should point to the right (x2 > 12)
    const { container } = render(<ClockTimeIcon time="03:00" />);
    
    const hourHand = screen.getByTestId('hour-hand');
    const hourX2 = parseFloat(hourHand.getAttribute('x2') || '12');
    
    // The hour hand should be shortened (length = 4)
    // When pointing right, x2 should be around 16 (12 + 4)
    expect(hourX2).toBeGreaterThan(12);
    expect(hourX2).toBeLessThanOrEqual(16.1); // Allow small tolerance for calculation precision
  });
  
  it('should have minute hand with gap from edge', () => {
    // At 6:00, minute hand should point down (y2 > 12)
    render(<ClockTimeIcon time="06:00" />);
    
    const minuteHand = screen.getByTestId('minute-hand');
    const minuteY2 = parseFloat(minuteHand.getAttribute('y2') || '12');
    
    // The minute hand should be shorter than the circle radius (length = 6.5, circle radius = 9)
    // When checking y2 value, consider that the hand starts from center (12)
    // and length 6.5 will give max value around 18.5
    expect(minuteY2).toBeGreaterThan(5); // Check that hand is not too short
    expect(minuteY2).toBeLessThanOrEqual(18.6); // Max is 12 + 6.5 + small tolerance
  });

  describe('Edge cases', () => {
    it('should handle invalid time string format', () => {
      consoleWarnSpy.mockClear(); // Clear previous calls
      
      // Invalid format: not HH:MM
      render(<ClockTimeIcon time="invalid" />);
      
      expect(consoleWarnSpy).toHaveBeenCalledWith('Invalid time format for ClockTimeIcon, using current time');
      expect(screen.getByTestId('hour-hand')).toBeInTheDocument();
    });

    it('should handle time string with invalid hours', () => {
      consoleWarnSpy.mockClear(); // Clear previous calls
      
      render(<ClockTimeIcon time="25:30" />);
      
      expect(consoleWarnSpy).toHaveBeenCalledWith('Invalid time format for ClockTimeIcon, using current time');
      expect(screen.getByTestId('hour-hand')).toBeInTheDocument();
    });

    it('should handle time string with invalid minutes', () => {
      consoleWarnSpy.mockClear(); // Clear previous calls
      
      render(<ClockTimeIcon time="10:70" />);
      
      expect(consoleWarnSpy).toHaveBeenCalledWith('Invalid time format for ClockTimeIcon, using current time');
      expect(screen.getByTestId('hour-hand')).toBeInTheDocument();
    });

    it('should handle time string with non-numeric values', () => {
      consoleWarnSpy.mockClear(); // Clear previous calls
      
      render(<ClockTimeIcon time="ab:cd" />);
      
      expect(consoleWarnSpy).toHaveBeenCalledWith('Invalid time format for ClockTimeIcon, using current time');
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

    it('should handle time string that causes an exception during parsing', () => {
      consoleWarnSpy.mockClear(); // Clear previous calls
      
      // Create an object that will throw an error when split is called
      const badTimeObject = {
        toString: () => { throw new Error('Test error'); },
        valueOf: () => { throw new Error('Test error'); }
      };
      
      // @ts-ignore - intentionally passing wrong type to test exception handling
      render(<ClockTimeIcon time={badTimeObject} />);
      
      expect(consoleWarnSpy).toHaveBeenCalledWith('Invalid time format for ClockTimeIcon, using current time');
      expect(screen.getByTestId('hour-hand')).toBeInTheDocument();
    });
  });
}); 