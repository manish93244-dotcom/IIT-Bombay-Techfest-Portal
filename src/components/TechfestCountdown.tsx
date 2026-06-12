import { useEffect, useState } from 'react';

export default function TechfestCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  useEffect(() => {
    // Techfest 2026 dates (e.g., Dec 18, 2026 at 09:00 AM IST)
    const targetDate = new Date('2026-12-18T09:00:00+05:30').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isOver: false });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  if (timeLeft.isOver) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 text-xs font-semibold">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>TECHFEST 2026 IS LIVE!</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 sm:gap-2.5">
      <div className="text-center">
        <div className="px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 min-w-[40px]">
          <span className="font-mono text-sm sm:text-base font-bold text-white tracking-tight">
            {String(timeLeft.days).padStart(2, '0')}
          </span>
          <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">Days</p>
        </div>
      </div>
      <div className="text-[14px] text-cyan-500 font-bold">:</div>
      <div className="text-center">
        <div className="px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 min-w-[40px]">
          <span className="font-mono text-sm sm:text-base font-bold text-white tracking-tight">
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">Hrs</p>
        </div>
      </div>
      <div className="text-[14px] text-cyan-500 font-bold">:</div>
      <div className="text-center">
        <div className="px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 min-w-[40px]">
          <span className="font-mono text-sm sm:text-base font-bold text-slate-400 tracking-tight">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">Min</p>
        </div>
      </div>
      <div className="text-[14px] text-cyan-500 font-bold">:</div>
      <div className="text-center">
        <div className="px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 min-w-[40px]">
          <span className="font-mono text-sm sm:text-base font-bold text-cyan-400 tracking-tight">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">Sec</p>
        </div>
      </div>
    </div>
  );
}
