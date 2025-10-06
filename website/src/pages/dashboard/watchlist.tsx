import { useAuthStore } from "@/store/user";
import { Loader, PackagePlus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useWatchlistStore } from "@/store/watchlist";

export default function WatchList() {
    const { token } = useAuthStore();
    const { watchlist, fetchWatchlist, updateWatchlist, isFetching, isUpdating } = useWatchlistStore();
    const [activeList, setActiveList] = useState(0);

    const [address, setAddress] = useState("");

    useEffect(() => {
        fetchWatchlist(token!);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchWatchlist(token!);
        }, 60 * 60 * 1000); // update every 1 hr

        return () => clearInterval(interval);
    }, [watchlist]);

    const newList = async () => await updateWatchlist(token!, [...watchlist, []]);
    const deleteActiveWatchlist = async () =>
        await updateWatchlist(
            token!,
            watchlist.filter((_, idx) => idx != activeList)
        );

    const addStock = async () => {
        if (address.length === 0) return alert("enter any stock symbol");

        watchlist[activeList].push({ address, name: "", price: 0, priceAt: 0 });
        await updateWatchlist(token!, watchlist);
        await fetchWatchlist(token!);
    };

    const deleteStock = async (index: number) =>
        await updateWatchlist(
            token!,
            watchlist.map((row, rowIndex) => row.filter((_, colIndex) => !(rowIndex === activeList && colIndex === index)))
        );

    return (
        <div className="h-full md:h-auto flex flex-col w-full md:max-w-md p-3 relative border-b md:border-b-0 md:border-r">
            {isFetching && (
                <div className="absolute top-0 left-0 bottom-0 right-0 flex justify-center items-center gap-2 z-50 backdrop-blur-xs">
                    <Loader className="size-4 animate-spin" />
                    <span className="animate-pulse">loading watchlist...</span>
                </div>
            )}

            {/* search bar */}
            <div className="w-full">
                <label className="input w-full outline-none!">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </g>
                    </svg>
                    <input type="search" className="grow uppercase" placeholder="0x5f4ec3df9cbd" value={address} onChange={(e) => setAddress(e.target.value)} />
                </label>
            </div>

            {/* watchlist */}
            <div className="flex-1 flex flex-col w-full py-3">
                <div className="w-full flex justify-between items-center px-2 pr-4">
                    <span className="opacity-80 text-sm">watchlist {activeList + 1}</span>
                    <button className="hover:animate-pulse cursor-pointer" onClick={deleteActiveWatchlist} disabled={isUpdating}>
                        <Trash2 className="opacity-80 size-3" />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                            <tr className="flex">
                                <th className="flex-1">TOKEN</th>
                                <th className="w-28 text-right">PRICE</th>
                                <th className="w-28 text-right">PRICE AT</th>
                                <th className="w-14 text-right"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {watchlist.length > activeList &&
                                watchlist[activeList].map(
                                    (stocks, index) =>
                                        stocks.name.length && (
                                            <tr className="flex" key={`list:stocks:${stocks.name}:${index}`}>
                                                <td className="flex-1">{stocks.name}</td>
                                                <td className="w-28 text-right">{stocks.price.toFixed(3)}</td>
                                                <td className="w-28 text-right">{new Date(stocks.priceAt * 1000).toDateString()}</td>
                                                <td className="w-14 text-right">
                                                    <button className="hover:animate-pulse cursor-pointer" onClick={async () => await deleteStock(index)} disabled={isUpdating}>
                                                        <Trash2 className="opacity-80 size-3" />
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                )}
                        </tbody>
                    </table>
                </div>
                <div className="pt-4 w-full flex justify-center items-center">
                    <span className="underline underline-offset-2 cursor-pointer hover:animate-pulse" onClick={addStock}>
                        add stocks
                    </span>
                </div>
            </div>

            {/* watchlist pagination */}
            <div className="w-full border-t border-light-green flex justify-between">
                <div className="w-full flex">
                    {watchlist.map((_, index) => (
                        <div key={`list:index:${index}`} onClick={() => setActiveList(index)} className={`h-8 w-10 flex justify-center items-center text-xl cursor-pointer hover:animate-pulse duration-300 ${index === activeList && "border-t-4 border-orange-600"}`}>
                            {index + 1}
                        </div>
                    ))}
                </div>
                <button className="h-8 w-10 flex justify-center items-center cursor-pointer group" onClick={newList} disabled={isUpdating}>
                    <PackagePlus className="size-4 group-hover:animate-pulse" />
                </button>
            </div>
        </div>
    );
}
