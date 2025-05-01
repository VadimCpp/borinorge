import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ManualLocation } from './manual-location';
import { type WeatherLocales } from './weather.types';

// Mock fetch
global.fetch = jest.fn();

describe('ManualLocation Component', () => {
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
    onLocationSelected: jest.fn(),
    locales: mockLocales
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset fetch mock
    (global.fetch as jest.Mock).mockReset();
  });

  describe('Rendering', () => {
    it('should render the input field with correct label', () => {
      render(<ManualLocation {...props} />);
      
      expect(screen.getByLabelText(`${mockLocales.enter_norwegian_address}:`)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('e.g. Storgata 10, Oslo')).toBeInTheDocument();
    });

    it('should not show error message initially', () => {
      render(<ManualLocation {...props} />);
      
      const errorElements = screen.queryByText(mockLocales.manual_location_error);
      expect(errorElements).not.toBeInTheDocument();
    });

    it('should not show suggestions list initially', () => {
      render(<ManualLocation {...props} />);
      
      const suggestionsList = screen.queryByRole('list');
      expect(suggestionsList).not.toBeInTheDocument();
    });
  });

  describe('Input behavior', () => {
    it('should update input value when typing', () => {
      render(<ManualLocation {...props} />);
      
      const inputEl = screen.getByPlaceholderText('e.g. Storgata 10, Oslo');
      fireEvent.change(inputEl, { target: { value: 'Oslo' } });
      
      expect(inputEl).toHaveValue('Oslo');
    });

    it('should trigger API call after typing debounce delay', async () => {
      // Mock successful response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { city: 'Oslo', fylke: 'Oslo', kommune: 'Oslo', lat: 59.9139, lng: 10.7522 }
        ]
      });

      jest.useFakeTimers();
      
      render(<ManualLocation {...props} />);
      
      const inputEl = screen.getByPlaceholderText('e.g. Storgata 10, Oslo');
      fireEvent.change(inputEl, { target: { value: 'Oslo' } });
      
      // Fast-forward timers
      jest.advanceTimersByTime(300);
      
      expect(global.fetch).toHaveBeenCalledWith('/api/geonorge/stedsnavn?q=Oslo');
      
      jest.useRealTimers();
    });

    it('should not trigger API call for short input (less than 4 characters)', async () => {
      render(<ManualLocation {...props} />);
      
      const inputEl = screen.getByPlaceholderText('e.g. Storgata 10, Oslo');
      fireEvent.change(inputEl, { target: { value: 'Osl' } });
      
      // Wait a bit to ensure no API call happens
      await new Promise(r => setTimeout(r, 400));
      
      expect(global.fetch).not.toHaveBeenCalled();
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('should clear suggestions when input is cleared', async () => {
      // First set up suggestions
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { city: 'Oslo', fylke: 'Oslo', kommune: 'Oslo', lat: 59.9139, lng: 10.7522 }
        ]
      });
      
      render(<ManualLocation {...props} />);
      
      const inputEl = screen.getByPlaceholderText('e.g. Storgata 10, Oslo');
      
      // Type something to trigger suggestions
      fireEvent.change(inputEl, { target: { value: 'Oslo' } });
      
      // Wait for suggestions to appear
      await waitFor(() => {
        expect(screen.getByText('Oslo, Oslo, Oslo')).toBeInTheDocument();
      });
      
      // Now clear the input
      fireEvent.change(inputEl, { target: { value: '' } });
      
      // Suggestions should disappear
      await waitFor(() => {
        expect(screen.queryByRole('list')).not.toBeInTheDocument();
      });
    });
  });

  describe('API interaction', () => {
    it('should show suggestions when API returns results', async () => {
      // Mock successful response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { city: 'Oslo', fylke: 'Oslo', kommune: 'Oslo', lat: 59.9139, lng: 10.7522 }
        ]
      });
      
      render(<ManualLocation {...props} />);
      
      const inputEl = screen.getByPlaceholderText('e.g. Storgata 10, Oslo');
      fireEvent.change(inputEl, { target: { value: 'Oslo' } });
      
      // Wait for suggestions to appear
      await waitFor(() => {
        expect(screen.getByText('Oslo, Oslo, Oslo')).toBeInTheDocument();
      });
    });

    it('should show error message when API call fails', async () => {
      // Mock error response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Server Error'
      });
      
      render(<ManualLocation {...props} />);
      
      const inputEl = screen.getByPlaceholderText('e.g. Storgata 10, Oslo');
      fireEvent.change(inputEl, { target: { value: 'Invalid Location' } });
      
      // Wait for error message to appear
      await waitFor(() => {
        expect(screen.getByText(mockLocales.manual_location_error)).toBeInTheDocument();
      });
    });
  });

  describe('Suggestion selection', () => {
    it('should call onLocationSelected when a suggestion is clicked', async () => {
      const suggestion = { 
        city: 'Oslo', 
        fylke: 'Oslo', 
        kommune: 'Oslo', 
        lat: 59.9139, 
        lng: 10.7522 
      };
      
      // Mock successful response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [suggestion]
      });
      
      render(<ManualLocation {...props} />);
      
      const inputEl = screen.getByPlaceholderText('e.g. Storgata 10, Oslo');
      fireEvent.change(inputEl, { target: { value: 'Oslo' } });
      
      // Wait for suggestions to appear and click on one
      await waitFor(() => {
        const suggestionEl = screen.getByText('Oslo, Oslo, Oslo');
        fireEvent.click(suggestionEl);
      });
      
      expect(props.onLocationSelected).toHaveBeenCalledWith(
        suggestion.lat, 
        suggestion.lng, 
        suggestion.city
      );
    });

    it('should update input value with the selected location', async () => {
      const suggestion = { 
        city: 'Oslo', 
        fylke: 'Oslo', 
        kommune: 'Oslo', 
        lat: 59.9139, 
        lng: 10.7522 
      };
      
      // Mock successful response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [suggestion]
      });
      
      render(<ManualLocation {...props} />);
      
      const inputEl = screen.getByPlaceholderText('e.g. Storgata 10, Oslo');
      fireEvent.change(inputEl, { target: { value: 'Oslo' } });
      
      // Wait for suggestions to appear and click on one
      await waitFor(() => {
        const suggestionEl = screen.getByText('Oslo, Oslo, Oslo');
        fireEvent.click(suggestionEl);
      });
      
      expect(inputEl).toHaveValue('Oslo, Oslo');
    });
  });

  describe('Suggestion selection with null coordinates', () => {
    it('should not call onLocationSelected when suggestion has null coordinates', async () => {
      const suggestion = { 
        city: 'Invalid Location', 
        fylke: 'Unknown', 
        kommune: 'Unknown', 
        lat: null, 
        lng: null 
      };
      
      // Mock successful response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [suggestion]
      });
      
      render(<ManualLocation {...props} />);
      
      const inputEl = screen.getByPlaceholderText('e.g. Storgata 10, Oslo');
      fireEvent.change(inputEl, { target: { value: 'Invalid' } });
      
      // Wait for suggestions to appear and click on one
      await waitFor(() => {
        const suggestionEl = screen.getByText('Invalid Location, Unknown, Unknown');
        fireEvent.click(suggestionEl);
      });
      
      // onLocationSelected should not be called due to null coordinates
      expect(props.onLocationSelected).not.toHaveBeenCalled();
      expect(inputEl).toHaveValue('Invalid Location, Unknown');
    });
  });
}); 