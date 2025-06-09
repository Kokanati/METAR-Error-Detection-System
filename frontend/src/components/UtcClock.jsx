import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react'; // optional if using icon libraries

const formatUtc = (date) => {
    const dd = String(date.getUTCDate()).padStart(2, '0');
    const hh = String(date.getUTCHours()).padStart(2, '0');
    const mm = String(date.getUTCMinutes()).padStart(2, '0');
    const ss = String(date.getUTCSeconds()).padStart(2, '0');
    return `${dd}${hh}${mm}Z : ${ss}s UTC Time`;
};

const UtcClock = () => {
    const [utcTime, setUtcTime] = useState(formatUtc(new Date()));

    useEffect(() => {
        const timer = setInterval(() => {
            setUtcTime(formatUtc(new Date()));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="utc-clock-box">
            <div className="clock-icon">🕒</div>
            <div className="clock-time">{utcTime}</div>
        </div>
    );
};

export default UtcClock;
