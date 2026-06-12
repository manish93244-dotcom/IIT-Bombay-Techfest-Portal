import React, { useState, useEffect } from 'react';
import { EventDetail } from '../types';
import { Sparkles, Calendar, MapPin, CheckCircle, ShieldAlert, X } from 'lucide-react';

interface RegistrationFormProps {
  event: EventDetail;
  onClose: () => void;
  onSuccess: () => void;
  isHighContrast?: boolean;
}

export default function RegistrationForm({ event, onClose, onSuccess, isHighContrast = false }: RegistrationFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredTickets, setRegisteredTickets] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('techfest-registrations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRegisteredTickets(parsed.map((item: any) => item.eventId));
      } catch (e) {
        // Safe fallback
      }
    }
  }, []);

  const hasAlreadyRegistered = registeredTickets.includes(event.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !college || !agreeTerms) return;

    setIsSubmitting(true);

    // Simulate database network delay
    setTimeout(() => {
      const saved = localStorage.getItem('techfest-registrations');
      let parsed = [];
      if (saved) {
        try {
          parsed = JSON.parse(saved);
        } catch (e) {
          parsed = [];
        }
      }

      const newRegistration = {
        eventId: event.id,
        eventTitle: event.title,
        fullName,
        email,
        college,
        registeredAt: new Date().toISOString(),
        ticketReference: `TF26-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      };

      parsed.push(newRegistration);
      localStorage.setItem('techfest-registrations', JSON.stringify(parsed));

      setIsSubmitting(false);
      onSuccess();
    }, 900);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md transition-all ${isHighContrast ? 'bg-slate-300/40' : 'bg-slate-950/70'} animate-fade-in`}>
      <div className={`relative w-full max-w-lg overflow-hidden border rounded-2xl shadow-2xl transition-all duration-300 ${isHighContrast ? 'border-slate-300 bg-white text-slate-950' : 'border-slate-800 bg-slate-900 text-slate-200'}`}>
        {/* Futuristic accent header */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-600" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-full transition ${isHighContrast ? 'text-slate-600 hover:text-slate-950 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
          <X size={20} />
        </button>

        <div className="p-6 md:p-8">
          <div className="mb-6">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${isHighContrast ? 'bg-cyan-50 text-cyan-800 border border-cyan-300' : 'bg-cyan-950/70 text-cyan-400 border border-cyan-800'}`}>
              <Sparkles size={12} />
              Registration Portal
            </span>
            <h3 className={`mt-3 text-2xl font-bold tracking-tight ${isHighContrast ? 'text-slate-950' : 'text-white'}`}>
              {event.title}
            </h3>
            <p className={`text-sm mt-1 ${isHighContrast ? 'text-slate-700' : 'text-slate-400'}`}>{event.tagline}</p>
          </div>

          <div className={`mb-6 space-y-2.5 p-3.5 rounded-xl border text-xs ${isHighContrast ? 'border-slate-200 bg-slate-50 text-slate-800' : 'border-slate-800 bg-slate-950/40 text-slate-300'}`}>
            <div className="flex items-center gap-2">
              <Calendar size={13} className="text-cyan-600" />
              <span>Event Date: <strong className={isHighContrast ? 'text-slate-950' : 'text-white'}>{event.date}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={13} className="text-violet-600" />
              <span>Venue / Prize: <strong className={isHighContrast ? 'text-slate-950' : 'text-white'}>{event.prizeOrVenue}</strong></span>
            </div>
          </div>

          {hasAlreadyRegistered ? (
            <div className="text-center py-6">
              <div className={`mx-auto w-12 h-12 flex items-center justify-center rounded-full mb-4 animate-bounce ${isHighContrast ? 'bg-emerald-100 border border-emerald-450 text-emerald-700' : 'bg-emerald-950 border border-emerald-500 text-emerald-400'}`}>
                <CheckCircle size={24} />
              </div>
              <h4 className={`text-lg font-bold ${isHighContrast ? 'text-slate-900' : 'text-white'}`}>You are Registered!</h4>
              <p className={`text-sm max-w-sm mx-auto mt-2 ${isHighContrast ? 'text-slate-700' : 'text-slate-400'}`}>
                A digital ticket and guide has been issued to your device. Go to your Dashboard at the bottom to view tickets.
              </p>
              <button
                onClick={onClose}
                className={`mt-6 w-full py-2.5 rounded-xl font-medium transition ${isHighContrast ? 'bg-slate-200 hover:bg-slate-300 text-slate-900' : 'bg-slate-850 hover:bg-slate-700 text-white'}`}
              >
                Close Portal
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isHighContrast ? 'text-slate-800' : 'text-slate-300'}`}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priyanshu Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition ${isHighContrast ? 'border-slate-300 bg-slate-50 text-slate-950 focus:border-cyan-600' : 'border-slate-700 bg-slate-950 text-white focus:border-cyan-500'}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isHighContrast ? 'text-slate-800' : 'text-slate-300'}`}>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. priyandhu@iitb.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition ${isHighContrast ? 'border-slate-300 bg-slate-50 text-slate-950 focus:border-cyan-600' : 'border-slate-700 bg-slate-950 text-white focus:border-cyan-500'}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isHighContrast ? 'text-slate-800' : 'text-slate-300'}`}>College / Institution</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IIT Bombay"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition ${isHighContrast ? 'border-slate-300 bg-slate-50 text-slate-950 focus:border-cyan-600' : 'border-slate-700 bg-slate-950 text-white focus:border-cyan-500'}`}
                />
              </div>

              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="agree-terms"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 accent-cyan-500 cursor-pointer h-4 w-4"
                />
                <label htmlFor="agree-terms" className={`text-xs leading-normal cursor-pointer select-none ${isHighContrast ? 'text-slate-700' : 'text-slate-400'}`}>
                  I agree to the Techfest 2026 Code of Conduct, and authorize the event organizers to send entry passes and updates.
                </label>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className={`flex-1 py-2.5 border rounded-xl font-medium text-sm transition ${isHighContrast ? 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-950' : 'border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40 cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Confirm Pass</span>
                      <CheckCircle size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
