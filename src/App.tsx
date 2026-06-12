import { useState } from 'react';
import {
  Compass,
  Cpu,
  Plane,
  Sparkles,
  Brain,
  GitPullRequest,
  Eye,
  Leaf,
  Ticket,
  Search,
  Globe,
  Orbit,
  Atom,
  Calendar,
  MapPin,
  ChevronRight,
  Info,
  CalendarDays,
  Gift,
  HelpCircle,
  Volume2,
  VolumeX,
  Github,
  Instagram,
  Linkedin,
  Sun,
  Moon
} from 'lucide-react';
import { TECHFEST_EVENTS, TECHFEST_STATS } from './data';
import { VisualMode, EventDetail } from './types';
import TechfestCanvas from './components/TechfestCanvas';
import TechfestCountdown from './components/TechfestCountdown';
import RegistrationForm from './components/RegistrationForm';
import MyRegistrationsList from './components/MyRegistrationsList';
import { techfestAudio } from './utils/audio';
import { getFuzzyEventScore, highlightFuzzyMatch } from './utils/fuzzySearch';

export default function App() {
  // Application State
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'competitions' | 'lectures' | 'workshops' | 'exhibitions'>('all');
  const [visualMode, setVisualMode] = useState<VisualMode>('globe');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHighContrast, setIsHighContrast] = useState(false);
  
  // Modal State for Active Event Registration
  const [registeringEvent, setRegisteringEvent] = useState<EventDetail | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const handleToggleAudio = () => {
    const isPlaying = techfestAudio.toggle();
    setIsAudioPlaying(isPlaying);
  };

  // Filter and rank events based on active category and real-time fuzzy search score
  const filteredEvents = TECHFEST_EVENTS
    .map((event) => {
      const score = searchQuery.trim() ? getFuzzyEventScore(event, searchQuery) : 1;
      return { event, score };
    })
    .filter(({ event, score }) => {
      const matchesCategory = activeCategory === 'all' || event.category === activeCategory;
      const matchesQuery = score > 0;
      return matchesCategory && matchesQuery;
    })
    // Sort descending by highest fuzzy match score
    .sort((a, b) => b.score - a.score)
    .map(({ event }) => event);

  const selectedEvent = TECHFEST_EVENTS.find((e) => e.id === selectedEventId);

  // Helper mapping category elements to Lucide components
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'competitions':
        return <Cpu size={14} className="text-emerald-400" />;
      case 'lectures':
        return <Sparkles size={14} className="text-red-400" />;
      case 'workshops':
        return <Brain size={14} className="text-amber-400" />;
      case 'exhibitions':
        return <Eye size={14} className="text-cyan-400" />;
      default:
        return <Compass size={14} />;
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'competitions':
        return 'bg-emerald-950/60 text-emerald-400 border-emerald-800';
      case 'lectures':
        return 'bg-red-950/60 text-red-400 border-red-800';
      case 'workshops':
        return 'bg-amber-950/60 text-amber-400 border-amber-800';
      case 'exhibitions':
        return 'bg-cyan-950/60 text-cyan-400 border-cyan-800';
      default:
        return 'bg-slate-900 border-slate-800 text-slate-300';
    }
  };

  return (
    <div className={`relative min-h-screen w-full font-sans select-none overflow-x-hidden flex flex-col justify-between transition-colors duration-300 ${isHighContrast ? 'text-slate-950 bg-slate-50' : 'text-slate-200 bg-[#020617]'}`}>
      {/* 3D WebGL Background Canvas */}
      <TechfestCanvas
        selectedEventId={selectedEventId}
        onNodeSelect={setSelectedEventId}
        activeCategory={activeCategory}
        visualMode={visualMode}
        hoveredNodeId={hoveredNodeId}
        onNodeHover={setHoveredNodeId}
        searchQuery={searchQuery}
        isHighContrast={isHighContrast}
      />

      {/* Background Atmosphere: Grid and Glows from Immersive UI */}
      <div className={`absolute inset-0 z-0 opacity-20 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none ${isHighContrast ? 'invert opacity-10' : ''}`} />
      {!isHighContrast && (
        <>
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-900/30 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-900/30 rounded-full blur-[120px] pointer-events-none" />
        </>
      )}

      {/* Scanline Overlay */}
      {!isHighContrast && (
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[size:100%_2px,3px_100%] z-45" />
      )}

      {/* Top Header Row / Brand Branding */}
      <header className={`relative z-10 w-full px-4 py-4 md:px-8 border-b transition-colors duration-300 ${isHighContrast ? 'border-slate-300 bg-white/95 text-slate-950 shadow-sm' : 'border-slate-900/50 bg-[#020617]/85 backdrop-blur-md text-slate-200'}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo Title Group */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-xl shadow-cyan-950/50 border border-cyan-500/30">
              <Compass className="text-white" size={22} />
            </div>
            <div>
              <p className={`text-[10px] font-mono tracking-[0.25em] font-bold uppercase transition-colors ${isHighContrast ? 'text-indigo-800' : 'text-cyan-400'}`}>
                IIT Bombay Presents
              </p>
              <h1 className={`text-xl md:text-2xl font-black font-sans tracking-tight transition-colors flex items-center gap-1.5 ${isHighContrast ? 'text-slate-900' : 'text-white'}`}>
                TECHFEST <span className={`${isHighContrast ? 'text-indigo-600' : 'text-cyan-500'} font-normal font-mono`}>'26</span>
              </h1>
              <p className={`text-[10px] font-mono tracking-wider mt-0.5 transition-colors ${isHighContrast ? 'text-slate-600' : 'text-slate-400'}`}>
                ARCHITECT: <span className={isHighContrast ? 'text-indigo-700 font-bold' : 'text-cyan-400 font-bold'}>MANISH KUMAR</span>
              </p>
            </div>
          </div>

          {/* Location Coordinates & Real-time Event Countdown */}
          <div className="flex items-center gap-4 md:gap-6">
            <div className={`hidden lg:flex items-center gap-4 text-left border-r pr-6 ${isHighContrast ? 'border-slate-300' : 'border-slate-800'}`}>
              <div className={`font-mono text-[10px] space-y-0.5 leading-tight transition-colors ${isHighContrast ? 'text-indigo-800' : 'text-cyan-500'}`}>
                <p>LAT: 19.1334 N</p>
                <p>LONG: 72.9133 E</p>
              </div>
              <div className={`w-[1px] h-6 ${isHighContrast ? 'bg-slate-300' : 'bg-slate-800'}`} />
              <div className={`font-mono text-[10px] space-y-0.5 leading-tight transition-colors ${isHighContrast ? 'text-slate-650' : 'text-slate-400'}`}>
                <p>ESTD. 1998</p>
                <p>PORTAL V2.6</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`hidden sm:inline-block text-xs font-mono font-medium uppercase tracking-widest text-right ${isHighContrast ? 'text-slate-700' : 'text-slate-400'}`}>
                Festival Starts In
              </span>
              <TechfestCountdown />
            </div>

            {/* Accessibility High Contrast Switch */}
            <button
              onClick={() => setIsHighContrast(!isHighContrast)}
              className={`p-2.5 rounded-xl border flex items-center gap-2 font-mono text-[10px] uppercase font-bold tracking-wider transition-all duration-300 pointer-events-auto cursor-pointer ${
                isHighContrast
                  ? 'bg-indigo-600 border-indigo-700 text-white shadow-sm hover:bg-indigo-500'
                  : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
              title="Toggle High-Contrast Accessibility Theme"
            >
              {isHighContrast ? (
                <>
                  <Moon size={13} className="text-white" />
                  <span className="hidden sm:inline-block">Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun size={13} className="text-amber-400 animate-spin-slow" />
                  <span className="hidden sm:inline-block">Light Mode</span>
                </>
              )}
            </button>

            {/* Ambient Synthesizer Controls */}
            <button
              onClick={handleToggleAudio}
              className={`p-2.5 rounded-xl border flex items-center gap-2 font-mono text-[10px] uppercase font-bold tracking-wider transition-all duration-300 pointer-events-auto cursor-pointer ${
                isAudioPlaying
                  ? (isHighContrast
                    ? 'bg-cyan-100 border-cyan-500 text-cyan-800'
                    : 'bg-cyan-950/40 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-950/50')
                  : (isHighContrast
                    ? 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200 hover:text-slate-850'
                    : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700')
              }`}
              title="Toggle Retro Ambient Synthesizer Drone"
            >
              {isAudioPlaying ? (
                <>
                  <Volume2 size={13} className={isHighContrast ? 'text-cyan-700' : 'text-cyan-400'} />
                  <span className="hidden sm:inline-block animate-pulse">Synth On</span>
                  <div className="hidden md:flex gap-0.5 items-end h-2 w-3">
                    <span className={`w-[1.5px] h-1.5 animate-bounce ${isHighContrast ? 'bg-cyan-700' : 'bg-cyan-400'}`} style={{ animationDelay: '0.1s' }} />
                    <span className={`w-[1.5px] h-2 animate-bounce ${isHighContrast ? 'bg-cyan-700' : 'bg-cyan-400'}`} style={{ animationDelay: '0.3s' }} />
                    <span className={`w-[1.5px] h-1 animate-bounce ${isHighContrast ? 'bg-cyan-700' : 'bg-cyan-400'}`} style={{ animationDelay: '0.2s' }} />
                  </div>
                </>
              ) : (
                <>
                  <VolumeX size={13} />
                  <span className="hidden sm:inline-block">Synth Off</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Single Screen Layout Container */}
      <main className="relative z-10 max-w-7xl mx-auto w-full px-4 py-6 md:px-8 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left column: Event Category Browsing & Searching */}
        <section className="lg:col-span-4 flex flex-col gap-5 h-full min-h-0">
          
          {/* Filters & Controls */}
          <div className={`p-5 border rounded-2xl shadow-2xl transition-all duration-300 flex flex-col gap-4 ${
            isHighContrast
              ? 'border-slate-300 bg-white/95 text-slate-900 shadow-slate-100'
              : 'border-slate-900/80 bg-slate-950/80 backdrop-blur-md'
          }`}>
            <div>
              <h2 className={`text-sm font-bold tracking-wider uppercase mb-1 flex items-center gap-1.5 ${isHighContrast ? 'text-slate-900' : 'text-white'}`}>
                <Compass size={14} className={isHighContrast ? 'text-indigo-700' : 'text-cyan-400'} />
                EXPLORE CENTRAL HUBS
              </h2>
              <p className={`text-xs ${isHighContrast ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                Click nodes directly on the 3D globe or browse categories below.
              </p>
            </div>

            {/* Custom Interactive Search block */}
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isHighContrast ? 'text-slate-600' : 'text-slate-500'}`} size={15} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search robotic, AI, lectures..."
                className={`w-full rounded-xl py-2 pl-9 pr-4 text-xs outline-none transition-colors border ${
                  isHighContrast
                    ? 'bg-slate-100 border-slate-300 text-slate-950 placeholder-slate-600 focus:border-indigo-600'
                    : 'bg-slate-900/70 border-slate-800 text-white placeholder-slate-500 focus:border-cyan-500'
                }`}
                id="techfest-search-input"
              />
            </div>

            {/* Category selection Tabs */}
            <div className="flex flex-col gap-1.5">
              <span className={`text-[10px] uppercase font-mono font-bold tracking-wider ${isHighContrast ? 'text-slate-600 font-bold' : 'text-slate-505 text-slate-500'}`}>
                Filter Event Modules
              </span>
              <div className="grid grid-cols-1 gap-1 font-mono">
                {(['all', 'competitions', 'workshops', 'lectures', 'exhibitions'] as const).map((cat, idx) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setSelectedEventId(null); // Clear active item to zoom back out
                    }}
                    className={`px-3 py-2 text-[11px] font-bold border rounded-lg uppercase tracking-wider transition-all flex justify-between items-center cursor-pointer ${
                      activeCategory === cat
                        ? (isHighContrast
                          ? 'bg-indigo-600 border-indigo-700 text-white'
                          : 'bg-cyan-950/45 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-950/20')
                        : (isHighContrast
                          ? 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-100'
                          : 'bg-slate-900/40 border-slate-900/80 text-slate-400 hover:border-slate-800 hover:text-slate-200')
                    }`}
                  >
                    <span>0{idx} // {cat}</span>
                    <span className={`text-[9px] ${isHighContrast ? 'text-slate-500 font-bold' : 'opacity-60'}`}>
                      {cat === 'all' ? TECHFEST_EVENTS.length : TECHFEST_EVENTS.filter(e => e.category === cat).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3D Visualizer Mode Controller */}
            <div className={`border-t pt-3.5 flex flex-col gap-2 ${isHighContrast ? 'border-slate-200' : 'border-slate-900'}`}>
              <span className={`text-[10px] uppercase font-mono font-bold tracking-wider flex items-center gap-1 ${isHighContrast ? 'text-slate-600' : 'text-slate-500'}`}>
                <Orbit size={11} className={`animate-pulse ${isHighContrast ? 'text-indigo-700' : 'text-violet-400'}`} />
                Hologram Projection Presets
              </span>
              <div className="grid grid-cols-3 gap-1">
                {(['globe', 'constellation', 'quantum'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setVisualMode(mode)}
                    className={`px-1.5 py-1.5 text-[10px] font-mono border rounded-md uppercase tracking-wider flex items-center justify-center gap-1 transition cursor-pointer ${
                      visualMode === mode
                        ? (isHighContrast
                          ? 'bg-indigo-600 border-indigo-700 text-white shadow-sm'
                          : 'bg-cyan-950/55 border-cyan-500 text-cyan-300 shadow-sm shadow-cyan-950')
                        : (isHighContrast
                          ? 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                          : 'bg-slate-900/30 border-slate-900 text-slate-500 hover:text-slate-400')
                    }`}
                  >
                    {mode === 'globe' ? <Globe size={11} /> :
                     mode === 'constellation' ? <Orbit size={11} /> : <Atom size={11} />}
                    <span>{mode}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* List Event Feed Container */}
          <div className={`flex-grow flex flex-col min-h-[220px] max-h-[380px] lg:max-h-none overflow-hidden p-5 border rounded-2xl shadow-2xl transition-all duration-300 ${
            isHighContrast
              ? 'border-slate-300 bg-white/95 text-slate-900 shadow-slate-100'
              : 'border-slate-900/80 bg-slate-950/80 backdrop-blur-md'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <span className={`text-xs font-bold tracking-wider uppercase flex items-center gap-1 ${isHighContrast ? 'text-slate-950 font-bold' : 'text-white'}`}>
                <span>EVENTS PROJECTED</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  isHighContrast ? 'bg-slate-100 border border-slate-200 text-indigo-700' : 'bg-slate-905 bg-slate-900 text-cyan-400'
                }`}>
                  {filteredEvents.length}
                </span>
              </span>
              {activeCategory !== 'all' && (
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`text-[10px] font-bold hover:underline ${isHighContrast ? 'text-indigo-700' : 'text-cyan-500'}`}
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Event list container scrollbar */}
            <div className="flex-grow overflow-y-auto pr-1 space-y-2.5">
              {filteredEvents.length === 0 ? (
                <div className={`py-12 text-center ${isHighContrast ? 'text-slate-500' : 'text-slate-500'}`}>
                  <Compass size={32} className={`mx-auto mb-2.5 opacity-40 ${isHighContrast ? 'text-slate-600' : ''}`} />
                  <p className="text-xs font-bold">No overlapping matrix hubs found</p>
                  <p className={`text-[11px] mt-1 max-w-[200px] mx-auto ${isHighContrast ? 'text-slate-600 font-medium' : 'text-slate-600'}`}>
                    Try adjusting your search query or choosing another module.
                  </p>
                </div>
              ) : (
                filteredEvents.map((event) => {
                  const isSelected = event.id === selectedEventId;
                  const isHovered = event.id === hoveredNodeId;

                  return (
                    <div
                      key={event.id}
                      onClick={() => setSelectedEventId(event.id === selectedEventId ? null : event.id)}
                      onMouseEnter={() => setHoveredNodeId(event.id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                      className={`group cursor-pointer p-3.5 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                        isSelected
                          ? (isHighContrast
                            ? 'border-indigo-600 bg-indigo-50/50 shadow-md border-2 text-slate-950 font-semibold'
                            : 'border-cyan-500 bg-slate-900/90 shadow-lg shadow-cyan-950/30 font-medium')
                          : isHovered
                          ? (isHighContrast
                            ? 'border-slate-400 bg-slate-100'
                            : 'border-indigo-500 bg-slate-900/50')
                          : (isHighContrast
                            ? 'border-slate-250 bg-slate-50/40 hover:border-slate-400 text-slate-850'
                            : 'border-slate-900/80 bg-slate-900/20 hover:border-slate-800')
                      }`}
                    >
                      {/* Dynamic border highlighting */}
                      {isSelected && (
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-indigo-600" />
                      )}

                      <div className="flex items-start justify-between gap-1.5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            {getCategoryIcon(event.category)}
                            <span className={`text-[10px] font-mono uppercase tracking-wider ${isHighContrast ? 'text-slate-600 font-bold' : 'text-slate-400'}`}>
                              {event.category}
                            </span>
                          </div>
                          <h3 className={`text-sm font-bold transition-colors ${
                            isHighContrast
                              ? 'text-slate-900 group-hover:text-indigo-750'
                              : 'text-white group-hover:text-cyan-300'
                          }`}>
                            {highlightFuzzyMatch(event.title, searchQuery)}
                          </h3>
                        </div>
                        <ChevronRight
                          size={15}
                          className={`transition-transform ${
                            isHighContrast
                              ? 'text-slate-500 group-hover:text-indigo-700'
                              : 'text-slate-600 group-hover:text-cyan-400'
                          } ${isSelected ? 'rotate-90' : ''}`}
                        />
                      </div>

                      <p className={`text-xs line-clamp-1 mt-1.5 font-sans ${isHighContrast ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                        {highlightFuzzyMatch(event.tagline, searchQuery)}
                      </p>

                      {event.techKeywords && (
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {event.techKeywords.map((tag) => {
                            const isTagMatch = searchQuery.trim().length > 0 && tag.toLowerCase().includes(searchQuery.toLowerCase());
                            return (
                              <span
                                key={tag}
                                className={`text-[9px] font-mono px-2 py-0.5 rounded border transition-colors ${
                                  isTagMatch
                                    ? (isHighContrast
                                      ? 'bg-indigo-100 border-indigo-400 text-indigo-800 font-bold'
                                      : 'bg-cyan-950/45 border-cyan-500/55 text-cyan-300')
                                    : (isHighContrast
                                      ? 'bg-slate-50 border-slate-205 text-slate-600'
                                      : 'bg-slate-900/30 border-slate-900/75 text-slate-500')
                                }`}
                              >
                                {highlightFuzzyMatch(tag, searchQuery)}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      <div className={`mt-3 flex items-center justify-between gap-2 border-t pt-2 text-[10px] font-mono ${
                        isHighContrast ? 'border-slate-200 text-slate-600' : 'border-slate-950/60 text-slate-500'
                      }`}>
                        <span className="truncate">{event.date}</span>
                        <span className={`font-semibold ${isHighContrast ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>{event.prizeOrVenue}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>

        {/* Center Canvas UI Tooltip & Legend Anchor */}
        <section className="lg:col-span-4 relative flex flex-col justify-between pointer-events-none">
          
          {/* Active Hover Tooltip floating in central stage */}
          <div className="w-full flex justify-center pt-2">
            {hoveredNodeId && (
              <div className={`px-4 py-2 border rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-2.5 animate-bounce ${
                isHighContrast
                  ? 'bg-white/95 border-indigo-650 text-slate-950 shadow-slate-100'
                  : 'bg-slate-950/90 border-cyan-800/80 text-white shadow-cyan-950/30'
              }`}>
                {getCategoryIcon(TECHFEST_EVENTS.find(e => e.id === hoveredNodeId)?.category || '')}
                <div>
                  <h4 className={`text-xs font-bold ${isHighContrast ? 'text-slate-900' : 'text-white'}`}>
                    {TECHFEST_EVENTS.find((e) => e.id === hoveredNodeId)?.title}
                  </h4>
                  <p className={`text-[10px] font-mono uppercase tracking-widest ${isHighContrast ? 'text-indigo-705 text-indigo-750 font-bold' : 'text-cyan-400'}`}>
                    Interactive Node Connected
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sphere Node Color Guild Indicator - Legend */}
          <div className={`p-4 border rounded-xl backdrop-blur-md self-center pointer-events-auto shadow-xl max-w-xs mb-4 ${
            isHighContrast
              ? 'border-slate-300 bg-white/95 text-slate-900 shadow-slate-100'
              : 'border-slate-900/60 bg-slate-950/70 text-slate-300'
          }`}>
            <span className={`text-[9px] font-mono font-bold tracking-widest uppercase block mb-2.5 text-center ${isHighContrast ? 'text-slate-600' : 'text-slate-400'}`}>
              Constellation Nodes Map
            </span>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px]">
              <div className="flex items-center gap-1.5 hover:scale-105 transition-transform">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-md" />
                <span className={isHighContrast ? 'text-slate-800 font-semibold' : 'text-slate-300'}>Competitions</span>
              </div>
              <div className="flex items-center gap-1.5 hover:scale-105 transition-transform">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-md" />
                <span className={isHighContrast ? 'text-slate-800 font-semibold' : 'text-slate-300'}>Keynotes</span>
              </div>
              <div className="flex items-center gap-1.5 hover:scale-105 transition-transform">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-md" />
                <span className={isHighContrast ? 'text-slate-800 font-semibold' : 'text-slate-300'}>Workshops</span>
              </div>
              <div className="flex items-center gap-1.5 hover:scale-105 transition-transform">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-md" />
                <span className={isHighContrast ? 'text-slate-800 font-semibold' : 'text-slate-300'}>Exhibitions</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right column: Selected Event Detail View / Dashboard & Registrations */}
        <section className="lg:col-span-4 flex flex-col gap-5 h-full min-h-0">
          
          {/* Active Selected Details Container */}
          <div className={`flex-grow flex flex-col p-5 border rounded-2xl shadow-2xl h-[40%] lg:h-[60%] overflow-hidden relative transition-all duration-300 ${
            isHighContrast
              ? 'border-slate-300 bg-white/95 text-slate-900 shadow-slate-100'
              : 'border-slate-900/80 bg-slate-950/80 backdrop-blur-md'
          }`}>
            {selectedEvent ? (
              <div className="flex flex-col h-full overflow-y-auto pr-1">
                {/* Visual Accent Badge */}
                <div className="flex items-center justify-between gap-2 max-w-full">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-lg text-[10px] font-bold uppercase tracking-wider ${getCategoryBadgeClass(selectedEvent.category)}`}>
                    {getCategoryIcon(selectedEvent.category)}
                    <span>{selectedEvent.category}</span>
                  </span>
                  
                  <button
                    onClick={() => setSelectedEventId(null)}
                    className={`text-[10px] font-mono rounded-md px-1.5 py-1 border transition cursor-pointer ${
                      isHighContrast
                        ? 'text-slate-600 border-slate-300 bg-slate-100 hover:bg-slate-200 hover:text-slate-950 font-semibold'
                        : 'text-slate-505 text-slate-500 hover:text-white border-slate-900 bg-slate-900/40'
                    }`}
                  >
                    Reset Zoom
                  </button>
                </div>

                <h2 className={`text-xl font-extrabold tracking-tight mt-4 ${isHighContrast ? 'text-slate-900 font-black' : 'text-white'}`}>
                  {selectedEvent.title}
                </h2>
                <p className={`text-xs font-semibold mt-1 ${isHighContrast ? 'text-indigo-800' : 'text-cyan-400'}`}>
                  {selectedEvent.tagline}
                </p>

                <p className={`text-xs mt-4 leading-relaxed border p-3 rounded-xl ${
                  isHighContrast
                    ? 'bg-slate-50 border-slate-200 text-slate-800 font-semibold'
                    : 'bg-slate-900/30 border-slate-900 text-slate-300'
                }`}>
                  {selectedEvent.description}
                </p>

                {/* Event Schedule details */}
                <div className={`mt-4 space-y-2 border-y py-3 text-xs ${isHighContrast ? 'border-slate-200' : 'border-slate-900'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1">
                      <CalendarDays size={13} className="text-violet-500" />
                      Date Schedule
                    </span>
                    <span className={`font-semibold ${isHighContrast ? 'text-slate-900 font-bold' : 'text-white'}`}>{selectedEvent.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-550 text-slate-500 flex items-center gap-1">
                      <Gift size={13} className="text-cyan-600" />
                      Prize / Arena
                    </span>
                    <span className={`font-semibold ${isHighContrast ? 'text-slate-900 font-bold' : 'text-white'}`}>{selectedEvent.prizeOrVenue}</span>
                  </div>
                </div>

                {/* Tech specifications of this event node */}
                <div className="mt-4">
                  <span className={`text-[10px] font-mono uppercase tracking-wider block mb-2 ${isHighContrast ? 'text-slate-600' : 'text-slate-505 text-slate-550 text-slate-500'}`}>
                    Involved Core Technologies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEvent.techKeywords.map((tag) => (
                      <span
                        key={tag}
                        className={`px-2 py-1 rounded border text-[10px] font-mono ${
                          isHighContrast
                            ? 'bg-slate-50 border-slate-200 text-slate-800 font-semibold'
                            : 'bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Immediate Registration Action CTA button */}
                <div className="mt-6 pt-2">
                  <button
                    onClick={() => setRegisteringEvent(selectedEvent)}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40 cursor-pointer"
                  >
                    <Ticket size={14} />
                    <span>Secure Digital Pass</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center py-12 p-3">
                <div className={`w-12 h-12 flex items-center justify-center rounded-full border mb-3.5 ${
                  isHighContrast ? 'bg-slate-50 border-slate-300 text-indigo-700 shadow-sm' : 'bg-slate-900 border-slate-800 text-cyan-500'
                }`}>
                  <Info size={22} className="animate-pulse" />
                </div>
                <h3 className={`text-sm font-bold uppercase tracking-wider ${isHighContrast ? 'text-slate-900' : 'text-white'}`}>No Sector Lock</h3>
                <p className={`text-xs max-w-xs mt-2 leading-relaxed ${isHighContrast ? 'text-slate-755 text-slate-700 font-semibold' : 'text-slate-400'}`}>
                  Hover and click on rotating glowing vertices of our 3D Tech Constellation Globe in the center to unlock details on specific competitions and workshops.
                </p>
                <div className={`mt-5 text-[10px] font-mono border px-3 py-1.5 rounded ${
                  isHighContrast ? 'bg-indigo-50 border-indigo-200 text-indigo-800 font-bold' : 'bg-slate-900/60 border-slate-900 text-cyan-400'
                }`}>
                  SELECT NODE ON ROTATING GLOBE
                </div>
              </div>
            )}
          </div>

          {/* Secure Registered Ticket Pass Dashboard */}
          <div className={`p-5 border rounded-2xl shadow-2xl h-[60%] lg:h-[40%] overflow-hidden flex flex-col transition-all duration-300 ${
            isHighContrast
              ? 'border-slate-300 bg-white/95 text-slate-900 shadow-slate-100'
              : 'border-slate-900/80 bg-slate-950/80 backdrop-blur-md'
          }`}>
            <h3 className={`text-xs font-bold tracking-wider uppercase mb-3 flex items-center gap-1.5 ${isHighContrast ? 'text-slate-900' : 'text-white'}`}>
              <Ticket size={13} className={isHighContrast ? 'text-indigo-705 text-indigo-800' : 'text-indigo-400'} />
              YOUR DIGITAL PASSES
            </h3>
            
            <div className="flex-grow overflow-hidden">
              <MyRegistrationsList
                onRefreshTrigger={refreshTrigger}
                isHighContrast={isHighContrast}
                onSelectEvent={(id) => {
                  setSelectedEventId(id);
                }}
              />
            </div>
          </div>
        </section>
      </main>

      {/* Embedded footer with statistics */}
      <footer className={`relative z-10 w-full px-4 py-5 border-t transition-colors duration-300 ${
        isHighContrast
          ? 'border-slate-300 bg-white/95 text-slate-950 shadow-sm'
          : 'border-slate-900/60 bg-slate-950/80 backdrop-blur-md text-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-10">
            {TECHFEST_STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className={`font-mono text-lg sm:text-xl font-bold ${
                  isHighContrast
                    ? 'text-indigo-805 text-indigo-800'
                    : 'bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent'
                }`}>
                  {stat.value}
                </span>
                <span className={`text-[10px] font-mono uppercase tracking-widest mt-0.5 ${
                  isHighContrast ? 'text-slate-600 font-bold' : 'text-slate-505 text-slate-500'
                }`}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Event Coordination Metadata info & Social Connections */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs font-mono">
            <div className={`flex items-center gap-3 p-2.5 px-4 border rounded-xl ${
              isHighContrast ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/30 border-slate-900'
            }`}>
              <a
                href="https://github.com/techfest-iitb"
                target="_blank"
                rel="noreferrer"
                className={`transition-all transform hover:scale-110 ${
                  isHighContrast ? 'text-slate-600 hover:text-indigo-800' : 'text-slate-505 text-slate-500 hover:text-cyan-400'
                }`}
                title="IIT Bombay Techfest - GitHub"
              >
                <Github size={16} />
              </a>
              <span className={isHighContrast ? 'text-slate-300' : 'text-slate-805 text-slate-800'}>|</span>
              <a
                href="https://instagram.com/techfestiitbombay"
                target="_blank"
                rel="noreferrer"
                className={`transition-all transform hover:scale-110 ${
                  isHighContrast ? 'text-slate-600 hover:text-pink-600' : 'text-slate-505 text-slate-500 hover:text-pink-500'
                }`}
                title="IIT Bombay Techfest - Instagram"
              >
                <Instagram size={16} />
              </a>
              <span className={isHighContrast ? 'text-slate-300' : 'text-slate-805 text-slate-800'}>|</span>
              <a
                href="https://linkedin.com/company/techfest-iit-bombay"
                target="_blank"
                rel="noreferrer"
                className={`transition-all transform hover:scale-110 ${
                  isHighContrast ? 'text-slate-600 hover:text-indigo-700' : 'text-slate-505 text-slate-500 hover:text-cyan-500'
                }`}
                title="IIT Bombay Techfest - LinkedIn"
              >
                <Linkedin size={16} />
              </a>
            </div>

            <div className={`p-2.5 px-4 border rounded-xl leading-relaxed ${
              isHighContrast ? 'text-slate-600 bg-slate-100 border-slate-200' : 'text-slate-505 text-slate-500 bg-slate-955 bg-slate-950/40 border-slate-950'
            }`}>
              <span>© 2026 IIT BOMBAY TECHFEST // 3D GRAPHICS PROJECTION PORTAL</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Sliding Registration Form Modal */}
      {registeringEvent && (
        <RegistrationForm
          event={registeringEvent}
          isHighContrast={isHighContrast}
          onClose={() => setRegisteringEvent(null)}
          onSuccess={() => {
            setRegisteringEvent(null);
            setRefreshTrigger((prev) => prev + 1); // trigger auto reload of ticket passes list
          }}
        />
      )}

      {/* Decorative Peripheral UI Nodes & Interactive Visual Decors from Immersive UI theme */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 hidden xl:flex flex-col gap-6 pointer-events-none z-10">
        <div className={`w-10 h-10 border flex items-center justify-center ${
          isHighContrast ? 'border-slate-300 bg-slate-100/50' : 'border-white/5 bg-[#020617]/50'
        }`}>
          <div className={`w-1.5 h-1.5 ${isHighContrast ? 'bg-indigo-600' : 'bg-cyan-500'}`} />
        </div>
        <div className={`writing-vertical-rl rotate-180 font-mono text-[9px] tracking-[0.3em] uppercase space-y-4 pt-4 border-t ${
          isHighContrast ? 'border-slate-300 text-slate-500' : 'border-white/5 text-white/30'
        }`}>
          <span>IITB-TF-26 // NEURAL SYSTEM INGRESS</span>
        </div>
      </div>

      <div className="absolute top-1/2 right-4 -translate-y-1/2 hidden xl:flex flex-col gap-2 pointer-events-none z-10 items-end">
        <div className={`w-1 h-1 ${isHighContrast ? 'bg-slate-900' : 'bg-white'}`} />
        <div className={`w-1 h-1 ${isHighContrast ? 'bg-slate-600' : 'bg-white/40'}`} />
        <div className={`w-1 h-1 ${isHighContrast ? 'bg-slate-400' : 'bg-white/20'}`} />
        <div className={`w-1 h-1 ${isHighContrast ? 'bg-slate-305 bg-slate-300' : 'bg-white/10'}`} />
        <div className={`w-[1px] h-12 my-1 ${isHighContrast ? 'bg-slate-205 bg-slate-305 bg-slate-300' : 'bg-white/10'}`} />
        <span className={`font-mono text-[8px] uppercase tracking-[0.2em] [writing-mode:vertical-lr] ${
          isHighContrast ? 'text-slate-500 font-bold' : 'text-white/20'
        }`}>PROJECTION LIVE</span>
      </div>
    </div>
  );
}
