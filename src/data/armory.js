/**
 * RESONANCE ENGINE V2.0 - OFFICIAL ARMORY
 * 
 * STRICT TYPING ENFORCED:
 * - baseDmg, reqF, reqS, reqB, bonusFront, bonusSupp, bonusBack, bonusDmg MUST be Integers.
 * - range MUST be a String to accommodate hyphens (e.g., "1-3").
 * - id MUST be a String to prevent Firebase NaN/Array-Coercion glitches.
 */

export const armory = [
    // ---------------------------------------------------------
    // TIER 0: STANDARD ISSUE (No Requirements, No Bonuses)
    // ---------------------------------------------------------
    {
        id: 'w01',
        name: 'Standard Issue Sidearm',
        element: 'Kinetic',
        range: '1-3',
        baseDmg: 3,
        reqF: 0, reqS: 0, reqB: 0,
        bonusFront: 0, bonusSupp: 0, bonusBack: 0, bonusDmg: 0,
        bonusDesc: 'Reliable, but lacks synergy interfaces.'
    },

    // ---------------------------------------------------------
    // TIER 1: PURE DISCIPLINES (10 DP Requirements)
    // ---------------------------------------------------------

    // VANGUARD (Heavy Front DP)
    {
        id: 'w02',
        name: 'Heavy Grav-Hammer',
        element: 'Kinetic',
        range: '1',
        baseDmg: 5,
        reqF: 10, reqS: 0, reqB: 0,
        bonusFront: 3, bonusSupp: 0, bonusBack: 0, bonusDmg: 2,
        bonusDesc: '+3 Front Parry, +2 Damage'
    },
    {
        id: 'w03',
        name: 'Thermic Breaching Lance',
        element: 'Thermal',
        range: '1-2',
        baseDmg: 4,
        reqF: 10, reqS: 0, reqB: 0,
        bonusFront: 2, bonusSupp: 0, bonusBack: 0, bonusDmg: 3,
        bonusDesc: '+2 Front Parry, +3 Damage'
    },

    // CONDUIT (Heavy Support DP)
    {
        id: 'w04',
        name: 'Arc Projector',
        element: 'Electro',
        range: '1-4',
        baseDmg: 4,
        reqF: 0, reqS: 10, reqB: 0,
        bonusFront: 0, bonusSupp: 4, bonusBack: 0, bonusDmg: 1,
        bonusDesc: '+4 Support Intercept, +1 Damage'
    },
    {
        id: 'w05',
        name: 'Radiant Beam Emitter',
        element: 'Radiant',
        range: '2-5',
        baseDmg: 3,
        reqF: 0, reqS: 10, reqB: 0,
        bonusFront: 0, bonusSupp: 3, bonusBack: 0, bonusDmg: 2,
        bonusDesc: '+3 Support Intercept, +2 Damage'
    },

    // SNIPER (Heavy Back DP)
    {
        id: 'w06',
        name: 'Long-Cycle Gauss Rifle',
        element: 'Kinetic',
        range: '3-8',
        baseDmg: 5,
        reqF: 0, reqS: 0, reqB: 10,
        bonusFront: 0, bonusSupp: 0, bonusBack: 3, bonusDmg: 2,
        bonusDesc: '+3 Backline Evasion, +2 Damage'
    },
    {
        id: 'w07',
        name: 'Void Piercer',
        element: 'Void',
        range: '4-10',
        baseDmg: 4,
        reqF: 0, reqS: 0, reqB: 10,
        bonusFront: 0, bonusSupp: 0, bonusBack: 2, bonusDmg: 3,
        bonusDesc: '+2 Backline Evasion, +3 Damage'
    },

    // ---------------------------------------------------------
    // TIER 2: HYBRID DISCIPLINES (5 / 5 DP Requirements)
    // ---------------------------------------------------------

    // PALADIN (Front + Support)
    {
        id: 'w08',
        name: 'Aegis Phalanx & Gladius',
        element: 'Kinetic',
        range: '1',
        baseDmg: 4,
        reqF: 5, reqS: 5, reqB: 0,
        bonusFront: 2, bonusSupp: 2, bonusBack: 0, bonusDmg: 1,
        bonusDesc: '+2 Parry, +2 Intercept, +1 Damage'
    },
    {
        id: 'w09',
        name: 'Magma Cleaver',
        element: 'Thermal',
        range: '1-2',
        baseDmg: 5,
        reqF: 6, reqS: 4, reqB: 0,
        bonusFront: 2, bonusSupp: 1, bonusBack: 0, bonusDmg: 2,
        bonusDesc: '+2 Parry, +1 Intercept, +2 Damage'
    },

    // SKIRMISHER (Front + Back)
    {
        id: 'w10',
        name: 'Dual Phase-Blades',
        element: 'Void',
        range: '1',
        baseDmg: 4,
        reqF: 5, reqS: 0, reqB: 5,
        bonusFront: 2, bonusSupp: 0, bonusBack: 2, bonusDmg: 1,
        bonusDesc: '+2 Parry, +2 Evasion, +1 Damage'
    },
    {
        id: 'w11',
        name: 'Cryo-Pump Shotgun',
        element: 'Cryo',
        range: '1-3',
        baseDmg: 5,
        reqF: 6, reqS: 0, reqB: 4,
        bonusFront: 1, bonusSupp: 0, bonusBack: 2, bonusDmg: 2,
        bonusDesc: '+1 Parry, +2 Evasion, +2 Damage'
    },

    // SABOTEUR (Support + Back)
    {
        id: 'w12',
        name: 'Toxic Needler',
        element: 'Toxic',
        range: '2-5',
        baseDmg: 3,
        reqF: 0, reqS: 5, reqB: 5,
        bonusFront: 0, bonusSupp: 2, bonusBack: 2, bonusDmg: 1,
        bonusDesc: '+2 Intercept, +2 Evasion, +1 Damage'
    },
    {
        id: 'w13',
        name: 'Sonic Pulser',
        element: 'Kinetic',
        range: '1-4',
        baseDmg: 4,
        reqF: 0, reqS: 6, reqB: 4,
        bonusFront: 0, bonusSupp: 2, bonusBack: 1, bonusDmg: 2,
        bonusDesc: '+2 Intercept, +1 Evasion, +2 Damage'
    },

    // ---------------------------------------------------------
    // TIER 3: SPECIALIZED / EXOTIC PROTOTYPES (Uneven DP Reqs)
    // ---------------------------------------------------------

    {
        id: 'w14',
        name: 'Bio-Rifle Proto-V',
        element: 'Toxic',
        range: '2-6',
        baseDmg: 4,
        reqF: 2, reqS: 4, reqB: 8,
        bonusFront: 0, bonusSupp: 1, bonusBack: 2, bonusDmg: 2,
        bonusDesc: '+1 Intercept, +2 Evasion, +2 Damage'
    },
    {
        id: 'w15',
        name: 'Plasma Caster',
        element: 'Thermal',
        range: '1-3',
        baseDmg: 5,
        reqF: 8, reqS: 4, reqB: 2,
        bonusFront: 2, bonusSupp: 1, bonusBack: 0, bonusDmg: 2,
        bonusDesc: '+2 Parry, +1 Intercept, +2 Damage'
    },
    {
        id: 'w16',
        name: 'Resonance Disruptor',
        element: 'Void',
        range: '1-5',
        baseDmg: 4,
        reqF: 2, reqS: 8, reqB: 4,
        bonusFront: 0, bonusSupp: 3, bonusBack: 1, bonusDmg: 1,
        bonusDesc: '+3 Intercept, +1 Evasion, +1 Damage'
    }
];