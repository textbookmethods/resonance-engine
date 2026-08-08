export const bestiary = [
    {
        id: 'e01',
        name: 'Vanguard Drone',
        tier: 1,
        affinity: 'Kinetic',
        hp: 15,
        barriers: [],
        abilities: [
            "Kinetic Blade [1 Res]: deals 4 Kinetic damage at range 1 and applies [Bleed]",
            "Pulse Rifle [2 Res]: deals 3 Kinetic damage at range 2-4"
        ]
    },
    {
        id: 'e02',
        name: 'Pyre Construct',
        tier: 2,
        affinity: 'Thermal',
        hp: 20,
        barriers: [5],
        abilities: [
            "Plasma Torch [2 Res]: deals 5 Thermal damage at range 1-2 and applies [Burn]",
            "Incendiary Shell [4 Res]: deals 4 Thermal damage in a 1-hex radius, applies [Vulnerable], terrain: major"
        ]
    },
    {
        id: 'e03',
        name: 'Cryo-Sentinel',
        tier: 2,
        affinity: 'Cryo',
        hp: 18,
        barriers: [5, 5],
        abilities: [
            "Frost Beam [2 Res]: deals 4 Cryo damage at range 3-6 and applies [Slowed]",
            "Absolute Zero [4 Res]: deals 6 Cryo damage in a cluster, applies [Immobilized], terrain: minor"
        ]
    },
    {
        id: 'e04',
        name: 'Venom Stalker',
        tier: 1,
        affinity: 'Toxic',
        hp: 12,
        barriers: [5],
        abilities: [
            "Neural Stinger [1 Res]: deals 3 Toxic damage at range 1-3 and applies [Poisoned]",
            "Blight Cloud [3 Res]: deals 2 Toxic damage in a 1-hex radius, applies [Blind], terrain: minor"
        ]
    },
    {
        id: 'e05',
        name: 'Arc-Node Conductor',
        tier: 3,
        affinity: 'Electro',
        hp: 25,
        barriers: [5, 5, 5],
        abilities: [
            "Spark Surge [4 Res]: deals 6 Electro damage in a line, applies [Shocked]",
            "Overcharge Node [2 Res]: deals 0 Electro damage at range 1-5 and applies [Haste]"
        ]
    },
    {
        id: 'e06',
        name: 'Aegis Guardian',
        tier: 3,
        affinity: 'Radiant',
        hp: 30,
        barriers: [10, 5],
        abilities: [
            "Solar Spear [3 Res]: deals 6 Radiant damage at range 1-4",
            "Prismatic Field [4 Res]: deals 0 Radiant damage in a 1-hex radius, applies [Shielded], terrain: clear"
        ]
    },
    {
        id: 'e07',
        name: 'Entropy Prime (Boss)',
        tier: 5,
        affinity: 'Void',
        hp: 50,
        barriers: [10, 10, 10, 10],
        abilities: [
            "Singularity Spike [4 Res]: deals 8 Void damage at range 1-6 and applies [Vulnerable], terrain: severe",
            "Event Horizon [6 Res]: deals 5 Void damage in a 2-hex radius, applies [Stunned]",
            "Reality Erasure [10 Res]: deals 99 Void damage at range 1-3 and applies [Execute]"
        ]
    },
    {
        id: 'e08',
        name: 'Heavy Siege Turret',
        tier: 2,
        affinity: 'Kinetic',
        hp: 22,
        barriers: [10],
        abilities: [
            "Flak Cannon [2 Res]: deals 4 Kinetic damage in a cluster and applies [Knockdown]",
            "Targeting Matrix [1 Res]: deals 0 Radiant damage at range 1-8 and applies [Vulnerable]"
        ]
    },
    {
        id: 'e09',
        name: 'Neural Splicer',
        tier: 4,
        affinity: 'Electro',
        hp: 24,
        barriers: [5, 5, 10],
        abilities: [
            "Static Whip [3 Res]: deals 5 Electro damage at range 1-4 and applies [Shocked]",
            "Mind Override [8 Res]: deals 2 Electro damage at range 1-3 and applies [Hijacked]"
        ]
    }
];