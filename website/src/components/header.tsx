import { useAuthStore } from "@/store/user";
import { useState } from "react";
import { Link } from "react-router";

export default function Header() {
    const { user, logout } = useAuthStore();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 w-full z-10 self-start flex flex-col items-center justify-between whitespace-nowrap border-b-3 border-dark-green bg-background-light px-4 py-3 md:px-10">
            <div className="w-full flex items-center justify-between">
                {/* logo */}
                <Link to="/">
                    <div className="flex items-center gap-3 text-dark-green">
                        <div className="text-retro-green size-5 md:size-8">
                            <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 2h16v2H4V2zm1 3h14v2H5V5zm-1 3h16v2H4V8zm1 3h14v2H5v-2zm-1 3h16v2H4v-2zm1 3h14v2H5v-2zm-1 3h16v2H4v-2z"></path>
                            </svg>
                        </div>
                        <h2 className="font-heading text-sm md:text-xl">OctoTokens</h2>
                    </div>
                </Link>

                {/* top links */}
                <nav className="hidden items-center gap-6 md:flex">
                    <Link className="text-lg font-medium text-dark-green transition-colors hover:text-retro-green" to="/dashboard">
                        Dashboard
                    </Link>
                    <Link className="text-lg font-medium text-dark-green transition-colors hover:text-retro-green" to="/backtest">
                        Backtest
                    </Link>
                    <Link className="text-lg font-medium text-dark-green transition-colors hover:text-retro-green" to="/trade">
                        Trade
                    </Link>
                    {user ? (
                        <button
                            className="flex h-10 w-full cursor-pointer items-center justify-center overflow-hidden border-2 border-dark-green bg-retro-green px-7 text-sm font-bold text-dark-green shadow-retro transition-all hover:shadow-retro-hover active:shadow-retro-hover truncate"
                            onClick={logout}
                        >
                            Logout
                        </button>
                    ) : (
                        <Link
                            className="flex h-10 w-full cursor-pointer items-center justify-center overflow-hidden border-2 border-dark-green bg-retro-green px-7 text-sm font-bold text-dark-green shadow-retro transition-all hover:shadow-retro-hover active:shadow-retro-hover truncate"
                            to="/authentication"
                        >
                            Login
                        </Link>
                    )}
                </nav>

                {/* three dots button for smaller screen */}
                <button className="md:hidden">
                    <span className="text-dark-green text-xl" onClick={() => setMenuOpen((s) => !s)}>
                        menu
                    </span>
                </button>
            </div>
            <div className="w-full pt-8 md:hidden" hidden={!menuOpen}>
                <nav className="items-center gap-2 flex flex-col">
                    <Link className="text-lg font-medium text-dark-green transition-colors hover:text-retro-green" to="/dashboard">
                        Dashboard
                    </Link>
                    <Link className="text-lg font-medium text-dark-green transition-colors hover:text-retro-green" to="/backtest">
                        Backtest
                    </Link>
                    <Link className="text-lg font-medium text-dark-green transition-colors hover:text-retro-green" to="/trade">
                        Trade
                    </Link>
                    {user ? (
                        <button
                            className="flex h-10 w-full cursor-pointer items-center justify-center overflow-hidden border-2 border-dark-green bg-retro-green px-7 text-sm font-bold text-dark-green shadow-retro transition-all hover:shadow-retro-hover active:shadow-retro-hover truncate "
                            onClick={logout}
                        >
                            Logout
                        </button>
                    ) : (
                        <Link
                            className="flex h-10 w-full cursor-pointer items-center justify-center overflow-hidden border-2 border-dark-green bg-retro-green px-7 text-sm font-bold text-dark-green shadow-retro transition-all hover:shadow-retro-hover active:shadow-retro-hover truncate "
                            to="/authentication"
                        >
                            Login
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}
