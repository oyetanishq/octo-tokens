import { useState, type FormEvent } from "react";
import Header from "@/components/header";
import { Noise } from "@/components/noise";
import { Loader } from "lucide-react";
import { useAuthStore } from "@/store/user";
import { useNavigate } from "react-router";

export default function Authentication() {
    const [isLogin, setIsLogin] = useState(true);
    const setToken = useAuthStore((state) => state.setToken);
    const navigate = useNavigate();

    // form details
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        try {
            setIsLoading(true);
            setError("");
            setMessage("");

            await fetch(`${import.meta.env.VITE_REST_API}/auth/account`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    service: isLogin ? "login" : "register",
                    email,
                    password,
                    fullName,
                }),
            })
                .then((res) => res.json())
                .then((res) => {
                    if ("message" in res) {
                        setMessage(res["message"]);

                        if (res["message"] == "user logged in") {
                            setToken(res["accessToken"]);
                            navigate("/dashboard");
                        }
                    } else setError(res["error"]);
                });
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    const switchToLogin = () => {
        setIsLogin(true);
        setError("");
        setMessage("");
    };

    const switchToRegister = () => {
        setIsLogin(false);
        setError("");
        setMessage("");
    };

    return (
        <main className="flex flex-1 flex-col relative w-full text-text-light font-display">
            <Header />

            <div className="flex h-full grow flex-col w-full justify-center items-center px-3">
                <div className="w-full max-w-lg bg-light-white border-4 border-background-dark shadow-retro p-8 md:p-12">
                    {/* Heading Section */}
                    <div className="text-center mb-8">
                        <h1 className="text-5xl font-bold text-background-dark tracking-widest">OCTOTOCKENS</h1>
                        <p className="text-xl text-dark-green mt-2">RETRO TRADING TERMINAL</p>
                    </div>

                    <div className="space-y-6">
                        {/* Login/Register Toggle Buttons */}
                        <div className="flex border-b-2 border-background-dark">
                            <button onClick={switchToRegister} className={`cursor-pointer flex-1 py-2 text-2xl uppercase focus:outline-none transition-colors duration-300 ${!isLogin ? "bg-background-dark text-light-white" : "bg-light-white text-background-dark"}`}>
                                Register
                            </button>
                            <button onClick={switchToLogin} className={`cursor-pointer flex-1 py-2 text-2xl uppercase focus:outline-none transition-colors duration-300 ${isLogin ? "bg-background-dark text-light-white" : "bg-light-white text-background-dark"}`}>
                                Login
                            </button>
                        </div>

                        {isLogin ? (
                            // Login Form
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-xl text-dark-green mb-2" htmlFor="login-email">
                                        EMAIL:
                                    </label>
                                    <input
                                        className="bg-light-white border-2 border-background-dark text-dark-green py-3 px-4 w-full text-xl outline-none shadow-[4px_4px_0px_#00000020] focus:border-background-dark focus:shadow-[0_0_0_2px_#588157]"
                                        minLength={3}
                                        maxLength={50}
                                        name="username"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="hello@tanishqsingh.com"
                                        type="email"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xl text-dark-green mb-2" htmlFor="register-password">
                                        PASSWORD:
                                    </label>
                                    <input
                                        className="bg-light-white border-2 border-background-dark text-dark-green py-3 px-4 w-full text-xl outline-none shadow-[4px_4px_0px_#00000020] focus:border-background-dark focus:shadow-[0_0_0_2px_#588157]"
                                        required
                                        minLength={6}
                                        maxLength={40}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="*******"
                                        type="password"
                                    />
                                </div>
                                <div>
                                    <button
                                        className="w-full h-14 flex justify-center items-center bg-retro-green text-dark-green border-2 border-background-dark py-3 px-4 text-xl uppercase cursor-pointer shadow-retro-hover transition-all duration-100 ease-in-out hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-retro active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_#00000040]"
                                        type="submit"
                                    >
                                        {isLoading ? <Loader className="size-5 animate-spin" /> : "Access Account"}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            // Registration Form
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-xl text-dark-green mb-2" htmlFor="register-name">
                                        FULL NAME:
                                    </label>
                                    <input
                                        className="bg-light-white border-2 border-background-dark text-dark-green py-3 px-4 w-full text-xl outline-none shadow-[4px_4px_0px_#00000020] focus:border-background-dark focus:shadow-[0_0_0_2px_#588157]"
                                        required
                                        minLength={3}
                                        maxLength={40}
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Tanishq Singh"
                                        type="text"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xl text-dark-green mb-2" htmlFor="register-email">
                                        EMAIL:
                                    </label>
                                    <input
                                        className="bg-light-white border-2 border-background-dark text-dark-green py-3 px-4 w-full text-xl outline-none shadow-[4px_4px_0px_#00000020] focus:border-background-dark focus:shadow-[0_0_0_2px_#588157]"
                                        required
                                        name="username"
                                        minLength={3}
                                        maxLength={50}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="hello@tanishqsingh.com"
                                        type="email"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xl text-dark-green mb-2" htmlFor="register-password">
                                        PASSWORD:
                                    </label>
                                    <input
                                        className="bg-light-white border-2 border-background-dark text-dark-green py-3 px-4 w-full text-xl outline-none shadow-[4px_4px_0px_#00000020] focus:border-background-dark focus:shadow-[0_0_0_2px_#588157]"
                                        required
                                        minLength={6}
                                        maxLength={40}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="*******"
                                        type="password"
                                    />
                                </div>
                                <div>
                                    <button
                                        className="w-full h-14 flex justify-center items-center bg-retro-green text-dark-green border-2 border-background-dark py-3 px-4 text-xl uppercase cursor-pointer shadow-retro-hover transition-all duration-100 ease-in-out hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-retro active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_#00000040]"
                                        type="submit"
                                    >
                                        {isLoading ? <Loader className="size-5 animate-spin" /> : "Create Account"}
                                    </button>
                                </div>
                            </form>
                        )}

                        {error && <span className="flex flex-1 justify-center items-center text-red-800">error: {error}</span>}
                        {message && <span className="flex flex-1 justify-center items-center text-green-800">message: {message}</span>}
                    </div>
                </div>
            </div>

            <Noise patternSize={250} patternScaleX={1} patternScaleY={1} patternRefreshInterval={4} patternAlpha={15} />
        </main>
    );
}
