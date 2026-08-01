// SCHEMA GUIDE:
// id: Unique integer
// name: String
// tier: 1 (Minion), 2 (Striker), 3 (Elite), 4 (Boss)
// type: String matching the tier name for filtering
// hp: Base health pool (Integer)
// barriers: Array of integers representing shield layers (e.g., [30, 30] for two 30HP barriers)
// abilities: Array of strings

export const bestiary = [
  {
    id: 1,
    name: 'Null-Sec Drone',
    tier: 1,
    type: 'Minion',
    hp: 15,
    barriers: [],
    abilities: ['Taser Sweep (2 DMG)'],
  },
  {
    id: 2,
    name: 'Void Stalker',
    tier: 2,
    type: 'Striker',
    hp: 45,
    barriers: [10],
    abilities: ['Flank Attack (+3 DMG)', 'Phase Shift'],
  },
  {
    id: 3,
    name: 'Aegis Juggernaut',
    tier: 3,
    type: 'Elite',
    hp: 80,
    barriers: [20, 20],
    abilities: ['Ground Slam (AoE 1)', 'Siphon Aura'],
  },
  {
    id: 4,
    name: 'Nexus Core Warden',
    tier: 4,
    type: 'Boss',
    hp: 120,
    barriers: [30, 30],
    abilities: [
      'Overload Beam (AoE 2)',
      'Reality Fracture (Major Terrain)',
      'Oppressive Siphon',
    ],
  },
  // Add enemies 5 through 50 here...
];
