export const armory = [
    // ROOKIE (Basic starters, slight damage bumps)
    { id: 'w01', name: 'Iron Shortsword', range: '1', baseDmg: 3, synergyClass: 'Rookie', bonusDmg: 1, bonusFront: 0, bonusSupp: 0, bonusBack: 0, bonusDesc: '+1 Base Dmg' },
    { id: 'w02', name: 'Wooden Club', range: '1', baseDmg: 3, synergyClass: 'Rookie', bonusDmg: 1, bonusFront: 0, bonusSupp: 0, bonusBack: 0, bonusDesc: '+1 Base Dmg' },
    { id: 'w03', name: 'Militia Spear', range: '1-2', baseDmg: 2, synergyClass: 'Rookie', bonusDmg: 1, bonusFront: 0, bonusSupp: 0, bonusBack: 0, bonusDesc: '+1 Base Dmg' },
    { id: 'w04', name: 'Peasant Pitchfork', range: '1-2', baseDmg: 2, synergyClass: 'Rookie', bonusDmg: 1, bonusFront: 0, bonusSupp: 0, bonusBack: 0, bonusDesc: '+1 Base Dmg' },
    { id: 'w05', name: 'Rusty Hatchet', range: '1', baseDmg: 3, synergyClass: 'Rookie', bonusDmg: 1, bonusFront: 0, bonusSupp: 0, bonusBack: 0, bonusDesc: '+1 Base Dmg' },
    { id: 'w06', name: 'Light Crossbow', range: '2-4', baseDmg: 2, synergyClass: 'Rookie', bonusDmg: 1, bonusFront: 0, bonusSupp: 0, bonusBack: 0, bonusDesc: '+1 Base Dmg' },
    { id: 'w07', name: 'Hunting Bow', range: '2-5', baseDmg: 2, synergyClass: 'Rookie', bonusDmg: 1, bonusFront: 0, bonusSupp: 0, bonusBack: 0, bonusDesc: '+1 Base Dmg' },
    { id: 'w08', name: 'Leather Sling', range: '2-4', baseDmg: 2, synergyClass: 'Rookie', bonusDmg: 1, bonusFront: 0, bonusSupp: 0, bonusBack: 0, bonusDesc: '+1 Base Dmg' },

    // VANGUARD (Heavy hitters, close range, front parry focus)
    { id: 'w09', name: 'Zweihander', range: '1-2', baseDmg: 4, synergyClass: 'Vanguard', bonusDmg: 1, bonusFront: 1, bonusSupp: 0, bonusBack: 0, bonusDesc: '+1 Base Dmg, +1 Front Parry' },
    { id: 'w10', name: 'Claymore', range: '1', baseDmg: 5, synergyClass: 'Vanguard', bonusDmg: 1, bonusFront: 0, bonusSupp: 0, bonusBack: 0, bonusDesc: '+1 Base Dmg' },
    { id: 'w11', name: 'Halberd', range: '1-2', baseDmg: 4, synergyClass: 'Vanguard', bonusDmg: 0, bonusFront: 2, bonusSupp: 0, bonusBack: 0, bonusDesc: '+2 Front Parry' },
    { id: 'w12', name: 'Bardiche', range: '1-2', baseDmg: 4, synergyClass: 'Vanguard', bonusDmg: 1, bonusFront: 1, bonusSupp: 0, bonusBack: 0, bonusDesc: '+1 Base Dmg, +1 Front Parry' },
    { id: 'w13', name: 'Executioners Axe', range: '1', baseDmg: 5, synergyClass: 'Vanguard', bonusDmg: 2, bonusFront: 0, bonusSupp: 0, bonusBack: 0, bonusDesc: '+2 Base Dmg' },
    { id: 'w14', name: 'Heavy Flail', range: '1', baseDmg: 4, synergyClass: 'Vanguard', bonusDmg: 1, bonusFront: 1, bonusSupp: 0, bonusBack: 0, bonusDesc: '+1 Base Dmg, +1 Front Parry' },
    { id: 'w15', name: 'Morningstar', range: '1', baseDmg: 4, synergyClass: 'Vanguard', bonusDmg: 1, bonusFront: 1, bonusSupp: 0, bonusBack: 0, bonusDesc: '+1 Base Dmg, +1 Front Parry' },
    { id: 'w16', name: 'Iron Blunderbuss', range: '1-2', baseDmg: 5, synergyClass: 'Vanguard', bonusDmg: 1, bonusFront: 1, bonusSupp: 0, bonusBack: 0, bonusDesc: '+1 Base Dmg, +1 Front Parry' },
    { id: 'w17', name: 'Brass Hand Cannon', range: '1-3', baseDmg: 5, synergyClass: 'Vanguard', bonusDmg: 2, bonusFront: 0, bonusSupp: 0, bonusBack: 0, bonusDesc: '+2 Base Dmg' },

    // PALADIN (Shields, maces, support and front line defense)
    { id: 'w18', name: 'Broadsword & Kite Shield', range: '1', baseDmg: 3, synergyClass: 'Paladin', bonusDmg: 0, bonusFront: 1, bonusSupp: 1, bonusBack: 0, bonusDesc: '+1 Front Parry, +1 Support Intercept' },
    { id: 'w19', name: 'Warhammer', range: '1', baseDmg: 4, synergyClass: 'Paladin', bonusDmg: 1, bonusFront: 1, bonusSupp: 0, bonusBack: 0, bonusDesc: '+1 Base Dmg, +1 Front Parry' },
    { id: 'w20', name: 'Flanged Mace', range: '1', baseDmg: 3, synergyClass: 'Paladin', bonusDmg: 1, bonusFront: 1, bonusSupp: 0, bonusBack: 0, bonusDesc: '+1 Base Dmg, +1 Front Parry' },
    { id: 'w21', name: 'Knights Lance', range: '1-2', baseDmg: 4, synergyClass: 'Paladin', bonusDmg: 1, bonusFront: 1, bonusSupp: 0, bonusBack: 0, bonusDesc: '+1 Base Dmg, +1 Front Parry' },
    { id: 'w22', name: 'Tower Shield & Pike', range: '1-2', baseDmg: 2, synergyClass: 'Paladin', bonusDmg: 0, bonusFront: 2, bonusSupp: 1, bonusBack: 0, bonusDesc: '+2 Front Parry, +1 Support Intercept' },
    { id: 'w23', name: 'Blessed Mace', range: '1', baseDmg: 3, synergyClass: 'Paladin', bonusDmg: 0, bonusFront: 0, bonusSupp: 2, bonusBack: 0, bonusDesc: '+2 Support Intercept' },
    { id: 'w24', name: 'Defenders Trident', range: '1-2', baseDmg: 3, synergyClass: 'Paladin', bonusDmg: 0, bonusFront: 1, bonusSupp: 1, bonusBack: 0, bonusDesc: '+1 Front Parry, +1 Support Intercept' },
    { id: 'w25', name: 'Steel Wall Shield', range: '1', baseDmg: 1, synergyClass: 'Paladin', bonusDmg: 0, bonusFront: 2, bonusSupp: 2, bonusBack: 0, bonusDesc: '+2 Front Parry, +2 Support Intercept' },

    // SNIPER (Long range, raw damage)
    { id: 'w26', name: 'Yew Longbow', range: '4-8', baseDmg: 4, synergyClass: 'Sniper', bonusDmg: 2, bonusFront: 0, bonusSupp: 0, bonusBack: 0, bonusDesc: '+2 Base Dmg' },
    { id: 'w27', name: 'Heavy Arbalest', range: '3-7', baseDmg: 5, synergyClass: 'Sniper', bonusDmg: 1, bonusFront: 0, bonusSupp: 0, bonusBack: 0, bonusDesc: '+1 Base Dmg' },
    { id: 'w28', name: 'Flintlock Musket', range: '3-6', baseDmg: 5, synergyClass: 'Sniper', bonusDmg: 2, bonusFront: 0, bonusSupp: 0, bonusBack: 0, bonusDesc: '+2 Base Dmg' },
    { id: 'w29', name: 'Matchlock Jezail', range: '5-10', baseDmg: 4, synergyClass: 'Sniper', bonusDmg: 2, bonusFront: 0, bonusSupp: 0, bonusBack: 0, bonusDesc: '+2 Base Dmg' },
    { id: 'w30', name: 'Clockwork Rifle', range: '4-8', baseDmg: 4, synergyClass: 'Sniper', bonusDmg: 1, bonusFront: 1, bonusSupp: 0, bonusBack: 0, bonusDesc: '+1 Base Dmg, +1 Front Parry' },
    { id: 'w31', name: 'Composite Bow', range: '3-6', baseDmg: 3, synergyClass: 'Sniper', bonusDmg: 2, bonusFront: 0, bonusSupp: 0, bonusBack: 0, bonusDesc: '+2 Base Dmg' },
    { id: 'w32', name: 'Dragon Pistol', range: '2-5', baseDmg: 5, synergyClass: 'Sniper', bonusDmg: 1, bonusFront: 0, bonusSupp: 0, bonusBack: 0, bonusDesc: '+1 Base Dmg' },
    { id: 'w33', name: 'Wheellock Rifle', range: '4-7', baseDmg: 4, synergyClass: 'Sniper', bonusDmg: 2, bonusFront: 0, bonusSupp: 0, bonusBack: 0, bonusDesc: '+2 Base Dmg' },

    // CONDUIT (Mid-range magic, support intercepts)
    { id: 'w34', name: 'Oak Staff', range: '1-2', baseDmg: 2, synergyClass: 'Conduit', bonusDmg: 0, bonusFront: 1, bonusSupp: 1, bonusBack: 0, bonusDesc: '+1 Front Parry, +1 Support Intercept' },
    { id: 'w35', name: 'Iron Censer', range: '1-3', baseDmg: 2, synergyClass: 'Conduit', bonusDmg: 0, bonusFront: 0, bonusSupp: 2, bonusBack: 0, bonusDesc: '+2 Support Intercept' },
    { id: 'w36', name: 'Resonance Tome', range: '2-4', baseDmg: 1, synergyClass: 'Conduit', bonusDmg: 0, bonusFront: 0, bonusSupp: 3, bonusBack: 0, bonusDesc: '+3 Support Intercept' },
    { id: 'w37', name: 'Crystal Focus', range: '2-5', baseDmg: 3, synergyClass: 'Conduit', bonusDmg: 1, bonusFront: 0, bonusSupp: 1, bonusBack: 0, bonusDesc: '+1 Base Dmg, +1 Support Intercept' },
    { id: 'w38', name: 'Runed Wand', range: '2-4', baseDmg: 2, synergyClass: 'Conduit', bonusDmg: 1, bonusFront: 0, bonusSupp: 1, bonusBack: 0, bonusDesc: '+1 Base Dmg, +1 Support Intercept' },
    { id: 'w39', name: 'Chanting Beads', range: '1', baseDmg: 1, synergyClass: 'Conduit', bonusDmg: 0, bonusFront: 0, bonusSupp: 2, bonusBack: 0, bonusDesc: '+2 Support Intercept' },
    { id: 'w40', name: 'Spirit Lantern', range: '1-3', baseDmg: 2, synergyClass: 'Conduit', bonusDmg: 0, bonusFront: 0, bonusSupp: 2, bonusBack: 0, bonusDesc: '+2 Support Intercept' },
    { id: 'w41', name: 'Star-metal Astrolabe', range: '2-5', baseDmg: 2, synergyClass: 'Conduit', bonusDmg: 0, bonusFront: 0, bonusSupp: 2, bonusBack: 0, bonusDesc: '+2 Support Intercept' },

    // SKIRMISHER (Agile, evasion, flanking)
    { id: 'w42', name: 'Rapier', range: '1', baseDmg: 3, synergyClass: 'Skirmisher', bonusDmg: 1, bonusFront: 0, bonusSupp: 0, bonusBack: 1, bonusDesc: '+1 Base Dmg, +1 Backline Evasion' },
    { id: 'w43', name: 'Twin Daggers', range: '1', baseDmg: 3, synergyClass: 'Skirmisher', bonusDmg: 0, bonusFront: 0, bonusSupp: 0, bonusBack: 2, bonusDesc: '+2 Backline Evasion' },
    { id: 'w44', name: 'Cavalry Sabre', range: '1', baseDmg: 4, synergyClass: 'Skirmisher', bonusDmg: 1, bonusFront: 0, bonusSupp: 0, bonusBack: 1, bonusDesc: '+1 Base Dmg, +1 Backline Evasion' },
    { id: 'w45', name: 'Throwing Knives', range: '2-4', baseDmg: 2, synergyClass: 'Skirmisher', bonusDmg: 1, bonusFront: 0, bonusSupp: 0, bonusBack: 1, bonusDesc: '+1 Base Dmg, +1 Backline Evasion' },
    { id: 'w46', name: 'Brace of Pistols', range: '1-3', baseDmg: 4, synergyClass: 'Skirmisher', bonusDmg: 1, bonusFront: 0, bonusSupp: 0, bonusBack: 1, bonusDesc: '+1 Base Dmg, +1 Backline Evasion' },
    { id: 'w47', name: 'Hand Crossbow', range: '2-4', baseDmg: 3, synergyClass: 'Skirmisher', bonusDmg: 1, bonusFront: 0, bonusSupp: 0, bonusBack: 1, bonusDesc: '+1 Base Dmg, +1 Backline Evasion' },
    { id: 'w48', name: 'Leather Whip', range: '1-3', baseDmg: 2, synergyClass: 'Skirmisher', bonusDmg: 0, bonusFront: 0, bonusSupp: 0, bonusBack: 2, bonusDesc: '+2 Backline Evasion' },
    { id: 'w49', name: 'Chakram', range: '2-5', baseDmg: 3, synergyClass: 'Skirmisher', bonusDmg: 1, bonusFront: 0, bonusSupp: 0, bonusBack: 1, bonusDesc: '+1 Base Dmg, +1 Backline Evasion' },
    { id: 'w50', name: 'Gladius', range: '1', baseDmg: 3, synergyClass: 'Skirmisher', bonusDmg: 1, bonusFront: 0, bonusSupp: 0, bonusBack: 1, bonusDesc: '+1 Base Dmg, +1 Backline Evasion' }
];