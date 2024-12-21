import { Coordinates } from "@/api/types"
import { weatherAPI } from "@/api/weather"
import { useQuery } from "@tanstack/react-query"

export const WEATHER_KEYS = {
    weather: (coordinates: Coordinates) => ['weather', coordinates] as const,
    forecast: (coordinates: Coordinates) => ['forecast', coordinates] as const,
    location: (coordinates: Coordinates) => ['location', coordinates] as const,
    search: (query: string) => ['location-search', query] as const
} as const;
export const useWeatherQuery = (coordinates: Coordinates | null) => {
    return useQuery({
        queryKey: WEATHER_KEYS.weather(coordinates??{lat: 0, lon: 0}),
        queryFn: async () => coordinates ? await weatherAPI.getCurrentWeather(coordinates) : null,
        enabled: !!coordinates
    })
}
export const useForecastQuery = (coordinates: Coordinates | null) => {
    return useQuery({
        queryKey: WEATHER_KEYS.forecast(coordinates??{lat: 0, lon: 0}),
        queryFn: async () => coordinates ? await weatherAPI.getForecast(coordinates) : null,
        enabled: !!coordinates
    })
}
export const useReverseGeocodeQuery = (coordinates: Coordinates | null) => {
    return useQuery({
        queryKey: WEATHER_KEYS.location(coordinates??{lat: 0, lon: 0}),
        queryFn: async () => coordinates ? await weatherAPI.reverseGeocode(coordinates) : null,
        enabled: !!coordinates
    })
}
export const useLocationSearch = (query: string) => {
    return useQuery({
        queryKey: WEATHER_KEYS.search(query),
        queryFn: () => weatherAPI.searchLocation(query),
        enabled: query.length >= 3,
    })
}

