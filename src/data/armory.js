export const armory = [
    // --- TIER 1 & 2: EARLY GAME & STANDARD ISSUE ---
    { id: 'w01', name: 'Standard Line Repeater', range: '1-3', baseDmg: 3, reqF: 0, reqS: 0, reqB: 0, bonusFront: 2, bonusSupp: 1, bonusBack: 1, element: 'Kinetic', bonusDesc: '+2 Parry, +1 Intercept, +1 Evade' },
    { id: 'w02', name: 'Thermal Blaster', range: '1-2', baseDmg: 4, reqF: 2, reqS: 1, reqB: 0, bonusFront: 3, bonusSupp: 2, bonusBack: 2, element: 'Thermal', bonusDesc: '+3 Parry, +2 Intercept, +2 Evade' },
    { id: 'w03', name: 'Cryo Precision Rifle', range: '2-5', baseDmg: 5, reqF: 0, reqS: 2, reqB: 3, bonusFront: 1, bonusSupp: 3, bonusBack: 4, element: 'Cryo', bonusDesc: '+1 Parry, +3 Intercept, +4 Evade' },
    { id: 'w04', name: 'Electro Arc Sidearm', range: '1-2', baseDmg: 3, reqF: 1, reqS: 2, reqB: 0, bonusFront: 2, bonusSupp: 3, bonusBack: 2, element: 'Electro', bonusDesc: '+2 Parry, +3 Intercept, +2 Evade' },
    { id: 'w05', name: 'Toxic Dart Caster', range: '2-4', baseDmg: 3, reqF: 0, reqS: 3, reqB: 1, bonusFront: 1, bonusSupp: 4, bonusBack: 3, element: 'Toxic', bonusDesc: '+1 Parry, +4 Intercept, +3 Evade' },
    
    // --- TIER 3: SPECIALIZED GEAR ---
    { id: 'w06', name: 'Radiant Sun Blade', range: '1-2', baseDmg: 6, reqF: 4, reqS: 1, reqB: 0, bonusFront: 5, bonusSupp: 2, bonusBack: 1, element: 'Radiant', bonusDesc: '+5 Parry, +2 Intercept, +1 Evade' },
    { id: 'w07', name: 'Void Singularity Rifle', range: '2-6', baseDmg: 5, reqF: 0, reqS: 2, reqB: 4, bonusFront: 1, bonusSupp: 3, bonusBack: 5, element: 'Void', bonusDesc: '+1 Parry, +3 Intercept, +5 Evade' },
    { id: 'w08', name: 'Heavy Plasma Cannon', range: '2-4', baseDmg: 7, reqF: 5, reqS: 2, reqB: 0, bonusFront: 6, bonusSupp: 3, bonusBack: 2, element: 'Thermal', bonusDesc: '+6 Parry, +3 Intercept, +2 Evade' },
    { id: 'w09', name: 'Gauss Railgun', range: '3-7', baseDmg: 6, reqF: 2, reqS: 0, reqB: 5, bonusFront: 2, bonusSupp: 1, bonusBack: 6, element: 'Kinetic', bonusDesc: '+2 Parry, +1 Intercept, +6 Evade' },
    { id: 'w10', name: 'Sub-Zero Scattergun', range: '1-3', baseDmg: 4, reqF: 1, reqS: 3, reqB: 1, bonusFront: 3, bonusSupp: 4, bonusBack: 3, element: 'Cryo', bonusDesc: '+3 Parry, +4 Intercept, +3 Evade' },
    
    // --- TIER 4: HIGH IMPACT ---
    { id: 'w11', name: 'Shockwave Hammer', range: '1-2', baseDmg: 7, reqF: 6, reqS: 0, reqB: 0, bonusFront: 7, bonusSupp: 0, bonusBack: 0, element: 'Kinetic', bonusDesc: '+7 Parry' },
    { id: 'w12', name: 'Galvanic Blunderbuss', range: '1-2', baseDmg: 6, reqF: 4, reqS: 2, reqB: 0, bonusFront: 5, bonusSupp: 3, bonusBack: 2, element: 'Electro', bonusDesc: '+5 Parry, +3 Intercept, +2 Evade' },
    { id: 'w13', name: 'Venom Spitter', range: '1-3', baseDmg: 4, reqF: 0, reqS: 4, reqB: 2, bonusFront: 2, bonusSupp: 5, bonusBack: 4, element: 'Toxic', bonusDesc: '+2 Parry, +5 Intercept, +4 Evade' },
    { id: 'w14', name: 'Starlight Crossbow', range: '2-5', baseDmg: 5, reqF: 1, reqS: 3, reqB: 2, bonusFront: 3, bonusSupp: 4, bonusBack: 4, element: 'Radiant', bonusDesc: '+3 Parry, +4 Intercept, +4 Evade' },
    { id: 'w15', name: 'Entropy Disintegrator', range: '1-4', baseDmg: 6, reqF: 2, reqS: 2, reqB: 4, bonusFront: 3, bonusSupp: 3, bonusBack: 5, element: 'Void', bonusDesc: '+3 Parry, +3 Intercept, +5 Evade' },
    
    // --- TIER 5: VETERAN LOADOUTS ---
    { id: 'w16', name: 'Magma Cleaver', range: '1-2', baseDmg: 6, reqF: 5, reqS: 1, reqB: 0, bonusFront: 6, bonusSupp: 2, bonusBack: 1, element: 'Thermal', bonusDesc: '+6 Parry, +2 Intercept, +1 Evade' },
    { id: 'w17', name: 'Glacial Shield-Pike', range: '1-2', baseDmg: 4, reqF: 3, reqS: 3, reqB: 1, bonusFront: 4, bonusSupp: 4, bonusBack: 3, element: 'Cryo', bonusDesc: '+4 Parry, +4 Intercept, +3 Evade' },
    { id: 'w18', name: 'EMP Disruptor', range: '1-3', baseDmg: 3, reqF: 0, reqS: 5, reqB: 1, bonusFront: 2, bonusSupp: 6, bonusBack: 5, element: 'Electro', bonusDesc: '+2 Parry, +6 Intercept, +5 Evade' },
    { id: 'w19', name: 'Acidic Blaster', range: '1-3', baseDmg: 5, reqF: 1, reqS: 4, reqB: 1, bonusFront: 4, bonusSupp: 5, bonusBack: 4, element: 'Toxic', bonusDesc: '+4 Parry, +5 Intercept, +4 Evade' },
    { id: 'w20', name: 'Solar Greatsword', range: '1-2', baseDmg: 8, reqF: 7, reqS: 0, reqB: 0, bonusFront: 8, bonusSupp: 0, bonusBack: 0, element: 'Radiant', bonusDesc: '+8 Parry' },
    
    // --- TIER 6: EXPERT HARDWARE ---
    { id: 'w21', name: 'Gravity Maul', range: '1-2', baseDmg: 7, reqF: 4, reqS: 0, reqB: 3, bonusFront: 5, bonusSupp: 0, bonusBack: 4, element: 'Void', bonusDesc: '+5 Parry, +4 Evade' },
    { id: 'w22', name: 'Kinetic Volley-Gun', range: '1-2', baseDmg: 4, reqF: 2, reqS: 0, reqB: 1, bonusFront: 4, bonusSupp: 0, bonusBack: 2, element: 'Kinetic', bonusDesc: '+4 Parry, +2 Evade' },
    { id: 'w23', name: 'Scorch Projector', range: '2-4', baseDmg: 5, reqF: 3, reqS: 2, reqB: 0, bonusFront: 4, bonusSupp: 3, bonusBack: 3, element: 'Thermal', bonusDesc: '+4 Parry, +3 Intercept, +3 Evade' },
    { id: 'w24', name: 'Frostbite Long-Rifle', range: '2-5', baseDmg: 5, reqF: 0, reqS: 4, reqB: 2, bonusFront: 2, bonusSupp: 5, bonusBack: 5, element: 'Cryo', bonusDesc: '+2 Parry, +5 Intercept, +5 Evade' },
    { id: 'w25', name: 'Tesla Repeater', range: '1-3', baseDmg: 4, reqF: 1, reqS: 4, reqB: 0, bonusFront: 3, bonusSupp: 5, bonusBack: 4, element: 'Electro', bonusDesc: '+3 Parry, +5 Intercept, +4 Evade' },
    
    // --- TIER 7: ELITE SYNERGIES ---
    { id: 'w26', name: 'Plague Injector', range: '1-2', baseDmg: 6, reqF: 2, reqS: 5, reqB: 0, bonusFront: 4, bonusSupp: 6, bonusBack: 5, element: 'Toxic', bonusDesc: '+4 Parry, +6 Intercept, +5 Evade' },
    { id: 'w27', name: 'Dawn Bringer Rifle', range: '2-6', baseDmg: 6, reqF: 3, reqS: 3, reqB: 2, bonusFront: 4, bonusSupp: 4, bonusBack: 4, element: 'Radiant', bonusDesc: '+4 Parry, +4 Intercept, +4 Evade' },
    { id: 'w28', name: 'Event Horizon Handgun', range: '1-2', baseDmg: 5, reqF: 1, reqS: 2, reqB: 3, bonusFront: 3, bonusSupp: 3, bonusBack: 4, element: 'Void', bonusDesc: '+3 Parry, +3 Intercept, +4 Evade' },
    { id: 'w29', name: 'Seismic Spike', range: '1-2', baseDmg: 5, reqF: 4, reqS: 1, reqB: 1, bonusFront: 5, bonusSupp: 2, bonusBack: 2, element: 'Kinetic', bonusDesc: '+5 Parry, +2 Intercept, +2 Evade' },
    { id: 'w30', name: 'Absolute Zero Heavy-Rifle', range: '2-5', baseDmg: 8, reqF: 0, reqS: 3, reqB: 5, bonusFront: 2, bonusSupp: 4, bonusBack: 8, element: 'Cryo', bonusDesc: '+2 Parry, +4 Intercept, +8 Evade' },

    // --- TIER 8: MASTERCRAFT (NEW ADDITIONS) ---
    { id: 'w31', name: 'Arc-Surge Halberd', range: '1-2', baseDmg: 6, reqF: 4, reqS: 4, reqB: 0, bonusFront: 5, bonusSupp: 5, bonusBack: 1, element: 'Electro', bonusDesc: '+5 Parry, +5 Intercept, +1 Evade' },
    { id: 'w32', name: 'Corrosion Long-Rifle', range: '3-6', baseDmg: 6, reqF: 0, reqS: 3, reqB: 5, bonusFront: 1, bonusSupp: 4, bonusBack: 6, element: 'Toxic', bonusDesc: '+1 Parry, +4 Intercept, +6 Evade' },
    { id: 'w33', name: 'Luminous Baston', range: '1-3', baseDmg: 5, reqF: 0, reqS: 8, reqB: 0, bonusFront: 2, bonusSupp: 8, bonusBack: 2, element: 'Radiant', bonusDesc: '+2 Parry, +8 Intercept, +2 Evade' },
    { id: 'w34', name: 'Switch-Axe Coil', range: '1-2', baseDmg: 7, reqF: 5, reqS: 0, reqB: 3, bonusFront: 6, bonusSupp: 0, bonusBack: 4, element: 'Kinetic', bonusDesc: '+6 Parry, +4 Evade' },
    { id: 'w35', name: 'Ignition Lance', range: '1-2', baseDmg: 7, reqF: 4, reqS: 4, reqB: 0, bonusFront: 5, bonusSupp: 5, bonusBack: 1, element: 'Thermal', bonusDesc: '+5 Parry, +5 Intercept, +1 Evade' },
    
    // --- TIER 9: APEX PROTOCOLS ---
    { id: 'w36', name: 'Null-Zone Projector', range: '2-5', baseDmg: 7, reqF: 0, reqS: 4, reqB: 5, bonusFront: 1, bonusSupp: 5, bonusBack: 6, element: 'Void', bonusDesc: '+1 Parry, +5 Intercept, +6 Evade' },
    { id: 'w37', name: 'Impact Gauntlets', range: '1-2', baseDmg: 8, reqF: 9, reqS: 0, reqB: 0, bonusFront: 9, bonusSupp: 1, bonusBack: 0, element: 'Kinetic', bonusDesc: '+9 Parry, +1 Intercept' },
    { id: 'w38', name: 'Permafrost Shotgun', range: '1-2', baseDmg: 6, reqF: 4, reqS: 5, reqB: 0, bonusFront: 5, bonusSupp: 6, bonusBack: 2, element: 'Cryo', bonusDesc: '+5 Parry, +6 Intercept, +2 Evade' },
    { id: 'w39', name: 'Blight Emitter', range: '2-4', baseDmg: 6, reqF: 0, reqS: 6, reqB: 3, bonusFront: 1, bonusSupp: 7, bonusBack: 4, element: 'Toxic', bonusDesc: '+1 Parry, +7 Intercept, +4 Evade' },
    { id: 'w40', name: 'Celestial Arbiter', range: '1-3', baseDmg: 7, reqF: 3, reqS: 6, reqB: 0, bonusFront: 4, bonusSupp: 7, bonusBack: 2, element: 'Radiant', bonusDesc: '+4 Parry, +7 Intercept, +2 Evade' },

    // --- TIER 10: LEGENDARY SYSTEMS ---
    { id: 'w41', name: 'Storm-Piercer', range: '3-8', baseDmg: 8, reqF: 0, reqS: 0, reqB: 10, bonusFront: 0, bonusSupp: 1, bonusBack: 10, element: 'Electro', bonusDesc: '+1 Intercept, +10 Evade' },
    { id: 'w42', name: 'Titanium Breach-Mace', range: '1-2', baseDmg: 10, reqF: 10, reqS: 0, reqB: 0, bonusFront: 10, bonusSupp: 0, bonusBack: 1, element: 'Kinetic', bonusDesc: '+10 Parry, +1 Evade' },
    { id: 'w43', name: 'Warp-Strike Tonfas', range: '1-2', baseDmg: 7, reqF: 6, reqS: 0, reqB: 4, bonusFront: 7, bonusSupp: 1, bonusBack: 5, element: 'Void', bonusDesc: '+7 Parry, +1 Intercept, +5 Evade' },
    { id: 'w44', name: 'Incendiary Mortar', range: '3-6', baseDmg: 8, reqF: 0, reqS: 3, reqB: 7, bonusFront: 1, bonusSupp: 4, bonusBack: 8, element: 'Thermal', bonusDesc: '+1 Parry, +4 Intercept, +8 Evade' },
    { id: 'w45', name: 'Hailstorm Repeater', range: '2-4', baseDmg: 7, reqF: 2, reqS: 5, reqB: 3, bonusFront: 3, bonusSupp: 6, bonusBack: 4, element: 'Cryo', bonusDesc: '+3 Parry, +6 Intercept, +4 Evade' },
    
    // --- TIER 11: OMNI-CLASS ARTIFACTS ---
    { id: 'w46', name: 'Amp-Surge Baton', range: '1-2', baseDmg: 6, reqF: 2, reqS: 8, reqB: 0, bonusFront: 3, bonusSupp: 9, bonusBack: 1, element: 'Electro', bonusDesc: '+3 Parry, +9 Intercept, +1 Evade' },
    { id: 'w47', name: 'Prismatic Glaive', range: '1-2', baseDmg: 7, reqF: 5, reqS: 5, reqB: 0, bonusFront: 6, bonusSupp: 6, bonusBack: 2, element: 'Radiant', bonusDesc: '+6 Parry, +6 Intercept, +2 Evade' },
    { id: 'w48', name: 'Noxious Cascade', range: '2-5', baseDmg: 7, reqF: 0, reqS: 5, reqB: 5, bonusFront: 1, bonusSupp: 6, bonusBack: 6, element: 'Toxic', bonusDesc: '+1 Parry, +6 Intercept, +6 Evade' },
    { id: 'w49', name: 'Anti-Materiel Rifle', range: '4-10', baseDmg: 10, reqF: 0, reqS: 0, reqB: 10, bonusFront: 0, bonusSupp: 0, bonusBack: 10, element: 'Kinetic', bonusDesc: '+10 Evade' },
    { id: 'w50', name: 'Singularity Engine', range: '2-4', baseDmg: 9, reqF: 4, reqS: 4, reqB: 4, bonusFront: 5, bonusSupp: 5, bonusBack: 5, element: 'Void', bonusDesc: '+5 to all Defenses' }
];