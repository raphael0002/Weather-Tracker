import CurrentWeather from "@/components/CurrentWeather";
import FavoriteCity from "@/components/FovoriteCity";
import HourlyTemperature from "@/components/HourlyTemperature";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import WeatherDeatils from "@/components/WeatherDeatils";
import WeatherForecast from "@/components/WeatherForecast";
import useGeoLocation from "@/hooks/useGeoLocation";
import {
  useForecastQuery,
  useReverseGeocodeQuery,
  useWeatherQuery,
} from "@/hooks/useWeather";
import { AlertTriangle, MapPin, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";

const WeatherDashboard = () => {
  const [initialLoad, setInitialLoad] = useState(true);

  const {
    coordinates,
    isLoading: locationLoading,
    error: locationError,
    getlocation,
  } = useGeoLocation();

  const locationQuery = useReverseGeocodeQuery(coordinates);
  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);

  const handleRefresh = () => {
    getlocation();
    if (coordinates) {
      locationQuery.refetch();
      weatherQuery.refetch();
      forecastQuery.refetch();
    }
  };

  useEffect(() => {
    // Simulate initial loading phase
    const timer = setTimeout(() => setInitialLoad(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (locationLoading) {
    return <LoadingSkeleton />;
  }

  if (locationError && initialLoad) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{locationError}</p>
          <Button onClick={getlocation} variant={"outline"} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" /> Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!coordinates && !initialLoad) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Please enable location access to see your local weather</p>
          <Button onClick={getlocation} variant={"outline"} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" /> Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const locationName = locationQuery.data?.[0];

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Weather Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Failed to fetch weather data! Please try again.</p>
          <Button onClick={handleRefresh} variant={"outline"} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" /> retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* Fav location */}
      <FavoriteCity />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">My Location</h1>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={handleRefresh}
          disabled={weatherQuery.isFetching || forecastQuery.isFetching}
        >
          <RefreshCcw
            className={`h-4 w-4 ${
              weatherQuery.isFetching ? "animate-spin" : ""
            }`}
          />
        </Button>
      </div>
      <div className="grid gap-6">
        <div className="flex flex-col lg:flex-row">
          <CurrentWeather
            data={weatherQuery.data}
            locationName={locationName}
          />{" "}
          <WeatherDeatils data={weatherQuery.data} />
        </div>
        <div className="grid gap-6 items-start">
          <HourlyTemperature data={forecastQuery.data} />
          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
