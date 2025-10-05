import React, { useState, useEffect } from 'react';
import { Skull, Heart, Shield, Sword, Sparkles, Trophy, Zap, Flame, Droplet } from 'lucide-react';

const DungeonYahtzee = () => {
  const [dice, setDice] = useState([1, 2, 3, 4, 5]);
  const [held, setHeld] = useState([false, false, false, false, false]);
  const [rollsLeft, setRollsLeft] = useState(3);
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

  const enemies = [
    { name: 'Goblin Zwiadowca', hp: 18, dmg: 4, reward: 12, xp: 10, icon: '👺', special: null },
    { name: 'Szkielet Łucznik', hp: 22, dmg: 5, reward: 18, xp: 15, icon: '💀', special: 'pierce' },
    { name: 'Ork Barbarzyńca', hp: 30, dmg: 7, reward: 25, xp: 20, icon: '👹', special: 'rage' },
    { name: 'Mroczny Mag', hp: 28, dmg: 6, reward: 30, xp: 25, icon: '🧙', special: 'curse' },
    { name: 'Troll Regenerujący', hp: 40, dmg: 8, reward: 35, xp: 30, icon: '🧌', special: 'regen' },
    { name: 'Wampir', hp: 35, dmg: 9, reward: 40, xp: 35, icon: '🧛', special: 'lifesteal' },
    { name: 'Demon Ognia', hp: 45, dmg: 10, reward: 50, xp: 40, icon: '👿', special: 'burn' },
    { name: 'Smok Lodu', hp: 60, dmg: 12, reward: 80, xp: 60, icon: '🐉', special: 'freeze' },
    { name: 'Nieumarły Rycerz', hp: 70, dmg: 14, reward: 100, xp: 80, icon: '⚔️', special: 'armor' },
    { name: 'WŁADCA LOCHÓW', hp: 120, dmg: 18, reward: 500, xp: 200, icon: '👑', special: 'boss' }
  ];

  const artifactsList = [
    { name: 'Pierścień Mocy', effect: 'dmg', value: 1.2, icon: '💍' },
    { name: 'Amulet Życia', effect: 'hp', value: 20, icon: '📿' },
    { name: 'Kryształ Many', effect: 'mana', value: 15, icon: '💎' },
    { name: 'Maska Krytyka', effect: 'crit', value: 0.15, icon: '🎭' },
    { name: 'Tarcza Odbicia', effect: 'reflect', value: 0.3, icon: '🛡️' }
  ];

  useEffect(() => {
    spawnEnemy();
  }, []);

  useEffect(() => {
    if (floor > 1) {
      spawnEnemy();
    }
  }, [floor]);

  useEffect(() => {
    const xpNeeded = level * 50;
    if (xp >= xpNeeded) {
      levelUp();
    }
  }, [xp]);

  const levelUp = () => {
    setLevel(level + 1);
    const newMaxHp = maxHp + 10;
    const newMaxMana = maxMana + 5;
    setMaxHp(newMaxHp);
    setHp(hp + 10);
    setMaxMana(newMaxMana);
    setMana(newMaxMana);
    setMessage(`⭐ AWANS! Poziom ${level + 1}! +10 HP, +5 Many!`);
    
    if (level % 3 === 0) {
      const randomArtifact = artifactsList[Math.floor(Math.random() * artifactsList.length)];
      setArtifacts([...artifacts, randomArtifact]);
      setTimeout(() => {
        setMessage(`🎁 Znaleziono: ${randomArtifact.name} ${randomArtifact.icon}!`);
      }, 1500);
    }
  };

  const spawnEnemy = () => {
    const isBoss = floor % 5 === 0;
    setBossFloor(isBoss);
    
    let index;
    if (isBoss) {
      index = Math.min(Math.floor(floor / 5) + 3, enemies.length - 1);
    } else {
      index = Math.min(Math.floor((floor - 1) / 1.5), enemies.length - 2);
    }
    
    const enemyTemplate = enemies[index];
    const scaledHp = Math.floor(enemyTemplate.hp * (1 + floor * 0.1));
    const scaledDmg = Math.floor(enemyTemplate.dmg * (1 + floor * 0.08));
    
    setEnemy({
      ...enemyTemplate,
      hp: scaledHp,
      currentHp: scaledHp,
      dmg: scaledDmg
    });
    setRollsLeft(3);
    setHeld([false, false, false, false, false]);
    setCombatPhase('rolling');
    setMessage(`${isBoss ? '⚠️ BOSS! ' : ''}Piętro ${floor}: ${enemyTemplate.icon} ${enemyTemplate.name}!`);
  };

  const rollDice = () => {
    if (rollsLeft <= 0 || combatPhase !== 'rolling') return;
    
    const newDice = dice.map((d, i) => held[i] ? d : Math.floor(Math.random() * 6) + 1);
    setDice(newDice);
    setRollsLeft(rollsLeft - 1);
    
    if (rollsLeft === 1) {
      setMessage('⚡ Ostatni rzut! Wybierz mądrze!');
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
    
    // Blessed bonus
    if (statusEffects.blessed > 0) {
      finalDmg = Math.floor(finalDmg * 1.3);
      setStatusEffects({...statusEffects, blessed: statusEffects.blessed - 1});
    }
    
    const newEnemyHp = Math.max(0, enemy.currentHp - finalDmg);
    setEnemy({...enemy, currentHp: newEnemyHp});
    setComboHistory([...comboHistory.slice(-2), {name: comboName, dmg: finalDmg, crit: isCrit}]);
    
    setTimeout(() => {
      if (newEnemyHp <= 0) {
        const lootGold = enemy.reward + Math.floor(Math.random() * 10);
        setGold(gold + lootGold);
        setXp(xp + enemy.xp);
        
        // Lifesteal artifacts
        artifacts.forEach(artifact => {
          if (artifact.effect === 'hp') {
            setHp(Math.min(maxHp, hp + 5));
          }
        });
        
        setMessage(`✨ Pokonano ${enemy.name}! +${lootGold} złota, +${enemy.xp} XP!`);
        
        if (floor >= 15) {
          setVictory(true);
          setMessage('👑 LEGENDA LOCHÓW! Pokonałeś wszystkie piętra!');
        } else {
          setTimeout(() => {
            setFloor(floor + 1);
            setMana(Math.min(maxMana, mana + 10));
          }, 2000);
        }
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

  const buyBlessing = () => {
    if (gold >= 40) {
      setGold(gold - 40);
      setStatusEffects({...statusEffects, blessed: 3});
      setMessage('✨ Błogosławieństwo! +30% DMG przez 3 tury!');
    }
  };

  const resetGame = () => {
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
    setTimeout(() => spawnEnemy(), 100);
  };

  const combos = calculateCombos();

  if (!enemy) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-1 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600">
          ⚔️ DUNGEON YAHTZEE ⚔️
        </h1>
        <p className="text-center text-xl text-yellow-300 mb-1 font-semibold">KRYPTY CHAOSU - EDYCJA ROZSZERZONA</p>
        <p className="text-center text-sm text-gray-400 mb-6">v2.0 - Artefakty • Bossowie • Efekty Statusu</p>

        {/* Enhanced Status Bar */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-4 mb-4 border-2 border-purple-500">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500" />
              <div>
                <div className="text-xs text-gray-400">HP</div>
                <div className="font-bold text-lg text-red-400">{hp}/{maxHp}</div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full transition-all" style={{width: `${(hp/maxHp)*100}%`}}></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-blue-500" />
              <div>
                <div className="text-xs text-gray-400">Mana</div>
                <div className="font-bold text-lg text-blue-400">{mana}/{maxMana}</div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full transition-all" style={{width: `${(mana/maxMana)*100}%`}}></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-cyan-500" />
              <div>
                <div className="text-xs text-gray-400">Tarcza</div>
                <div className="font-bold text-lg text-cyan-400">{shield}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <div>
                <div className="text-xs text-gray-400">Poziom {level}</div>
                <div className="font-bold text-sm text-yellow-400">Piętro {floor}/15</div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full transition-all" style={{width: `${(xp % (level*50))/(level*50)*100}%`}}></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              <div>
                <div className="text-xs text-gray-400">Złoto</div>
                <div className="font-bold text-lg text-yellow-300">{gold}</div>
              </div>
            </div>
          </div>
          
          {/* Status Effects */}
          {(statusEffects.burning > 0 || statusEffects.frozen || statusEffects.blessed > 0) && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {statusEffects.burning > 0 && (
                <div className="bg-orange-600 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <Flame className="w-4 h-4" /> Płonie ({statusEffects.burning} DMG)
                </div>
              )}
              {statusEffects.frozen && (
                <div className="bg-blue-600 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <Droplet className="w-4 h-4" /> Zamrożony
                </div>
              )}
              {statusEffects.blessed > 0 && (
                <div className="bg-yellow-600 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <Sparkles className="w-4 h-4" /> Błogosławiony ({statusEffects.blessed})
                </div>
              )}
            </div>
          )}
        </div>

        {/* Artifacts Display */}
        {artifacts.length > 0 && (
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg p-3 mb-4 border border-purple-400">
            <div className="text-sm font-bold mb-2 text-purple-300">🎁 Artefakty:</div>
            <div className="flex gap-2 flex-wrap">
              {artifacts.map((art, i) => (
                <div key={i} className="bg-black bg-opacity-40 px-3 py-1 rounded-lg text-sm border border-purple-400">
                  {art.icon} {art.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Enemy */}
        {!gameOver && !victory && (
          <div className={`rounded-lg p-5 mb-4 text-center border-4 transition-all ${
            bossFloor 
              ? 'bg-gradient-to-br from-red-900 via-purple-900 to-black border-yellow-500 shadow-lg shadow-red-500' 
              : 'bg-gradient-to-br from-red-800 to-gray-900 border-red-600'
          }`}>
            <div className="text-7xl mb-3">{enemy.icon}</div>
            <div className={`text-3xl font-bold mb-2 ${bossFloor ? 'text-yellow-300' : 'text-red-300'}`}>
              {bossFloor && '👑 '}{enemy.name}{bossFloor && ' 👑'}
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="w-6 h-6 text-red-400" />
              <div className="text-2xl font-bold">{enemy.currentHp}/{enemy.hp}</div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 mb-3 border-2 border-gray-600">
              <div className="bg-gradient-to-r from-red-600 to-red-400 h-full rounded-full transition-all" style={{width: `${(enemy.currentHp/enemy.hp)*100}%`}}></div>
            </div>
            <div className="flex items-center justify-center gap-4 text-orange-300">
              <div className="flex items-center gap-1">
                <Sword className="w-5 h-5" />
                <span className="font-semibold">{enemy.dmg} DMG</span>
              </div>
              {enemy.special && (
                <div className="bg-purple-800 px-3 py-1 rounded-full text-sm">
                  ⚡ {enemy.special.toUpperCase()}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Message with animation */}
        <div className={`rounded-lg p-4 mb-4 text-center font-semibold text-lg border-2 transition-all ${
          criticalHit 
            ? 'bg-yellow-600 border-yellow-400 animate-pulse' 
            : 'bg-gradient-to-r from-blue-900 to-purple-900 border-blue-500'
        }`}>
          {criticalHit && '💥 KRYTYK! 💥 '}
          {message}
        </div>

        {/* Combat History */}
        {comboHistory.length > 0 && !gameOver && !victory && (
          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-2 mb-4">
            <div className="text-xs text-gray-400 mb-1">Historia ataków:</div>
            <div className="flex gap-2 flex-wrap">
              {comboHistory.map((combo, i) => (
                <div key={i} className={`px-2 py-1 rounded text-sm ${combo.crit ? 'bg-yellow-600' : 'bg-gray-700'}`}>
                  {combo.crit && '💥'} {combo.name}: {combo.dmg} DMG
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Game Over / Victory */}
        {(gameOver || victory) && (
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg p-8 mb-4 text-center border-4 border-purple-500">
            <div className="text-8xl mb-4">{victory ? '👑' : '💀'}</div>
            <div className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
              {victory ? 'LEGENDARNY ZWYCIĘZCA!' : 'UPADEK BOHATERA'}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6 text-lg">
              <div className="bg-gray-800 p-3 rounded">
                <div className="text-gray-400">Poziom</div>
                <div className="text-2xl font-bold text-yellow-400">{level}</div>
              </div>
              <div className="bg-gray-800 p-3 rounded">
                <div className="text-gray-400">Piętro</div>
                <div className="text-2xl font-bold text-red-400">{floor}</div>
              </div>
              <div className="bg-gray-800 p-3 rounded">
                <div className="text-gray-400">Złoto</div>
                <div className="text-2xl font-bold text-yellow-300">{gold}</div>
              </div>
              <div className="bg-gray-800 p-3 rounded">
                <div className="text-gray-400">Artefakty</div>
                <div className="text-2xl font-bold text-purple-400">{artifacts.length}</div>
              </div>
            </div>
            <button
              onClick={resetGame}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-4 rounded-lg font-bold text-xl shadow-lg"
            >
              🎮 Nowa Przygoda
            </button>
          </div>
        )}

        {/* Dice */}
        {!gameOver && !victory && (
          <>
            <div className="flex justify-center gap-3 mb-4">
              {dice.map((d, i) => (
                <button
                  key={i}
                  onClick={() => toggleHold(i)}
                  disabled={rollsLeft === 3 || combatPhase !== 'rolling'}
                  className={`w-20 h-20 text-4xl font-bold rounded-xl transition-all shadow-lg ${
                    held[i]
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-black transform scale-110 rotate-6 shadow-yellow-500'
                      : 'bg-gradient-to-br from-white to-gray-200 text-black hover:scale-105'
                  } ${rollsLeft === 3 || combatPhase !== 'rolling' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-xl'}`}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="text-center mb-4">
              <button
                onClick={rollDice}
                disabled={rollsLeft <= 0 || combatPhase !== 'rolling'}
                className={`px-10 py-4 rounded-xl font-bold text-xl shadow-lg transition-all ${
                  rollsLeft <= 0 || combatPhase !== 'rolling'
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105'
                }`}
              >
                🎲 RZUĆ KOŚĆMI ({rollsLeft}/3)
              </button>
            </div>

            {/* Enhanced Combos */}
            {rollsLeft < 3 && combatPhase === 'rolling' && (
              <div className="bg-gray-900 bg-opacity-80 rounded-lg p-4 mb-4 border-2 border-purple-500">
                <div className="text-xl font-bold mb-3 text-center text-purple-300">⚔️ WYBIERZ ATAK ⚔️</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(combos).map(([name, data]) => {
                    const canUse = data.dmg > 0 && data.mana <= mana;
                    return (
                      <button
                        key={name}
                        onClick={() => attack(name, data)}
                        disabled={!canUse}
                        className={`p-3 rounded-lg font-semibold transition-all ${
                          !canUse
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                            : data.dmg >= 40
                            ? 'bg-gradient-to-br from-red-600 via-orange-600 to-yellow-600 hover:from-red-700 hover:via-orange-700 hover:to-yellow-700 transform hover:scale-105 shadow-lg'
                            : data.dmg >= 25
                            ? 'bg-gradient-to-br from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 transform hover:scale-105'
                            : 'bg-gradient-to-br from-red-700 to-orange-700 hover:from-red-800 hover:to-orange-800'
                        }`}
                      >
                        <div className="text-xs opacity-80">{name}</div>
                        <div className="text-2xl font-bold">⚔️ {data.dmg}</div>
                        {data.mana > 0 && (
                          <div className="text-xs text-blue-300">💙 {data.mana} many</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Enhanced Shop */}
            <div className="bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 rounded-lg p-4 border-2 border-yellow-600">
              <div className="text-2xl font-bold mb-3 text-yellow-300 text-center">🏪 SKLEP KUPCA 🏪</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={usePotion}
                  disabled={gold < 25 || hp >= maxHp}
                  className={`p-3 rounded-lg font-semibold transition-all ${
                    gold < 25 || hp >= maxHp
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-br from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 transform hover:scale-105'
                  }`}
                >
                  <div className="text-3xl mb-1">💖</div>
                  <div className="text-sm">Eliksir Życia</div>
                  <div className="text-xs text-yellow-300">25 złota</div>
                  <div className="text-xs opacity-80">+30 HP</div>
                </button>
                <button
                  onClick={buyManaPotion}
                  disabled={gold < 15 || mana >= maxMana}
                  className={`p-3 rounded-lg font-semibold transition-all ${
                    gold < 15 || mana >= maxMana
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-br from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transform hover:scale-105'
                  }`}
                >
                  <div className="text-3xl mb-1">💙</div>
                  <div className="text-sm">Eliksir Many</div>
                  <div className="text-xs text-yellow-300">15 złota</div>
                  <div className="text-xs opacity-80">+20 Many</div>
                </button>
                <button
                  onClick={buyShield}
                  disabled={gold < 20}
                  className={`p-3 rounded-lg font-semibold transition-all ${
                    gold < 20
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-br from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 transform hover:scale-105'
                  }`}
                >
                  <div className="text-3xl mb-1">🛡️</div>
                  <div className="text-sm">Magiczna Tarcza</div>
                  <div className="text-xs text-yellow-300">20 złota</div>
                  <div className="text-xs opacity-80">+15 Obrony</div>
                </button>
                <button
                  onClick={buyBlessing}
                  disabled={gold < 40}
                  className={`p-3 rounded-lg font-semibold transition-all ${
                    gold < 40
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-br from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 transform hover:scale-105'
                  }`}
                >
                  <div className="text-3xl mb-1">✨</div>
                  <div className="text-sm">Błogosławieństwo</div>
                  <div className="text-xs text-yellow-300">40 złota</div>
                  <div className="text-xs opacity-80">+30% DMG x3</div>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DungeonYahtzee;

