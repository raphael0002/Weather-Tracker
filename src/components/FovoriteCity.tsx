import { useFavourite } from "@/hooks/useFavourite";
import { ScrollArea } from "./ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { useWeatherQuery } from "@/hooks/useWeather";
import { Button } from "./ui/button";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

interface FavoriteCityTabletProps {
  id: string;
  name: string;
  lat: number;
  lon: number;
  onRemove: (id: string) => void;
}
const FavoriteCity = () => {
  const { favorites, removeFavorite } = useFavourite();

  if (favorites.length < 0) {
    return null;
  }
  return (
    <div>
      <h1 className="text-xl font-bold tracking-tight">Favorites</h1>
      <ScrollArea className="pb-4 w-full">
        <div className="flex gap-4">
          {favorites.map((favorite) => (
            <FavoriteCityTablet
              key={favorite.id}
              {...favorite}
              onRemove={() => removeFavorite.mutate(favorite.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

const FavoriteCityTablet = ({
  id,
  name,
  lat,
  lon,
  onRemove,
}: FavoriteCityTabletProps) => {
  const navigate = useNavigate();

  const { data: weather, isLoading } = useWeatherQuery({ lat, lon });

  return (
    <div
      className="relative flex min-w-[250px] cursor-pointer items-center gap-3 rounded-lg border bg-card p-5 pr-8 shadow-sm transition-all hover:shadow-md"
      onClick={() => navigate(`/city/${name}?lat=${lat}&lon=${lon}`)}
      role="button"
      tabIndex={0}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1 h-6 w-6 rounded-sm p-0 hover:text-destructive-foreground group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(id);
          toast.error(`Removed ${name} from favorites`);
        }}
      >
        <X className="h-4 w-4" />
      </Button>

      {isLoading ? (
        <div>
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : weather ? (
        <>
          <div className="flex items-center gap-2">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              className="h-8 w-8"
              alt={weather.weather[0].description}
            />
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-sm text-muted-foreground">
                {weather.sys.country}
              </p>
            </div>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xl font-bold">
              {Math.round(weather.main.temp - 273.15)}°C
            </p>
            <p className="text-xs capitalize text-muted-foreground">
              {weather.weather[0].description}
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default FavoriteCity;
