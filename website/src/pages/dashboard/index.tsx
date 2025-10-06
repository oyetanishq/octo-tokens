import WatchList from "@/pages/dashboard/watchlist";
import { useAuthStore } from "@/store/user";
import { Noise } from "@/components/noise";
import Header from "@/components/header";
import PriceChart from "./graph";
import MetaMaskWallet from "./metamask-wallet";
import CoinbaseWallet from "./coinbase-wallet";

export default function Dashboard() {
    const { user } = useAuthStore();

    if (!user) return null;

    return (
        <div className="flex flex-1 flex-col relative w-full text-text-light font-display">
            {/* heading */}
            <Header />

            {/* main section */}
            <main className="flex flex-1 flex-col md:flex-row h-auto">
                <WatchList />
                <div className="w-full flex flex-col justify-center items-center overflow-y-scroll">
                    <PriceChart />
                    <MetaMaskWallet />
                    <CoinbaseWallet />
                </div>
            </main>

            {/* noise in page */}
            <Noise patternSize={250} patternScaleX={1} patternScaleY={1} patternRefreshInterval={4} patternAlpha={15} />
        </div>
    );
}
