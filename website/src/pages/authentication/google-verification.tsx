import { useParams, useNavigate } from "react-router";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useAuthStore } from "@/store/user";

export default function GoogleVerification() {
    const setToken = useAuthStore((state) => state.setToken);
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            setToken(token);
            navigate("/dashboard");
        } else {
            alert("couldn't sign you in");
            navigate("/");
        }
    }, []);

    return (
        <main className="flex flex-1 w-full items-center justify-center px-3 sm:px-5 md:px-8 gap-3">
            <Loader className="animate-spin size-4" />
            <h1 className="animate-pulse font-ubuntu text-sm">logging user in...</h1>
        </main>
    );
}
