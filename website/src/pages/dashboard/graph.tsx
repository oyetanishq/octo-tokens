import { useEffect, useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { useAuthStore } from "@/store/user";

const tokens = ["ETH", "BTC", "UNI", "USDC", "USDT", "LINK", "AAVE", "ARB", "OP"];

const getDateRanges = () => {
    const ranges = [];
    const today = new Date();
    let end = new Date(today);
    let start = new Date(today);

    for (let i = 0; i < 10; i++) {
        start = new Date(end);
        start.setDate(start.getDate() - 30);
        ranges.push([start.toISOString().split("T")[0], end.toISOString().split("T")[0]]);
        end = new Date(start);
    }

    return ranges; // oldest to newest
};

const TokenChart = () => {
    const user = useAuthStore();
    const intervals = useMemo(getDateRanges, []);
    const [data, setData] = useState([]);
    const [token, setToken] = useState("ETH");
    const [interval, setIntervalOption] = useState(intervals[0].join("#"));

    const fetchPrice = async () => {
        try {
            const [startTime, endTime] = interval.split("#");
            const res = await fetch(`${import.meta.env.VITE_REST_API}/historical-data`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    symbol: token,
                    startTime: new Date(startTime),
                    endTime: new Date(endTime),
                    interval: "1d",
                }),
            });

            if (!res.ok) throw new Error("Failed to fetch watchlist");

            const data = await res.json();
            const modifiedData = data.historicalData.map((pt: any) => {
                return { value: pt.value, timestamp: pt.timestamp.split("T")[0] };
            });

            setData(modifiedData);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPrice();
        const intervalId = setInterval(fetchPrice, 30 * 1000); // refresh every 30s
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
                        <option key={i.join("-")} value={i.join("#")}>
                            {new Date(i[0]).toDateString()}&ensp;to&ensp;
                            {new Date(i[1]).toDateString()}
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
                    <Line type="monotone" dataKey="value" stroke="#364531" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TokenChart;
