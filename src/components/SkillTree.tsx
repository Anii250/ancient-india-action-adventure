import { useState } from "react";
import { Skill, Character } from "../data/gameData";

type Props = {
  skills: Skill[];
  player: Character;
  onUnlock: (skillId: string) => void;
  onClose: () => void;
};

export function SkillTree({ skills, player, onUnlock, onClose }: Props) {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-950 to-slate-950 p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-purple-400 font-cinzel">⚡ Skill Tree</h2>
            <p className="text-slate-400 text-sm">Spend XP to unlock powerful abilities</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-slate-900/80 border border-blue-700/40 rounded-xl px-4 py-2">
              <p className="text-xs text-slate-400">Available XP</p>
              <p className="text-xl font-bold text-blue-400">{player.stats.xp}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white text-sm border border-slate-700 px-3 py-1.5 rounded-lg transition-all">
              ← Back
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill) => (
            <div
              key={skill.id}
              onClick={() => !skill.unlocked && setSelectedSkill(skill)}
              className={`rounded-xl border p-4 transition-all cursor-pointer ${
                skill.unlocked
                  ? "border-green-500 bg-green-950/30"
                  : player.stats.xp >= skill.cost
                  ? "border-purple-500 bg-purple-950/30 hover:scale-105"
                  : "border-slate-700 bg-slate-900/30 opacity-60"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                  skill.unlocked ? "bg-green-700" : "bg-slate-700"
                }`}>
                  {skill.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`font-bold ${skill.unlocked ? "text-green-400" : "text-white"}`}>
                      {skill.name}
                    </h3>
                    {skill.unlocked && <span className="text-xs bg-green-700 text-white px-2 py-0.5 rounded-full">UNLOCKED</span>}
                  </div>
                  <p className="text-slate-400 text-xs mt-1">{skill.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs font-semibold ${skill.unlocked ? "text-green-400" : "text-purple-400"}`}>
                      {skill.unlocked ? "✓ Active" : `${skill.cost} XP`}
                    </span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-400">{skill.effect}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedSkill && !selectedSkill.unlocked && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedSkill(null)}>
            <div className="bg-slate-900 border border-purple-700 rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
              <div className="text-center mb-4">
                <div className="text-5xl mb-3">{selectedSkill.icon}</div>
                <h3 className="text-2xl font-bold text-purple-400 font-cinzel">{selectedSkill.name}</h3>
                <p className="text-slate-400 text-sm mt-2">{selectedSkill.description}</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-4 mb-4">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Effect</p>
                <p className="text-white text-sm">{selectedSkill.effect}</p>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-400">Cost:</span>
                <span className="text-purple-400 font-bold">{selectedSkill.cost} XP</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onUnlock(selectedSkill.id);
                    setSelectedSkill(null);
                  }}
                  className="flex-1 bg-purple-700 hover:bg-purple-600 text-white font-bold py-3 rounded-xl transition-all"
                >
                  Unlock Skill
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
