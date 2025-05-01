import { renderHook, act, waitFor } from '@testing-library/react';
import { useGeolocation } from './useGeolocation';
import Cookies from 'js-cookie';

// Mock Cookies
jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn()
}));

// Mock fetch
global.fetch = jest.fn();

describe('useGeolocation Hook', () => {
  // Mock navigator.geolocation
  const mockGeolocation = {
    getCurrentPosition: jest.fn(),
    watchPosition: jest.fn(),
    clearWatch: jest.fn()
  };

  // Mock navigator.permissions
  const mockPermissions = {
    query: jest.fn()
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup navigator mocks
    Object.defineProperty(global.navigator, 'geolocation', {
      value: mockGeolocation,
      configurable: true
    });
    
    Object.defineProperty(global.navigator, 'permissions', {
      value: mockPermissions,
      configurable: true
    });
    
    // Mock permissions query result
    mockPermissions.query.mockResolvedValue({ state: 'granted' });
    
    // Mock console.log to avoid noise in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useGeolocation());
    
    expect(result.current.latitude).toBeNull();
    expect(result.current.longitude).toBeNull();
    expect(result.current.city).toBeNull();
    expect(result.current.geoError).toBeNull();
    expect(result.current.isLoadingPosition).toBe(true);
    expect(typeof result.current.getCurrentPosition).toBe('function');
    expect(typeof result.current.resetLocation).toBe('function');
    expect(typeof result.current.setGeolocationAndCity).toBe('function');
  });

  it('should use cached location from cookies if available', async () => {
    // Mock cookies to return cached location
    (Cookies.get as jest.Mock).mockImplementation((key) => {
      if (key === 'geo_lat') return '59.9139';
      if (key === 'geo_lng') return '10.7522';
      if (key === 'city') return 'Oslo';
      return null;
    });
    
    const { result } = renderHook(() => useGeolocation());
    
    // Wait for changes to be applied
    await waitFor(() => {
      expect(result.current.latitude).toBe(59.9139);
    });
    
    expect(result.current.longitude).toBe(10.7522);
    expect(result.current.city).toBe('Oslo');
    expect(result.current.isLoadingPosition).toBe(false);
    expect(mockGeolocation.getCurrentPosition).not.toHaveBeenCalled();
  });

  it('should get current position when no cached location exists', async () => {
    // Mock empty cookies
    (Cookies.get as jest.Mock).mockReturnValue(null);
    
    // Mock successful geolocation
    const mockPosition = {
      coords: {
        latitude: 59.9139,
        longitude: 10.7522,
        accuracy: 100
      }
    };
    
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(mockPosition);
    });
    
    // Mock successful city fetch
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({ city: 'Oslo' })
    });
    
    const { result } = renderHook(() => useGeolocation());
    
    // Wait for position and city to be set
    await waitFor(() => {
      expect(result.current.latitude).toBe(59.9139);
      expect(result.current.city).toBe('Oslo');
    });
    
    expect(result.current.longitude).toBe(10.7522);
    expect(result.current.accuracy).toBe(100);
    expect(result.current.isLoadingPosition).toBe(false);
    
    // Check if cookies were set
    expect(Cookies.set).toHaveBeenCalledWith('geo_lat', '59.9139', { expires: 7 });
    expect(Cookies.set).toHaveBeenCalledWith('geo_lng', '10.7522', { expires: 7 });
    expect(Cookies.set).toHaveBeenCalledWith('city', 'Oslo', { expires: 7 });
  });

  it('should handle geolocation errors', async () => {
    // Mock empty cookies
    (Cookies.get as jest.Mock).mockReturnValue(null);
    
    // Mock geolocation error
    const mockError = {
      code: 1, // PERMISSION_DENIED
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3
    };
    
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error(mockError);
    });
    
    const { result } = renderHook(() => useGeolocation());
    
    // Wait for error to be set
    await waitFor(() => {
      expect(result.current.geoError).toBe('user_denied_the_request_for_geolocation');
    });
    
    expect(result.current.isLoadingPosition).toBe(false);
  });

  it('should handle city fetch errors', async () => {
    // Mock empty cookies
    (Cookies.get as jest.Mock).mockReturnValue(null);
    
    // Mock successful geolocation but failed city fetch
    const mockPosition = {
      coords: {
        latitude: 59.9139,
        longitude: 10.7522,
        accuracy: 100
      }
    };
    
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(mockPosition);
    });
    
    // Mock failed city fetch
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Failed to fetch city'));
    
    const { result } = renderHook(() => useGeolocation());
    
    // Wait for position to be set but city should remain null
    await waitFor(() => {
      expect(result.current.latitude).toBe(59.9139);
    });
    
    expect(result.current.longitude).toBe(10.7522);
    expect(result.current.city).toBeNull();
    expect(result.current.isLoadingPosition).toBe(false);
    
    // City cookie should not be set
    expect(Cookies.set).not.toHaveBeenCalledWith('city', expect.any(String), expect.any(Object));
  });

  it('should handle different types of geolocation errors', async () => {
    // Test different error codes
    const errorCases = [
      {
        code: 2, // POSITION_UNAVAILABLE
        expected: 'location_information_is_unavailable'
      },
      {
        code: 3, // TIMEOUT
        expected: 'the_request_to_get_user_location_timed_out'
      },
      {
        code: 101, // Custom code for browser location services disabled
        expected: 'browser_location_services_disabled'
      },
      {
        code: 102, // Custom code for browser permissions services unavailable
        expected: 'browser_location_services_disabled'
      },
      {
        code: 999, // Unknown error
        expected: 'an_unknown_error_occurred'
      }
    ];
    
    for (const errorCase of errorCases) {
      jest.clearAllMocks();
      (Cookies.get as jest.Mock).mockReturnValue(null);
      
      // Mock geolocation error with specific code
      const mockError = {
        code: errorCase.code,
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3
      };
      
      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error(mockError);
      });
      
      const { result } = renderHook(() => useGeolocation());
      
      // Wait for error to be set with the expected error type
      await waitFor(() => {
        expect(result.current.geoError).toBe(errorCase.expected);
      });
      
      expect(result.current.isLoadingPosition).toBe(false);
    }
  });

  it('should handle permissions query denied state', async () => {
    // Mock empty cookies
    (Cookies.get as jest.Mock).mockReturnValue(null);
    
    // Mock permissions query result to denied
    mockPermissions.query.mockResolvedValue({ state: 'denied' });
    
    const { result } = renderHook(() => useGeolocation());
    
    // Wait for error to be set
    await waitFor(() => {
      expect(result.current.geoError).toBe('browser_location_services_disabled');
    });
    
    expect(result.current.isLoadingPosition).toBe(false);
  });

  it('should handle permissions query rejection', async () => {
    // Mock empty cookies
    (Cookies.get as jest.Mock).mockReturnValue(null);
    
    // Mock permissions query to throw error
    mockPermissions.query.mockRejectedValue(new Error('Not supported'));
    
    const { result } = renderHook(() => useGeolocation());
    
    // Wait for error to be set
    await waitFor(() => {
      expect(result.current.geoError).toBe('browser_location_services_disabled');
    });
    
    expect(result.current.isLoadingPosition).toBe(false);
  });

  it('should reset location when resetLocation is called', async () => {
    // First set some location
    (Cookies.get as jest.Mock).mockReturnValue('10.7522');
    
    const { result } = renderHook(() => useGeolocation());
    
    // Wait for initial state to be set
    await waitFor(() => {
      expect(result.current.isLoadingPosition).toBeFalsy();
    });
    
    // Reset location
    act(() => {
      result.current.resetLocation();
    });
    
    expect(result.current.latitude).toBeNull();
    expect(result.current.longitude).toBeNull();
    expect(result.current.accuracy).toBeNull();
    expect(result.current.geoError).toBeNull();
    expect(result.current.isLoadingPosition).toBe(false);
    
    // Check if cookies were removed
    expect(Cookies.remove).toHaveBeenCalledWith('geo_lat');
    expect(Cookies.remove).toHaveBeenCalledWith('geo_lng');
    expect(Cookies.remove).toHaveBeenCalledWith('city');
  });

  it('should set location manually when setGeolocationAndCity is called', async () => {
    const { result } = renderHook(() => useGeolocation());
    
    // Set location manually
    act(() => {
      result.current.setGeolocationAndCity(59.9139, 10.7522, 'Oslo');
    });
    
    expect(result.current.latitude).toBe(59.9139);
    expect(result.current.longitude).toBe(10.7522);
    expect(result.current.city).toBe('Oslo');
    expect(result.current.geoError).toBeNull();
    expect(result.current.isLoadingPosition).toBe(false);
    
    // Check if cookies were set
    expect(Cookies.set).toHaveBeenCalledWith('geo_lat', '59.9139', { expires: 7 });
    expect(Cookies.set).toHaveBeenCalledWith('geo_lng', '10.7522', { expires: 7 });
    expect(Cookies.set).toHaveBeenCalledWith('city', 'Oslo', { expires: 7 });
  });
}); 