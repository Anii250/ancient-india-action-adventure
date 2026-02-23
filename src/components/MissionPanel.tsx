import { Mission } from "../data/gameData";

type Props = {
  missions: Mission[];
  currentMissionIndex: number;
  accentColor: string;
  textColor: string;
};

export function MissionPanel({ missions, currentMissionIndex, textColor }: Props) {
  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-4">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">📋 Level Missions</h3>
      <div className="space-y-2.5">
        {missions.map((mission, idx) => {
          const isActive = idx === currentMissionIndex && !mission.completed;
          const isCompleted = mission.completed;
          const isLocked = idx > currentMissionIndex; void isLocked;

          return (
            <div
              key={mission.id}
              className={`rounded-xl border p-3 transition-all ${
                isCompleted
                  ? "border-green-700/50 bg-green-950/30"
                  : isActive
                  ? "border-amber-600/60 bg-amber-950/30"
                  : "border-slate-700/50 bg-slate-800/30 opacity-50"
              }`}
            >
              <div className="flex items-start gap-2.5">
                {/* Status Icon */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 mt-0.5 ${
                  isCompleted ? "bg-green-700 text-white"
                  : isActive ? "bg-amber-700 text-white animate-pulse"
                  : "bg-slate-700 text-slate-400"
                }`}>
                  {isCompleted ? "✓" : isActive ? `${idx + 1}` : "🔒"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`font-semibold text-sm ${isCompleted ? "text-green-400" : isActive ? textColor : "text-slate-500"}`}>
                      {mission.title}
                    </p>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full border ${
                      mission.type === "combat" ? "border-red-700/50 text-red-400 bg-red-950/30"
                      : mission.type === "puzzle" ? "border-purple-700/50 text-purple-400 bg-purple-950/30"
                      : mission.type === "dialogue" ? "border-blue-700/50 text-blue-400 bg-blue-950/30"
                      : "border-teal-700/50 text-teal-400 bg-teal-950/30"
                    }`}>
                      {mission.type === "combat" ? "⚔️" : mission.type === "puzzle" ? "🧩" : mission.type === "dialogue" ? "💬" : "🌿"} {mission.type}
                    </span>
                  </div>

                  {(isActive || isCompleted) && (
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">{mission.description}</p>
                  )}

                  {isActive && (
                    <div className="mt-2 bg-black/40 rounded-lg p-2 border border-amber-700/30">
                      <p className="text-xs text-amber-300">🎯 <span className="font-semibold">Objective:</span> {mission.objective}</p>
                    </div>
                  )}

                  {(isActive || isCompleted) && (
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-blue-400">+{mission.reward.xp} XP</span>
                      {mission.reward.karma && <span className="text-xs text-amber-400">+{mission.reward.karma} Karma</span>}
                      {mission.reward.item && <span className="text-xs text-purple-400">🎁 {mission.reward.item.name}</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
