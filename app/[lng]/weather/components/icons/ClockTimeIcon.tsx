import React from 'react';

interface ClockTimeIconProps {
  /** Time string in format 'HH:MM' or Date object */
  time?: string | Date;
  /** CSS classes to apply to the SVG */
  className?: string;
}

/**
 * ClockTimeIcon component that displays a clock with hands showing the actual time
 * based on the provided time string or current time if not provided.
 */
export const ClockTimeIcon: React.FC<ClockTimeIconProps> = ({ time, className = 'w-6 h-6' }) => {
  // Parse the time or use current time
  const timeObj = React.useMemo(() => {
    if (!time) return new Date();
    if (time instanceof Date) return time;
    
    // Parse time string in format "HH:MM"
    try {
      const parts = time.split(':');
      if (parts.length !== 2) return new Date(); // Invalid format, use current time
      
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      
      // Validate hours and minutes
      if (isNaN(hours) || isNaN(minutes) || 
          hours < 0 || hours > 23 || 
          minutes < 0 || minutes > 59) {
        return new Date(); // Invalid values, use current time
      }
      
      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes);
      return date;
    } catch (error) {
      // Any parsing error, return current time
      console.warn('Invalid time format for ClockTimeIcon, using current time');
      return new Date();
    }
  }, [time]);
  
  // Calculate hour and minute hand positions
  const hourAngle = React.useMemo(() => {
    const hours = timeObj.getHours() % 12;
    const minutes = timeObj.getMinutes();
    // Each hour is 30 degrees, plus a small adjustment for minutes
    return (hours * 30) + (minutes * 0.5);
  }, [timeObj]);
  
  const minuteAngle = React.useMemo(() => {
    // Each minute is 6 degrees
    return timeObj.getMinutes() * 6;
  }, [timeObj]);
  
  // Calculate coordinates for hour hand (shorter)
  const hourHandCoords = React.useMemo(() => {
    const length = 5; // Shorter than minute hand
    const angle = hourAngle * Math.PI / 180;
    return {
      x2: 12 + length * Math.sin(angle),
      y2: 12 - length * Math.cos(angle)
    };
  }, [hourAngle]);
  
  // Calculate coordinates for minute hand (longer)
  const minuteHandCoords = React.useMemo(() => {
    const length = 7; // Longer than hour hand
    const angle = minuteAngle * Math.PI / 180;
    return {
      x2: 12 + length * Math.sin(angle),
      y2: 12 - length * Math.cos(angle)
    };
  }, [minuteAngle]);
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      data-testid="clock-time-icon"
    >
      {/* Clock face */}
      <circle cx="12" cy="12" r="9" />
      
      {/* Time markers (optional) */}
      <line x1="12" y1="3" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="21" />
      <line x1="3" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="21" y2="12" />
      
      {/* Hour hand */}
      <line
        x1="12" 
        y1="12" 
        x2={hourHandCoords.x2} 
        y2={hourHandCoords.y2} 
        strokeWidth="2"
        data-testid="hour-hand"
      />
      
      {/* Minute hand */}
      <line 
        x1="12" 
        y1="12" 
        x2={minuteHandCoords.x2} 
        y2={minuteHandCoords.y2}
        data-testid="minute-hand"
      />
      
      {/* Center dot */}
      <circle cx="12" cy="12" r="0.5" fill="currentColor" />
    </svg>
  );
};

export default ClockTimeIcon; 