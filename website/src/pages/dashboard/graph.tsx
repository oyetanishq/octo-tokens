import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { useAuthStore } from "@/store/user";

const intervals = ["1d", "1h"];
const tokens = ["ETH", "BTC", "UNI"];

const TokenChart = () => {
    const user = useAuthStore();
    const [data, setData] = useState([]);
    const [token, setToken] = useState("ETH");
    const [interval, setIntervalOption] = useState("1d");

    const fetchPrice = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_REST_API}/historical-data`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    symbol: token,
                    startTime: "2025-09-14T00:00:00Z",
                    endTime: "2025-10-05T23:59:59Z",
                    interval: interval,
                }),
            });

            if (!res.ok) throw new Error("Failed to fetch watchlist");

            const data = await res.json();
            setData(data.historicalData);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPrice();
        const intervalId = setInterval(fetchPrice, 30000); // refresh every 30s
        return () => clearInterval(intervalId);
    }, [token, interval]);

    return (
        <div className="w-full">
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <select value={token} onChange={(e) => setToken(e.target.value)}>
                    {tokens.map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>

                <select value={interval} onChange={(e) => setIntervalOption(e.target.value)}>
                    {intervals.map((i) => (
                        <option key={i} value={i}>
                            {i}
                        </option>
                    ))}
                </select>
            </div>

            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TokenChart;
