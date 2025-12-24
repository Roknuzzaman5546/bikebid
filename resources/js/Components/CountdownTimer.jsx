import { useEffect, useState } from "react";

export default function CountdownTimer({ endTime }) {
    const [time, setTime] = useState("");
    console.log(endTime);
    useEffect(() => {
        const i = setInterval(() => {
            const diff = new Date(endTime) - new Date();
            if (diff <= 0) return setTime("Ended");

            const min = Math.floor(diff / 60000);
            const sec = Math.floor((diff % 60000) / 1000);
            setTime(`${min}m ${sec}s`);
        }, 1000);

        return () => clearInterval(i);
    }, [endTime]);

    return <p className="font-semibold">⏱ {time}</p>;
}
