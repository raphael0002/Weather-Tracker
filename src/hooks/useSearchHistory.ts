import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./useLocalStorage"

interface SearchHistoryItem {
    id: string;
    name: string;
    lat: number;
    lon: number;
    country: string;
    state?: string;
    query: string;
    searchedAt: number;
}
export const useSearchHistory = () => {
    const [history, setHistory] = useLocalStorage<SearchHistoryItem[]>('search-history', [])


    const queryClient = useQueryClient();

    const hidtoryQuery = useQuery({
        queryKey: ['search-history'], queryFn: () => history,
        initialData: history
    })

    const addToHistory = useMutation({
        mutationFn: async (searchItem: Omit<SearchHistoryItem, 'id' | 'searchedAt'>) => {
            const newSearch: SearchHistoryItem = { 
                ...searchItem, 
                searchedAt: Date.now(), 
                id: `${searchItem.lat } - ${searchItem.lon} - ${Date.now()}`
        }

        const filteredHistory = history.filter((item) => !(item.lat === searchItem.lat && item.lon === searchItem.lon))

        const newHistory = [newSearch, ...filteredHistory].slice(0, 10)

        setHistory(newHistory);
        return newHistory;
    },
    onSuccess: (newHistory) => {
        queryClient.setQueryData(["search-history"], newHistory);
    }
    });

    const clearHistory = useMutation({
        mutationFn: async () => {
            setHistory([])
            return []
        },
        onSuccess: () => {
            queryClient.setQueryData(["search-history"], []);
        }

    })

    return {
        history: hidtoryQuery.data ?? [],
        addToHistory,
        clearHistory
    }
}