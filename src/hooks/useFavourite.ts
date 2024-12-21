import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./useLocalStorage"

interface FavoriteCity {
    id: string;
    name: string;
    lat: number;
    lon: number;
    country: string;
    state?: string;
    addedAt: number;
}
export const useFavourite = () => {
    const [favorites, setfavorites] = useLocalStorage<FavoriteCity[]>('favorites', [])


    const queryClient = useQueryClient();

    const favoritesQuery = useQuery({
        queryKey: ['favorites'], queryFn: () => favorites,
        initialData: favorites,
        staleTime: Infinity
    })

    const addTofavorites = useMutation({
        mutationFn: async (city: Omit<FavoriteCity, 'id' | 'addedAt'>) => {
            const newFavoriteCity: FavoriteCity = { 
                ...city, 
                addedAt: Date.now(), 
                id: `${city.lat } - ${city.lon}`
        }

        const exists = favorites.some((fav) => fav.id === newFavoriteCity.id)

        if (exists) return favorites;


        const newfavorites = [...favorites, newFavoriteCity].slice(0, 10)

        setfavorites(newfavorites);
        return newfavorites;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({
            queryKey: ['favorites']
        });
    }
    });

    const removeFavorite = useMutation({
        mutationFn: async (cityId: string) => {
            const newfavorites = favorites.filter((fav) => fav.id !== cityId)
            setfavorites(newfavorites);
            return newfavorites
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['favorites']
            });
        },
    })

    return {
        favorites: favoritesQuery.data ?? [],
        addTofavorites,
        removeFavorite,
        isFavorite: (lat: number, lon: number) => favorites.some((fav) => fav.lat === lat && fav.lon === lon),
    }
}