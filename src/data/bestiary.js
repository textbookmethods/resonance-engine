export const bestiary = [
  // ---------------------------------------------------------
  // MINIONS (Tier 1-2, low HP, 0 barriers, swarm tactics)
  // ---------------------------------------------------------
  { 
      id: 1, name: "Conscripted Militiaman", tier: 1, type: "Minion", hp: 12, barriers: [], 
      abilities: ["Spear Thrust: Deals 3 damage to one adjacent target."] 
  },
  { 
      id: 2, name: "Hollowed Peasant", tier: 1, type: "Minion", hp: 10, barriers: [], 
      abilities: ["Desperate Claw: Deals 2 damage.", "Swarm Mentality [1 Res]: If adjacent to another Hollowed, attack twice."] 
  },
  { 
      id: 3, name: "Trench Hound", tier: 1, type: "Minion", hp: 8, barriers: [], 
      abilities: ["Bite: Deals 3 damage.", "Hamstring [2 Res]: Target loses their shift action next turn."] 
  },
  { 
      id: 4, name: "Eonic Scout", tier: 1, type: "Minion", hp: 15, barriers: [], 
      abilities: ["Shortbow: Deals 3 damage at range 2-5.", "Reposition: Shift 2 hexes after attacking."] 
  },
  { 
      id: 5, name: "Resonance Wisp", tier: 1, type: "Minion", hp: 5, barriers: [], 
      abilities: ["Arcane Spark: Deals 2 damage.", "Detonate [1 Res]: Destroys self to deal 5 damage in a 1-hex radius."] 
  },
  { 
      id: 6, name: "Grave Robber", tier: 1, type: "Minion", hp: 12, barriers: [], 
      abilities: ["Shiv: Deals 3 damage. Flanking attacks deal +2 damage."] 
  },
  { 
      id: 7, name: "Plague Rat Swarm", tier: 1, type: "Minion", hp: 10, barriers: [], 
      abilities: ["Gnawing Teeth: Deals 2 damage.", "Infectious [1 Res]: Applies Minor Poison (1 dmg/turn) to target."] 
  },
  { 
      id: 8, name: "Black-Powder Rifleman", tier: 1, type: "Minion", hp: 14, barriers: [], 
      abilities: ["Musket Shot: Deals 4 damage at range 3-6.", "Reload: Cannot attack next turn unless they shift."] 
  },
  { 
      id: 9, name: "Cultist Initiate", tier: 1, type: "Minion", hp: 12, barriers: [], 
      abilities: ["Sacrificial Dagger: Deals 3 damage.", "Blood Hex [2 Res]: Target's next attack deals -2 damage."] 
  },
  { 
      id: 10, name: "Clockwork Sentry", tier: 1, type: "Minion", hp: 18, barriers: [], 
      abilities: ["Bronze Blade: Deals 3 damage.", "Overwatch [1 Res]: Instantly attacks the next enemy to enter a front-arc hex."] 
  },
  { 
      id: 11, name: "Ironclad Foot-Soldier", tier: 2, type: "Minion", hp: 20, barriers: [], 
      abilities: ["Longsword: Deals 4 damage.", "Shield Wall [1 Res]: +2 Front Parry for all adjacent allies until next turn."] 
  },
  { 
      id: 12, name: "Feral Ghoul", tier: 2, type: "Minion", hp: 16, barriers: [], 
      abilities: ["Rending Claws: Deals 4 damage.", "Frenzy [2 Res]: Shift 3 hexes and attack any target in range."] 
  },
  { 
      id: 13, name: "Ash-Wastes Scavenger", tier: 2, type: "Minion", hp: 18, barriers: [], 
      abilities: ["Scrap Cleaver: Deals 4 damage.", "Pocket Sand [1 Res]: Target is blinded, halving their next attack's range."] 
  },
  { 
      id: 14, name: "Corrupted Acolyte", tier: 2, type: "Minion", hp: 15, barriers: [], 
      abilities: ["Void Bolt: Deals 3 damage at range 2-4.", "Drain [2 Res]: Deals 2 damage and restores 2 HP to self."] 
  },
  { 
      id: 15, name: "Skeletal Pikeman", tier: 2, type: "Minion", hp: 14, barriers: [], 
      abilities: ["Pike Thrust: Deals 4 damage at range 2.", "Brace [1 Res]: Reflects 2 damage back at next melee attacker."] 
  },

  // ---------------------------------------------------------
  // STRIKERS (Tier 1-3, medium HP, high damage, 0-1 barriers)
  // ---------------------------------------------------------
  { 
      id: 16, name: "Trench-Mage", tier: 2, type: "Striker", hp: 25, barriers: [10], 
      abilities: ["Arcane Missiles: Deals 5 damage at range 2-4.", "Flash Fire [3 Res]: Paints target hex as Minor Terrain (Fire)."] 
  },
  { 
      id: 17, name: "Inquisition Assassin", tier: 2, type: "Striker", hp: 22, barriers: [], 
      abilities: ["Backstab: Deals 6 damage. Bypasses Backline Evasion if Flanking.", "Smoke Bomb [2 Res]: Shifts 3 hexes without triggering Overwatch."] 
  },
  { 
      id: 18, name: "Berserker Vanguard", tier: 2, type: "Striker", hp: 35, barriers: [], 
      abilities: ["Reckless Swing: Deals 7 damage.", "Bloodlust [3 Res]: Take 5 damage to deal 10 damage to an adjacent target."] 
  },
  { 
      id: 19, name: "Eonic Dragoon", tier: 2, type: "Striker", hp: 28, barriers: [15], 
      abilities: ["Cavalry Sabre: Deals 5 damage.", "Charge [2 Res]: Shift up to 4 hexes in a straight line and deal 6 damage."] 
  },
  { 
      id: 20, name: "Resonance Weaver", tier: 2, type: "Striker", hp: 20, barriers: [20], 
      abilities: ["Aether Whip: Deals 4 damage at range 1-3.", "Kinetic Push [3 Res]: Pushes target 2 hexes straight back."] 
  },
  { 
      id: 21, name: "Mutated Brute", tier: 2, type: "Striker", hp: 40, barriers: [], 
      abilities: ["Smash: Deals 6 damage.", "Ground Slam [3 Res]: Deals 4 damage to all entities in a 1-hex radius."] 
  },
  { 
      id: 22, name: "Shadow Stalker", tier: 2, type: "Striker", hp: 25, barriers: [], 
      abilities: ["Shadow Strike: Deals 5 damage.", "Phase [2 Res]: Ignore terrain movement costs this turn."] 
  },
  { 
      id: 23, name: "Crossbow Sniper", tier: 2, type: "Striker", hp: 22, barriers: [10], 
      abilities: ["Heavy Bolt: Deals 6 damage at range 4-8.", "Pinning Shot [2 Res]: Target cannot shift next turn."] 
  },
  { 
      id: 24, name: "Alchemical Grenadier", tier: 2, type: "Striker", hp: 26, barriers: [], 
      abilities: ["Shrapnel Flask: Deals 4 damage at range 2-4.", "Acid Flask [3 Res]: Paints target hex as Major Terrain (Acid)."] 
  },
  { 
      id: 25, name: "Blood-Iron Duelist", tier: 3, type: "Striker", hp: 30, barriers: [15], 
      abilities: ["Rapier Lunge: Deals 6 damage.", "Riposte [3 Res]: The next missed attack against this unit triggers a 4 damage counter-attack."] 
  },
  { 
      id: 26, name: "Storm-Caller", tier: 3, type: "Striker", hp: 28, barriers: [25], 
      abilities: ["Lightning Arc: Deals 5 damage at range 2-5.", "Chain Lightning [4 Res]: Deals 5 damage to target, and 3 damage to an adjacent enemy."] 
  },
  { 
      id: 27, name: "Beastmaster", tier: 3, type: "Striker", hp: 35, barriers: [10], 
      abilities: ["Whip Crack: Deals 5 damage.", "Command Pack [3 Res]: All allied Minions immediately shift 1 hex and attack."] 
  },
  { 
      id: 28, name: "Infernal Engine", tier: 3, type: "Striker", hp: 45, barriers: [], 
      abilities: ["Rotary Cannon: Deals 3 damage to two different targets.", "Overdrive [4 Res]: Deals 8 damage, but Engine takes 4 damage."] 
  },
  { 
      id: 29, name: "Void-Touched Harpy", tier: 3, type: "Striker", hp: 30, barriers: [10], 
      abilities: ["Diving Talons: Deals 6 damage.", "Sonic Screech [3 Res]: Target is Staggered, removing their base weapon damage from mitigation."] 
  },
  { 
      id: 30, name: "Elite Cannoneer", tier: 3, type: "Striker", hp: 35, barriers: [20], 
      abilities: ["Hand Cannon: Deals 7 damage at range 2-6.", "Grapeshot [4 Res]: Deals 4 damage to all targets in a 2-hex front cone."] 
  },

  // ---------------------------------------------------------
  // ELITES (Tier 2-3, high HP, 1-2 barriers, battlefield control)
  // ---------------------------------------------------------
  { 
      id: 31, name: "Ironclad Centurion", tier: 3, type: "Elite", hp: 60, barriers: [30], 
      abilities: ["Greatsword: Deals 8 damage.", "Commanding Shout [3 Res]: Grants +10 HP to all Minions within 3 hexes.", "Phalanx [2 Res]: Negates all flanking penalties for 1 turn."] 
  },
  { 
      id: 32, name: "High Inquisitor", tier: 3, type: "Elite", hp: 50, barriers: [20, 20], 
      abilities: ["Zealot's Flame: Deals 6 damage.", "Purge [4 Res]: Removes all buffs from target and deals 5 damage.", "Condemn [3 Res]: Paints a 1-hex radius as Severe Terrain (Holy Fire)."] 
  },
  { 
      id: 33, name: "Eonic War-Priest", tier: 3, type: "Elite", hp: 55, barriers: [40], 
      abilities: ["Mace of Eons: Deals 7 damage.", "Divine Shield [3 Res]: Restores a broken barrier on an allied unit at 10 HP.", "Smite [4 Res]: Deals 10 damage to a Staggered target."] 
  },
  { 
      id: 34, name: "Necrotech Flesh-Golem", tier: 3, type: "Elite", hp: 80, barriers: [], 
      abilities: ["Crushing Blow: Deals 9 damage.", "Absorb Dead [3 Res]: Destroys an adjacent Minion corpse to heal 20 HP.", "Toxic Vent [4 Res]: Paints all adjacent hexes as Major Terrain (Poison)."] 
  },
  { 
      id: 35, name: "Arch-Cryomancer", tier: 3, type: "Elite", hp: 45, barriers: [30, 20], 
      abilities: ["Ice Lance: Deals 6 damage at range 3-6.", "Glacial Prison [5 Res]: Target is encased in ice (Stunned) until they take 5 damage.", "Blizzard [4 Res]: Paints a 2-hex radius as Minor Terrain (Deep Snow)."] 
  },
  { 
      id: 36, name: "Dread-Knight", tier: 3, type: "Elite", hp: 70, barriers: [25], 
      abilities: ["Soul-Cleaver: Deals 8 damage.", "Terror [3 Res]: Target must immediately shift 2 hexes away.", "Life Siphon [4 Res]: Deals 6 damage and heals self for 6 HP."] 
  },
  { 
      id: 37, name: "Clockwork Behemoth", tier: 3, type: "Elite", hp: 90, barriers: [20], 
      abilities: ["Hydraulic Smash: Deals 10 damage.", "Venting Steam [3 Res]: Deals 4 damage to all adjacent enemies.", "Repair Protocols [4 Res]: Restores 15 HP."] 
  },
  { 
      id: 38, name: "Master Assassin", tier: 3, type: "Elite", hp: 45, barriers: [20, 20], 
      abilities: ["Lethal Strike: Deals 8 damage.", "Shadow Step [4 Res]: Instantly teleport to any empty hex within 5 spaces.", "Toxin [3 Res]: Target takes 3 damage at the start of their next 2 turns."] 
  },
  { 
      id: 39, name: "Geomancer Supreme", tier: 3, type: "Elite", hp: 55, barriers: [30, 10], 
      abilities: ["Boulder Toss: Deals 7 damage at range 2-5.", "Earthquake [5 Res]: Deals 5 damage to all entities in a 2-hex radius and changes terrain to Major (Rubble).", "Rock Wall [3 Res]: Paints one hex as Severe Terrain (Impassable)."] 
  },
  { 
      id: 40, name: "Abyssal Horror", tier: 3, type: "Elite", hp: 75, barriers: [20], 
      abilities: ["Tentacle Lash: Deals 6 damage at range 1-2.", "Mind Flay [4 Res]: Target uses their lowest DP stat for mitigation next turn.", "Drag Below [4 Res]: Pulls a target 2 hexes towards the Horror."] 
  },
  { 
      id: 41, name: "Guild Alchemist", tier: 3, type: "Elite", hp: 50, barriers: [40], 
      abilities: ["Corrosive Vial: Deals 5 damage.", "Mutagen [4 Res]: Target ally gains +3 Base Damage for 2 turns.", "Volatile Mix [5 Res]: Deals 8 damage in a 1-hex radius. Ignores barriers."] 
  },
  { 
      id: 42, name: "Storm-Drake", tier: 3, type: "Elite", hp: 85, barriers: [25], 
      abilities: ["Bite: Deals 7 damage.", "Thunder Breath [5 Res]: Deals 6 damage in a 3-hex front line.", "Gust [3 Res]: Pushes all adjacent targets 1 hex away."] 
  },
  { 
      id: 43, name: "Blood-Mage", tier: 3, type: "Elite", hp: 40, barriers: [20, 20, 20], 
      abilities: ["Boil Blood: Deals 6 damage.", "Transfusion [4 Res]: Deal 5 damage to an ally to heal self for 10 HP.", "Crimson Chains [4 Res]: Target cannot shift for 2 turns."] 
  },
  { 
      id: 44, name: "Iron-Gargoyle", tier: 3, type: "Elite", hp: 65, barriers: [30], 
      abilities: ["Stone Claws: Deals 7 damage.", "Petrify [5 Res]: Target is Stunned for 1 turn.", "Shatter Dive [4 Res]: Shifts 3 hexes and deals 5 AoE damage upon landing."] 
  },
  { 
      id: 45, name: "Warlord of the Wastes", tier: 3, type: "Elite", hp: 80, barriers: [30, 10], 
      abilities: ["Heavy Axe: Deals 9 damage.", "War Cry [4 Res]: All allies gain +1 Base Damage.", "Execute [5 Res]: Deals 15 damage to a target with no active barriers."] 
  },

  // ---------------------------------------------------------
  // BOSSES (Tier 4, massive HP, 2-3 barriers, devastating abilities)
  // ---------------------------------------------------------
  { 
      id: 46, name: "The Nameless King", tier: 4, type: "Boss", hp: 150, barriers: [50, 50, 50], 
      abilities: ["Kings Greatsword: Deals 12 damage.", "Royal Decree [6 Res]: Forces a target to attack their nearest ally.", "Eradicate [8 Res]: Deals 10 damage to all targets in a 3-hex radius. Paints area as Major Terrain (Scorched)."] 
  },
  { 
      id: 47, name: "Goliath, the Siege Engine", tier: 4, type: "Boss", hp: 200, barriers: [40, 40], 
      abilities: ["Artillery Shell: Deals 10 damage at range 4-10.", "Earthshaker [5 Res]: All targets on the board are Staggered.", "Bunker Buster [7 Res]: Destroys all Severe Terrain on the board, dealing 5 damage to anyone adjacent to the destroyed hexes."] 
  },
  { 
      id: 48, name: "Matriarch of the Deep", tier: 4, type: "Boss", hp: 120, barriers: [60, 40, 40], 
      abilities: ["Tidal Wave: Deals 8 damage in a 2-hex wide line.", "Drowning Pool [6 Res]: Paints 3 connected hexes as Severe Terrain (Whirlpool).", "Call the Brood [5 Res]: Spawns two Tier 1 Minions on adjacent hexes."] 
  },
  { 
      id: 49, name: "Avatar of the Eon", tier: 4, type: "Boss", hp: 180, barriers: [50, 50], 
      abilities: ["Time Strike: Deals 10 damage. Target is reverted to their position from the previous turn.", "Stasis Field [7 Res]: Target is Stunned and Immune to damage for 2 turns.", "Chrono-Collapse [10 Res]: Deals 20 damage to a single target, ignoring all mitigation."] 
  },
  { 
      id: 50, name: "The Resonance Core", tier: 4, type: "Boss", hp: 250, barriers: [80, 80], 
      abilities: ["Energy Pulse: Deals 8 damage to all targets within 3 hexes.", "Feedback Loop [6 Res]: Whenever the Core takes damage this turn, it reflects 3 damage back.", "Meltdown [10 Res]: Triggers System Overload instantly, regardless of the current Round number."] 
  }
];