/**
 * RESONANCE ENGINE V2.0 - OFFICIAL BESTIARY
 * 
 * STRICT FORMATTING ENFORCED:
 * - Abilities MUST follow the syntax: "Name (X Res): deals Y [Element] damage range Z-Z [shape] [terrain: type] [applies [State]]"
 * - Range MUST be explicitly declared (e.g., "range 1" or "range 0-5") to prevent grid physics crashes.
 */

export const bestiary = [
    // ---------------------------------------------------------
    // THERMAL ENTITIES
    // ---------------------------------------------------------
    { id: '101', name: 'Ash-Stalker', tier: 1, hp: 15, barriers: [], affinity: 'Thermal', abilities: ['Ember Dart (1 Res): deals 3 Thermal damage range 2-4 applies [Burn]'] },
    { id: '102', name: 'Pyro-Clast', tier: 1, hp: 18, barriers: [5], affinity: 'Thermal', abilities: ['Scorch (1 Res): deals 5 Thermal damage range 1-3 applies [Burn]', 'Magma Pool (2 Res): deals 2 Thermal damage range 1-3 1-hex radius terrain: major'] },
    { id: '103', name: 'Scorch-Hound', tier: 1, hp: 12, barriers: [], affinity: 'Thermal', abilities: ['Flame Bite (1 Res): deals 4 Thermal damage range 1 applies [Bleed]'] },
    { id: '104', name: 'Ember-Hulk', tier: 2, hp: 35, barriers: [10], affinity: 'Thermal', abilities: ['Heat Smash (2 Res): deals 6 Thermal damage range 1 applies [Knockdown]', 'Ignite (2 Res): deals 4 Thermal damage range 1-3 cluster3 terrain: minor'] },
    { id: '105', name: 'Magma-Weaver', tier: 2, hp: 25, barriers: [15], affinity: 'Thermal', abilities: ['Lava Burst (3 Res): deals 5 Thermal damage range 1-4 1-hex radius terrain: major', 'Thermal Vent (1 Res): deals 3 Thermal damage range 1 line3'] },
    { id: '106', name: 'Solar Flare', tier: 3, hp: 50, barriers: [15, 10], affinity: 'Thermal', abilities: ['Sunbeam (3 Res): deals 8 Thermal damage range 1-10 line3 applies [Blind]', 'Supernova (4 Res): deals 6 Thermal damage range 0 2-hex radius applies [Burn]'] },
    { id: '107', name: 'Inferno Lord', tier: 4, hp: 80, barriers: [20, 20], affinity: 'Thermal', abilities: ['Hellfire (4 Res): deals 10 Thermal damage range 1-6 2-hex radius terrain: severe', 'Incinerate (3 Res): deals 8 Thermal damage range 1-2 applies [Execute]'] },

    // ---------------------------------------------------------
    // CRYO ENTITIES
    // ---------------------------------------------------------
    { id: '108', name: 'Ice-Biter', tier: 1, hp: 12, barriers: [], affinity: 'Cryo', abilities: ['Frost Nip (1 Res): deals 3 Cryo damage range 1 applies [Slowed]'] },
    { id: '109', name: 'Cryo-Strider', tier: 1, hp: 20, barriers: [5], affinity: 'Cryo', abilities: ['Frost Spit (1 Res): deals 4 Cryo damage range 2-4 applies [Slowed]', 'Glacial Burst (2 Res): deals 3 Cryo damage range 0-3 1-hex radius terrain: minor'] },
    { id: '110', name: 'Hail-Sprite', tier: 1, hp: 10, barriers: [5], affinity: 'Cryo', abilities: ['Hailstone (1 Res): deals 2 Cryo damage range 3-5'] },
    { id: '111', name: 'Frost-Brute', tier: 2, hp: 40, barriers: [10], affinity: 'Cryo', abilities: ['Ice Smash (2 Res): deals 6 Cryo damage range 1 applies [Stunned]'] },
    { id: '112', name: 'Blizzard-Wraith', tier: 2, hp: 25, barriers: [15], affinity: 'Cryo', abilities: ['Freezing Wind (3 Res): deals 4 Cryo damage range 1 line3 applies [Blind]', 'Flash Freeze (2 Res): deals 3 Cryo damage range 1-4 cluster3 terrain: major'] },
    { id: '113', name: 'Glacier-Mage', tier: 3, hp: 45, barriers: [20, 10], affinity: 'Cryo', abilities: ['Ice Wall (3 Res): deals 5 Cryo damage range 1-4 line3 terrain: severe', 'Shatter (2 Res): deals 6 Cryo damage range 1-3 applies [Vulnerable]'] },
    { id: '114', name: 'Zero-Kelvin Anomaly', tier: 4, hp: 75, barriers: [25, 25], affinity: 'Cryo', abilities: ['Absolute Zero (4 Res): deals 8 Cryo damage range 0-3 2-hex radius applies [Immobilized]', 'Deep Freeze (3 Res): deals 5 Cryo damage range 1-5 cluster3 terrain: severe'] },

    // ---------------------------------------------------------
    // TOXIC ENTITIES
    // ---------------------------------------------------------
    { id: '115', name: 'Sludge-Crawler', tier: 1, hp: 15, barriers: [], affinity: 'Toxic', abilities: ['Acid Spit (1 Res): deals 3 Toxic damage range 1-3 applies [Poisoned]'] },
    { id: '116', name: 'Venom-Spitter', tier: 1, hp: 18, barriers: [5], affinity: 'Toxic', abilities: ['Toxic Dart (1 Res): deals 4 Toxic damage range 2-4 applies [Poisoned]'] },
    { id: '117', name: 'Smog-Wisp', tier: 1, hp: 12, barriers: [5], affinity: 'Toxic', abilities: ['Noxious Fumes (2 Res): deals 2 Toxic damage range 0-3 cluster3 terrain: minor'] },
    { id: '118', name: 'Tox-Hulk', tier: 2, hp: 30, barriers: [10, 10], affinity: 'Toxic', abilities: ['Venom Lash (1 Res): deals 6 Toxic damage range 1-2 applies [Poisoned]', 'Acid Pool (2 Res): deals 4 Toxic damage range 1-3 1-hex radius terrain: major'] },
    { id: '119', name: 'Acid-Pudding', tier: 2, hp: 40, barriers: [5], affinity: 'Toxic', abilities: ['Corrode (2 Res): deals 5 Toxic damage range 1 applies [Vulnerable]'] },
    { id: '120', name: 'Plague-Bearer', tier: 3, hp: 50, barriers: [15, 15], affinity: 'Toxic', abilities: ['Viral Outbreak (3 Res): deals 6 Toxic damage range 0-4 2-hex radius applies [Poisoned]', 'Decay (2 Res): deals 5 Toxic damage range 1-3'] },
    { id: '121', name: 'Bio-Hazard Prime', tier: 4, hp: 85, barriers: [20, 20, 10], affinity: 'Toxic', abilities: ['Meltdown (4 Res): deals 9 Toxic damage range 0-5 2-hex radius terrain: severe', 'Lethal Dose (3 Res): deals 8 Toxic damage range 1 applies [Execute]'] },

    // ---------------------------------------------------------
    // VOID ENTITIES
    // ---------------------------------------------------------
    { id: '122', name: 'Shadow-Fiend', tier: 1, hp: 15, barriers: [5], affinity: 'Void', abilities: ['Dark Strike (1 Res): deals 4 Void damage range 1'] },
    { id: '123', name: 'Warp-Hound', tier: 1, hp: 12, barriers: [], affinity: 'Void', abilities: ['Phase Bite (1 Res): deals 3 Void damage range 1 applies [Blind]'] },
    { id: '124', name: 'Null-Wisp', tier: 1, hp: 10, barriers: [10], affinity: 'Void', abilities: ['Entropy Dart (1 Res): deals 2 Void damage range 3-5'] },
    { id: '125', name: 'Void-Weaver', tier: 2, hp: 25, barriers: [15], affinity: 'Void', abilities: ['Entropy Ray (2 Res): deals 8 Void damage range 3-6', 'Singularity (3 Res): deals 5 Void damage range 1-4 1-hex radius applies [Immobilized]'] },
    { id: '126', name: 'Abyss-Stalker', tier: 2, hp: 35, barriers: [10, 5], affinity: 'Void', abilities: ['Shadow Step (2 Res): deals 6 Void damage range 1-2 applies [Evasive]'] },
    { id: '127', name: 'Entropy-Sphere', tier: 3, hp: 45, barriers: [20, 20], affinity: 'Void', abilities: ['Gravity Well (3 Res): deals 5 Void damage range 1-5 2-hex radius terrain: major', 'Nullify (2 Res): deals 7 Void damage range 1 line3'] },
    { id: '128', name: 'Cosmic-Horror', tier: 4, hp: 90, barriers: [30, 20], affinity: 'Void', abilities: ['Astral Collapse (4 Res): deals 10 Void damage range 0-6 2-hex radius applies [Stunned]', 'Oblivion (4 Res): deals 5 Void damage range 1-4 cluster3 terrain: severe'] },

    // ---------------------------------------------------------
    // RADIANT ENTITIES
    // ---------------------------------------------------------
    { id: '129', name: 'Luminous-Wisp', tier: 1, hp: 12, barriers: [5], affinity: 'Radiant', abilities: ['Flash (1 Res): deals 2 Radiant damage range 1-3 applies [Blind]'] },
    { id: '130', name: 'Sun-Zealot', tier: 1, hp: 20, barriers: [5], affinity: 'Radiant', abilities: ['Holy Strike (1 Res): deals 4 Radiant damage range 1 applies [Shielded]'] },
    { id: '131', name: 'Dawn-Seeker', tier: 1, hp: 15, barriers: [5], affinity: 'Radiant', abilities: ['Light Ray (1 Res): deals 3 Radiant damage range 2-5'] },
    { id: '132', name: 'Aegis Sentinel', tier: 2, hp: 40, barriers: [5, 5, 5], affinity: 'Radiant', abilities: ['Purge (1 Res): deals 5 Radiant damage range 1 applies [Knockdown]', 'Holy Nova (3 Res): deals 6 Radiant damage range 0-3 2-hex radius'] },
    { id: '133', name: 'Purifier', tier: 2, hp: 30, barriers: [15, 10], affinity: 'Radiant', abilities: ['Cleansing Flame (2 Res): deals 6 Radiant damage range 1 line3 applies [Burn]'] },
    { id: '134', name: 'Holy-Avenger', tier: 3, hp: 55, barriers: [20, 10], affinity: 'Radiant', abilities: ['Smite (3 Res): deals 8 Radiant damage range 1-2 applies [Execute]', 'Aura of Light (2 Res): deals 4 Radiant damage range 0-3 1-hex radius'] },
    { id: '135', name: 'Divine Oracle', tier: 4, hp: 75, barriers: [25, 25, 10], affinity: 'Radiant', abilities: ['Judgment (4 Res): deals 10 Radiant damage range 1-5 cluster3 applies [Stunned]', 'Sanctuary (3 Res): deals 5 Radiant damage range 0-4 2-hex radius applies [Invulnerable]'] },

    // ---------------------------------------------------------
    // ELECTRO ENTITIES
    // ---------------------------------------------------------
    { id: '136', name: 'EMP-Drone', tier: 1, hp: 10, barriers: [5], affinity: 'Electro', abilities: ['Zap (1 Res): deals 2 Electro damage range 1-3 applies [Shocked]'] },
    { id: '137', name: 'Spark-Hound', tier: 1, hp: 15, barriers: [], affinity: 'Electro', abilities: ['Jolt (1 Res): deals 4 Electro damage range 1-3 applies [Shocked]', 'Static Dash (2 Res): deals 3 Electro damage range 1 line3 applies [Blind]'] },
    { id: '138', name: 'Arc-Sprite', tier: 1, hp: 12, barriers: [5], affinity: 'Electro', abilities: ['Chain Lightning (2 Res): deals 3 Electro damage range 1-4 cluster3'] },
    { id: '139', name: 'Volt-Striker', tier: 2, hp: 30, barriers: [10, 5], affinity: 'Electro', abilities: ['Thunder Punch (2 Res): deals 6 Electro damage range 1 applies [Knockdown]'] },
    { id: '140', name: 'Magneto-Construct', tier: 2, hp: 45, barriers: [15], affinity: 'Electro', abilities: ['Magnetic Pull (2 Res): deals 4 Electro damage range 2-4 applies [Immobilized]'] },
    { id: '141', name: 'Galvanic-Golem', tier: 3, hp: 60, barriers: [20, 10], affinity: 'Electro', abilities: ['Overload (3 Res): deals 7 Electro damage range 0-3 1-hex radius terrain: minor', 'Lightning Storm (3 Res): deals 5 Electro damage range 0-5 2-hex radius applies [Shocked]'] },
    { id: '142', name: 'Thunder-Wyrm', tier: 4, hp: 85, barriers: [25, 20], affinity: 'Electro', abilities: ['Plasma Breath (4 Res): deals 10 Electro damage range 1 line3 terrain: major', 'Static Field (3 Res): deals 6 Electro damage range 1-4 cluster3 terrain: severe'] },

    // ---------------------------------------------------------
    // KINETIC ENTITIES
    // ---------------------------------------------------------
    { id: '143', name: 'Dust-Devil', tier: 1, hp: 15, barriers: [], affinity: 'Kinetic', abilities: ['Wind Slash (1 Res): deals 3 Kinetic damage range 1-2 applies [Haste]'] },
    { id: '144', name: 'Aero-Blade', tier: 1, hp: 18, barriers: [5], affinity: 'Kinetic', abilities: ['Gale Strike (1 Res): deals 4 Kinetic damage range 1-3'] },
    { id: '145', name: 'Stone-Gargoyle', tier: 2, hp: 35, barriers: [15], affinity: 'Kinetic', abilities: ['Slam (2 Res): deals 5 Kinetic damage range 1 applies [Knockdown]'] },
    { id: '146', name: 'Blood-Reaver', tier: 2, hp: 40, barriers: [10, 5], affinity: 'Kinetic', abilities: ['Lacerate (2 Res): deals 6 Kinetic damage range 1 applies [Bleed]'] },
    { id: '147', name: 'Geo-Breaker', tier: 3, hp: 50, barriers: [15, 15], affinity: 'Kinetic', abilities: ['Shatter (2 Res): deals 10 Kinetic damage range 1 applies [Vulnerable]', 'Bedrock Slam (4 Res): deals 8 Kinetic damage range 1-4 cluster3 terrain: severe'] },
    { id: '148', name: 'Steel-Juggernaut', tier: 3, hp: 65, barriers: [20, 20], affinity: 'Kinetic', abilities: ['Charge (3 Res): deals 7 Kinetic damage range 1 line3 applies [Stunned]'] },
    { id: '149', name: 'Seismic-Titan', tier: 4, hp: 90, barriers: [30, 20, 10], affinity: 'Kinetic', abilities: ['Earthquake (4 Res): deals 8 Kinetic damage range 0-5 2-hex radius terrain: major', 'Fissure (3 Res): deals 6 Kinetic damage range 1 line3 terrain: severe'] },

    // ---------------------------------------------------------
    // APEX TIER (BOSS)
    // ---------------------------------------------------------
    { id: '150', name: 'The Resonance Core', tier: 5, hp: 150, barriers: [50, 50, 50, 50], affinity: 'Void', abilities: ['Reality Tear (5 Res): deals 12 Void damage range 0-6 2-hex radius terrain: severe', 'Erase (4 Res): deals 10 Void damage range 1-5 applies [Execute]', 'System Overload (5 Res): deals 8 Void damage range 1-4 cluster3 applies [Stunned]'] }
];