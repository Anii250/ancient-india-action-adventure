import { useState, useEffect } from "react";
import { Level } from "../data/gameData";

type Props = {
  level: Level;
  onComplete: (success: boolean) => void;
  onFail: () => void;
};

const STEALTH_AREAS = [
  { id: "forest_path", name: "Forest Path", difficulty: 3, obstacles: ["Patrol", "Trap"] },
  { id: "camp_perimeter", name: "Camp Perimeter", difficulty: 4, obstacles: ["Patrol", "Guard", "Watch Tower"] },
  { id: "temple_grounds", name: "Temple Grounds", difficulty: 4, obstacles: ["Patrol", "Guard", "Trap", "Watch Tower"] },
];

export function StealthScreen({ level, onComplete, onFail }: Props) {
  const [currentArea, setCurrentArea] = useState(0);
  const [detectionMeter, setDetectionMeter] = useState(0);
  const [actions, setActions] = useState<string[]>([]);
  const [isMoving, setIsMoving] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [success, setSuccess] = useState(false);

  const area = STEALTH_AREAS[currentArea];
  const maxDetection = 100;

  useEffect(() => {
    if (detectionMeter >= maxDetection && !gameOver) {
      setGameOver(true);
      setTimeout(() => onFail(), 2000);
    }
  }, [detectionMeter, gameOver, onFail]);

  const handleAction = (action: string, detectionRisk: number) => {
    if (gameOver || success) return;
    
    setIsMoving(true);
    setActions(prev => [...prev, action]);
    
    const newDetection = Math.min(maxDetection, detectionMeter + detectionRisk + Math.floor(Math.random() * 10));
    setDetectionMeter(newDetection);
    
    setTimeout(() => {
      setIsMoving(false);
      
      if (newDetection >= maxDetection) {
        setGameOver(true);
        setTimeout(() => onFail(), 2000);
      } else if (currentArea >= STEALTH_AREAS.length - 1) {
        setSuccess(true);
        setTimeout(() => onComplete(true), 2000);
      }
    }, 800);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-950 via-slate-950 to-slate-950 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🤫</div>
          <h2 className="text-3xl font-bold text-green-400 font-cinzel mb-3">Stealth Complete!</h2>
          <p className="text-slate-300 mb-6">You navigated through without being detected!</p>
          <p className="text-slate-400 text-sm">Actions taken: {actions.length}</p>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-950 via-slate-950 to-slate-950 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🚨</div>
          <h2 className="text-3xl font-bold text-red-400 font-cinzel mb-3">Detected!</h2>
          <p className="text-slate-300 mb-6">You were spotted by the enemy!</p>
          <p className="text-slate-400 text-sm">Detection level: {detectionMeter}%</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4 md:p-6">
      <div className="max-w-xl mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={onFail} className="text-slate-400 hover:text-white text-sm border border-slate-700 px-3 py-1.5 rounded-lg">← Abort</button>
          <div>
            <p className={`text-xs font-bold uppercase ${level.textColor}`}>Stealth Mission</p>
            <p className="text-white font-bold font-cinzel">{area.name}</p>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Detection Level</span>
            <span className={`text-sm font-bold ${detectionMeter > 70 ? "text-red-400" : detectionMeter > 40 ? "text-yellow-400" : "text-green-400"}`}>
              {detectionMeter}%
            </span>
          </div>
          <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className={`h-full transition-all duration-500 ${
                detectionMeter > 70 ? "bg-red-500" : detectionMeter > 40 ? "bg-yellow-500" : "bg-green-500"
              }`}
              style={{ width: `${detectionMeter}%` }}
            />
          </div>
          {detectionMeter > 70 && (
            <p className="text-red-400 text-xs mt-2 animate-pulse">⚠️ High alert! Move carefully!</p>
          )}
        </div>

        <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🗺️</span>
            <div>
              <p className="text-amber-300 font-bold text-sm">Area {currentArea + 1} of {STEALTH_AREAS.length}</p>
              <p className="text-slate-400 text-xs">{area.name}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {area.obstacles.map(obs => (
              <span key={obs} className="text-xs bg-red-900/50 text-red-300 px-2 py-1 rounded-full border border-red-700/50">
                ⚠️ {obs}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleAction("Crouch", 5)}
            disabled={isMoving}
            className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-medium py-4 rounded-xl transition-all border border-slate-600"
          >
            <div className="text-2xl mb-1">🧎</div>
            <div className="text-sm">Crouch</div>
            <div className="text-xs text-slate-400">+5 detection</div>
          </button>
          <button
            onClick={() => handleAction("Sneak", 10)}
            disabled={isMoving}
            className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-medium py-4 rounded-xl transition-all border border-slate-600"
          >
            <div className="text-2xl mb-1">🤫</div>
            <div className="text-sm">Sneak</div>
            <div className="text-xs text-slate-400">+10 detection</div>
          </button>
          <button
            onClick={() => handleAction("Distract", 15)}
            disabled={isMoving}
            className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-medium py-4 rounded-xl transition-all border border-slate-600"
          >
            <div className="text-2xl mb-1">🪶</div>
            <div className="text-sm">Distract</div>
            <div className="text-xs text-slate-400">+15 detection</div>
          </button>
          <button
            onClick={() => handleAction("Wait", 3)}
            disabled={isMoving}
            className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-medium py-4 rounded-xl transition-all border border-slate-600"
          >
            <div className="text-2xl mb-1">⏳</div>
            <div className="text-sm">Wait</div>
            <div className="text-xs text-slate-400">+3 detection</div>
          </button>
        </div>

        <button
          onClick={() => {
            handleAction("Advance", 20);
            if (currentArea < STEALTH_AREAS.length - 1) {
              setCurrentArea(c => c + 1);
            }
          }}
          disabled={isMoving}
          className="w-full bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all border border-green-500/30"
        >
          <div className="text-xl mb-1">➡️</div>
          <div className="text-sm">Advance to Next Area</div>
          <div className="text-xs text-slate-400">+20 detection</div>
        </button>

        {actions.length > 0 && (
          <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-3">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Recent Actions</p>
            <div className="flex flex-wrap gap-1">
              {actions.slice(-5).map((action, i) => (
                <span key={i} className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                  {action}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
