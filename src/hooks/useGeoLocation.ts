import { Coordinates } from "@/api/types";
import { useEffect, useState } from "react";

interface GeolocationState {
  coordinates: Coordinates | null;
  error: string | null;
  isLoading: boolean;
}

const useGeoLocation = () => {
  const [locationData, setLocationData] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    isLoading: true,
  });

  const getlocation = () => {
    setLocationData((prev) => ({ ...prev, isLoading: false, error: null }));

    if (!navigator.geolocation) {
      setLocationData((prev) => ({
        ...prev,
        error: "Geolocation is not supported by this browser.",
        isLoading: false,
      }));
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationData({
            coordinates: {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            },
            error: null,
            isLoading: false,
          });
        },
        (error) => {
          let errorMessage: string;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "User denied the request for Geolocation.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "The request to get user location timed out.";
              break;
            default:
              errorMessage = "An unknown error occurred.";
              break;
          }
          setLocationData({
            coordinates: null,
            error: errorMessage,
            isLoading: false,
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }
  };

  useEffect(() => {
    getlocation();
  },[]);

  return {
    ...locationData,
    getlocation,
  };
};

export default useGeoLocation;
