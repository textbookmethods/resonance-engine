export const bestiary = [
    // TIER 1: SCOUTS & DRONES (e01 - e12)
    {
        id: 'e01', name: 'Vanguard Drone', tier: 1, affinity: 'Kinetic', hp: 15, barriers: [],
        abilities: [
            { name: "Kinetic Blade", cost: 1, value: 4, element: "Kinetic", range: "1", aoe: 0, effect: "Bleed", terrain: null },
            { name: "Pulse Rifle", cost: 2, value: 3, element: "Kinetic", range: "2-4", aoe: 0, effect: "", terrain: null }
        ]
    },
    {
        id: 'e02', name: 'Venom Stalker', tier: 1, affinity: 'Toxic', hp: 12, barriers: [5],
        abilities: [
            { name: "Neural Stinger", cost: 1, value: 3, element: "Toxic", range: "1-3", aoe: 0, effect: "Poisoned", terrain: null },
            { name: "Blight Cloud", cost: 3, value: 2, element: "Toxic", range: "0-1", aoe: 1, effect: "Blind", terrain: "minor" }
        ]
    },
    {
        id: 'e03', name: 'Scout Prowler', tier: 1, affinity: 'Kinetic', hp: 14, barriers: [],
        abilities: [
            { name: "Rapid Claw", cost: 1, value: 3, element: "Kinetic", range: "1", aoe: 0, effect: "Knockdown", terrain: null },
            { name: "Tracking Dart", cost: 1, value: 1, element: "Kinetic", range: "3-6", aoe: 0, effect: "Vulnerable", terrain: null }
        ]
    },
    {
        id: 'e04', name: 'Spark Imp', tier: 1, affinity: 'Electro', hp: 10, barriers: [],
        abilities: [
            { name: "Static Jolt", cost: 1, value: 3, element: "Electro", range: "1-2", aoe: 0, effect: "Shocked", terrain: null },
            { name: "Flash Surge", cost: 2, value: 2, element: "Electro", range: "0-1", aoe: 1, effect: "Blind", terrain: null }
        ]
    },
    {
        id: 'e05', name: 'Frost Skitterer', tier: 1, affinity: 'Cryo', hp: 13, barriers: [],
        abilities: [
            { name: "Rime Bite", cost: 1, value: 3, element: "Cryo", range: "1", aoe: 0, effect: "Slowed", terrain: null },
            { name: "Chill Mist", cost: 2, value: 2, element: "Cryo", range: "0-1", aoe: 1, effect: "Slowed", terrain: "minor" }
        ]
    },
    {
        id: 'e06', name: 'Cinder Wasp', tier: 1, affinity: 'Thermal', hp: 11, barriers: [],
        abilities: [
            { name: "Ember Sting", cost: 1, value: 3, element: "Thermal", range: "1", aoe: 0, effect: "Burn", terrain: null },
            { name: "Flare Pop", cost: 2, value: 2, element: "Thermal", range: "0-1", aoe: 1, effect: "Blind", terrain: null }
        ]
    },
    {
        id: 'e07', name: 'Glimmer Sprite', tier: 1, affinity: 'Radiant', hp: 12, barriers: [],
        abilities: [
            { name: "Luminous Ray", cost: 1, value: 3, element: "Radiant", range: "2-5", aoe: 0, effect: "", terrain: null },
            { name: "Prismatic Dust", cost: 2, value: 0, element: "Radiant", range: "1-3", aoe: 0, effect: "Shielded", terrain: null }
        ]
    },
    {
        id: 'e08', name: 'Null Skulk', tier: 1, affinity: 'Void', hp: 12, barriers: [],
        abilities: [
            { name: "Shadow Scratch", cost: 1, value: 3, element: "Void", range: "1", aoe: 0, effect: "Vulnerable", terrain: null },
            { name: "Phase Step", cost: 2, value: 0, element: "Void", range: "1-3", aoe: 0, effect: "Evasive", terrain: null }
        ]
    },
    {
        id: 'e09', name: 'Rust Beetle', tier: 1, affinity: 'Toxic', hp: 16, barriers: [5],
        abilities: [
            { name: "Mandible Crunch", cost: 1, value: 4, element: "Toxic", range: "1", aoe: 0, effect: "Bleed", terrain: null },
            { name: "Acid Slime", cost: 2, value: 2, element: "Toxic", range: "1-3", aoe: 0, effect: "", terrain: "minor" }
        ]
    },
    {
        id: 'e10', name: 'Glass Flyer', tier: 1, affinity: 'Cryo', hp: 10, barriers: [],
        abilities: [
            { name: "Shard Dart", cost: 1, value: 3, element: "Cryo", range: "2-4", aoe: 0, effect: "", terrain: null },
            { name: "Shatter Sweep", cost: 2, value: 3, element: "Cryo", range: "0-1", aoe: "cluster3", effect: "Knockdown", terrain: null }
        ]
    },
    {
        id: 'e11', name: 'Static Leech', tier: 1, affinity: 'Electro', hp: 11, barriers: [],
        abilities: [
            { name: "Drain Bite", cost: 1, value: 3, element: "Electro", range: "1", aoe: 0, effect: "Shocked", terrain: null },
            { name: "Magnetic Pulse", cost: 2, value: 2, element: "Electro", range: "0-1", aoe: 1, effect: "Immobilized", terrain: null }
        ]
    },
    {
        id: 'e12', name: 'Iron Pawn', tier: 1, affinity: 'Kinetic', hp: 18, barriers: [5],
        abilities: [
            { name: "Piston Punch", cost: 1, value: 4, element: "Kinetic", range: "1", aoe: 0, effect: "Knockdown", terrain: null },
            { name: "Shield Wall", cost: 1, value: 0, element: "Kinetic", range: "1", aoe: 0, effect: "Shielded", terrain: null }
        ]
    },

    // TIER 2: TROOPERS & CONSTRUCTS (e13 - e25)
    {
        id: 'e13', name: 'Pyre Construct', tier: 2, affinity: 'Thermal', hp: 20, barriers: [5],
        abilities: [
            { name: "Plasma Torch", cost: 2, value: 5, element: "Thermal", range: "1-2", aoe: 0, effect: "Burn", terrain: null },
            { name: "Incendiary Shell", cost: 4, value: 4, element: "Thermal", range: "2-5", aoe: 1, effect: "Vulnerable", terrain: "major" }
        ]
    },
    {
        id: 'e14', name: 'Cryo-Sentinel', tier: 2, affinity: 'Cryo', hp: 18, barriers: [5, 5],
        abilities: [
            { name: "Frost Beam", cost: 2, value: 4, element: "Cryo", range: "3-6", aoe: 0, effect: "Slowed", terrain: null },
            { name: "Absolute Zero", cost: 4, value: 6, element: "Cryo", range: "2-5", aoe: "cluster3", effect: "Immobilized", terrain: "minor" }
        ]
    },
    {
        id: 'e15', name: 'Heavy Siege Turret', tier: 2, affinity: 'Kinetic', hp: 22, barriers: [10],
        abilities: [
            { name: "Flak Cannon", cost: 2, value: 4, element: "Kinetic", range: "2-6", aoe: "cluster3", effect: "Knockdown", terrain: null },
            { name: "Targeting Matrix", cost: 1, value: 0, element: "Radiant", range: "1-8", aoe: 0, effect: "Vulnerable", terrain: null }
        ]
    },
    {
        id: 'e16', name: 'Shock Trooper', tier: 2, affinity: 'Electro', hp: 20, barriers: [5],
        abilities: [
            { name: "Arc Rifle", cost: 2, value: 5, element: "Electro", range: "2-5", aoe: 0, effect: "Shocked", terrain: null },
            { name: "Stun Baton", cost: 3, value: 4, element: "Electro", range: "1", aoe: 0, effect: "Stunned", terrain: null }
        ]
    },
    {
        id: 'e17', name: 'Venom Brute', tier: 2, affinity: 'Toxic', hp: 24, barriers: [5],
        abilities: [
            { name: "Spore Launcher", cost: 3, value: 5, element: "Toxic", range: "2-4", aoe: 0, effect: "Poisoned", terrain: null },
            { name: "Toxic Sludge", cost: 3, value: 3, element: "Toxic", range: "1-3", aoe: 1, effect: "", terrain: "major" }
        ]
    },
    {
        id: 'e18', name: 'Solar Zealot', tier: 2, affinity: 'Radiant', hp: 19, barriers: [5],
        abilities: [
            { name: "Sun Ray", cost: 2, value: 5, element: "Radiant", range: "2-6", aoe: 0, effect: "", terrain: null },
            { name: "Blinding Flash", cost: 3, value: 2, element: "Radiant", range: "0-1", aoe: 1, effect: "Blind", terrain: null }
        ]
    },
    {
        id: 'e19', name: 'Rift Walker', tier: 2, affinity: 'Void', hp: 18, barriers: [5],
        abilities: [
            { name: "Void Bolt", cost: 2, value: 5, element: "Void", range: "2-5", aoe: 0, effect: "Vulnerable", terrain: null },
            { name: "Gravity Well", cost: 4, value: 3, element: "Void", range: "2-5", aoe: 1, effect: "Immobilized", terrain: null }
        ]
    },
    {
        id: 'e20', name: 'Magma Hound', tier: 2, affinity: 'Thermal', hp: 21, barriers: [],
        abilities: [
            { name: "Molten Bite", cost: 2, value: 6, element: "Thermal", range: "1", aoe: 0, effect: "Burn", terrain: null },
            { name: "Magma Trail", cost: 3, value: 3, element: "Thermal", range: "1-2", aoe: 0, effect: "", terrain: "major" }
        ]
    },
    {
        id: 'e21', name: 'Glacial Sentry', tier: 2, affinity: 'Cryo', hp: 23, barriers: [10],
        abilities: [
            { name: "Ice Shard", cost: 2, value: 5, element: "Cryo", range: "2-5", aoe: 0, effect: "", terrain: null },
            { name: "Ice Wall", cost: 3, value: 0, element: "Cryo", range: "1-3", aoe: 0, effect: "", terrain: "severe" }
        ]
    },
    {
        id: 'e22', name: 'Pulse Vanguard', tier: 2, affinity: 'Kinetic', hp: 22, barriers: [5],
        abilities: [
            { name: "Pulse Burst", cost: 2, value: 5, element: "Kinetic", range: "2-4", aoe: 0, effect: "Knockdown", terrain: null },
            { name: "Kinetic Shield", cost: 3, value: 0, element: "Kinetic", range: "1", aoe: 0, effect: "Shielded", terrain: null }
        ]
    },
    {
        id: 'e23', name: 'Galvanic Hunter', tier: 2, affinity: 'Electro', hp: 19, barriers: [],
        abilities: [
            { name: "Rail Dart", cost: 3, value: 6, element: "Electro", range: "3-7", aoe: 0, effect: "Shocked", terrain: null },
            { name: "Magnetic Snare", cost: 2, value: 2, element: "Electro", range: "1-4", aoe: 0, effect: "Immobilized", terrain: null }
        ]
    },
    {
        id: 'e24', name: 'Blight Spitter', tier: 2, affinity: 'Toxic', hp: 20, barriers: [5],
        abilities: [
            { name: "Corrosive Spittle", cost: 2, value: 5, element: "Toxic", range: "2-5", aoe: 0, effect: "Poisoned", terrain: null },
            { name: "Miasma Burst", cost: 4, value: 4, element: "Toxic", range: "1-4", aoe: 1, effect: "Blind", terrain: null }
        ]
    },
    {
        id: 'e25', name: 'Astral Scout', tier: 2, affinity: 'Void', hp: 17, barriers: [],
        abilities: [
            { name: "Astral Rifle", cost: 2, value: 5, element: "Void", range: "3-6", aoe: 0, effect: "", terrain: null },
            { name: "Blink Ambush", cost: 3, value: 6, element: "Void", range: "1", aoe: 0, effect: "Evasive", terrain: null }
        ]
    },

    // TIER 3: ELITES & COMMANDERS (e26 - e37)
    {
        id: 'e26', name: 'Arc-Node Conductor', tier: 3, affinity: 'Electro', hp: 28, barriers: [10, 5],
        abilities: [
            { name: "Spark Surge", cost: 4, value: 6, element: "Electro", range: "2-6", aoe: "line3", effect: "Shocked", terrain: null },
            { name: "Overcharge Node", cost: 2, value: 0, element: "Electro", range: "1-5", aoe: 0, effect: "Haste", terrain: null }
        ]
    },
    {
        id: 'e27', name: 'Aegis Guardian', tier: 3, affinity: 'Radiant', hp: 32, barriers: [10, 10],
        abilities: [
            { name: "Solar Spear", cost: 3, value: 6, element: "Radiant", range: "1-4", aoe: 0, effect: "", terrain: null },
            { name: "Prismatic Field", cost: 4, value: 0, element: "Radiant", range: "1-3", aoe: 1, effect: "Shielded", terrain: "clear" }
        ]
    },
    {
        id: 'e28', name: 'Magma Behemoth', tier: 3, affinity: 'Thermal', hp: 35, barriers: [10],
        abilities: [
            { name: "Volcanic Slam", cost: 4, value: 7, element: "Thermal", range: "1-2", aoe: "cluster3", effect: "Knockdown", terrain: "major" },
            { name: "Magma Blast", cost: 3, value: 6, element: "Thermal", range: "2-5", aoe: 0, effect: "Burn", terrain: null }
        ]
    },
    {
        id: 'e29', name: 'Cryo-Warden', tier: 3, affinity: 'Cryo', hp: 30, barriers: [15],
        abilities: [
            { name: "Blizzard Cannon", cost: 4, value: 6, element: "Cryo", range: "2-6", aoe: "line3", effect: "Slowed", terrain: null },
            { name: "Permafrost Field", cost: 5, value: 4, element: "Cryo", range: "2-5", aoe: 2, effect: "Immobilized", terrain: "minor" }
        ]
    },
    {
        id: 'e30', name: 'Vortex Inquisitor', tier: 3, affinity: 'Void', hp: 29, barriers: [10, 5],
        abilities: [
            { name: "Singularity Ray", cost: 4, value: 7, element: "Void", range: "2-6", aoe: 0, effect: "Vulnerable", terrain: null },
            { name: "Rift Collapse", cost: 5, value: 6, element: "Void", range: "2-5", aoe: 1, effect: "Stunned", terrain: null }
        ]
    },
    {
        id: 'e31', name: 'Blight Chemist', tier: 3, affinity: 'Toxic', hp: 27, barriers: [5, 5],
        abilities: [
            { name: "Noxious Mortar", cost: 4, value: 6, element: "Toxic", range: "3-7", aoe: 1, effect: "Poisoned", terrain: null },
            { name: "Acid Rain", cost: 5, value: 5, element: "Toxic", range: "2-6", aoe: 2, effect: "", terrain: "major" }
        ]
    },
    {
        id: 'e32', name: 'Kinetic Juggernaut', tier: 3, affinity: 'Kinetic', hp: 38, barriers: [15],
        abilities: [
            { name: "Seismic Slam", cost: 4, value: 8, element: "Kinetic", range: "1-2", aoe: "cluster3", effect: "Knockdown", terrain: "minor" },
            { name: "Armor Plating", cost: 2, value: 0, element: "Kinetic", range: "1", aoe: 0, effect: "Shielded", terrain: null }
        ]
    },
    {
        id: 'e33', name: 'Plasma Centurion', tier: 3, affinity: 'Thermal', hp: 33, barriers: [10],
        abilities: [
            { name: "Plasma Rifle", cost: 3, value: 7, element: "Thermal", range: "2-6", aoe: 0, effect: "Burn", terrain: null },
            { name: "Thermal Shield", cost: 3, value: 0, element: "Thermal", range: "1", aoe: 0, effect: "Shielded", terrain: null }
        ]
    },
    {
        id: 'e34', name: 'Storm Weaver', tier: 3, affinity: 'Electro', hp: 28, barriers: [10],
        abilities: [
            { name: "Lightning Bolt", cost: 3, value: 7, element: "Electro", range: "2-7", aoe: 0, effect: "Shocked", terrain: null },
            { name: "Thunderclap", cost: 4, value: 6, element: "Electro", range: "1-4", aoe: 1, effect: "Stunned", terrain: null }
        ]
    },
    {
        id: 'e35', name: 'Radiant Arbitrator', tier: 3, affinity: 'Radiant', hp: 31, barriers: [10, 5],
        abilities: [
            { name: "Judgment Beam", cost: 4, value: 7, element: "Radiant", range: "2-6", aoe: 0, effect: "", terrain: null },
            { name: "Holy Sanctuary", cost: 4, value: 0, element: "Radiant", range: "1-3", aoe: 1, effect: "Invulnerable", terrain: null }
        ]
    },
    {
        id: 'e36', name: 'Apex Stalker', tier: 3, affinity: 'Void', hp: 26, barriers: [5],
        abilities: [
            { name: "Shadow Blade", cost: 3, value: 8, element: "Void", range: "1", aoe: 0, effect: "Bleed", terrain: null },
            { name: "Quantum Blur", cost: 4, value: 0, element: "Void", range: "1", aoe: 0, effect: "Evasive", terrain: null }
        ]
    },
    {
        id: 'e37', name: 'Sub-Zero Construct', tier: 3, affinity: 'Cryo', hp: 34, barriers: [10],
        abilities: [
            { name: "Absolute Zero Ray", cost: 4, value: 7, element: "Cryo", range: "2-5", aoe: 0, effect: "Stunned", terrain: null },
            { name: "Glacier Stomp", cost: 4, value: 6, element: "Cryo", range: "1-2", aoe: "cluster3", effect: "", terrain: "severe" }
        ]
    },

    // TIER 4: MINI-BOSSES & APEX ENTITIES (e38 - e48)
    {
        id: 'e38', name: 'Neural Splicer', tier: 4, affinity: 'Electro', hp: 35, barriers: [10, 10],
        abilities: [
            { name: "Static Whip", cost: 3, value: 5, element: "Electro", range: "1-4", aoe: 0, effect: "Shocked", terrain: null },
            { name: "Mind Override", cost: 8, value: 2, element: "Electro", range: "1-3", aoe: 0, effect: "Hijacked", terrain: null }
        ]
    },
    {
        id: 'e39', name: 'Solar Apex', tier: 4, affinity: 'Radiant', hp: 42, barriers: [15, 10],
        abilities: [
            { name: "Solar Flare", cost: 5, value: 9, element: "Radiant", range: "2-6", aoe: 2, effect: "Blind", terrain: null },
            { name: "Nova Shield", cost: 4, value: 0, element: "Radiant", range: "1", aoe: 0, effect: "Invulnerable", terrain: null }
        ]
    },
    {
        id: 'e40', name: 'Void Sovereign', tier: 4, affinity: 'Void', hp: 40, barriers: [15, 15],
        abilities: [
            { name: "Event Horizon Beam", cost: 5, value: 9, element: "Void", range: "2-7", aoe: 0, effect: "Vulnerable", terrain: null },
            { name: "Reality Rip", cost: 6, value: 8, element: "Void", range: "2-6", aoe: 2, effect: "Stunned", terrain: null }
        ]
    },
    {
        id: 'e41', name: 'Infernal Engine', tier: 4, affinity: 'Thermal', hp: 45, barriers: [20],
        abilities: [
            { name: "Magma Cannon", cost: 5, value: 10, element: "Thermal", range: "2-7", aoe: "line3", effect: "Burn", terrain: "major" },
            { name: "Overheat Core", cost: 4, value: 6, element: "Thermal", range: "1-4", aoe: 1, effect: "Vulnerable", terrain: null }
        ]
    },
    {
        id: 'e42', name: 'Cryo-Titan', tier: 4, affinity: 'Cryo', hp: 48, barriers: [20],
        abilities: [
            { name: "Avalanche Slam", cost: 5, value: 9, element: "Cryo", range: "1-3", aoe: "cluster3", effect: "Immobilized", terrain: "severe" },
            { name: "Absolute Zero Blast", cost: 6, value: 8, element: "Cryo", range: "2-6", aoe: 2, effect: "Stunned", terrain: null }
        ]
    },
    {
        id: 'e43', name: 'Blight Queen', tier: 4, affinity: 'Toxic', hp: 38, barriers: [10, 10],
        abilities: [
            { name: "Plague Spores", cost: 5, value: 7, element: "Toxic", range: "2-6", aoe: 2, effect: "Poisoned", terrain: null },
            { name: "Corrosive Wave", cost: 5, value: 8, element: "Toxic", range: "2-7", aoe: "line3", effect: "Vulnerable", terrain: "major" }
        ]
    },
    {
        id: 'e44', name: 'Kinetic Warlord', tier: 4, affinity: 'Kinetic', hp: 50, barriers: [20],
        abilities: [
            { name: "Mass Driver", cost: 5, value: 10, element: "Kinetic", range: "3-8", aoe: 0, effect: "Knockdown", terrain: null },
            { name: "Tactical Barrier", cost: 4, value: 0, element: "Kinetic", range: "1", aoe: 0, effect: "Shielded", terrain: null }
        ]
    },
    {
        id: 'e45', name: 'Storm Bringer', tier: 4, affinity: 'Electro', hp: 39, barriers: [15],
        abilities: [
            { name: "Thunderstrike", cost: 5, value: 9, element: "Electro", range: "2-6", aoe: 0, effect: "Stunned", terrain: null },
            { name: "Ionic Storm", cost: 6, value: 7, element: "Electro", range: "2-6", aoe: 2, effect: "Shocked", terrain: null }
        ]
    },
    {
        id: 'e46', name: 'Prismatic Judge', tier: 4, affinity: 'Radiant', hp: 44, barriers: [15, 10],
        abilities: [
            { name: "Judgment Beam", cost: 5, value: 9, element: "Radiant", range: "2-7", aoe: 0, effect: "Vulnerable", terrain: null },
            { name: "Divine Wrath", cost: 6, value: 8, element: "Radiant", range: "2-6", aoe: 2, effect: "Blind", terrain: null }
        ]
    },
    {
        id: 'e47', name: 'Entropy Stalker', tier: 4, affinity: 'Void', hp: 36, barriers: [10],
        abilities: [
            { name: "Entropy Blade", cost: 4, value: 10, element: "Void", range: "1", aoe: 0, effect: "Bleed", terrain: null },
            { name: "Phase Shift", cost: 4, value: 0, element: "Void", range: "1", aoe: 0, effect: "Invulnerable", terrain: null }
        ]
    },
    {
        id: 'e48', name: 'Magma Colossus', tier: 4, affinity: 'Thermal', hp: 46, barriers: [15, 10],
        abilities: [
            { name: "Volcanic Eruption", cost: 6, value: 10, element: "Thermal", range: "2-6", aoe: 2, effect: "Burn", terrain: "major" },
            { name: "Molten Fist", cost: 4, value: 8, element: "Thermal", range: "1", aoe: 0, effect: "Knockdown", terrain: null }
        ]
    },

    // TIER 5: CAPSTONE BOSSES (e49 - e50)
    {
        id: 'e49', name: 'Arch-Anomaly Prime', tier: 5, affinity: 'Void', hp: 75, barriers: [20, 20, 20],
        abilities: [
            { name: "Singularity Burst", cost: 6, value: 12, element: "Void", range: "2-7", aoe: 2, effect: "Stunned", terrain: null },
            { name: "Reality Disruption", cost: 8, value: 10, element: "Void", range: "1-8", aoe: 0, effect: "Vulnerable", terrain: "severe" },
            { name: "Annihilation Ray", cost: 10, value: 14, element: "Void", range: "2-8", aoe: "line3", effect: "Execute", terrain: null }
        ]
    },
    {
        id: 'e50', name: 'Resonance Core', tier: 5, affinity: 'Radiant', hp: 120, barriers: [25, 25, 25, 25],
        abilities: [
            { name: "Resonance Pulse", cost: 5, value: 10, element: "Radiant", range: "2-7", aoe: 2, effect: "Shocked", terrain: null },
            { name: "Overload Feedback", cost: 8, value: 12, element: "Electro", range: "1-10", aoe: 0, effect: "Stunned", terrain: "major" },
            { name: "Terminal Singular Matrix", cost: 12, value: 20, element: "Void", range: "2-8", aoe: 2, effect: "Execute", terrain: null }
        ]
    }
];