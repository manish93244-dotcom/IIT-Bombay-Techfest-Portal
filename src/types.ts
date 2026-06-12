export interface EventDetail {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: 'competitions' | 'lectures' | 'workshops' | 'exhibitions';
  prizeOrVenue: string;
  date: string;
  icon: string;
  techKeywords: string[];
  nodePosition: { x: number; y: number; z: number }; // Coordinates on our 3D Globe
}

export type VisualMode = 'constellation' | 'globe' | 'quantum';

export interface TechfestState {
  selectedEventId: string | null;
  activeCategory: 'all' | EventDetail['category'];
  visualMode: VisualMode;
  hoveredNodeId: string | null;
  searchQuery: string;
}
