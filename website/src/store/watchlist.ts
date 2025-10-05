import { create } from "zustand";

export interface StockDetails {
    name: string;
    address: string;
    price: number;
    priceAt: number;
}

export type Watchlist = StockDetails[][];

interface WatchlistStore {
    watchlist: Watchlist;
    isFetching: boolean;
    isUpdating: boolean;
    error: string | null;

    fetchWatchlist: (token: string) => Promise<void>;
    updateWatchlist: (token: string, newList: Watchlist) => Promise<void>;
}

const mockData: Watchlist = [
    [
        {
            name: "ethusd",
            address: "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419",
            price: 4519.754,
            priceAt: 1759701779,
        },
        {
            name: "btcusd",
            address: "0xf4030086522a5beea4988f8ca5b36dbc97bee88c",
            price: 122976.577,
            priceAt: 1759702247,
        },
    ],
    [],
    [],
];

export const useWatchlistStore = create<WatchlistStore>((set) => ({
    watchlist: mockData,
    isFetching: false,
    isUpdating: false,
    error: null,

    fetchWatchlist: async (token) => {
        set({ isFetching: true, error: null });

        try {
            const res = await fetch(`${import.meta.env.VITE_REST_API}/watchlist`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Failed to fetch watchlist");

            const data = await res.json();
            console.log(data);

            set({ watchlist: data["watchlist"], isFetching: false });
        } catch (err: any) {
            set({ error: err.message || "Error fetching watchlist", isFetching: false });
        }
    },

    updateWatchlist: async (token, newList) => {
        set({ isUpdating: true, error: null });

        try {
            const res = await fetch(`${import.meta.env.VITE_REST_API}/watchlist`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ watchlist: newList }),
            });

            if (!res.ok) throw new Error("Failed to update watchlist");
            set({ watchlist: newList, isUpdating: false });
        } catch (err: any) {
            set({ error: err.message || "Error updating watchlist", isUpdating: false });
        }
    },
}));
