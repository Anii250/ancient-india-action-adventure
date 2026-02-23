import { Character } from "../data/gameData";

type Props = {
  player: Character;
  onClose: () => void;
};

export function InventoryPanel({ player, onClose }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-950 via-slate-950 to-slate-950 p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-amber-400 font-cinzel">🎒 Inventory</h2>
            <p className="text-slate-400 text-sm">Your items and equipment</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-slate-900/80 border border-amber-700/40 rounded-xl px-4 py-2">
              <p className="text-xs text-slate-400">Gold</p>
              <p className="text-xl font-bold text-amber-400">{player.gold} 🪙</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white text-sm border border-slate-700 px-3 py-1.5 rounded-lg transition-all">
              ← Back
            </button>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Equipment</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {player.inventory.map((item, idx) => (
              <div key={idx} className="bg-slate-800/60 border border-slate-600 rounded-xl p-3 hover:border-amber-600 transition-all cursor-pointer group">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-sm text-white font-medium">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.effect}</p>
                  </div>
                </div>
                {item.used && (
                  <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">Used</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Character Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Attack", value: player.stats.attack, icon: "⚔️", color: "text-red-400" },
              { label: "Defense", value: player.stats.defense, icon: "🛡️", color: "text-blue-400" },
              { label: "Max HP", value: player.stats.maxHp, icon: "❤️", color: "text-green-400" },
              { label: "Karma", value: player.karma, icon: "⚖️", color: "text-amber-400" },
            ].map(stat => (
              <div key={stat.label} className="bg-slate-800/60 rounded-xl p-3 border border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{stat.icon}</span>
                  <div>
                    <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-slate-400">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-950/40 border border-indigo-800/30 rounded-2xl p-4">
          <h3 className="text-sm font-bold text-indigo-300 mb-2">💡 Tips</h3>
          <ul className="space-y-1 text-xs text-slate-300">
            <li>• Complete missions to earn more items and gold</li>
            <li>• Use items strategically in combat</li>
            <li>• Unlock skills in the Skill Tree to boost your abilities</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
