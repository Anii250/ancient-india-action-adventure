import { useState, useEffect } from "react";
import { Character, Enemy } from "../data/gameData";

type Props = {
  player: Character;
  enemy: Enemy;
  onVictory: (updatedPlayer: Character) => void;
  onDefeat: () => void;
  onFlee: () => void;
  levelAccent?: string;
};

type CombatAction = {
  id: string;
  timestamp: number;
  text: string;
  type: "player" | "enemy" | "system" | "special";
};

export function CombatScreen({ player, enemy, onVictory, onDefeat, onFlee }: Props) {
  const [playerHp, setPlayerHp] = useState(player.stats.hp);
  const [enemyHp, setEnemyHp] = useState(enemy.hp);
  const [log, setLog] = useState<CombatAction[]>([]);
  const [turn, setTurn] = useState<"player" | "enemy" | "animating">("player");
  const [isShaking, setIsShaking] = useState<"player" | "enemy" | null>(null);
  const [specialUsed, setSpecialUsed] = useState(false);
  const [specialCooldown, setSpecialCooldown] = useState(0);
  const [poisoned, setPoisoned] = useState(0);
  const [blocking, setBlocking] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [combatEnded, setCombatEnded] = useState(false);
  const [useItemCooldown, setUseItemCooldown] = useState(false);

  const addLog = (text: string, type: CombatAction["type"] = "system") => {
    setLog(prev => [...prev, { id: `${Date.now()}-${Math.random()}`, timestamp: Date.now(), text, type }]);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
      addLog(enemy.dialogue.intro, "enemy");
      addLog("⚔️ Combat begins! Choose your action.", "system");
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const doEnemyTurn = (currentPlayerHp: number, currentBlock: boolean, currentPoisoned: number) => {
    setTurn("animating");
    setTimeout(() => {
      let newPlayerHp = currentPlayerHp;

      // Poison tick
      if (currentPoisoned > 0) {
        const poisonDmg = 8;
        newPlayerHp = Math.max(0, newPlayerHp - poisonDmg);
        setPoisoned(p => p - 1);
        addLog(`☠️ Poison deals ${poisonDmg} damage! (${currentPoisoned - 1} turns left)`, "enemy");
      }

      // Enemy attack
      const baseDmg = enemy.attack + Math.floor(Math.random() * 8) - 3;
      const finalDmg = currentBlock ? Math.floor(baseDmg * 0.35) : baseDmg;
      newPlayerHp = Math.max(0, newPlayerHp - finalDmg);

      setIsShaking("player");
      setTimeout(() => setIsShaking(null), 400);

      if (currentBlock) {
        addLog(`🛡️ Your shield absorbs most of ${enemy.name}'s strike! Only ${finalDmg} damage!`, "enemy");
      } else {
        addLog(`${enemy.emoji} ${enemy.name} attacks for ${finalDmg} damage!`, "enemy");
      }

      setBlocking(false);
      setPlayerHp(newPlayerHp);
      setTurnCount(t => t + 1);

      if (newPlayerHp <= 0 && !combatEnded) {
        setCombatEnded(true);
        addLog(`💀 You have been defeated by ${enemy.name}...`, "system");
        setTimeout(() => onDefeat(), 2000);
      } else {
        setTurn("player");
      }
    }, 1200);
  };

  const handleAttack = () => {
    if (turn !== "player" || combatEnded) return;
    setTurn("animating");

    const baseDmg = player.stats.attack + Math.floor(Math.random() * 10);
    const finalDmg = Math.max(5, baseDmg);
    const newEnemyHp = Math.max(0, enemyHp - finalDmg);

    setIsShaking("enemy");
    setTimeout(() => setIsShaking(null), 400);

    addLog(`🏹 You strike ${enemy.name} for ${finalDmg} damage!`, "player");
    setEnemyHp(newEnemyHp);

    if (newEnemyHp <= 0 && !combatEnded) {
      setCombatEnded(true);
      addLog(enemy.dialogue.defeat, "enemy");
      addLog(`🏆 Victory! ${enemy.name} has been defeated!`, "system");
      setTimeout(() => {
        const updated: Character = {
          ...player,
          stats: {
            ...player.stats,
            hp: Math.min(player.stats.maxHp, playerHp + 20),
            xp: player.stats.xp + enemy.rewards.xp,
          },
          karma: player.karma + enemy.rewards.karma,
          inventory: enemy.rewards.item
            ? [...player.inventory, enemy.rewards.item]
            : player.inventory,
        };
        onVictory(updated);
      }, 2500);
      return;
    }

    // Enemy special ability
    if (!specialUsed && specialCooldown <= 0 && newEnemyHp < enemy.maxHp * 0.4) {
      setSpecialUsed(true);
      addLog(`⚡ ${enemy.name} uses ${enemy.specialAbility}!`, "special");
      if (enemy.specialAbility.includes("Poison")) setPoisoned(3);
      doEnemyTurn(playerHp, false, poisoned + (enemy.specialAbility.includes("Poison") ? 1 : 0));
    } else {
      setSpecialCooldown(s => Math.max(0, s - 1));
      doEnemyTurn(playerHp, false, poisoned);
    }
  };

  const handleDefend = () => {
    if (turn !== "player" || combatEnded) return;
    setBlocking(true);
    addLog("🛡️ You brace yourself, raising your guard...", "player");
    doEnemyTurn(playerHp, true, poisoned);
  };

  const handleHeal = () => {
    if (turn !== "player" || combatEnded || useItemCooldown) return;
    const healItem = player.inventory.find(i => i.id === "healing_herb" && !i.used);
    if (!healItem) return;

    const healed = 30;
    const newHp = Math.min(player.stats.maxHp, playerHp + healed);
    setPlayerHp(newHp);
    setUseItemCooldown(true);
    addLog(`🌿 You use Ashwagandha and restore ${healed} HP!`, "player");
    setTurn("animating");
    setTimeout(() => doEnemyTurn(newHp, false, poisoned), 500);
  };

  const playerHpPercent = Math.max(0, (playerHp / player.stats.maxHp) * 100);
  const enemyHpPercent = Math.max(0, (enemyHp / enemy.maxHp) * 100);
  const hasHealItem = player.inventory.some(i => i.id === "healing_herb" && !i.used);

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-950 via-slate-900 to-black flex items-center justify-center p-4">
        <div className="text-center animate-pulse">
          <div className="text-8xl mb-6">{enemy.emoji}</div>
          <h2 className="text-4xl font-bold text-red-400 font-cinzel mb-2">{enemy.name}</h2>
          <p className="text-slate-300 text-lg italic">{enemy.title}</p>
          <div className="mt-8 text-red-500 text-2xl animate-bounce">⚔️ COMBAT ⚔️</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950 via-slate-950 to-black p-3 md:p-6">
      <div className="max-w-3xl mx-auto space-y-4">

        {/* Header */}
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold text-red-400 font-cinzel tracking-wider">⚔️ COMBAT ⚔️</h2>
          <p className="text-slate-400 text-sm">Turn {turnCount + 1} · {turn === "player" ? "Your Move" : "Enemy's Move"}</p>
        </div>

        {/* Combatants */}
        <div className="grid grid-cols-2 gap-3">
          {/* Player */}
          <div className={`bg-slate-900/80 rounded-xl p-3 border-2 transition-all duration-300 ${isShaking === "player" ? "border-red-500 scale-95" : "border-amber-700/40"} ${blocking ? "border-blue-500" : ""}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-orange-800 flex items-center justify-center text-xl border border-amber-500/50">
                {player.emoji}
              </div>
              <div>
                <p className="text-amber-300 font-bold text-sm font-cinzel">{player.name}</p>
                {blocking && <span className="text-xs text-blue-400">🛡️ Blocking</span>}
                {poisoned > 0 && <span className="text-xs text-purple-400 ml-1">☠️ Poisoned</span>}
              </div>
            </div>
            <div className="text-xs text-slate-400 mb-1 flex justify-between">
              <span>❤️ HP</span>
              <span className="text-white font-mono">{playerHp}/{player.stats.maxHp}</span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden mb-1">
              <div
                className={`h-full rounded-full transition-all duration-500 ${playerHpPercent > 60 ? "bg-green-500" : playerHpPercent > 30 ? "bg-yellow-500" : "bg-red-500"}`}
                style={{ width: `${playerHpPercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-400">⚔️ {player.stats.attack} ATK · 🛡️ {player.stats.defense} DEF</p>
          </div>

          {/* Enemy */}
          <div className={`bg-red-950/50 rounded-xl p-3 border-2 transition-all duration-300 ${isShaking === "enemy" ? "border-amber-400 scale-95" : "border-red-800/50"}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-800 to-rose-950 flex items-center justify-center text-xl border border-red-600/50">
                {enemy.emoji}
              </div>
              <div>
                <p className="text-red-300 font-bold text-sm font-cinzel leading-tight">{enemy.name}</p>
                <p className="text-slate-400 text-xs">{enemy.title}</p>
              </div>
            </div>
            <div className="text-xs text-slate-400 mb-1 flex justify-between">
              <span>💀 HP</span>
              <span className="text-white font-mono">{enemyHp}/{enemy.maxHp}</span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden mb-1">
              <div
                className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-red-700 to-rose-500"
                style={{ width: `${enemyHpPercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-400">⚔️ {enemy.attack} ATK · ⚡ {enemy.specialAbility.split("—")[0]}</p>
          </div>
        </div>

        {/* Combat Log */}
        <div className="bg-black/70 border border-slate-700 rounded-xl p-3 h-44 overflow-y-auto space-y-1.5 font-mono">
          {log.length === 0 && (
            <p className="text-slate-500 text-xs text-center mt-4">Combat log will appear here...</p>
          )}
          {log.map(entry => (
            <div key={entry.id} className={`text-xs leading-relaxed flex items-start gap-1.5 ${
              entry.type === "player" ? "text-amber-300"
              : entry.type === "enemy" ? "text-red-400"
              : entry.type === "special" ? "text-purple-400"
              : "text-slate-300"
            }`}>
              <span className="shrink-0 mt-0.5">{entry.type === "player" ? "▶" : entry.type === "enemy" ? "◀" : entry.type === "special" ? "★" : "·"}</span>
              <span>{entry.text}</span>
            </div>
          ))}
        </div>

        {/* Enemy Lore */}
        <div className="bg-red-950/30 border border-red-800/40 rounded-xl p-3">
          <p className="text-xs text-slate-400 italic leading-relaxed">{enemy.description}</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleAttack}
            disabled={turn !== "player" || combatEnded}
            className="bg-gradient-to-r from-red-700 to-rose-700 hover:from-red-600 hover:to-rose-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-xl transition-all active:scale-95 hover:scale-105 border border-red-500/30 shadow-lg shadow-red-900/30"
          >
            <div className="text-2xl mb-1">⚔️</div>
            <div className="text-sm">Attack</div>
            <div className="text-xs opacity-70">{player.stats.attack} base dmg</div>
          </button>
          <button
            onClick={handleDefend}
            disabled={turn !== "player" || combatEnded}
            className="bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-xl transition-all active:scale-95 hover:scale-105 border border-blue-500/30 shadow-lg shadow-blue-900/30"
          >
            <div className="text-2xl mb-1">🛡️</div>
            <div className="text-sm">Defend</div>
            <div className="text-xs opacity-70">65% dmg reduction</div>
          </button>
          <button
            onClick={handleHeal}
            disabled={turn !== "player" || combatEnded || !hasHealItem || useItemCooldown}
            className="bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-600 hover:to-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-xl transition-all active:scale-95 hover:scale-105 border border-green-500/30 shadow-lg shadow-green-900/30"
          >
            <div className="text-2xl mb-1">🌿</div>
            <div className="text-sm">Use Item</div>
            <div className="text-xs opacity-70">{hasHealItem && !useItemCooldown ? "+30 HP" : "Not available"}</div>
          </button>
          <button
            onClick={onFlee}
            disabled={combatEnded}
            className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-xl transition-all active:scale-95 hover:scale-105 border border-slate-500/30"
          >
            <div className="text-2xl mb-1">🏃</div>
            <div className="text-sm">Flee</div>
            <div className="text-xs opacity-70">Escape battle</div>
          </button>
        </div>

        {/* Enemy Taunt */}
        {turnCount > 0 && turnCount % 3 === 0 && (
          <div className="bg-red-950/40 border border-red-700/30 rounded-lg p-3">
            <p className="text-red-300 text-xs italic">💬 {enemy.name}: "{enemy.dialogue.taunt}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
