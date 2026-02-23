import { useState, useEffect } from "react";
import { Level } from "../data/gameData";

type Props = {
  level: Level;
  onComplete: (success: boolean) => void;
  onFail: () => void;
};

const ESCORT_STAGES = [
  { id: 1, name: "Village Gate", enemies: 2 },
  { id: 2, name: "Forest Path", enemies: 3 },
  { id: 3, name: "River Crossing", enemies: 4 },
  { id: 4, name: "Cave Entrance", enemies: 5 },
];

export function EscortScreen({ level, onComplete, onFail }: Props) {
  const [currentStage, setCurrentStage] = useState(0);
  const [priestsEscorted, setPriestsEscorted] = useState(0);
  const [totalPriests] = useState(20);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isMoving, setIsMoving] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0 && !gameOver) {
      setGameOver(true);
      setTimeout(() => onFail(), 2000);
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(t => Math.max(0, t - 1));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, gameOver, onFail]);

  const handleMove = () => {
    if (gameOver || success || isMoving) return;
    
    setIsMoving(true);
    
    setTimeout(() => {
      const priestsThisMove = Math.floor(Math.random() * 3) + 1;
      const newEscorted = Math.min(totalPriests, priestsEscorted + priestsThisMove);
      setPriestsEscorted(newEscorted);
      setIsMoving(false);
      
      if (newEscorted >= totalPriests) {
        setSuccess(true);
        setTimeout(() => onComplete(true), 2000);
      } else if (currentStage >= ESCORT_STAGES.length - 1) {
        setCurrentStage(c => c + 1);
      }
    }, 1000);
  };

  const handleDefend = () => {
    if (gameOver || success || isMoving) return;
    
    setIsMoving(true);
    
    setTimeout(() => {
      const lostPriests = Math.floor(Math.random() * 2);
      const newEscorted = Math.max(0, priestsEscorted - lostPriests);
      setPriestsEscorted(newEscorted);
      setIsMoving(false);
      
      if (newEscorted <= 0) {
        setGameOver(true);
        setTimeout(() => onFail(), 2000);
      }
    }, 800);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-950 via-slate-950 to-slate-950 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-green-400 font-cinzel mb-3">All Priests Safe!</h2>
          <p className="text-slate-300 mb-6">You successfully escorted all {totalPriests} priests to safety!</p>
          <p className="text-slate-400 text-sm">Time remaining: {timeLeft}s</p>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-950 via-slate-950 to-slate-950 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">💔</div>
          <h2 className="text-3xl font-bold text-red-400 font-cinzel mb-3">Mission Failed</h2>
          <p className="text-slate-300 mb-6">Some priests were lost along the way...</p>
          <p className="text-slate-400 text-sm">Priests escorted: {priestsEscorted}/{totalPriests}</p>
        </div>
      </div>
    );
  }

  const stage = ESCORT_STAGES[currentStage];
  const progressPercent = (priestsEscorted / totalPriests) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4 md:p-6">
      <div className="max-w-xl mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={onFail} className="text-slate-400 hover:text-white text-sm border border-slate-700 px-3 py-1.5 rounded-lg">← Abort</button>
          <div>
            <p className={`text-xs font-bold uppercase ${level.textColor}`}>Escort Mission</p>
            <p className="text-white font-bold font-cinzel">{stage.name}</p>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Time Remaining</span>
            <span className={`text-sm font-bold ${timeLeft < 30 ? "text-red-400 animate-pulse" : "text-amber-400"}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className={`h-full transition-all duration-500 ${
                timeLeft < 30 ? "bg-red-500" : "bg-amber-500"
              }`}
              style={{ width: `${(timeLeft / 180) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Priests Escorted</span>
            <span className="text-sm font-bold text-green-400">{priestsEscorted} / {totalPriests}</span>
          </div>
          <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-2xl">👨‍🦳</span>
            <span className="text-slate-300 text-sm">{priestsEscorted} priests safe</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🗺️</span>
            <div>
              <p className="text-amber-300 font-bold text-sm">Stage {stage.id} of {ESCORT_STAGES.length}</p>
              <p className="text-slate-400 text-xs">{stage.name}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: stage.enemies }).map((_, i) => (
              <span key={i} className="text-xs bg-red-900/50 text-red-300 px-2 py-1 rounded-full border border-red-700/50">
                ⚔️ Enemy Patrol
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleMove}
            disabled={isMoving}
            className="bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all border border-green-500/30"
          >
            <div className="text-2xl mb-1">🚶</div>
            <div className="text-sm">Move Forward</div>
            <div className="text-xs text-slate-400">+1-3 priests</div>
          </button>
          <button
            onClick={handleDefend}
            disabled={isMoving}
            className="bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all border border-blue-500/30"
          >
            <div className="text-2xl mb-1">🛡️</div>
            <div className="text-sm">Defend</div>
            <div className="text-xs text-slate-400">Protect priests</div>
          </button>
        </div>

        <div className="bg-indigo-950/40 border border-indigo-800/30 rounded-xl p-3">
          <p className="text-indigo-300 text-xs font-semibold mb-1">💡 Mission Objective</p>
          <p className="text-slate-300 text-xs leading-relaxed">Get all {totalPriests} priests to the cave monastery before time runs out. Defend them from enemy patrols!</p>
        </div>
      </div>
    </div>
  );
}
