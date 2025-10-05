import WatchList from "@/pages/dashboard/watchlist";
import { useAuthStore } from "@/store/user";
import { Noise } from "@/components/noise";
import Header from "@/components/header";

export default function Dashboard() {
    const { user } = useAuthStore();

    if (!user) return null;

    return (
        <div className="flex flex-1 flex-col relative w-full text-text-light font-display">
            {/* heading */}
            <Header />

            {/* main section */}
            <main className="flex flex-1 flex-col md:flex-row">
                <WatchList />
            </main>

            {/* noise in page */}
            <Noise patternSize={250} patternScaleX={1} patternScaleY={1} patternRefreshInterval={4} patternAlpha={15} />
        </div>
    );
}
