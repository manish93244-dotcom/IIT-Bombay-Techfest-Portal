import React, { useState, useEffect } from 'react';
import { Ticket, Calendar, MapPin, User, GraduationCap, Trash2 } from 'lucide-react';

interface Registration {
  eventId: string;
  eventTitle: string;
  fullName: string;
  email: string;
  college: string;
  registeredAt: string;
  ticketReference: string;
}

interface MyRegistrationsListProps {
  onRefreshTrigger: number;
  onSelectEvent: (id: string) => void;
  isHighContrast?: boolean;
}

export default function MyRegistrationsList({ onRefreshTrigger, onSelectEvent, isHighContrast = false }: MyRegistrationsListProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  const fetchRegistrations = () => {
    const saved = localStorage.getItem('techfest-registrations');
    if (saved) {
      try {
        setRegistrations(JSON.parse(saved));
      } catch (e) {
        setRegistrations([]);
      }
    } else {
      setRegistrations([]);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [onRefreshTrigger]);

  const deleteRegistration = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering event node focus
    const filtered = registrations.filter((reg) => reg.eventId !== eventId);
    localStorage.setItem('techfest-registrations', JSON.stringify(filtered));
    fetchRegistrations();
  };

  if (registrations.length === 0) {
    return (
      <div className={`p-5 text-center border border-dashed rounded-xl ${
        isHighContrast
          ? 'border-slate-350 bg-slate-100 text-slate-800'
          : 'border-slate-800 bg-slate-950/20 text-slate-400'
      }`}>
        <Ticket size={24} className={`mx-auto mb-2 ${isHighContrast ? 'text-slate-550' : 'text-slate-600'}`} />
        <p className="text-xs font-bold uppercase tracking-wider">No registered events yet</p>
        <p className={`text-[11px] mt-1 max-w-xs mx-auto leading-relaxed ${isHighContrast ? 'text-slate-600 font-medium' : 'text-slate-500'}`}>
          Explore the interactive 3D globe or browse the event categories list, then click "Secure Digital Pass" to book your digital ticket.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
      {registrations.map((reg) => (
        <div
          key={reg.eventId}
          onClick={() => onSelectEvent(reg.eventId)}
          className={`group relative cursor-pointer overflow-hidden rounded-xl border p-4 transition-all duration-300 hover:shadow-lg ${
            isHighContrast
              ? 'border-slate-300 hover:border-cyan-600 bg-white hover:shadow-slate-200 text-slate-950'
              : 'border-slate-800 hover:border-cyan-500 bg-slate-950/60 hover:shadow-cyan-950/20 text-slate-200'
          }`}
        >
          {/* Deco glow line */}
          <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-cyan-500 to-indigo-600" />
          
          <div className="flex justify-between items-start gap-2">
            <div>
              <span className={`text-[9px] font-mono font-bold tracking-wider ${isHighContrast ? 'text-cyan-700' : 'text-cyan-400'}`}>
                PASS: {reg.ticketReference}
              </span>
              <h4 className={`text-sm font-bold transition mt-0.5 ${
                isHighContrast
                  ? 'text-slate-900 group-hover:text-cyan-700'
                  : 'text-white group-hover:text-cyan-300'
              }`}>
                {reg.eventTitle}
              </h4>
            </div>
            
            <button
              onClick={(e) => deleteRegistration(reg.eventId, e)}
              className={`p-1 rounded transition-colors ${
                isHighContrast
                  ? 'text-slate-400 hover:text-red-700 hover:bg-slate-100'
                  : 'text-slate-500 hover:text-red-400 hover:bg-slate-900'
              }`}
              title="Cancel Registration"
            >
              <Trash2 size={13} />
            </button>
          </div>

          <div className={`mt-3.5 space-y-1.5 border-t pt-3 text-[11px] ${isHighContrast ? 'border-slate-200 text-slate-700' : 'border-slate-900 text-slate-400'}`}>
            <div className="flex items-center gap-1.5">
              <User size={11} className={isHighContrast ? 'text-slate-600' : 'text-slate-500'} />
              <span className={`truncate ${isHighContrast ? 'text-slate-900 font-semibold' : 'text-slate-300'}`}>{reg.fullName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <GraduationCap size={11} className={isHighContrast ? 'text-slate-600' : 'text-slate-500'} />
              <span className="truncate">{reg.college}</span>
            </div>
          </div>
          
          {/* Simulated digital bar representation */}
          <div className={`mt-3 flex items-center justify-between gap-2 border-t pt-2.5 ${isHighContrast ? 'border-slate-200' : 'border-slate-900'}`}>
            <div className="flex gap-0.5">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className={`h-3 w-0.5 ${isHighContrast ? 'bg-slate-400' : 'bg-slate-800'}`}
                  style={{
                    height: `${Math.max(4, Math.sin(i * 1.5) * 12 + 6)}px`,
                    opacity: i % 3 === 0 ? 0.3 : 0.8
                  }}
                />
              ))}
            </div>
            <span className={`text-[9px] font-mono ${isHighContrast ? 'text-slate-600' : 'text-slate-500'}`}>
              SECURE ACCESS PASS
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
