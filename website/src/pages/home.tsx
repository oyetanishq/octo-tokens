import Header from "@/components/header";
import { Noise } from "@/components/noise";
import { useNavigate } from "react-router";

export default function Home() {
    const navigate = useNavigate();
    const handleRegister = () => navigate("/authentication", { state: { service: "register" } });

    return (
        <div className="flex flex-1 flex-col relative w-full text-text-light font-display">
            {/* header */}
            <Header />

            {/* main body */}
            <main className="flex flex-1 flex-col">
                {/* section 1 */}
                <section className="flex min-h-[60vh] w-full items-center justify-center border-b-3 border-dark-green bg-retro-green">
                    <div className="container mx-auto px-4 text-center">
                        <div className="flex flex-col items-center gap-6">
                            <h1 className="font-heading text-4xl tracking-tighter text-dark-green md:text-5xl">Trade Smarter, Not Harder</h1>
                            <p className="max-w-2xl text-xl text-dark-green">Unlock the power of data-driven trading with our platform. Backtest your strategies, trade stocks, and visualize real-time pricing graphs.</p>
                            <button className="flex h-12 cursor-pointer items-center justify-center overflow-hidden border-2 border-dark-green bg-off-white px-6 text-lg font-bold text-dark-green shadow-retro transition-all hover:shadow-retro-hover active:shadow-retro-hover">
                                <span className="truncate" onClick={handleRegister}>
                                    Start for Free
                                </span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* section 2 */}
                <section className="py-16 md:py-24 bg-off-white">
                    <div className="container mx-auto px-4">
                        <div className="mb-12 text-center">
                            <h2 className="font-heading text-3xl tracking-tight text-dark-green md:text-4xl">Key Features</h2>
                            <p className="mt-4 max-w-2xl mx-auto text-xl text-dark-green">Our platform offers a comprehensive suite of tools to enhance your trading experience.</p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-3">
                            <div className="flex flex-col gap-4 border-2 border-dark-green bg-off-white p-6 shadow-retro">
                                <div className="aspect-video w-full overflow-hidden border-2 border-dark-green">
                                    <img
                                        className="h-full w-full bg-cover bg-center"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBg5oCXn1DeHrWtv_P3-Jzd3KG6h0GuMsWqHfYWFVLMzmAQbf7Sa5HdmxT8pqebn733pIV2JAYHnScTqHRiznjo6u50RvAhnfSdW8wicXgMP8Bc7sGgjZuiicBEYJ7zQMeSGIvt650mrudW-lz_I1PI7-47XcwC5gpLTmY9GmpD_g122TK0qfiuuKHRUMilwxlNJuHEEb9Ziqo_I-997bI4X2H_g48zGWmO-8voyD-qqqmOHjjl9gzYn93TmCrgfiWMeRz4PKWrkMA"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-dark-green">Strategy Backtesting</h3>
                                    <p className="mt-2 text-lg text-dark-green">Test your trading strategies against historical data to optimize performance and minimize risk.</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 border-2 border-dark-green bg-off-white p-6 shadow-retro">
                                <div className="aspect-video w-full overflow-hidden border-2 border-dark-green">
                                    <img
                                        className="h-full w-full bg-cover bg-center"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBg5oCXn1DeHrWtv_P3-Jzd3KG6h0GuMsWqHfYWFVLMzmAQbf7Sa5HdmxT8pqebn733pIV2JAYHnScTqHRiznjo6u50RvAhnfSdW8wicXgMP8Bc7sGgjZuiicBEYJ7zQMeSGIvt650mrudW-lz_I1PI7-47XcwC5gpLTmY9GmpD_g122TK0qfiuuKHRUMilwxlNJuHEEb9Ziqo_I-997bI4X2H_g48zGWmO-8voyD-qqqmOHjjl9gzYn93TmCrgfiWMeRz4PKWrkMA"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-dark-green">Stock Trading</h3>
                                    <p className="mt-2 text-lg text-dark-green">Execute trades seamlessly with our intuitive interface, accessing a wide range of stocks.</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 border-2 border-dark-green bg-off-white p-6 shadow-retro">
                                <div className="aspect-video w-full overflow-hidden border-2 border-dark-green">
                                    <img
                                        className="h-full w-full bg-cover bg-center"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBg5oCXn1DeHrWtv_P3-Jzd3KG6h0GuMsWqHfYWFVLMzmAQbf7Sa5HdmxT8pqebn733pIV2JAYHnScTqHRiznjo6u50RvAhnfSdW8wicXgMP8Bc7sGgjZuiicBEYJ7zQMeSGIvt650mrudW-lz_I1PI7-47XcwC5gpLTmY9GmpD_g122TK0qfiuuKHRUMilwxlNJuHEEb9Ziqo_I-997bI4X2H_g48zGWmO-8voyD-qqqmOHjjl9gzYn93TmCrgfiWMeRz4PKWrkMA"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-dark-green">Real-Time Pricing Graphs</h3>
                                    <p className="mt-2 text-lg text-dark-green">Visualize stock price movements with interactive graphs, enabling informed decision-making.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* section 3 */}
                <section className="bg-retro-green py-16 md:py-24 border-t-3 border-dark-green">
                    <div className="container mx-auto px-4">
                        <div className="mb-12 text-center">
                            <h2 className="font-heading text-3xl tracking-tight text-dark-green md:text-4xl">What Our Users Say</h2>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <div className="flex flex-col gap-4 border-2 border-dark-green bg-off-white p-6 shadow-retro">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 flex-shrink-0 overflow-hidden border-2 border-dark-green">
                                        <img
                                            className="h-full w-full bg-cover bg-center"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBg5oCXn1DeHrWtv_P3-Jzd3KG6h0GuMsWqHfYWFVLMzmAQbf7Sa5HdmxT8pqebn733pIV2JAYHnScTqHRiznjo6u50RvAhnfSdW8wicXgMP8Bc7sGgjZuiicBEYJ7zQMeSGIvt650mrudW-lz_I1PI7-47XcwC5gpLTmY9GmpD_g122TK0qfiuuKHRUMilwxlNJuHEEb9Ziqo_I-997bI4X2H_g48zGWmO-8voyD-qqqmOHjjl9gzYn93TmCrgfiWMeRz4PKWrkMA"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold text-dark-green">Ethan Carter</p>
                                        <p className="text-base text-dark-green">2023-09-15</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 text-dark-green">
                                    <span className="material-symbols-outlined !text-2xl">star</span>
                                    <span className="material-symbols-outlined !text-2xl">star</span>
                                    <span className="material-symbols-outlined !text-2xl">star</span>
                                    <span className="material-symbols-outlined !text-2xl">star</span>
                                    <span className="material-symbols-outlined !text-2xl">star</span>
                                </div>
                                <p className="text-lg text-dark-green">"This platform has revolutionized my trading approach. The backtesting feature is incredibly powerful, allowing me to refine my strategies with confidence."</p>
                            </div>
                            <div className="flex flex-col gap-4 border-2 border-dark-green bg-off-white p-6 shadow-retro">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 flex-shrink-0 overflow-hidden border-2 border-dark-green">
                                        <img
                                            className="h-full w-full bg-cover bg-center"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBg5oCXn1DeHrWtv_P3-Jzd3KG6h0GuMsWqHfYWFVLMzmAQbf7Sa5HdmxT8pqebn733pIV2JAYHnScTqHRiznjo6u50RvAhnfSdW8wicXgMP8Bc7sGgjZuiicBEYJ7zQMeSGIvt650mrudW-lz_I1PI7-47XcwC5gpLTmY9GmpD_g122TK0qfiuuKHRUMilwxlNJuHEEb9Ziqo_I-997bI4X2H_g48zGWmO-8voyD-qqqmOHjjl9gzYn93TmCrgfiWMeRz4PKWrkMA"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold text-dark-green">Sophia Lee</p>
                                        <p className="text-base text-dark-green">2023-08-22</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 text-dark-green">
                                    <span className="material-symbols-outlined !text-2xl">star</span>
                                    <span className="material-symbols-outlined !text-2xl">star</span>
                                    <span className="material-symbols-outlined !text-2xl">star</span>
                                    <span className="material-symbols-outlined !text-2xl">star</span>
                                    <span className="material-symbols-outlined !text-2xl text-gray-400">star_outline</span>
                                </div>
                                <p className="text-lg text-dark-green">"I appreciate the user-friendly interface and the ability to trade stocks directly from the platform. The real-time pricing graphs are also a great asset."</p>
                            </div>
                            <div className="flex flex-col gap-4 border-2 border-dark-green bg-off-white p-6 shadow-retro">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 flex-shrink-0 overflow-hidden border-2 border-dark-green">
                                        <img
                                            className="h-full w-full bg-cover bg-center"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBg5oCXn1DeHrWtv_P3-Jzd3KG6h0GuMsWqHfYWFVLMzmAQbf7Sa5HdmxT8pqebn733pIV2JAYHnScTqHRiznjo6u50RvAhnfSdW8wicXgMP8Bc7sGgjZuiicBEYJ7zQMeSGIvt650mrudW-lz_I1PI7-47XcwC5gpLTmY9GmpD_g122TK0qfiuuKHRUMilwxlNJuHEEb9Ziqo_I-997bI4X2H_g48zGWmO-8voyD-qqqmOHjjl9gzYn93TmCrgfiWMeRz4PKWrkMA"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold text-dark-green">David Chen</p>
                                        <p className="text-base text-dark-green">2023-07-10</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 text-dark-green">
                                    <span className="material-symbols-outlined !text-2xl">star</span>
                                    <span className="material-symbols-outlined !text-2xl">star</span>
                                    <span className="material-symbols-outlined !text-2xl">star</span>
                                    <span className="material-symbols-outlined !text-2xl">star</span>
                                    <span className="material-symbols-outlined !text-2xl">star</span>
                                </div>
                                <p className="text-lg text-dark-green">"The platform's comprehensive tools have significantly improved my trading performance. I highly recommend it to both novice and experienced traders."</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* footer */}
            <footer className="border-t-3 border-dark-green bg-background-light">
                <div className="container mx-auto px-4 py-10">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                        {/* links */}
                        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center md:justify-start">
                            <a className="text-lg text-dark-green hover:text-retro-green" href="#">
                                About Us
                            </a>
                            <a className="text-lg text-dark-green hover:text-retro-green" href="#">
                                Contact
                            </a>
                            <a className="text-lg text-dark-green hover:text-retro-green" href="#">
                                Terms of Service
                            </a>
                            <a className="text-lg text-dark-green hover:text-retro-green" href="#">
                                Privacy Policy
                            </a>
                        </div>

                        {/* social media links */}
                        <div className="flex justify-center gap-4">
                            <a className="text-dark-green hover:text-retro-green" href="#">
                                <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                                </svg>
                            </a>
                            <a className="text-dark-green hover:text-retro-green" href="#">
                                <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        clipRule="evenodd"
                                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                        fillRule="evenodd"
                                    ></path>
                                </svg>
                            </a>
                            <a className="text-dark-green hover:text-retro-green" href="#">
                                <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        clipRule="evenodd"
                                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 2.525c.636-.247 1.363-.416 2.427-.465C9.793 2.013 10.147 2 12.315 2h.001zm-1.04 2.295c-2.426 0-2.718.01-3.68.056-1.4.064-2.19.349-2.76.626a3.14 3.14 0 00-1.15 1.15c-.277.57-.562 1.36-.626 2.76C4.309 9.57 4.299 9.86 4.299 12.285s.01 2.715.056 3.68c.064 1.4.349 2.19.626 2.76a3.14 3.14 0 001.15 1.15c.57.277 1.36.562 2.76.626 1.02.046 1.312.056 3.799.056s2.779-.01 3.8-.056c1.399-.064 2.189-.349 2.76-.626a3.14 3.14 0 001.149-1.15c.277-.57.562-1.36.626-2.76.047-1.02.057-1.312.057-3.799s-.01-2.779-.057-3.8c-.064-1.399-.349-2.189-.626-2.76a3.14 3.14 0 00-1.15-1.15c-.57-.277-1.36-.562-2.76-.626C15.093 4.31 14.8 4.299 12.315 4.299h-1.04zM12 8.118a3.882 3.882 0 100 7.764 3.882 3.882 0 000-7.764zm0 6.264a2.382 2.382 0 110-4.764 2.382 2.382 0 010 4.764zm4.658-6.059a.96.96 0 100 1.92.96.96 0 000-1.92z"
                                        fillRule="evenodd"
                                    ></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                    <p className="mt-6 text-center text-lg text-dark-green">© 2025 OctoTokens. All rights reserved.</p>
                </div>
            </footer>

            <Noise patternSize={250} patternScaleX={1} patternScaleY={1} patternRefreshInterval={4} patternAlpha={15} />
        </div>
    );
}
