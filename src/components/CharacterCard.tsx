import { Character } from "../data/gameData";

type Props = {
  character: Character;
  compact?: boolean;
};

export function CharacterCard({ character, compact = false }: Props) {
  const hpPercent = Math.max(0, (character.stats.hp / character.stats.maxHp) * 100);
  const xpToNext = character.stats.level * 200;
  const xpPercent = Math.min(100, (character.stats.xp / xpToNext) * 100);

  if (compact) {
    return (
      <div className="flex items-center gap-3 bg-slate-900/80 border border-amber-700/40 rounded-xl p-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center text-2xl border-2 border-amber-400/50 shadow-lg shadow-amber-900/50 shrink-0">
          {character.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="font-bold text-amber-300 text-sm font-cinzel leading-tight">{character.name}</p>
              <p className="text-slate-400 text-xs">{character.title}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-slate-400">Lv.{character.stats.level}</p>
              <p className="text-xs text-amber-400 font-semibold">{character.karma > 0 ? "+" : ""}{character.karma} Karma</p>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <div>
              <div className="flex justify-between text-xs mb-0.5">
                <span className="text-rose-400">❤️ HP</span>
                <span className="text-white">{character.stats.hp}/{character.stats.maxHp}</span>
              </div>
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${hpPercent > 60 ? "bg-green-500" : hpPercent > 30 ? "bg-yellow-500" : "bg-red-500"}`}
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-0.5">
                <span className="text-blue-400">⭐ XP</span>
                <span className="text-white">{character.stats.xp}/{xpToNext}</span>
              </div>
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${xpPercent}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-700/40 rounded-2xl p-5">
      {/* Avatar + Identity */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-800 flex items-center justify-center text-4xl border-2 border-amber-400/60 shadow-xl shadow-amber-900/50 shrink-0 relative">
          {character.emoji}
          <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full border border-slate-900">
            {character.stats.level}
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-amber-300 font-cinzel leading-tight">{character.name}</h2>
          <p className="text-amber-500/80 text-sm font-medium italic">{character.title}</p>
          <p className="text-slate-400 text-xs mt-1">{character.role}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-amber-900/50 text-amber-300 text-xs px-2 py-0.5 rounded-full border border-amber-700/40">
              ⚖️ Karma: {character.karma}
            </span>
          </div>
        </div>
      </div>

      {/* HP Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-rose-400 font-semibold">❤️ Health</span>
          <span className="text-white font-mono">{character.stats.hp} / {character.stats.maxHp}</span>
        </div>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              hpPercent > 60 ? "bg-gradient-to-r from-green-600 to-emerald-400"
              : hpPercent > 30 ? "bg-gradient-to-r from-yellow-600 to-amber-400"
              : "bg-gradient-to-r from-red-700 to-red-500"
            }`}
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>

      {/* XP Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-blue-400 font-semibold">⭐ Experience</span>
          <span className="text-white font-mono">{character.stats.xp} / {xpToNext} XP</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-700 to-indigo-400 transition-all duration-700"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          { label: "⚔️ Attack", value: character.stats.attack, color: "text-red-400" },
          { label: "🛡️ Defense", value: character.stats.defense, color: "text-blue-400" },
        ].map(s => (
          <div key={s.label} className="bg-slate-800/60 rounded-lg p-2.5 border border-slate-700">
            <p className={`text-xs ${s.color} font-semibold`}>{s.label}</p>
            <p className="text-xl font-bold text-white mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Inventory */}
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-widest mb-2 font-semibold">Inventory</p>
        <div className="flex flex-wrap gap-2">
          {character.inventory.map(item => (
            <div key={item.id} className="bg-slate-800/60 border border-slate-600 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
              <span className="text-base">{item.icon}</span>
              <div>
                <p className="text-xs text-white font-medium leading-tight">{item.name}</p>
                <p className="text-xs text-slate-400">{item.effect}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
