import { useEffect, useState } from "react";

export default function CountdownTimer({ endTime }) {
    const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0, ended: false });

    useEffect(() => {
        const update = () => {
            const diff = new Date(endTime) - new Date();
            if (diff <= 0) return setTimeLeft({ h: 0, m: 0, s: 0, ended: true });

            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setTimeLeft({ h, m, s, ended: false });
        };

        update();
        const i = setInterval(update, 1000);
        return () => clearInterval(i);
    }, [endTime]);

    if (timeLeft.ended) return <p className="text-2xl font-black text-slate-500 uppercase tracking-tighter">Auction Ended</p>;

    return (
        <div className="flex gap-2 items-center">
            <TimeUnit value={timeLeft.h} label="h" />
            <span className="text-slate-700 font-bold">:</span>
            <TimeUnit value={timeLeft.m} label="m" />
            <span className="text-slate-700 font-bold">:</span>
            <TimeUnit value={timeLeft.s} label="s" color="text-indigo-400" />
        </div>
    );
}

function TimeUnit({ value, label, color = "text-white" }) {
    return (
        <div className="flex items-baseline gap-0.5">
            <span className={`text-2xl font-black tabular-nums ${color}`}>{value.toString().padStart(2, '0')}</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase">{label}</span>
        </div>
    );
}
