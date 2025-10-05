import React, { useState, useEffect } from 'react';
import { Skull, Heart, Shield, Sword, Sparkles, Trophy, Zap, Flame, Droplet } from 'lucide-react';

const DungeonYahtzee = () => {
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [dice, setDice] = useState([1, 2, 3, 4, 5]);
  const [held, setHeld] = useState([false, false, false, false, false]);
  const [rollsLeft, setRollsLeft] = useState(3);
  const [isRolling, setIsRolling] = useState(false);
  const [eliteKills, setEliteKills] = useState(0);
  const [showArtifacts, setShowArtifacts] = useState(false);
  const [showForge, setShowForge] = useState(false);
  const [activeForgeTab, setActiveForgeTab] = useState('enhancement');
  const [showStats, setShowStats] = useState(false);
  const [diceBuild, setDiceBuild] = useState({
    level: 0,
    enhancement: 0,
    enchantment: 0,
    evolution: 0
  });
  
  // Individual dice enhancement levels (1-6 dice, each can be enhanced to level 25, 50, 75, etc.)
  const [diceEnhancements, setDiceEnhancements] = useState([0, 0, 0, 0, 0, 0]); // [dice1, dice2, dice3, dice4, dice5, dice6]
  
  // Evolution tiers: 0-10 (Stone, Copper, Silver, Gold, Platinum, Diamond, Ruby, Emerald, Sapphire, Obsidian, Void)
  const [evolutionTier, setEvolutionTier] = useState(0);
  
  // Evolution bonuses (6 different bonuses)
  const [evolutionBonuses, setEvolutionBonuses] = useState({
    critical: 0,      // Critical hit chance
    resistance: 0,    // Damage reduction
    regeneration: 0,   // HP/Mana regen
    luck: 0,          // Gold/XP bonus
    power: 0,         // Damage bonus
    defense: 0        // Shield bonus
  });
  
  // Enchantment Skills System
  const [enchantmentSkills, setEnchantmentSkills] = useState({
    extraRoll: 0,        // 4 Szansa - extra roll
    reroll: 0,           // Powtórzenie rzutu
    multiplier: 0,       // Mnożnik damage
    bonusDmg: 0,         // Dodatkowy DMG
    bonusExp: 0,         // Bonus EXP
    bonusGold: 0,        // Bonus Gold
    shield: 0,           // Tarcza
    regeneration: 0,     // Regeneracja HP
    critical: 0,         // Krytyk
    lifesteal: 0,        // Lifesteal
    freeze: 0,           // Zamrożenie
    burn: 0,             // Podpalenie
    blessing: 0,         // Błogosławieństwo
    curse: 0,            // Przekleństwo
    teleport: 0,         // Teleport
    vision: 0,           // Widzenie
    speed: 0,            // Szybkość
    endurance: 0         // Wytrzymałość
  });
  
  // Active skill effects
  const [activeEffects, setActiveEffects] = useState({
    extraRolls: 0,       // Current extra rolls available
    multiplier: 0,       // Damage multiplier turns left
    shield: 0,           // Shield turns left
    regeneration: 0,     // Regen turns left
    freeze: 0,           // Freeze turns left
    burn: 0,             // Burn turns left
    blessing: 0,         // Blessing turns left
    curse: 0,            // Curse turns left
    speed: 0,            // Speed turns left
    endurance: 0         // Endurance turns left
  });
  const [collectedDice, setCollectedDice] = useState([0, 0, 0, 0, 0, 0]); // [1,2,3,4,5,6] kostki
  const [shopDice, setShopDice] = useState(0); // 1 losowa kostka w sklepie
  const [specialCombo, setSpecialCombo] = useState('');
  const [hp, setHp] = useState(60);
  const [maxHp, setMaxHp] = useState(60);
  const [shield, setShield] = useState(0);
  const [mana, setMana] = useState(30);
  const [maxMana, setMaxMana] = useState(30);
  const [floor, setFloor] = useState(1);
  const [enemy, setEnemy] = useState(null);
  const [gold, setGold] = useState(0);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [message, setMessage] = useState('');
  const [combatPhase, setCombatPhase] = useState('rolling');
  const [comboHistory, setComboHistory] = useState([]);
  const [bossFloor, setBossFloor] = useState(false);
  const [criticalHit, setCriticalHit] = useState(false);
  const [artifacts, setArtifacts] = useState([]);
  const [statusEffects, setStatusEffects] = useState({
    burning: 0,
    frozen: false,
    blessed: 0
  });
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  const enemies = [
    { name: 'Goblin Zwiadowca', hp: 18, dmg: 4, reward: 30, xp: 10, icon: '👺', special: null },
    { name: 'Szkielet Łucznik', hp: 22, dmg: 5, reward: 45, xp: 15, icon: '💀', special: 'pierce' },
    { name: 'Ork Barbarzyńca', hp: 30, dmg: 7, reward: 63, xp: 20, icon: '👹', special: 'rage' },
    { name: 'Mroczny Mag', hp: 28, dmg: 6, reward: 75, xp: 25, icon: '🧙', special: 'curse' },
    { name: 'Troll Regenerujący', hp: 40, dmg: 8, reward: 88, xp: 30, icon: '🧌', special: 'regen' },
    { name: 'Wampir', hp: 35, dmg: 9, reward: 100, xp: 35, icon: '🧛', special: 'lifesteal' },
    { name: 'Demon Ognia', hp: 45, dmg: 10, reward: 125, xp: 40, icon: '👿', special: 'burn' },
    { name: 'Smok Lodu', hp: 60, dmg: 12, reward: 200, xp: 60, icon: '🐉', special: 'freeze' },
    { name: 'Nieumarły Rycerz', hp: 70, dmg: 14, reward: 250, xp: 80, icon: '⚔️', special: 'armor' },
    { name: 'WŁADCA LOCHÓW', hp: 120, dmg: 18, reward: 1250, xp: 200, icon: '👑', special: 'boss' }
  ];

  const artifactsList = [
    { 
      name: 'Pierścień Mocy', 
      effect: 'dmg', 
      value: 1.2, 
      icon: '💍', 
      desc: '+20% do wszystkich obrażeń',
      lore: 'Starożytny pierścień pulsujący neonową energią. Wzmacnia każde uderzenie toksyczną mocą.',
      requirement: 1,
      unlocked: eliteKills >= 1
    },
    { 
      name: 'Amulet Życia', 
      effect: 'hp', 
      value: 20, 
      icon: '📿', 
      desc: '+5 HP po każdym zabiciu',
      lore: 'Cybertechnologiczny amulet absorbujący energię życiową pokonanych wrogów.',
      requirement: 2,
      unlocked: eliteKills >= 2
    },
    { 
      name: 'Kryształ Many', 
      effect: 'mana', 
      value: 15, 
      icon: '💎', 
      desc: '+15 maksymalnej many',
      lore: 'Pulsujący kryształ zawierający nieskończone zasoby cyfrowej mocy.',
      requirement: 3,
      unlocked: eliteKills >= 3
    },
    { 
      name: 'Maska Krytyka', 
      effect: 'crit', 
      value: 0.15, 
      icon: '🎭', 
      desc: '+15% szansy na krytyka',
      lore: 'Tajemnicza maska hakera ujawniająca słabe punkty w systemach przeciwnika.',
      requirement: 4,
      unlocked: eliteKills >= 4
    },
    { 
      name: 'Tarcza Odbicia', 
      effect: 'reflect', 
      value: 0.3, 
      icon: '🛡️', 
      desc: 'Odbija 30% otrzymanych obrażeń',
      lore: 'Holograficzna tarcza odbijająca ataki z neonowym blaskiem.',
      requirement: 5,
      unlocked: eliteKills >= 5
    },
    { 
      name: 'Oko Chaosu', 
      effect: 'xp', 
      value: 1.5, 
      icon: '👁️', 
      desc: '+50% XP z walk',
      lore: 'Cybernetyczne oko widzące przez wymiary. Odkrywa ukryte ścieżki doświadczenia.',
      requirement: 7,
      unlocked: eliteKills >= 7
    },
    { 
      name: 'Kostka Czasu', 
      effect: 'rolls', 
      value: 1, 
      icon: '⏰', 
      desc: '+1 rzut kostkami',
      lore: 'Zakrzywiona kostka manipulująca czasem. Daje dodatkowy rzut w każdej walce.',
      requirement: 10,
      unlocked: eliteKills >= 10
    },
    { 
      name: 'Neonowy Płaszcz', 
      effect: 'dodge', 
      value: 0.2, 
      icon: '👘', 
      desc: '+20% szansy na unik',
      lore: 'Holograficzny płaszcz z technologii stealth. Sprawia, że ataki przechodzą przez ciebie.',
      requirement: 12,
      unlocked: eliteKills >= 12
    },
    { 
      name: 'Kryształ Lodu', 
      effect: 'freeze', 
      value: 0.25, 
      icon: '❄️', 
      desc: '25% szansy na zamrożenie',
      lore: 'Wieczny lód z wymiaru zimna. Zamraża przeciwników na miejscu.',
      requirement: 15,
      unlocked: eliteKills >= 15
    },
    { 
      name: 'Ostrze Wampira', 
      effect: 'lifesteal', 
      value: 0.3, 
      icon: '🗡️', 
      desc: '30% lifesteal z obrażeń',
      lore: 'Zaklęte ostrze pijące życie wrogów. Każde uderzenie leczy.',
      requirement: 18,
      unlocked: eliteKills >= 18
    },
    { 
      name: 'Płomienie Piekła', 
      effect: 'burn', 
      value: 0.4, 
      icon: '🔥', 
      desc: '40% szansy na podpalenie',
      lore: 'Ogień z najgłębszych czeluści. Palące się rany nie goją się łatwo.',
      requirement: 20,
      unlocked: eliteKills >= 20
    },
    { 
      name: 'Kryształ Złota', 
      effect: 'gold', 
      value: 2.0, 
      icon: '💰', 
      desc: '+100% złota z walk',
      lore: 'Magiczny kryształ przyciągający bogactwo. Złoto lgnie do ciebie.',
      requirement: 25,
      unlocked: eliteKills >= 25
    },
    { 
      name: 'Maska Szaleństwa', 
      effect: 'rage', 
      value: 0.5, 
      icon: '😈', 
      desc: '+50% obrażeń gdy HP < 30%',
      lore: 'Maska wyzwalająca pierwotną furię. Im bliżej śmierci, tym silniejszy.',
      requirement: 30,
      unlocked: eliteKills >= 30
    },
    { 
      name: 'Tarcza Czasu', 
      effect: 'shield', 
      value: 50, 
      icon: '⏳', 
      desc: '+50 tarczy na start walki',
      lore: 'Chronometr tworzący barierę czasową. Chroni przed pierwszymi atakami.',
      requirement: 35,
      unlocked: eliteKills >= 35
    },
    { 
      name: 'Oko Przepowiedni', 
      effect: 'foresight', 
      value: 0.3, 
      icon: '🔮', 
      desc: '30% szansy na podwójny rzut',
      lore: 'Kryształowa kula widząca przyszłość. Pozwala na ponowne rzucenie kostkami.',
      requirement: 40,
      unlocked: eliteKills >= 40
    },
    { 
      name: 'Kostka Przeznaczenia', 
      effect: 'destiny', 
      value: 0.1, 
      icon: '🎲', 
      desc: '10% szansy na natychmiastowe zabicie',
      lore: 'Kostka decydująca o życiu i śmierci. Czasami los jest po twojej stronie.',
      requirement: 45,
      unlocked: eliteKills >= 45
    },
    { 
      name: 'Serce Feniksa', 
      effect: 'revive', 
      value: 1, 
      icon: '❤️', 
      desc: 'Ożywienie po śmierci (1x na grę)',
      lore: 'Płonące serce odradzające się z popiołów. Daje drugą szansę.',
      requirement: 50,
      unlocked: eliteKills >= 50
    },
    { 
      name: 'Korona Chaosu', 
      effect: 'chaos', 
      value: 0.2, 
      icon: '👑', 
      desc: '20% szansy na losowy efekt',
      lore: 'Korona władcy chaosu. Każda walka może przynieść niespodziankę.',
      requirement: 60,
      unlocked: eliteKills >= 60
    },
    { 
      name: 'Oko Boga', 
      effect: 'omniscience', 
      value: 1, 
      icon: '👁️‍🗨️', 
      desc: 'Widzi wszystkie kombinacje',
      lore: 'Oko widzące wszystkie możliwe wyniki. Pozwala wybrać najlepszą kombinację.',
      requirement: 75,
      unlocked: eliteKills >= 75
    },
    { 
      name: 'Kostka Nieskończoności', 
      effect: 'infinite', 
      value: 0.05, 
      icon: '♾️', 
      desc: '5% szansy na nieskończone rzuty',
      lore: 'Kostka z wymiaru nieskończoności. Czasami daje nieograniczone możliwości.',
      requirement: 100,
      unlocked: eliteKills >= 100
    }
  ];

  useEffect(() => {
    // Load saved game
    const savedGame = localStorage.getItem('dungeon-yahtzee-save');
    if (savedGame) {
      try {
        const data = JSON.parse(savedGame);
        setHp(data.hp);
        setMaxHp(data.maxHp);
        setMana(data.mana);
        setMaxMana(data.maxMana);
        setShield(data.shield);
        setFloor(data.floor);
        setGold(data.gold);
        setXp(data.xp);
        setLevel(data.level);
        setArtifacts(data.artifacts || []);
        setDice(data.dice || [1, 2, 3, 4, 5]);
        setRollsLeft(data.rollsLeft || 3);
        setDiceEnhancements(data.diceEnhancements || [0, 0, 0, 0, 0, 0]);
        setEvolutionTier(data.evolutionTier || 0);
        setEvolutionBonuses(data.evolutionBonuses || { critical: 0, resistance: 0, regeneration: 0, luck: 0, power: 0, defense: 0 });
        setEnchantmentSkills(data.enchantmentSkills || { extraRoll: 0, reroll: 0, multiplier: 0, bonusDmg: 0, bonusExp: 0, bonusGold: 0, shield: 0, regeneration: 0, critical: 0, lifesteal: 0, freeze: 0, burn: 0, blessing: 0, curse: 0, teleport: 0, vision: 0, speed: 0, endurance: 0 });
        setActiveEffects(data.activeEffects || { extraRolls: 0, multiplier: 0, shield: 0, regeneration: 0, freeze: 0, burn: 0, blessing: 0, curse: 0, speed: 0, endurance: 0 });
      } catch (e) {
        console.error('Failed to load saved game', e);
      }
    }

    // Loading screen animation
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!loading) {
      spawnEnemy();
    }
  }, [loading]);

  // Auto-save game state
  useEffect(() => {
    if (!loading && !gameOver && !victory && enemy) {
      const gameState = {
        hp, maxHp, mana, maxMana, shield, floor, gold, xp, level, artifacts, dice, rollsLeft,
        diceBuild, collectedDice, shopDice
      };
      localStorage.setItem('dungeon-yahtzee-save', JSON.stringify(gameState));
    }
  }, [hp, maxHp, mana, maxMana, shield, floor, gold, xp, level, artifacts, dice, rollsLeft, diceBuild, collectedDice, shopDice, loading, gameOver, victory, enemy]);

  // Generate shop dice on game start
  useEffect(() => {
    if (!loading && shopDice === 0) {
      generateShopDice();
    }
  }, [loading, shopDice]);

  useEffect(() => {
    if (floor > 1) {
      spawnEnemy();
    }
  }, [floor]);

  useEffect(() => {
    // Enhanced XP scaling for endless gameplay
    const xpNeeded = level * 50 + Math.floor(level * level * 0.5); // Quadratic scaling
    if (xp >= xpNeeded) {
      levelUp();
    }
  }, [xp]);

  const levelUp = () => {
    setLevel(level + 1);
    
    // Enhanced scaling for endless gameplay
    const hpGain = 10 + Math.floor(level / 5); // +1 HP per 5 levels
    const manaGain = 5 + Math.floor(level / 10); // +1 Mana per 10 levels
    
    const newMaxHp = maxHp + hpGain;
    const newMaxMana = maxMana + manaGain;
    setMaxHp(newMaxHp);
    setHp(hp + hpGain);
    setMaxMana(newMaxMana);
    setMana(newMaxMana);
    setMessage(`⚡ LEVEL UP! Poziom ${level + 1}! +${hpGain} HP, +${manaGain} Mana!`);
  };

  const spawnEnemy = () => {
    const isElite = Math.random() < 0.3; // 30% szansy na elite enemy
    const isBoss = floor % 5 === 0;
    setBossFloor(isBoss);
    
    // Endless scaling - cycle through enemies infinitely
    let index;
    if (isBoss) {
      index = Math.min(Math.floor(floor / 5) + 3, enemies.length - 1);
    } else {
      // Cycle through enemies based on floor, but allow infinite scaling
      const baseIndex = Math.floor((floor - 1) / 1.5);
      index = baseIndex % (enemies.length - 1); // Cycle through all enemies except last
    }
    
    const enemyTemplate = enemies[index];
    
    // Enhanced scaling for endless gameplay
    const floorMultiplier = 1 + (floor * 0.15); // 15% increase per floor
    const bossMultiplier = isBoss ? 2.0 : 1.0;
    const eliteMultiplier = isElite ? 1.8 : 1.0;
    
    let scaledHp = Math.floor(enemyTemplate.hp * floorMultiplier * bossMultiplier * eliteMultiplier);
    let scaledDmg = Math.floor(enemyTemplate.dmg * floorMultiplier * bossMultiplier * eliteMultiplier);
    
    // Additional scaling for very high floors (floor 20+)
    if (floor >= 20) {
      const extraMultiplier = 1 + ((floor - 20) * 0.05); // 5% extra per floor after 20
      scaledHp = Math.floor(scaledHp * extraMultiplier);
      scaledDmg = Math.floor(scaledDmg * extraMultiplier);
    }
    
    setEnemy({
      ...enemyTemplate,
      hp: scaledHp,
      currentHp: scaledHp,
      dmg: scaledDmg,
      isElite: isElite
    });
    setRollsLeft(3);
    setHeld([false, false, false, false, false]);
    setCombatPhase('rolling');
    setIsRolling(false);
    
    if (isElite) {
      setMessage(`⚡ ELITE ENCOUNTER! ${enemyTemplate.icon} ${enemyTemplate.name}! [Lvl ${level}]`);
    } else if (isBoss) {
      setMessage(`⚠️ BOSS! Piętro ${floor}: ${enemyTemplate.icon} ${enemyTemplate.name}!`);
    } else {
      setMessage(`Piętro ${floor}: ${enemyTemplate.icon} ${enemyTemplate.name}`);
    }
  };

  const rollDice = () => {
    if (rollsLeft <= 0 || combatPhase !== 'rolling' || isRolling) return;
    
    setIsRolling(true);
    setSpecialCombo(''); // Clear previous special combo
    
    // Animate dice rolling with random values - slower animation
    let animationFrame = 0;
    const animationInterval = setInterval(() => {
      animationFrame++;
      // Show random values during animation (only for non-held dice)
      setDice(prevDice => prevDice.map((d, i) => 
        held[i] ? d : Math.floor(Math.random() * 6) + 1
      ));
      
      // Stop animation after 20 frames (~1000ms) - slower
      if (animationFrame >= 20) {
        clearInterval(animationInterval);
        
        // Set final values
    const newDice = dice.map((d, i) => held[i] ? d : Math.floor(Math.random() * 6) + 1);
    setDice(newDice);
        setIsRolling(false);
    setRollsLeft(rollsLeft - 1);
        
        // Check for special combos
        checkSpecialCombo(newDice);
    
    if (rollsLeft === 1) {
      setMessage('⚡ Ostatni rzut! Wybierz mądrze!');
        }
      }
    }, 50);
  };

  const checkSpecialCombo = (diceValues) => {
    const counts = {};
    diceValues.forEach(d => counts[d] = (counts[d] || 0) + 1);
    const values = Object.values(counts).sort((a, b) => b - a);
    
    // Check for Yahtzee
    if (values[0] === 5) {
      setSpecialCombo('yahtzee');
      setTimeout(() => setSpecialCombo(''), 3000);
      return;
    }
    
    // Check for straight
    const sorted = [...diceValues].sort((a, b) => a - b);
    const isSequence = (arr) => {
      for (let i = 1; i < arr.length; i++) {
        if (arr[i] !== arr[i-1] + 1) return false;
      }
      return true;
    };
    
    if (isSequence(sorted)) {
      setSpecialCombo('straight');
      setTimeout(() => setSpecialCombo(''), 3000);
    }
  };

  const toggleHold = (index) => {
    if (rollsLeft === 3 || combatPhase !== 'rolling') return;
    const newHeld = [...held];
    newHeld[index] = !newHeld[index];
    setHeld(newHeld);
  };

  const calculateCombos = () => {
    const counts = {};
    dice.forEach(d => counts[d] = (counts[d] || 0) + 1);
    const values = Object.values(counts).sort((a, b) => b - a);
    const sum = dice.reduce((a, b) => a + b, 0);
    
    let baseCombos = {
      'Jedynki': { dmg: counts[1] ? counts[1] * 2 : 0, mana: 0 },
      'Dwójki': { dmg: counts[2] ? counts[2] * 3 : 0, mana: 0 },
      'Trójki': { dmg: counts[3] ? counts[3] * 4 : 0, mana: 0 },
      'Czwórki': { dmg: counts[4] ? counts[4] * 5 : 0, mana: 0 },
      'Piątki': { dmg: counts[5] ? counts[5] * 6 : 0, mana: 0 },
      'Szóstki': { dmg: counts[6] ? counts[6] * 7 : 0, mana: 0 },
      'Trzy jednakowe': { dmg: values[0] >= 3 ? sum + 5 : 0, mana: 0 },
      'Cztery jednakowe': { dmg: values[0] >= 4 ? sum + 15 : 0, mana: 5 },
      'Full': { dmg: values[0] === 3 && values[1] === 2 ? 30 : 0, mana: 5 },
      'Mały strit': { dmg: isDiceSequence([1,2,3,4]) || isDiceSequence([2,3,4,5]) || isDiceSequence([3,4,5,6]) ? 35 : 0, mana: 8 },
      'Duży strit': { dmg: isDiceSequence([1,2,3,4,5]) || isDiceSequence([2,3,4,5,6]) ? 45 : 0, mana: 10 },
      'Yahtzee': { dmg: values[0] === 5 ? 60 : 0, mana: 15 },
      'Szansa': { dmg: sum, mana: 0 }
    };

    // Artifact bonuses
    artifacts.forEach(artifact => {
      if (artifact.effect === 'dmg') {
        Object.keys(baseCombos).forEach(key => {
          baseCombos[key].dmg = Math.floor(baseCombos[key].dmg * artifact.value);
        });
      }
    });

    return baseCombos;
  };

  const isDiceSequence = (seq) => {
    return seq.every(n => dice.includes(n));
  };

  const attack = (comboName, comboData) => {
    if (rollsLeft === 3 || combatPhase !== 'rolling') return;
    if (comboData.dmg === 0) return;
    if (comboData.mana > mana) {
      setMessage('❌ Za mało many!');
      return;
    }
    
    setCombatPhase('attacking');
    setMana(mana - comboData.mana);
    
    let finalDmg = comboData.dmg;
    
    // Critical hit chance
    let critChance = 0.15;
    artifacts.forEach(artifact => {
      if (artifact.effect === 'crit') critChance += artifact.value;
    });
    
    const isCrit = Math.random() < critChance;
    if (isCrit) {
      finalDmg = Math.floor(finalDmg * 2);
      setCriticalHit(true);
      setTimeout(() => setCriticalHit(false), 1000);
    }
    
    // Burning damage
    if (statusEffects.burning > 0) {
      finalDmg += statusEffects.burning;
      setStatusEffects({...statusEffects, burning: Math.max(0, statusEffects.burning - 2)});
    }
    
    // Blessed bonus - 2.5x
    if (statusEffects.blessed > 0) {
      finalDmg = Math.floor(finalDmg * 2.5);
      setStatusEffects({...statusEffects, blessed: statusEffects.blessed - 1});
    }
    
    const newEnemyHp = Math.max(0, enemy.currentHp - finalDmg);
    setEnemy({...enemy, currentHp: newEnemyHp});
    setComboHistory([...comboHistory.slice(-2), {name: comboName, dmg: finalDmg, crit: isCrit}]);
    
    setTimeout(() => {
      if (newEnemyHp <= 0) {
        const lootGold = enemy.reward + Math.floor(Math.random() * 25);
        setGold(gold + lootGold);
        setXp(xp + enemy.xp);
        
        // Lifesteal artifacts
        artifacts.forEach(artifact => {
          if (artifact.effect === 'hp') {
            setHp(Math.min(maxHp, hp + 5));
          }
        });
        
        // Check if elite enemy - increment elite kills
        if (enemy.isElite) {
          setEliteKills(eliteKills + 1);
        }
        
        setMessage(`⚡ Pokonano ${enemy.name}! +${lootGold} 💰, +${enemy.xp} XP!`);
        
        // Endless scaling - no victory condition
          setTimeout(() => {
            setFloor(floor + 1);
            setMana(Math.min(maxMana, mana + 10));
          }, 2000);
      } else {
        enemyAttack();
      }
    }, 800);
  };

  const enemyAttack = () => {
    setCombatPhase('enemy');
    
    setTimeout(() => {
      let dmg = enemy.dmg;
      
      // Enemy special abilities
      if (enemy.special === 'rage' && enemy.currentHp < enemy.hp * 0.5) {
        dmg = Math.floor(dmg * 1.5);
        setMessage(`🔥 ${enemy.name} wścieka się! Podwójne obrażenia!`);
      } else if (enemy.special === 'regen') {
        const heal = Math.min(5, enemy.hp - enemy.currentHp);
        setEnemy({...enemy, currentHp: enemy.currentHp + heal});
        setMessage(`💚 ${enemy.name} regeneruje ${heal} HP!`);
      } else if (enemy.special === 'burn') {
        setStatusEffects({...statusEffects, burning: 5});
        setMessage(`🔥 ${enemy.name} podpala cię! Płoniesz!`);
      } else if (enemy.special === 'freeze' && Math.random() < 0.3) {
        setStatusEffects({...statusEffects, frozen: true});
        setMessage(`❄️ ${enemy.name} zamraża cię! Tracisz turę!`);
        setTimeout(() => {
          setStatusEffects({...statusEffects, frozen: false});
          setRollsLeft(3);
          setHeld([false, false, false, false, false]);
          setCombatPhase('rolling');
          setMana(Math.min(maxMana, mana + 5));
          setMessage('❄️ Rozmrożono! Możesz działać!');
        }, 1200);
        return;
      }
      
      // Shield blocking
      if (shield > 0) {
        const blocked = Math.min(shield, dmg);
        setShield(shield - blocked);
        dmg -= blocked;
      }
      
      // Reflection artifact
      let reflected = 0;
      artifacts.forEach(artifact => {
        if (artifact.effect === 'reflect') {
          reflected = Math.floor(dmg * artifact.value);
        }
      });
      
      if (reflected > 0) {
        setEnemy({...enemy, currentHp: Math.max(0, enemy.currentHp - reflected)});
        setMessage(`🛡️ Odbito ${reflected} obrażeń!`);
      }
      
      if (dmg > 0) {
        const newHp = Math.max(0, hp - dmg);
        setHp(newHp);
        
        if (newHp <= 0) {
          setGameOver(true);
          setMessage(`💀 ${enemy.name} cię pokonał... Poziom: ${level}, Piętro: ${floor}`);
          return;
        }
      }
      
      setTimeout(() => {
        setRollsLeft(3);
        setHeld([false, false, false, false, false]);
        setCombatPhase('rolling');
        setMana(Math.min(maxMana, mana + 5));
        setMessage('⚔️ Twoja tura!');
      }, 1200);
    }, 800);
  };

  const usePotion = () => {
    if (gold >= 25 && hp < maxHp) {
      setGold(gold - 25);
      const heal = Math.min(30, maxHp - hp);
      setHp(hp + heal);
      setMessage(`💖 Wypito eliksir! +${heal} HP`);
    }
  };

  const buyShield = () => {
    if (gold >= 20) {
      setGold(gold - 20);
      setShield(shield + 15);
      setMessage('🛡️ Kupiono tarczę! +15 obrony');
    }
  };

  const buyManaPotion = () => {
    if (gold >= 15) {
      setGold(gold - 15);
      setMana(Math.min(maxMana, mana + 20));
      setMessage('💙 Wypito eliksir many! +20 many');
    }
  };

  // Generate random dice for shop
  const generateShopDice = () => {
    setShopDice(Math.floor(Math.random() * 6) + 1);
  };

  // Buy dice from shop
  const buyDice = () => {
    const cost = 10 + (shopDice * 2); // Koszt: 10 + (wartość kostki * 2)
    if (gold >= cost) {
      setGold(gold - cost);
      const newCollected = [...collectedDice];
      newCollected[shopDice - 1] += 1; // shopDice 1-6, indeks 0-5
      setCollectedDice(newCollected);
      
      // Generate new random dice
      setShopDice(Math.floor(Math.random() * 6) + 1);
    }
  };

  const buyBlessing = () => {
    if (gold >= 40) {
      setGold(gold - 40);
      setStatusEffects({...statusEffects, blessed: 3});
      setMessage('✨ Błogosławieństwo! x2.5 DMG przez 3 tury!');
    }
  };

  // Dice Enhancement System
  const enhanceDice = (diceIndex) => {
    const currentLevel = diceEnhancements[diceIndex];
    const nextLevel = Math.ceil((currentLevel + 1) / 25) * 25; // 25, 50, 75, 100, 125, 150...
    const cost = nextLevel * 2; // Very cheap: 50, 100, 150, 200, 250, 300...
    
    if (gold >= cost) {
      setGold(gold - cost);
      const newEnhancements = [...diceEnhancements];
      newEnhancements[diceIndex] = nextLevel;
      setDiceEnhancements(newEnhancements);
      setMessage(`🎲 Kostka ${diceIndex + 1} wzmocniona do poziomu ${nextLevel}!`);
    }
  };

  // Evolution System
  const evolveDice = () => {
    const evolutionCosts = [100, 250, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000];
    const cost = evolutionCosts[evolutionTier];
    
    if (gold >= cost && evolutionTier < 10) {
      setGold(gold - cost);
      setEvolutionTier(evolutionTier + 1);
      
      // Random bonus selection
      const bonusTypes = ['critical', 'resistance', 'regeneration', 'luck', 'power', 'defense'];
      const randomBonus = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];
      
      setEvolutionBonuses(prev => ({
        ...prev,
        [randomBonus]: prev[randomBonus] + 1
      }));
      
      const tierNames = ['Kamień', 'Miedź', 'Srebro', 'Złoto', 'Platyna', 'Diament', 'Rubin', 'Szmaragd', 'Szafir', 'Obsydian', 'Void'];
      setMessage(`✨ Ewolucja do ${tierNames[evolutionTier + 1]}! Bonus: ${randomBonus}!`);
    }
  };

  // Enchantment Skills System
  const upgradeSkill = (skillName) => {
    const skillCosts = {
      extraRoll: 50, reroll: 30, multiplier: 40, bonusDmg: 25, bonusExp: 35, bonusGold: 35,
      shield: 30, regeneration: 40, critical: 45, lifesteal: 50, freeze: 35, burn: 30,
      blessing: 40, curse: 35, teleport: 60, vision: 20, speed: 50, endurance: 45
    };
    
    const cost = skillCosts[skillName] * (enchantmentSkills[skillName] + 1);
    
    if (gold >= cost) {
      setGold(gold - cost);
      setEnchantmentSkills(prev => ({
        ...prev,
        [skillName]: prev[skillName] + 1
      }));
      setMessage(`✨ Umiejętność ${skillName} ulepszona do poziomu ${enchantmentSkills[skillName] + 1}!`);
    }
  };

  const useSkill = (skillName) => {
    const manaCosts = {
      extraRoll: 5, reroll: 3, multiplier: 8, bonusDmg: 0, bonusExp: 0, bonusGold: 0,
      shield: 6, regeneration: 7, critical: 0, lifesteal: 0, freeze: 4, burn: 3,
      blessing: 5, curse: 4, teleport: 10, vision: 2, speed: 8, endurance: 6
    };
    
    const manaCost = manaCosts[skillName];
    
    if (mana >= manaCost) {
      setMana(mana - manaCost);
      
      switch(skillName) {
        case 'extraRoll':
          setActiveEffects(prev => ({...prev, extraRolls: prev.extraRolls + 1}));
          setRollsLeft(rollsLeft + 1);
          setMessage('🎲 Dodatkowy rzut!');
          break;
        case 'reroll':
          setMessage('🎲 Możesz ponownie rzucić jedną kostkę!');
          break;
        case 'multiplier':
          setActiveEffects(prev => ({...prev, multiplier: 3}));
          setMessage('⚡ Mnożnik damage x2 przez 3 tury!');
          break;
        case 'shield':
          setActiveEffects(prev => ({...prev, shield: 5}));
          setShield(shield + 10);
          setMessage('🛡️ Tarcza +10 na 5 tur!');
          break;
        case 'regeneration':
          setActiveEffects(prev => ({...prev, regeneration: 5}));
          setMessage('💚 Regeneracja +5 HP/turę przez 5 tur!');
          break;
        case 'freeze':
          setActiveEffects(prev => ({...prev, freeze: 1}));
          setMessage('❄️ Potwór zamrożony na 1 turę!');
          break;
        case 'burn':
          setActiveEffects(prev => ({...prev, burn: 3}));
          setMessage('🔥 Potwór podpalony na 3 tury!');
          break;
        case 'blessing':
          setActiveEffects(prev => ({...prev, blessing: 3}));
          setMessage('✨ Błogosławieństwo +1 do wszystkich kostek!');
          break;
        case 'curse':
          setActiveEffects(prev => ({...prev, curse: 3}));
          setMessage('💀 Przekleństwo -2 damage potwora!');
          break;
        case 'teleport':
          setMessage('🌀 Teleportacja! Uciekasz z walki!');
          setTimeout(() => spawnEnemy(), 1000);
          break;
        case 'vision':
          setMessage('👁️ Widzenie! HP potwora: ' + enemy.currentHp + '/' + enemy.hp);
          break;
        case 'speed':
          setActiveEffects(prev => ({...prev, speed: 3}));
          setMessage('⚡ Szybkość x2 przez 3 tury!');
          break;
        case 'endurance':
          setActiveEffects(prev => ({...prev, endurance: 3}));
          setMessage('💪 Wytrzymałość -50% damage przez 3 tury!');
          break;
      }
    }
  };

  const saveHighScore = () => {
    const score = {
      name: playerName || 'ANON',
      level,
      floor,
      gold,
      artifacts: artifacts.length,
      date: new Date().toLocaleDateString('pl-PL'),
      time: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
    };

    const highScores = JSON.parse(localStorage.getItem('dungeon-yahtzee-scores') || '[]');
    highScores.push(score);
    highScores.sort((a, b) => {
      if (b.floor !== a.floor) return b.floor - a.floor;
      if (b.level !== a.level) return b.level - a.level;
      return b.gold - a.gold;
    });
    const top10 = highScores.slice(0, 10);
    localStorage.setItem('dungeon-yahtzee-scores', JSON.stringify(top10));
  };

  const saveGame = () => {
    const gameState = {
      dice, held, rollsLeft, hp, maxHp, shield, mana, maxMana, floor, gold, xp, level,
      artifacts, statusEffects, eliteKills, diceBuild, collectedDice, shopDice, diceEnhancements, evolutionTier, evolutionBonuses, enchantmentSkills, activeEffects,
      playerName: playerName || 'ANON'
    };
    localStorage.setItem('dungeon-yahtzee-save', JSON.stringify(gameState));
    setMessage('Gra zapisana!');
    setTimeout(() => setMessage(''), 2000);
  };


  const resetGame = () => {
    // Save high score if game ended
    if (gameOver || victory) {
      saveHighScore();
    }
    
    setHp(60);
    setMaxHp(60);
    setMana(30);
    setMaxMana(30);
    setShield(0);
    setFloor(1);
    setGold(0);
    setXp(0);
    setLevel(1);
    setGameOver(false);
    setVictory(false);
    setRollsLeft(3);
    setHeld([false, false, false, false, false]);
    setComboHistory([]);
    setArtifacts([]);
    setStatusEffects({burning: 0, frozen: false, blessed: 0});
    setBossFloor(false);
    setCriticalHit(false);
    setEnemy(null);
    setCombatPhase('rolling');
    setIsRolling(false);
    setDice([1, 2, 3, 4, 5]);
    setEliteKills(0);
    setShowArtifacts(false);
    setShowForge(false);
    setActiveForgeTab('enhancement');
    setDiceBuild({
      level: 0,
      enhancement: 0,
      enchantment: 0,
      evolution: 0
    });
    setCollectedDice([0, 0, 0, 0, 0, 0]);
    setShopDice(0);
    setDiceEnhancements([0, 0, 0, 0, 0, 0]);
    setEvolutionTier(0);
    setEvolutionBonuses({ critical: 0, resistance: 0, regeneration: 0, luck: 0, power: 0, defense: 0 });
    setEnchantmentSkills({ extraRoll: 0, reroll: 0, multiplier: 0, bonusDmg: 0, bonusExp: 0, bonusGold: 0, shield: 0, regeneration: 0, critical: 0, lifesteal: 0, freeze: 0, burn: 0, blessing: 0, curse: 0, teleport: 0, vision: 0, speed: 0, endurance: 0 });
    setActiveEffects({ extraRolls: 0, multiplier: 0, shield: 0, regeneration: 0, freeze: 0, burn: 0, blessing: 0, curse: 0, speed: 0, endurance: 0 });
    setSpecialCombo('');
    localStorage.removeItem('dungeon-yahtzee-save');
    setTimeout(() => spawnEnemy(), 100);
  };

  const combos = calculateCombos();

  // Loading Screen
  if (loading) {
    const highScores = JSON.parse(localStorage.getItem('dungeon-yahtzee-scores') || '[]').slice(0, 3);

  return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center overflow-hidden relative">
        {/* Cyberpunk grid background */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'linear-gradient(rgba(0,255,150,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,150,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
        
        {/* Animated neon particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-30 animate-pulse"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                backgroundColor: ['#00ff96', '#ff00ff', '#00ffff'][Math.floor(Math.random() * 3)],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                boxShadow: `0 0 20px currentColor`
              }}
            />
          ))}
        </div>

        <div className="text-center z-10 px-4 max-w-4xl w-full">
          {/* Animated dice with toxic glow */}
          <div className="flex justify-center gap-6 mb-8 animate-bounce">
            <div className="text-6xl md:text-8xl animate-spin drop-shadow-[0_0_25px_rgba(0,255,150,0.8)]" style={{ animationDuration: '3s' }}>🎲</div>
            <div className="text-6xl md:text-8xl animate-spin drop-shadow-[0_0_25px_rgba(255,0,255,0.8)]" style={{ animationDuration: '2.5s', animationDirection: 'reverse' }}>🎲</div>
          </div>

          {/* Cyberpunk title with toxic glow */}
          <h1 className="text-5xl md:text-7xl font-bold mb-2 relative">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-pink-500 drop-shadow-2xl animate-pulse">
              KOŚCI CHAOSU
            </span>
            <div className="absolute inset-0 blur-xl opacity-50">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-pink-500">
                KOŚCI CHAOSU
              </span>
            </div>
        </h1>
          
          <p className="text-lg md:text-xl mb-8 font-bold relative">
            <span className="text-green-400 drop-shadow-[0_0_10px_rgba(0,255,150,0.8)]">⚡ CYBERPUNK</span>
            {' '}
            <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">DICE</span>
            {' '}
            <span className="text-pink-500 drop-shadow-[0_0_10px_rgba(255,0,255,0.8)]">ROGUE ⚡</span>
          </p>

          {/* High Scores Leaderboard */}
          {highScores.length > 0 && (
            <div className="mb-8 bg-black bg-opacity-60 border-2 border-green-500 rounded-lg py-4 px-16 shadow-[0_0_30px_rgba(0,255,150,0.3)]">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-green-400 drop-shadow-[0_0_10px_rgba(0,255,150,0.8)]">
                🏆 TOP RUNS 🏆
              </h2>
              <div className="space-y-2">
                {highScores.map((score, i) => (
                  <div key={i} className={`flex justify-between items-center p-2 rounded ${
                    i === 0 ? 'bg-green-900 bg-opacity-40 border border-green-500' : 'bg-gray-900 bg-opacity-40'
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className={`text-2xl font-bold ${
                        i === 0 ? 'text-green-400' : i === 1 ? 'text-cyan-400' : 'text-pink-400'
                      }`}>#{i + 1}</span>
                      <div className="text-left">
                        <div className="font-bold text-white">
                          {score.name || 'ANON'} • Lvl {score.level} • Piętro {score.floor}
                </div>
                        <div className="text-xs text-gray-400">{score.date} {score.time}</div>
              </div>
            </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold">{score.gold} 💰</div>
                      <div className="text-xs text-pink-400">{score.artifacts} 🎁</div>
                </div>
              </div>
                ))}
            </div>
              </div>
          )}

          {/* Loading counter with toxic effects */}
          <div className="mb-6">
            <div className="text-6xl md:text-8xl font-bold mb-4 tabular-nums relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 animate-pulse">
                {loadingProgress}%
              </span>
              <div className="absolute inset-0 blur-lg opacity-50">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
                  {loadingProgress}%
                </span>
            </div>
                </div>
            
            {/* Cyberpunk progress bar */}
            <div className="w-64 md:w-96 mx-auto bg-black rounded-full h-4 border-2 border-green-500 overflow-hidden shadow-[0_0_20px_rgba(0,255,150,0.5)]">
              <div 
                className="bg-gradient-to-r from-green-500 via-cyan-500 to-pink-500 h-full rounded-full transition-all duration-300 ease-out relative"
                style={{ width: `${loadingProgress}%` }}
              >
                <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-pulse" />
                <div className="absolute inset-0 shadow-[0_0_20px_rgba(0,255,150,0.8)]" />
              </div>
            </div>
              </div>

          {/* Loading text with glitch effect */}
          <p className="text-sm font-bold tracking-wider animate-pulse">
            <span className={`${
              loadingProgress < 30 ? 'text-green-400' :
              loadingProgress < 60 ? 'text-cyan-400' :
              loadingProgress < 90 ? 'text-pink-400' : 'text-green-400'
            } drop-shadow-[0_0_10px_currentColor]`}>
              {loadingProgress < 30 && '>>> INICJALIZACJA SYSTEMU...'}
              {loadingProgress >= 30 && loadingProgress < 60 && '>>> ŁADOWANIE PRZECIWNIKÓW...'}
              {loadingProgress >= 60 && loadingProgress < 90 && '>>> SYNCHRONIZACJA DANYCH...'}
              {loadingProgress >= 90 && '>>> SYSTEM GOTOWY <<<'}
            </span>
          </p>
            </div>
          </div>
    );
  }

  if (!enemy) return null;

  return (
    <div className="min-h-screen bg-black text-white p-2 md:p-4 relative overflow-hidden">
      {/* Cyberpunk grid background */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(0,255,150,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,150,0.2) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Collapsible Stats Menu - Cyberpunk Style */}
        <div className="bg-black rounded-lg border-2 border-green-500 shadow-[0_0_30px_rgba(0,255,150,0.3)] mb-3">
          {/* Main Stats Bar - Always Visible */}
          <div className="py-4 px-16">
            <div className="grid grid-cols-4 gap-4 items-center">
              {/* HP */}
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500 flex-shrink-0 drop-shadow-[0_0_10px_rgba(255,0,255,0.8)]" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-pink-400 font-bold">{hp}/{maxHp}</div>
                  <div className="w-full bg-gray-900 rounded-full h-1.5 border border-pink-500">
                    <div className="bg-gradient-to-r from-pink-500 to-pink-400 h-full rounded-full transition-all shadow-[0_0_10px_rgba(255,0,255,0.5)]" style={{width: `${(hp/maxHp)*100}%`}}></div>
                  </div>
                </div>
              </div>
              
              {/* Mana */}
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400 flex-shrink-0 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-cyan-400 font-bold">{mana}/{maxMana}</div>
                  <div className="w-full bg-gray-900 rounded-full h-1.5 border border-cyan-500">
                    <div className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-full rounded-full transition-all shadow-[0_0_10px_rgba(0,255,255,0.5)]" style={{width: `${(mana/maxMana)*100}%`}}></div>
                  </div>
                </div>
              </div>
              
              {/* Level & Floor */}
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-green-400 flex-shrink-0 drop-shadow-[0_0_10px_rgba(0,255,150,0.8)]" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-green-400 font-bold">Lvl {level} • Piętro {floor}</div>
                  <div className="w-full bg-gray-900 rounded-full h-1.5 border border-green-500">
                    <div className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full transition-all shadow-[0_0_10px_rgba(0,255,150,0.5)]" style={{width: `${(xp % (level*50 + Math.floor(level*level*0.5)))/(level*50 + Math.floor(level*level*0.5))*100}%`}}></div>
                  </div>
                </div>
              </div>
              
              {/* XP, Gold & Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 flex items-center justify-center text-yellow-400 flex-shrink-0 drop-shadow-[0_0_8px_rgba(255,255,0,0.8)]">
                    ⚡
                  </div>
                  <div className="text-xs text-yellow-300 font-bold">{xp}</div>
                  <Sparkles className="w-5 h-5 text-green-400 flex-shrink-0 drop-shadow-[0_0_10px_rgba(0,255,150,0.8)]" />
                  <div className="text-xs text-green-300 font-bold">{gold} 💰</div>
                </div>
                <button
                  onClick={() => setShowStats(!showStats)}
                  className="text-xs bg-cyan-900 border border-cyan-500 text-cyan-400 hover:bg-cyan-800 px-2 py-1 rounded transition-all shadow-[0_0_5px_rgba(0,255,255,0.3)] hover:shadow-[0_0_10px_rgba(0,255,255,0.6)]"
                >
                  {showStats ? 'ZWIŃ' : 'ROZWIŃ'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Expanded Stats - Collapsible */}
          {showStats && (
            <div className="border-t border-green-500 py-4 px-16 bg-gray-900 bg-opacity-50">
              {/* Detailed Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {/* Shield */}
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]" />
                  <div className="text-xs text-cyan-300 font-bold">{shield}</div>
                </div>
                
                {/* Elite Kills */}
                <div className="flex items-center gap-2">
                  <Skull className="w-5 h-5 text-pink-400 flex-shrink-0 drop-shadow-[0_0_10px_rgba(255,0,255,0.8)]" />
                  <div className="text-xs text-pink-300 font-bold">{eliteKills} Elite</div>
                </div>
                
                {/* Rolls Left */}
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 flex items-center justify-center text-purple-400 flex-shrink-0 drop-shadow-[0_0_8px_rgba(147,51,234,0.8)]">
                    🎲
                  </div>
                  <div className="text-xs text-purple-300 font-bold">{rollsLeft}/3 Rzuty</div>
                </div>
              </div>
              
              {/* Status Effects */}
              <div className="flex gap-2 flex-wrap items-center mb-4">
                {statusEffects.burning > 0 && (
                  <div className="bg-pink-900 border border-pink-500 px-2 py-0.5 rounded-full text-xs flex items-center gap-1 shadow-[0_0_10px_rgba(255,0,255,0.5)]">
                    <Flame className="w-3 h-3 text-pink-400" /> <span className="text-pink-300">{statusEffects.burning} DMG</span>
                  </div>
                )}
                {statusEffects.frozen && (
                  <div className="bg-cyan-900 border border-cyan-500 px-2 py-0.5 rounded-full text-xs flex items-center gap-1 shadow-[0_0_10px_rgba(0,255,255,0.5)]">
                    <Droplet className="w-3 h-3 text-cyan-400" /> <span className="text-cyan-300">Frozen</span>
                  </div>
                )}
                {statusEffects.blessed > 0 && (
                  <div className="bg-green-900 border border-green-500 px-2 py-0.5 rounded-full text-xs flex items-center gap-1 shadow-[0_0_10px_rgba(0,255,150,0.5)]">
                    <Sparkles className="w-3 h-3 text-green-400" /> <span className="text-green-300">x2.5 ({statusEffects.blessed})</span>
                  </div>
                )}
              </div>
              
              {/* Artifacts & Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Artifacts */}
                <div>
                  <div className="text-xs text-pink-400 font-bold mb-2 flex items-center gap-1">
                    <Skull className="w-4 h-4" />
                    ARTEFAKTY ({artifactsList.filter(art => art.unlocked).length})
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {artifactsList.filter(art => art.unlocked).map((artifact, i) => (
                      <span key={i} title={artifact.name} className="text-lg">{artifact.icon}</span>
                    ))}
                    {artifactsList.filter(art => art.unlocked).length === 0 && (
                      <span className="text-gray-500 text-xs">Brak artefaktów</span>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={saveGame}
                    className="text-xs bg-yellow-900 border border-yellow-500 text-yellow-400 hover:bg-yellow-800 px-2 py-1 rounded transition-all shadow-[0_0_5px_rgba(255,255,0,0.3)] hover:shadow-[0_0_10px_rgba(255,255,0,0.6)]"
                  >
                    💾 ZAPISZ
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>


        {/* Special Combo Notifications - BIGGER */}
        {specialCombo === 'yahtzee' && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none bg-black bg-opacity-30">
            <div className="text-center animate-bounce" style={{transform: 'scale(0.8)'}}>
              <div className="text-7xl md:text-9xl mb-6 drop-shadow-[0_0_60px_rgba(255,0,255,1)] animate-spin" style={{animationDuration: '2s'}}>🎲</div>
              <div className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 animate-pulse drop-shadow-[0_0_50px_rgba(255,0,255,1)] mb-4">
                YAHTZEE!!!
                </div>
              <div className="text-4xl md:text-5xl text-green-400 mt-4 drop-shadow-[0_0_30px_rgba(0,255,150,1)] font-bold">
                ⚡ ULTIMATE COMBO! ⚡
              </div>
            </div>
          </div>
        )}

        {specialCombo === 'straight' && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none bg-black bg-opacity-30">
            <div className="text-center animate-bounce" style={{transform: 'scale(0.8)'}}>
              <div className="text-7xl md:text-9xl mb-6 drop-shadow-[0_0_60px_rgba(0,255,255,1)] animate-pulse">🎯</div>
              <div className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-green-400 to-pink-400 animate-pulse drop-shadow-[0_0_50px_rgba(0,255,255,1)] mb-4">
                DUŻY STRIT!
              </div>
              <div className="text-4xl md:text-5xl text-cyan-400 mt-4 drop-shadow-[0_0_30px_rgba(0,255,255,1)] font-bold">
                ⚡ PERFECT SEQUENCE! ⚡
              </div>
            </div>
          </div>
        )}


        {/* Combined Enemy Info & Combat History - Cyberpunk */}
        {!gameOver && !victory && (
          <div className="my-3" style={{marginTop: '13px', marginBottom: '13px'}}>
            {/* Enemy Info Section */}
            <div className={`rounded-lg py-7 px-16 border-2 transition-all ${
              enemy.isElite
                ? 'bg-black border-green-500 shadow-[0_0_50px_rgba(0,255,150,0.8)]'
                : bossFloor 
                ? 'bg-black border-pink-500 shadow-[0_0_40px_rgba(255,0,255,0.6)]' 
                : 'bg-black border-cyan-500 shadow-[0_0_30px_rgba(0,255,255,0.4)]'
            }`} style={{minWidth: '400px', maxWidth: '650px', margin: '0 auto'}}>
            
            {/* Enemy Info Section */}
            <div className="text-center mb-4">
              <div className={`text-6xl mb-4 ${bossFloor ? 'drop-shadow-[0_0_20px_rgba(255,0,255,0.8)]' : 'drop-shadow-[0_0_15px_rgba(0,255,255,0.6)]'}`}>{enemy.icon}</div>
              <div className={`text-3xl font-bold mb-4 ${
                enemy.isElite ? 'text-green-400 drop-shadow-[0_0_10px_rgba(0,255,150,0.8)]' :
                bossFloor ? 'text-pink-400 drop-shadow-[0_0_10px_rgba(255,0,255,0.8)]' : 
                'text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]'
              }`}>
                {enemy.isElite && '💎 ELITE: '}
                {bossFloor && '⚡ '}
                {enemy.name}
                {bossFloor && ' ⚡'}
                {enemy.isElite && ' 💎'}
              </div>
              
              {/* Enemy Stats Row */}
              <div className="flex items-center justify-center gap-6 mb-4">
                <div className="flex items-center gap-3">
                  <Heart className="w-6 h-6 text-pink-500 drop-shadow-[0_0_10px_rgba(255,0,255,0.8)]" />
                  <div className="text-xl font-bold text-pink-400">{enemy.currentHp}/{enemy.hp}</div>
                  <div className="w-32 bg-gray-900 rounded-full h-3 border border-pink-500">
                    <div className="bg-gradient-to-r from-pink-500 to-pink-400 h-full rounded-full transition-all shadow-[0_0_15px_rgba(255,0,255,0.6)]" style={{width: `${(enemy.currentHp/enemy.hp)*100}%`}}></div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Sword className="w-5 h-5 text-cyan-400" />
                  <span className="font-semibold text-base text-cyan-300">{enemy.dmg} DMG</span>
                </div>
                
                {enemy.special && (
                  <div className="bg-black border border-green-500 px-3 py-2 rounded-full text-sm text-green-400 shadow-[0_0_10px_rgba(0,255,150,0.5)]">
                    ⚡ {enemy.special.toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Combat History Section */}
            {comboHistory.length > 0 && (
              <div className="border-t border-gray-600 pt-5">
                <div className="text-lg font-bold text-cyan-400 mb-4 text-center drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">
                  OSTATNIE ATAKI
                </div>
                <div className="flex gap-2 flex-wrap justify-center">
                  {comboHistory.map((combo, i) => (
                    <div key={i} className={`px-3 py-2 rounded text-sm border ${combo.crit ? 'bg-pink-900 border-pink-500 text-pink-300' : 'bg-gray-900 border-cyan-500 text-cyan-300'}`}>
                      {combo.crit && '⚡'} {combo.name}: {combo.dmg}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Message Section */}
            {message && (
              <div className="border-t border-gray-600 pt-5">
                <div className={`rounded-lg py-4 px-6 text-center font-semibold text-base border-2 transition-all ${
                  criticalHit 
                    ? 'bg-pink-900 border-pink-400 shadow-[0_0_20px_rgba(255,0,255,0.6)] animate-pulse text-pink-200' 
                    : 'bg-gray-800 border-green-500 shadow-[0_0_15px_rgba(0,255,150,0.3)] text-green-300'
                }`}>
                  {criticalHit && '⚡ CRITICAL HIT! ⚡ '}
                  {message}
                </div>
              </div>
            )}
            </div>
          </div>
        )}

        {/* Roll Dice Section - Below Monster Info */}
        {!gameOver && !victory && (
          <div className="bg-black rounded-lg py-5 px-10 border-2 border-cyan-500 shadow-[0_0_30px_rgba(0,255,255,0.4)] my-4" style={{minWidth: '300px', maxWidth: '500px', margin: '0 auto'}}>
            {/* Dice */}
            <div className="flex justify-center gap-3 mb-6">
              {dice.map((d, i) => (
                <button
                  key={i}
                  onClick={() => toggleHold(i)}
                  disabled={rollsLeft === 3 || combatPhase !== 'rolling' || isRolling}
                  className={`w-20 h-20 text-4xl font-bold rounded-xl transition-all border-2 ${
                    held[i]
                      ? 'bg-black border-green-500 text-green-400 transform scale-110 rotate-6 shadow-[0_0_30px_rgba(0,255,150,0.8)]'
                      : 'bg-black border-cyan-500 text-cyan-300 hover:scale-105 shadow-[0_0_25px_rgba(0,255,255,0.5)]'
                  } ${rollsLeft === 3 || combatPhase !== 'rolling' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-[0_0_30px_rgba(0,255,255,0.8)]'} ${
                    isRolling && !held[i] ? 'animate-dice-roll' : ''
                  }`}
                  style={isRolling && !held[i] ? {
                    animation: `dice-roll 0.1s infinite, dice-shake 1s ease-in-out, dice-glow 1s ease-in-out`,
                    animationDelay: `${i * 0.08}s`
                  } : {}}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Roll Button */}
            <div className="text-center">
              <button
                onClick={rollDice}
                disabled={rollsLeft <= 0 || combatPhase !== 'rolling' || isRolling}
                className={`px-7 py-3 rounded-xl font-bold text-base transition-all border-2 ${
                  rollsLeft <= 0 || combatPhase !== 'rolling' || isRolling
                    ? 'bg-gray-900 border-gray-600 text-gray-500 cursor-not-allowed'
                    : 'bg-black border-pink-500 text-pink-400 hover:bg-pink-900 transform hover:scale-105 shadow-[0_0_30px_rgba(255,0,255,0.5)] hover:shadow-[0_0_40px_rgba(255,0,255,0.8)]'
                }`}
              >
                {isRolling ? '>>> ROLLING...' : `>>> ROLL DICE (${rollsLeft}/3) >`}
              </button>
            </div>
          </div>
        )}

        {/* Game Over / Victory - Cyberpunk */}
        {(gameOver || victory) && (
          <div className={`bg-black rounded-lg py-4 px-16 mb-4 text-center border-2 ${
            victory ? 'border-green-500 shadow-[0_0_50px_rgba(0,255,150,0.6)]' : 'border-pink-500 shadow-[0_0_50px_rgba(255,0,255,0.6)]'
          }`}>
            <div className={`text-8xl mb-4 ${victory ? 'drop-shadow-[0_0_30px_rgba(0,255,150,0.8)]' : 'drop-shadow-[0_0_30px_rgba(255,0,255,0.8)]'}`}>
              {victory ? '👑' : '💀'}
            </div>
            <div className={`text-4xl font-bold mb-4 drop-shadow-[0_0_20px_currentColor] ${
              victory ? 'text-green-400' : 'text-pink-400'
            }`}>
              {victory ? '>>> VICTORY ACHIEVED <<<' : '>>> SYSTEM FAILURE <<<'}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6 text-lg">
              <div className="bg-gray-900 border border-green-500 p-3 rounded shadow-[0_0_15px_rgba(0,255,150,0.3)]">
                <div className="text-gray-400 text-sm">LEVEL</div>
                <div className="text-2xl font-bold text-green-400">{level}</div>
              </div>
              <div className="bg-gray-900 border border-cyan-500 p-3 rounded shadow-[0_0_15px_rgba(0,255,255,0.3)]">
                <div className="text-gray-400 text-sm">FLOOR</div>
                <div className="text-2xl font-bold text-cyan-400">{floor}</div>
              </div>
              <div className="bg-gray-900 border border-green-500 p-3 rounded shadow-[0_0_15px_rgba(0,255,150,0.3)]">
                <div className="text-gray-400 text-sm">GOLD</div>
                <div className="text-2xl font-bold text-green-300">{gold} 💰</div>
              </div>
              <div className="bg-gray-900 border border-pink-500 p-3 rounded shadow-[0_0_15px_rgba(255,0,255,0.3)]">
                <div className="text-gray-400 text-sm">ARTIFACTS</div>
                <div className="text-2xl font-bold text-pink-400 flex gap-2 flex-wrap">
                  {artifactsList.filter(art => art.unlocked).map((artifact, i) => (
                    <span key={i} title={artifact.name}>{artifact.icon}</span>
                  ))}
                  {artifactsList.filter(art => art.unlocked).length === 0 && (
                    <span className="text-gray-500">Brak</span>
                  )}
              </div>
            </div>
            </div>
            
            {/* Player Name Input */}
            {!showNameInput && (
              <div className="mb-4">
                <button
                  onClick={() => setShowNameInput(true)}
                  className="bg-black border-2 border-cyan-500 hover:bg-cyan-900 px-6 py-3 rounded-lg font-bold text-lg text-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.5)] hover:shadow-[0_0_30px_rgba(0,255,255,0.8)] transition-all"
                >
                  {'>>> WPROWADŹ NAZWĘ (3 LITERY) <<<'}
                </button>
              </div>
            )}
            
            {showNameInput && (
              <div className="mb-4">
                <div className="text-cyan-400 font-bold mb-2">WPROWADŹ SWOJĄ NAZWĘ:</div>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value.toUpperCase().slice(0, 3))}
                  className="bg-black border-2 border-cyan-500 text-cyan-400 text-center text-2xl font-bold px-4 py-2 rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.5)] focus:shadow-[0_0_30px_rgba(0,255,255,0.8)] transition-all"
                  placeholder="ABC"
                  maxLength={3}
                />
                <div className="mt-2">
                  <button
                    onClick={() => {
                      setShowNameInput(false);
                      if (playerName.length > 0) {
                        saveHighScore();
                        setMessage('Wynik zapisany!');
                        setTimeout(() => setMessage(''), 2000);
                      }
                    }}
                    className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg font-bold text-black mr-2"
                  >
                    ZAPISZ
                  </button>
                  <button
                    onClick={() => setShowNameInput(false)}
                    className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg font-bold text-white"
                  >
                    ANULUJ
                  </button>
                </div>
              </div>
            )}
            
            <button
              onClick={resetGame}
              className="bg-black border-2 border-green-500 hover:bg-green-900 px-8 py-4 rounded-lg font-bold text-xl text-green-400 shadow-[0_0_30px_rgba(0,255,150,0.5)] hover:shadow-[0_0_40px_rgba(0,255,150,0.8)] transition-all"
            >
              {'>>> NEW RUN <<<'}
            </button>
          </div>
        )}

        {/* Enhanced Combos - Cyberpunk */}
        {!gameOver && !victory && rollsLeft < 3 && combatPhase === 'rolling' && (
              <div className="bg-black rounded-lg py-4 px-16 mb-3 border-2 border-pink-500 shadow-[0_0_30px_rgba(255,0,255,0.4)]">
                <div className="text-lg font-bold mb-2 text-center text-pink-400 drop-shadow-[0_0_10px_rgba(255,0,255,0.8)]">{'>>> SELECT ATTACK <<<'}</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(combos).filter(([name, data]) => data.dmg > 0).map(([name, data]) => {
                    const canUse = data.mana <= mana;
                    return (
                      <button
                        key={name}
                        onClick={() => attack(name, data)}
                        disabled={!canUse}
                        className={`p-2 rounded-lg font-semibold transition-all border-2 ${
                          !canUse
                            ? 'bg-gray-900 border-gray-600 text-gray-500 cursor-not-allowed opacity-50'
                            : data.dmg >= 40
                            ? 'bg-black border-pink-500 text-pink-400 hover:bg-pink-900 transform hover:scale-105 shadow-[0_0_20px_rgba(255,0,255,0.6)]'
                            : data.dmg >= 25
                            ? 'bg-black border-cyan-500 text-cyan-400 hover:bg-cyan-900 transform hover:scale-105 shadow-[0_0_15px_rgba(0,255,255,0.5)]'
                            : 'bg-black border-green-500 text-green-400 hover:bg-green-900 shadow-[0_0_10px_rgba(0,255,150,0.4)]'
                        }`}
                      >
                        <div className="text-xs opacity-80">{name}</div>
                        <div className="text-xl font-bold">⚡ {data.dmg}</div>
                        {data.mana > 0 && (
                          <div className="text-xs text-cyan-300">💎 {data.mana}</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
        )}

        {/* Main Menu Buttons */}
        <div className="bg-black rounded-lg py-4 px-16 mb-3 border-2 border-cyan-500 shadow-[0_0_30px_rgba(0,255,255,0.4)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => setShowArtifacts(!showArtifacts)}
              className={`text-lg font-bold text-purple-400 text-center drop-shadow-[0_0_10px_rgba(147,51,234,0.8)] transition-all border-2 border-purple-500 rounded-lg py-2 ${
                artifactsList.some(art => art.unlocked) ? 'animate-pulse' : ''
              }`}
            >
              {'>>> ARTEFAKTY <<<'}
            </button>
            <button
              onClick={() => setShowForge(!showForge)}
              className="text-lg font-bold text-cyan-400 text-center drop-shadow-[0_0_10px_rgba(0,255,255,0.8)] transition-all border-2 border-cyan-500 rounded-lg py-2"
            >
              {'>>> KUŹNIA CHAOSU <<<'}
            </button>
          </div>
          
          {/* Shop Section */}
          <div className="mb-4">
            <div className="text-lg font-bold mb-2 text-green-400 text-center drop-shadow-[0_0_10px_rgba(0,255,150,0.8)]">CYBER DICE WORLD</div>
            

            {/* Traditional Shop Items */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <button
                  onClick={usePotion}
                  disabled={gold < 25 || hp >= maxHp}
                    className={`p-2 rounded-lg font-semibold transition-all border-2 ${
                    gold < 25 || hp >= maxHp
                        ? 'bg-gray-900 border-gray-600 text-gray-500 cursor-not-allowed'
                        : 'bg-black border-pink-500 text-pink-400 hover:bg-pink-900 transform hover:scale-105 shadow-[0_0_15px_rgba(255,0,255,0.5)]'
                    }`}
                  >
                    <div className="text-2xl mb-1">💖</div>
                    <div className="text-sm">HP Boost</div>
                    <div className="text-xs text-green-300">25 💰</div>
                  <div className="text-xs opacity-80">+30 HP</div>
                </button>
                <button
                  onClick={buyManaPotion}
                  disabled={gold < 15 || mana >= maxMana}
                    className={`p-2 rounded-lg font-semibold transition-all border-2 ${
                    gold < 15 || mana >= maxMana
                        ? 'bg-gray-900 border-gray-600 text-gray-500 cursor-not-allowed'
                        : 'bg-black border-cyan-500 text-cyan-400 hover:bg-cyan-900 transform hover:scale-105 shadow-[0_0_15px_rgba(0,255,255,0.5)]'
                    }`}
                  >
                    <div className="text-2xl mb-1">💎</div>
                    <div className="text-sm">Mana Boost</div>
                    <div className="text-xs text-green-300">15 💰</div>
                    <div className="text-xs opacity-80">+20 Mana</div>
                </button>
                <button
                  onClick={buyShield}
                  disabled={gold < 20}
                    className={`p-2 rounded-lg font-semibold transition-all border-2 ${
                    gold < 20
                        ? 'bg-gray-900 border-gray-600 text-gray-500 cursor-not-allowed'
                        : 'bg-black border-cyan-500 text-cyan-400 hover:bg-cyan-900 transform hover:scale-105 shadow-[0_0_15px_rgba(0,255,255,0.5)]'
                    }`}
                  >
                    <div className="text-2xl mb-1">🛡️</div>
                    <div className="text-sm">Shield</div>
                    <div className="text-xs text-green-300">20 💰</div>
                    <div className="text-xs opacity-80">+15 Armor</div>
                </button>
                <button
                  onClick={buyBlessing}
                  disabled={gold < 40}
                    className={`p-2 rounded-lg font-semibold transition-all border-2 ${
                    gold < 40
                        ? 'bg-gray-900 border-gray-600 text-gray-500 cursor-not-allowed'
                        : 'bg-black border-green-500 text-green-400 hover:bg-green-900 transform hover:scale-105 shadow-[0_0_15px_rgba(0,255,150,0.5)]'
                    }`}
                  >
                    <div className="text-2xl mb-1">✨</div>
                    <div className="text-sm">Power Up</div>
                    <div className="text-xs text-green-300">40 💰</div>
                    <div className="text-xs opacity-80">x2.5 DMG x3</div>
                  </button>
                  <button
                    onClick={buyDice}
                    disabled={gold < (10 + (shopDice * 2))}
                    className={`p-2 rounded-lg font-semibold transition-all border-2 ${
                      gold < (10 + (shopDice * 2))
                        ? 'bg-gray-900 border-gray-600 text-gray-500 cursor-not-allowed'
                        : 'bg-black border-yellow-500 text-yellow-400 hover:bg-yellow-900 transform hover:scale-105 shadow-[0_0_15px_rgba(255,255,0,0.5)]'
                    }`}
                  >
                    <div className="text-2xl mb-1">🎲</div>
                    <div className="text-sm">Random Dice</div>
                    <div className="text-xs text-yellow-300">{10 + (shopDice * 2)} 💰</div>
                    <div className="text-xs opacity-80">Value: {shopDice}</div>
                </button>
              </div>
              </div>

              {/* Artifacts Section - Positioned under Cyber Dice World */}
              {showArtifacts && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {artifactsList.map((artifact, index) => (
                    <div key={index} className={`rounded-lg p-3 border-2 transition-all ${
                      artifact.unlocked 
                        ? 'bg-green-900 border-green-500 shadow-[0_0_20px_rgba(0,255,150,0.4)]' 
                        : 'bg-gray-900 border-gray-600 opacity-60'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{artifact.icon}</span>
                        <div className="flex-1">
                          <div className={`font-bold text-sm ${
                            artifact.unlocked ? 'text-green-400' : 'text-gray-500'
                          }`}>
                            {artifact.unlocked ? artifact.name : '???'}
                          </div>
                          <div className="text-xs text-gray-400">
                            {artifact.unlocked ? `Wymagane: ${artifact.requirement} elite` : `Wymagane: ${artifact.requirement} elite`}
                          </div>
                        </div>
                      </div>
                      {artifact.unlocked && (
                        <div className="space-y-2">
                          <div className="text-xs text-cyan-300 font-semibold">
                            {artifact.desc}
                          </div>
                          <div className="text-xs text-gray-300 italic">
                            "{artifact.lore}"
                          </div>
                        </div>
                      )}
                      {!artifact.unlocked && (
                        <div className="text-xs text-gray-500 italic">
                          Zabij {artifact.requirement} elite enemies, aby odblokować
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Forge Section - Positioned under Cyber Dice World */}
              {showForge && (
                <div className="mt-4">
                  <div className="text-lg font-bold mb-4 text-cyan-400 text-center drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">
                    {'>>> KUŹNIA CHAOSU <<<'}
                  </div>
                  
                  {/* Current Build Display */}
                  <div className="bg-gray-900 border-2 border-cyan-500 rounded-lg p-4 mb-4">
                    <div className="text-center text-cyan-300 font-bold mb-2">AKTUALNY BUILD KOSTEK</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div className="text-center">
                        <div className="text-gray-400">Poziom</div>
                        <div className="text-cyan-400 font-bold">{diceBuild.level}/7</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-400">Wzmocnienie</div>
                        <div className="text-green-400 font-bold">{diceBuild.enhancement}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-400">Zaczarowanie</div>
                        <div className="text-purple-400 font-bold">{diceBuild.enchantment}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-400">Ewolucja</div>
                        <div className="text-pink-400 font-bold">{diceBuild.evolution}</div>
                      </div>
                    </div>
                  </div>

                  {/* Forge Tabs */}
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setActiveForgeTab('enhancement')}
                      className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                        activeForgeTab === 'enhancement'
                          ? 'bg-green-900 border-green-500 text-green-400 shadow-[0_0_15px_rgba(0,255,150,0.5)]'
                          : 'bg-gray-900 border-gray-600 text-gray-400 hover:border-green-500'
                      }`}
                    >
                      Wzmocnienie
                    </button>
                    <button
                      onClick={() => setActiveForgeTab('enchantment')}
                      className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                        activeForgeTab === 'enchantment'
                          ? 'bg-purple-900 border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(147,51,234,0.5)]'
                          : 'bg-gray-900 border-gray-600 text-gray-400 hover:border-purple-500'
                      }`}
                    >
                      Zaczarowanie
                    </button>
                    <button
                      onClick={() => setActiveForgeTab('evolution')}
                      className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                        activeForgeTab === 'evolution'
                          ? 'bg-pink-900 border-pink-500 text-pink-400 shadow-[0_0_15px_rgba(255,0,255,0.5)]'
                          : 'bg-gray-900 border-gray-600 text-gray-400 hover:border-pink-500'
                      }`}
                    >
                      Ewolucja
                    </button>
                  </div>

                  {/* Tab Content */}
                  {activeForgeTab === 'enhancement' && (
                    <div className="bg-cyan-900 border-2 border-cyan-500 rounded-lg p-4">
                      <div className="text-cyan-400 font-bold text-center mb-4">WZMOCNIENIE KOSTEK</div>
                      
                      {/* Individual Dice Enhancement */}
                      <div className="mb-4">
                        <div className="text-cyan-300 font-bold text-center mb-2">WZMOCNIENIE INDYWIDUALNE</div>
                        <div className="grid grid-cols-3 gap-2">
                          {diceEnhancements.map((level, index) => {
                            const nextLevel = Math.ceil((level + 1) / 25) * 25;
                            const cost = nextLevel * 2;
                            const canEnhance = gold >= cost;
                            
                            return (
                              <button
                                key={index}
                                onClick={() => enhanceDice(index)}
                                disabled={!canEnhance}
                                className={`p-2 rounded border-2 text-center transition-all ${
                                  canEnhance
                                    ? 'bg-cyan-500 border-cyan-300 text-white hover:bg-cyan-600'
                                    : 'bg-gray-700 border-gray-500 text-gray-400 cursor-not-allowed'
                                }`}
                              >
                                <div className="text-lg">{['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣'][index]}</div>
                                <div className="text-xs">Lv.{level}</div>
                                <div className="text-xs">{cost}💰</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeForgeTab === 'enchantment' && (
                    <div className="bg-purple-900 border-2 border-purple-500 rounded-lg p-4">
                      <div className="text-purple-400 font-bold text-center mb-4">ZACZAROWANIE KOSTEK</div>
                      
                      {/* Skills Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {/* 4 Szansa */}
                        <div className="bg-gray-800 border-2 border-purple-400 rounded-lg p-3">
                          <div className="text-center">
                            <div className="text-lg mb-1">🎲</div>
                            <div className="text-sm font-bold text-purple-300">4 Szansa</div>
                            <div className="text-xs text-gray-400">Lv.{enchantmentSkills.extraRoll}</div>
                            <div className="text-xs text-yellow-400">{50 * (enchantmentSkills.extraRoll + 1)}💰</div>
                            <button
                              onClick={() => upgradeSkill('extraRoll')}
                              disabled={gold < 50 * (enchantmentSkills.extraRoll + 1)}
                              className="mt-2 px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                              ULEPSZ
                            </button>
                            <button
                              onClick={() => useSkill('extraRoll')}
                              disabled={mana < 5}
                              className="mt-1 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                              UŻYJ (5💎)
                            </button>
                          </div>
                        </div>

                        {/* Powtórzenie rzutu */}
                        <div className="bg-gray-800 border-2 border-purple-400 rounded-lg p-3">
                          <div className="text-center">
                            <div className="text-lg mb-1">🔄</div>
                            <div className="text-sm font-bold text-purple-300">Powtórzenie</div>
                            <div className="text-xs text-gray-400">Lv.{enchantmentSkills.reroll}</div>
                            <div className="text-xs text-yellow-400">{30 * (enchantmentSkills.reroll + 1)}💰</div>
                            <button
                              onClick={() => upgradeSkill('reroll')}
                              disabled={gold < 30 * (enchantmentSkills.reroll + 1)}
                              className="mt-2 px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                              ULEPSZ
                            </button>
                            <button
                              onClick={() => useSkill('reroll')}
                              disabled={mana < 3}
                              className="mt-1 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                              UŻYJ (3💎)
                            </button>
                          </div>
                        </div>

                        {/* Mnożnik */}
                        <div className="bg-gray-800 border-2 border-purple-400 rounded-lg p-3">
                          <div className="text-center">
                            <div className="text-lg mb-1">⚡</div>
                            <div className="text-sm font-bold text-purple-300">Mnożnik</div>
                            <div className="text-xs text-gray-400">Lv.{enchantmentSkills.multiplier}</div>
                            <div className="text-xs text-yellow-400">{40 * (enchantmentSkills.multiplier + 1)}💰</div>
                            <button
                              onClick={() => upgradeSkill('multiplier')}
                              disabled={gold < 40 * (enchantmentSkills.multiplier + 1)}
                              className="mt-2 px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                              ULEPSZ
                            </button>
                            <button
                              onClick={() => useSkill('multiplier')}
                              disabled={mana < 8}
                              className="mt-1 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                              UŻYJ (8💎)
                            </button>
                          </div>
                        </div>

                        {/* Tarcza */}
                        <div className="bg-gray-800 border-2 border-purple-400 rounded-lg p-3">
                          <div className="text-center">
                            <div className="text-lg mb-1">🛡️</div>
                            <div className="text-sm font-bold text-purple-300">Tarcza</div>
                            <div className="text-xs text-gray-400">Lv.{enchantmentSkills.shield}</div>
                            <div className="text-xs text-yellow-400">{30 * (enchantmentSkills.shield + 1)}💰</div>
                            <button
                              onClick={() => upgradeSkill('shield')}
                              disabled={gold < 30 * (enchantmentSkills.shield + 1)}
                              className="mt-2 px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                              ULEPSZ
                            </button>
                            <button
                              onClick={() => useSkill('shield')}
                              disabled={mana < 6}
                              className="mt-1 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                              UŻYJ (6💎)
                            </button>
                          </div>
                        </div>

                        {/* Teleport */}
                        <div className="bg-gray-800 border-2 border-purple-400 rounded-lg p-3">
                          <div className="text-center">
                            <div className="text-lg mb-1">🌀</div>
                            <div className="text-sm font-bold text-purple-300">Teleport</div>
                            <div className="text-xs text-gray-400">Lv.{enchantmentSkills.teleport}</div>
                            <div className="text-xs text-yellow-400">{60 * (enchantmentSkills.teleport + 1)}💰</div>
                            <button
                              onClick={() => upgradeSkill('teleport')}
                              disabled={gold < 60 * (enchantmentSkills.teleport + 1)}
                              className="mt-2 px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                              ULEPSZ
                            </button>
                            <button
                              onClick={() => useSkill('teleport')}
                              disabled={mana < 10}
                              className="mt-1 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                              UŻYJ (10💎)
                            </button>
                          </div>
                        </div>

                        {/* Widzenie */}
                        <div className="bg-gray-800 border-2 border-purple-400 rounded-lg p-3">
                          <div className="text-center">
                            <div className="text-lg mb-1">👁️</div>
                            <div className="text-sm font-bold text-purple-300">Widzenie</div>
                            <div className="text-xs text-gray-400">Lv.{enchantmentSkills.vision}</div>
                            <div className="text-xs text-yellow-400">{20 * (enchantmentSkills.vision + 1)}💰</div>
                            <button
                              onClick={() => upgradeSkill('vision')}
                              disabled={gold < 20 * (enchantmentSkills.vision + 1)}
                              className="mt-2 px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                              ULEPSZ
                            </button>
                            <button
                              onClick={() => useSkill('vision')}
                              disabled={mana < 2}
                              className="mt-1 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                              UŻYJ (2💎)
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeForgeTab === 'evolution' && (
                    <div className="bg-pink-900 border-2 border-pink-500 rounded-lg p-4">
                      <div className="text-pink-400 font-bold text-center mb-4">EWOLUCJA KOSTEK</div>
                      
                      {/* Evolution Tier Display */}
                      <div className="mb-4">
                        <div className="text-pink-300 font-bold text-center mb-2">TIER EWOLUCJI</div>
                        <div className="grid grid-cols-5 gap-2">
                          {[0,1,2,3,4,5,6,7,8,9,10].map(tier => {
                            const tierNames = ['Kamień', 'Miedź', 'Srebro', 'Złoto', 'Platyna', 'Diament', 'Rubin', 'Szmaragd', 'Szafir', 'Obsydian', 'Void'];
                            const tierColors = ['gray', 'orange', 'gray', 'yellow', 'cyan', 'blue', 'red', 'green', 'blue', 'purple', 'black'];
                            const isActive = evolutionTier >= tier;
                            
                            return (
                              <div key={tier} className={`p-2 rounded border-2 text-center ${
                                isActive
                                  ? 'bg-pink-500 border-pink-300 text-white' 
                                  : 'bg-gray-700 border-gray-500 text-gray-400'
                              }`}>
                                <div className="text-lg">💎</div>
                                <div className="text-xs">{tierNames[tier]}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Evolution Bonuses */}
                      <div className="mb-4">
                        <div className="text-pink-300 font-bold text-center mb-2">BONUSY EWOLUCJI</div>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(evolutionBonuses).map(([bonus, value]) => (
                            <div key={bonus} className="bg-gray-800 border-2 border-pink-400 rounded-lg p-2 text-center">
                              <div className="text-xs text-pink-300">{bonus.toUpperCase()}</div>
                              <div className="text-lg text-pink-400 font-bold">{value}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Evolution Button */}
                      <div className="text-center">
                        <button
                          onClick={evolveDice}
                          disabled={gold < [100, 250, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000][evolutionTier] || evolutionTier >= 10}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
                            gold >= [100, 250, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000][evolutionTier] && evolutionTier < 10
                              ? 'bg-pink-500 border-pink-300 text-white hover:bg-pink-600'
                              : 'bg-gray-700 border-gray-500 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          EWOLUCJA ({[100, 250, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000][evolutionTier]}💰)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
      </div>
    </div>
  );
};

export default DungeonYahtzee;

