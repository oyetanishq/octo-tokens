import { useParams, useNavigate } from "react-router";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useAuthStore } from "@/store/user";

export default function AccountVerification() {
    const setToken = useAuthStore((state) => state.setToken);
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            await fetch(`${import.meta.env.VITE_REST_API}/auth/account-verify?token=${token}`)
                .then((res) => res.json())
                .then((res) => {
                    if ("accessToken" in res) {
                        setToken(res["accessToken"]);
                        navigate("/dashboard");
                    } else alert(res["error"]);
                })
                .catch((res) => alert(res["error"]));
        })();
    }, []);

    return (
        <main className="flex flex-1 w-full items-center justify-center px-3 sm:px-5 md:px-8 gap-3">
            <Loader className="animate-spin size-4" />
            <h1 className="animate-pulse font-ubuntu text-sm">logging user in...</h1>
        </main>
    );
}
