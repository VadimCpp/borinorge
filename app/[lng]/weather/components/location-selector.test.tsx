import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LocationSelector } from './location-selector';
import { type WeatherLocales } from './weather.types';

describe('LocationSelector Component', () => {
  // Mock props
  const mockLocales: WeatherLocales = {
    lang: 'en',
    feels_like: 'Feels like',
    precipitation: 'Precipitation',
    wind: 'Wind',
    locationErrors: {
      user_denied_the_request_for_geolocation: 'Location access denied',
      location_information_is_unavailable: 'Location unavailable',
      the_request_to_get_user_location_timed_out: 'Request timed out',
      browser_location_services_disabled: 'Location services disabled',
      browser_permissions_services_unavailable: 'Permission services unavailable',
      an_unknown_error_occurred: 'Unknown error'
    },
    try_again: 'Try again',
    manual_or_automatically: 'Choose location method',
    detect_my_location: 'Detect my location',
    enter_location_manually: 'Enter manually',
    enter_norwegian_address: 'Enter Norwegian address',
    manual_location_error: 'Location error'
  };

  const props = {
    onDetectLocation: jest.fn(),
    onManualLocation: jest.fn(),
    locales: mockLocales
  };

  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the component with all elements', () => {
      render(<LocationSelector {...props} />);
      
      // Check that the instruction message is displayed
      expect(screen.getByText(mockLocales.manual_or_automatically)).toBeInTheDocument();
      
      // Check that both buttons are rendered
      expect(screen.getByText(mockLocales.detect_my_location)).toBeInTheDocument();
      expect(screen.getByText(mockLocales.enter_location_manually)).toBeInTheDocument();
    });

    it('should apply appropriate styling to the container', () => {
      render(<LocationSelector {...props} />);
      
      // Find the main container and check its classes
      const container = screen.getByText(mockLocales.manual_or_automatically).closest('div');
      expect(container).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center');
    });

    it('should apply appropriate styling to the instruction text', () => {
      render(<LocationSelector {...props} />);
      
      const instructionText = screen.getByText(mockLocales.manual_or_automatically);
      expect(instructionText).toHaveClass('pb-8', 'text-center', 'text-gray-800');
    });
  });

  describe('Interactions', () => {
    it('should call onDetectLocation when the detect location button is clicked', () => {
      render(<LocationSelector {...props} />);
      
      const detectButton = screen.getByText(mockLocales.detect_my_location);
      fireEvent.click(detectButton);
      
      expect(props.onDetectLocation).toHaveBeenCalledTimes(1);
      expect(props.onManualLocation).not.toHaveBeenCalled();
    });

    it('should call onManualLocation when the manual location button is clicked', () => {
      render(<LocationSelector {...props} />);
      
      const manualButton = screen.getByText(mockLocales.enter_location_manually);
      fireEvent.click(manualButton);
      
      expect(props.onManualLocation).toHaveBeenCalledTimes(1);
      expect(props.onDetectLocation).not.toHaveBeenCalled();
    });
  });

  it('should have a responsive button layout', () => {
    render(<LocationSelector {...props} />);
    
    const buttonContainer = screen.getByText(mockLocales.detect_my_location).parentElement;
    expect(buttonContainer).toHaveClass('flex', 'flex-col', 'sm:flex-row', 'gap-4');
  });
}); 