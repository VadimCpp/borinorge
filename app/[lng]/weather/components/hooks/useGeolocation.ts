import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie"
import { type LocationErrors } from "../weather.types";

export type GeolocationData = {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  accuracy: number | null;
  geoError: keyof LocationErrors | null;
  isLoadingPosition: boolean;
  getCurrentPosition: () => void;
  resetLocation: () => void;
  setGeolocationAndCity: (lat: number, lng: number, city: string) => void;
};

export const useGeolocation = (): GeolocationData => {
  const [location, setLocation] = useState<GeolocationData>({
    latitude: null,
    longitude: null,
    city: null,
    accuracy: null,
    geoError: null,
    isLoadingPosition: true,
    // Placeholder—will be overwritten below
    getCurrentPosition: () => {},
    resetLocation: () => {},
    setGeolocationAndCity: () => {},
  });

  const handleSuccess = useCallback(async (position: GeolocationPosition) => {
    const { latitude, longitude, accuracy } = position.coords

    // Cache the lat/lng in cookies for future visits
    Cookies.set("geo_lat", String(latitude), { expires: 7 })
    Cookies.set("geo_lng", String(longitude), { expires: 7 })

    setLocation((prev) => ({
      ...prev,
      latitude,
      longitude,
      accuracy,
      geoError: null,
      isLoadingPosition: false,
    }));
  }, []);

  useEffect(() => {
    const fetchCity = async () => {
      const { latitude, longitude, city } = location;

      if (latitude && longitude && !city) {
        // Get the city name from the API
        try {
          const response = await fetch(`/api/geonorge/punktsok?lat=${latitude}&lon=${longitude}`)
          const { city } = await response.json()
          if (city) {
            Cookies.set("city", city, { expires: 7 })
            setLocation((prev) => ({
              ...prev,
              city,
            }))
          }
        } catch (error) {
          console.log("Failed to fetch city name", error);
        }
      }
    }

    fetchCity()
  }, [location])

  const handleError = useCallback((error: GeolocationPositionError) => {
    let message: keyof LocationErrors | null;
    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = "user_denied_the_request_for_geolocation" as keyof LocationErrors;
        break
      case error.POSITION_UNAVAILABLE:
        message = "location_information_is_unavailable" as keyof LocationErrors;
        break
      case error.TIMEOUT:
        message = "the_request_to_get_user_location_timed_out" as keyof LocationErrors;
        break
      case 101:
        message = "browser_location_services_disabled" as keyof LocationErrors;
        break
      case 102:
        message = "browser_location_services_disabled" as keyof LocationErrors;
        break
      default:
        message = "an_unknown_error_occurred" as keyof LocationErrors;
        break
    }
    setLocation((prev) => ({
      ...prev,
      geoError: message,
      isLoadingPosition: false,
    }))
  }, [])

  const getCurrentPosition = useCallback(() => {
    console.log("Getting current position...");

    const cachedLat = parseFloat(Cookies.get("geo_lat") ?? "NaN")
    const cachedLng = parseFloat(Cookies.get("geo_lng") ?? "NaN")
    const city = Cookies.get("city") ?? null

    if (!isNaN(cachedLat) && !isNaN(cachedLng) && city) {
      console.log("Using cached location", cachedLat, cachedLng)
      setLocation((prev) => ({
        ...prev,
        latitude: cachedLat,
        longitude: cachedLng,
        city,
        isLoadingPosition: false,
      }))
      return
    }

    // SSR check and geolocation support check
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setLocation((prev) => ({
        ...prev,
        geoError: "an_unknown_error_occurred" as keyof LocationErrors,
        isLoadingPosition: false,
      }));
      return;
    } else {
      setLocation((prev) => ({
        ...prev,
        isLoadingPosition: true,
      }));
    }

    /* Set up getCurrentPosition options with a timeout */
    const navigatorLocationOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    /* Determine browser permissions status */
    navigator.permissions.query({name:'geolocation'})
      .then((result) => {
        /* result.state will be 'granted', 'denied', or 'error' */
        if (result.state === 'granted') {
          console.log('Geolocation permissions granted');
          navigator.geolocation.getCurrentPosition(handleSuccess, handleError, navigatorLocationOptions);
        } else {
          /* Browser location services disabled or error */
          handleError({ code: 101 } as GeolocationPositionError);
        }
      }, (error) => {
        /* Browser doesn't support querying for permissions */
        handleError({ code: 102 } as GeolocationPositionError)
      }
    );

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: Infinity,
    });
  }, [handleSuccess, handleError]);

  const resetLocation = useCallback(() => {
    console.log("Resetting location...");

    // Clear the lat/lng from cookies
    Cookies.remove("geo_lat")
    Cookies.remove("geo_lng")
    Cookies.remove("city")

    setLocation((prev) => ({
      ...prev,
      latitude: null,
      longitude: null,
      accuracy: null,
      geoError: null,
      isLoadingPosition: false,
    }));
  }, [])

  const setGeolocationAndCity = useCallback((lat: number, lng: number, city: string) => {
    console.log("Setting location to", lat, lng, city);

    // Cache the lat/lng in cookies for future visits
    Cookies.set("geo_lat", String(lat), { expires: 7 })
    Cookies.set("geo_lng", String(lng), { expires: 7 })
    Cookies.set("city", city, { expires: 7 })

    setLocation((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      city,
      geoError: null,
      isLoadingPosition: false,
    }));
  }, [])

  // Attach the real getCurrentPosition to our location state
  useEffect(() => {
    setLocation((prev) => ({
      ...prev,
      getCurrentPosition,
      resetLocation,
      setGeolocationAndCity,
    }));
  }, [getCurrentPosition, resetLocation, setGeolocationAndCity]);

  // Automatically get current position on mount
  useEffect(() => {
    getCurrentPosition();
  }, [getCurrentPosition]);

  return location;
}
