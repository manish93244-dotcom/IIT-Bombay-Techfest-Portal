import { EventDetail } from './types';

export const TECHFEST_EVENTS: EventDetail[] = [
  {
    id: 'robotic-challenge',
    title: 'Meshmerize & IRC',
    tagline: 'The Ultimate Autonomous Robotics Battleground',
    description: 'Design, build, and program heavy-duty autonomous robots capable of navigating complex obstacle courses, decoding grid terrains in real-time, and competing head-to-head with top global universities.',
    category: 'competitions',
    prizeOrVenue: 'Prize Pool: ₹5,00,000',
    date: 'December 18, 2026',
    icon: 'Cpu',
    techKeywords: ['Pathfinding', 'PID Tuning', 'Computer Vision', 'LiDAR Sensors'],
    nodePosition: { x: 1.2, y: 1.0, z: 0.8 }
  },
  {
    id: 'aeromodelling',
    title: 'Boeing National Championship',
    tagline: 'High-Speed Aerial Maneuvers and Innovation',
    description: 'Build micro-aerial vehicles and fixed-wing RC aircraft evaluated for structural integrity, payload capacity, energy efficiency, and dynamic flight mechanics in extreme conditions.',
    category: 'competitions',
    prizeOrVenue: 'Prize Pool: ₹3,50,000',
    date: 'December 19, 2026',
    icon: 'Plane',
    techKeywords: ['Aerodynamics', 'RC Avionics', 'Carbon Fiber', 'Propulsion'],
    nodePosition: { x: -1.4, y: 0.6, z: 1.1 }
  },
  {
    id: 'astro-physics',
    title: 'Keynote: Space Exploration Frontiers',
    tagline: 'A Lecture on Deep Space Trajectories',
    description: 'An inspiring keynote address by pioneering scientists exploring deep-space propulsion, lunar base architecture, and the search for biosignatures inside icy ocean worlds.',
    category: 'lectures',
    prizeOrVenue: 'Main Stage Convocation Hall',
    date: 'December 18, 2026',
    icon: 'Sparkles',
    techKeywords: ['Exoplanets', 'Orbital Mechanics', 'Fusion Propulsion', 'NASA Insight'],
    nodePosition: { x: 0.2, y: -1.5, z: 1.1 }
  },
  {
    id: 'ai-summit',
    title: 'Generative AI & LLMs Workshop',
    tagline: 'Hands-on Edge Computing and Neural Architecture',
    description: 'Explore state-of-the-art transformer block optimizations, training parameters, prompt engineering pipelines, and fine-tuning lightweight models to deploy locally on low-power devices.',
    category: 'workshops',
    prizeOrVenue: 'LC 101 Lecture Hall',
    date: 'December 20, 2026',
    icon: 'Brain',
    techKeywords: ['Transformers', 'PyTorch', 'Quantization', 'Model Fine-tuning'],
    nodePosition: { x: -1.0, y: -1.1, z: -1.2 }
  },
  {
    id: 'quantum-computing',
    title: 'Quantum Cryptography Challenge',
    tagline: 'Coding Secure Protocols in a Post-Quantum World',
    description: 'A dedicated interactive workshop on IBM Qiskit and cybersecurity paradigms. Write error-correcting algorithms and establish unbreakable quantum-key distribution paths.',
    category: 'workshops',
    prizeOrVenue: 'Computer Center Lab A',
    date: 'December 19, 2026',
    icon: 'GitPullRequest',
    techKeywords: ['Superposition', 'Qiskit', 'QKD Protocols', 'Post-Quantum Crypto'],
    nodePosition: { x: 1.5, y: -0.5, z: -0.9 }
  },
  {
    id: 'tech-exhibition',
    title: 'Global Tech Innovation Summit',
    tagline: 'Showcasing Prototypes of Tomorrow',
    description: 'Tour high-tech interactive exhibits brought in by international labs, showing humanoids, high-speed hyperloop scale models, and real-time brain-computer interfaces (BCI).',
    category: 'exhibitions',
    prizeOrVenue: 'Tech Hall A & B',
    date: 'December 18-20, 2026',
    icon: 'Eye',
    techKeywords: ['Humanoids', 'Hyperloop', 'BCI Brainwave', 'Augmented Reality'],
    nodePosition: { x: 0.8, y: 1.4, z: -1.0 }
  },
  {
    id: 'climate-hackathon',
    title: 'Green-Tech Innovation Hackathon',
    tagline: 'Decarbonizing Industry with Smart Grid Algorithms',
    description: 'Code and present software architectures targeting waste mitigation, carbon credit verification networks, or decentralized microgrid distribution algorithms.',
    category: 'competitions',
    prizeOrVenue: 'Prize Pool: ₹4,00,000',
    date: 'December 20, 2026',
    icon: 'Leaf',
    techKeywords: ['Smart Grids', 'IOT Sensors', 'Carbon Accounting', 'Renewables'],
    nodePosition: { x: -0.5, y: 1.6, z: 0.5 }
  }
];

export const TECHFEST_STATS = [
  { label: 'Footfall', value: '180,000+' },
  { label: 'Colleges', value: '2,500+' },
  { label: 'Events', value: '50+' },
  { label: 'Prize Pool', value: '₹40L+' },
];
