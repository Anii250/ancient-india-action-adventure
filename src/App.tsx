import { useState, useEffect } from "react";
import {
  GAME_LEVELS,
  PLAYER_CHARACTER,
  GITA_QUESTIONS,
  GURUKUL_RIDDLE,
  VILLAGE_CHOICES,
  SKILL_TREE,
  STAR_MAP_PUZZLE,
  Character,
  Enemy,
  Skill,
} from "./data/gameData";
import { CharacterCard } from "./components/CharacterCard";
import { CombatScreen } from "./components/CombatScreen";
import { MissionPanel } from "./components/MissionPanel";
import { SkillTree } from "./components/SkillTree";
import { InventoryPanel } from "./components/InventoryPanel";
import { StealthScreen } from "./components/StealthScreen";
import { EscortScreen } from "./components/EscortScreen";

type Screen =
  | "splash"
  | "title"
  | "level_map"
  | "level_intro"
  | "mission_hub"
  | "dialogue"
  | "puzzle"
  | "choice"
  | "combat"
  | "stealth"
  | "escort"
  | "resource"
  | "level_complete"
  | "game_over"
  | "final_victory"
  | "skill_tree"
  | "inventory";

// ─── Game State ───────────────────────────────────────────────────────
export function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [player, setPlayer] = useState<Character>(PLAYER_CHARACTER);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [unlockedLevels, setUnlockedLevels] = useState([0]);
  const [missionIndex, setMissionIndex] = useState(0);
  const [missions, setMissions] = useState(GAME_LEVELS[0].missions);
  const [splashText, setSplashText] = useState(0);
  const [dialogueStep, setDialogueStep] = useState(0);
  const [dialogueNpc, setDialogueNpc] = useState(0);
  const [puzzleAnswered, setPuzzleAnswered] = useState<number | null>(null);
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [choiceScenario, setChoiceScenario] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [combatEnemy, setCombatEnemy] = useState<Enemy | null>(null);
  const [karmaFlash, setKarmaFlash] = useState(false);
  const [skills, setSkills] = useState<Skill[]>(SKILL_TREE);
  const [selectedNpc, setSelectedNpc] = useState<string | null>(null);
  const [cluesFound, setCluesFound] = useState(0);
  const [trapsDisarmed, setTrapsDisarmed] = useState(0);

  const level = GAME_LEVELS[currentLevelIndex];
  const currentMission = missions[missionIndex];

  // ── Splash sequence ──────────────────────────────────────────────────
  useEffect(() => {
    if (screen !== "splash") return;
    const lines = [
      "🕉️  In the beginning was the Word...",
      "And the Word was Dharma.",
      "A land of ancient wisdom awaits you.",
      "Dharma Warriors: Rise of Arjun",
    ];
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setSplashText(i);
      if (i >= lines.length - 1) {
        clearInterval(timer);
        setTimeout(() => setScreen("title"), 2000);
      }
    }, 1800);
    return () => clearInterval(timer);
  }, [screen]);

  // ── Helpers ──────────────────────────────────────────────────────────
  const flashKarma = () => {
    setKarmaFlash(true);
    setTimeout(() => setKarmaFlash(false), 1000);
  };

  const showMsg = (msg: string) => {
    setFeedbackMsg(msg);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 3000);
  };

  const awardXP = (xp: number, karma = 0, gold = 0, msg = "") => {
    setPlayer((p) => ({
      ...p,
      stats: {
        ...p.stats,
        xp: p.stats.xp + xp,
        level: Math.floor((p.stats.xp + xp) / 200) + 1,
      },
      karma: p.karma + karma,
      gold: p.gold + gold,
    }));
    if (karma > 0) flashKarma();
    if (msg) showMsg(msg);
  };

  const completeMission = (idx: number) => {
    const updated = [...missions];
    updated[idx] = { ...updated[idx], completed: true };
    setMissions(updated);
    const reward = level.missions[idx].reward;
    awardXP(
      reward.xp,
      reward.karma || 0,
      reward.gold || 0,
      `✅ Mission complete! +${reward.xp} XP${reward.karma ? ` +${reward.karma} Karma` : ""}${reward.gold ? ` +${reward.gold} Gold` : ""}`,
    );
    if (reward.item) {
      setPlayer((p) => ({ ...p, inventory: [...p.inventory, reward.item!] }));
    }
  };

  const advanceMission = () => {
    const next = missionIndex + 1;
    if (next >= level.missions.length) {
      setTimeout(() => setScreen("level_complete"), 400);
    } else {
      setMissionIndex(next);
      setDialogueStep(0);
      setDialogueNpc(0);
      setPuzzleAnswered(null);
      setPuzzleIndex(0);
      setChoiceScenario(0);
      setCluesFound(0);
      setTrapsDisarmed(0);
      setScreen("mission_hub");
    }
  };

  const startLevel = (idx: number) => {
    setCurrentLevelIndex(idx);
    setMissions([...GAME_LEVELS[idx].missions]);
    setMissionIndex(0);
    setDialogueStep(0);
    setDialogueNpc(0);
    setPuzzleAnswered(null);
    setPuzzleIndex(0);
    setChoiceScenario(0);
    setCluesFound(0);
    setTrapsDisarmed(0);
    setScreen("level_intro");
  };

  const handleCombatVictory = (updatedPlayer: Character) => {
    setPlayer(updatedPlayer);
    completeMission(missionIndex);
    setTimeout(() => advanceMission(), 500);
  };

  const handleCombatDefeat = () => {
    setScreen("game_over");
  };

  const handleCombatFlee = () => {
    showMsg("You fled the battle. Regroup and try again!");
    setScreen("mission_hub");
  };

  const unlockSkill = (skillId: string) => {
    const skill = skills.find((s) => s.id === skillId);
    if (!skill || skill.unlocked || player.stats.xp < skill.cost) return;

    setSkills((prev) =>
      prev.map((s) => (s.id === skillId ? { ...s, unlocked: true } : s)),
    );
    setPlayer((p) => ({
      ...p,
      stats: { ...p.stats, xp: p.stats.xp - skill.cost },
    }));
    showMsg(`✨ ${skill.name} unlocked!`);
  };

  // ─────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────

  // ── SPLASH ───────────────────────────────────────────────────────────
  if (screen === "splash") {
    const lines = [
      "🕉️  In the beginning was the Word...",
      "And the Word was Dharma.",
      "A land of ancient wisdom awaits you.",
      "Dharma Warriors: Rise of Arjun",
    ];
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-amber-950 to-black flex items-center justify-center p-8">
        <div className="text-center max-w-lg">
          <div className="text-7xl mb-8 animate-pulse">🕉️</div>
          {lines.map((line, i) => (
            <p
              key={i}
              className={`transition-all duration-1000 font-cinzel ${i <= splashText
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
                } ${i === 3 ? "text-3xl font-bold text-amber-400 mt-6" : "text-xl text-amber-100 mb-3"}`}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    );
  }

  // ── TITLE SCREEN ─────────────────────────────────────────────────────
  if (screen === "title") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-amber-950 to-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.08),transparent_70%)]" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-center gap-4 mb-4">
              <span className="text-5xl">🏹</span>
              <span className="text-5xl">🕉️</span>
              <span className="text-5xl">⚔️</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-orange-500 font-cinzel mb-3 leading-tight">
              DHARMA WARRIORS
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-amber-400 font-cinzel tracking-widest mb-2">
              Rise of Arjun
            </h2>
            <p className="text-slate-400 text-sm md:text-base italic">
              "An action-adventure through the living world of ancient India"
            </p>
          </div>

          <div className="bg-slate-900/60 border border-amber-700/40 rounded-2xl p-5 mb-8 text-left">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-800 flex items-center justify-center text-3xl border-2 border-amber-500/50">
                🏹
              </div>
              <div>
                <h3 className="text-2xl font-bold text-amber-300 font-cinzel">
                  Arjun
                </h3>
                <p className="text-amber-600 text-sm">
                  The Seeker of Dharma · Warrior-Sage
                </p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              A young warrior trained by the legendary Guru Dronacharya.
              Navigate ancient India's greatest moral dilemmas — from the sacred
              Gurukul to the plains of Kurukshetra — and discover your true
              Dharma.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-8">
            {GAME_LEVELS.map((lv, i) => (
              <div
                key={lv.id}
                className={`rounded-xl border p-3 text-left ${i === 0 ? "border-amber-600/60 bg-amber-950/30" : "border-slate-700/40 bg-slate-900/30 opacity-60"}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-500">
                    LEVEL {lv.id}
                  </span>
                  {i === 0 && (
                    <span className="text-xs text-amber-400 bg-amber-950 px-1.5 rounded-full border border-amber-700/40">
                      AVAILABLE
                    </span>
                  )}
                  {i > 0 && <span className="text-xs text-slate-600">🔒</span>}
                </div>
                <p className="text-white text-sm font-semibold leading-tight">
                  {lv.title}
                </p>
                <p className="text-slate-400 text-xs mt-0.5">{lv.region}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setScreen("level_map")}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-4 px-12 rounded-xl text-xl transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-amber-900/50 font-cinzel tracking-wide border border-amber-400/30"
          >
            🕉️ Begin Your Journey
          </button>
          <p className="text-slate-500 text-xs mt-4">
            4 Levels · 7 Missions Each · Real Combat · Ancient Wisdom
          </p>
        </div>
      </div>
    );
  }

  // ── LEVEL MAP ────────────────────────────────────────────────────────
  if (screen === "level_map") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-amber-400 font-cinzel mb-1">
              🗺️ Journey Map
            </h2>
            <p className="text-slate-400 text-sm">
              Choose your next destination
            </p>
          </div>

          <div className="mb-6">
            <CharacterCard character={player} compact />
          </div>

          <div className="space-y-4">
            {GAME_LEVELS.map((lv, idx) => {
              const isUnlocked = unlockedLevels.includes(idx);
              const isCompleted = unlockedLevels.includes(idx + 1);
              return (
                <div
                  key={lv.id}
                  className={`rounded-2xl border-2 p-5 transition-all ${isUnlocked
                    ? `bg-gradient-to-r ${lv.bgGradient} border-amber-600/50 cursor-pointer hover:border-amber-400`
                    : "bg-slate-900/40 border-slate-700/40 opacity-60 cursor-not-allowed"
                    }`}
                  onClick={() => isUnlocked && startLevel(idx)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 border ${isUnlocked ? "border-amber-500/50 bg-amber-900/50" : "border-slate-600 bg-slate-800"}`}
                    >
                      {isCompleted ? "✅" : isUnlocked ? "▶️" : "🔒"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className={`text-xs font-bold uppercase tracking-widest ${lv.textColor}`}
                        >
                          Level {lv.id}
                        </span>
                        <span className="text-xs text-slate-500">·</span>
                        <span className="text-xs text-slate-400">{lv.era}</span>
                        {isCompleted && (
                          <span className="text-xs text-green-400 bg-green-950 px-1.5 rounded-full border border-green-700/40">
                            ✓ Completed
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white font-cinzel mb-0.5">
                        {lv.title}
                      </h3>
                      <p className="text-slate-400 text-xs mb-2">{lv.region}</p>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {lv.subtitle}
                      </p>
                      {isUnlocked && (
                        <div className="flex items-center gap-3 mt-3">
                          <span className="text-xs text-slate-400">
                            {lv.missions.length} Missions
                          </span>
                          <span className="text-xs text-slate-400">·</span>
                          <span className="text-xs text-slate-400">
                            {lv.boss?.name}
                          </span>
                          <span className="text-xs text-slate-400">·</span>
                          <span className={`text-xs ${lv.textColor}`}>
                            Learn: {lv.lessonTitle.split(":")[0]}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setScreen("title")}
            className="mt-6 w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 rounded-xl transition-all border border-slate-700"
          >
            ← Back to Title
          </button>
        </div>
      </div>
    );
  }

  // ── LEVEL INTRO ───────────────────────────────────────────────────────
  if (screen === "level_intro") {
    return (
      <div
        className={`min-h-screen bg-gradient-to-b ${level.bgGradient} p-4 md:p-6`}
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <span
              className={`text-xs font-bold uppercase tracking-widest ${level.textColor} border rounded-full px-3 py-1`}
              style={{ borderColor: level.accentColor + "50" }}
            >
              Level {level.id} · {level.era}
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-white font-cinzel mt-3 mb-1">
              {level.title}
            </h1>
            <p className="text-slate-400 text-sm italic">{level.region}</p>
          </div>

          <div className="space-y-3 mb-6">
            {level.story.map((line, i) => (
              <div
                key={i}
                className={`bg-slate-900/60 border rounded-xl p-4 border-slate-700/50`}
              >
                <p className="text-slate-200 text-sm leading-relaxed">
                  {i === 0 && "📍 "}
                  {i > 0 && i < level.story.length - 1 && ""}
                  {i === level.story.length - 1 && "👉 "}
                  {line}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-indigo-950/60 border border-indigo-700/40 rounded-2xl p-5 mb-6">
            <h3 className="text-sm font-bold text-indigo-300 mb-2">
              {level.lessonTitle}
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {level.lesson}
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-700 rounded-2xl p-4 mb-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
              🎯 Your Missions
            </h3>
            {level.missions.map((m, i) => (
              <div key={m.id} className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-300 text-xs flex items-center justify-center font-bold shrink-0">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm text-white font-medium">{m.title}</p>
                  <p className="text-xs text-slate-400">{m.objective}</p>
                </div>
              </div>
            ))}
            {level.boss && (
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-700">
                <div className="w-6 h-6 rounded-full bg-red-900 text-red-300 text-xs flex items-center justify-center">
                  👑
                </div>
                <div>
                  <p className="text-sm text-red-300 font-medium">
                    Boss: {level.boss.name}
                  </p>
                  <p className="text-xs text-slate-400">{level.boss.title}</p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setScreen("mission_hub")}
            className="w-full font-bold py-4 text-xl rounded-xl transition-all hover:scale-105 active:scale-95 font-cinzel text-white border"
            style={{
              background: `linear-gradient(to right, ${level.accentColor}99, ${level.accentColor}66)`,
              borderColor: level.accentColor + "50",
            }}
          >
            ⚔️ Begin Level {level.id}
          </button>
        </div>
      </div>
    );
  }

  // ── MISSION HUB ───────────────────────────────────────────────────────
  if (screen === "mission_hub") {
    return (
      <div
        className={`min-h-screen bg-gradient-to-b ${level.bgGradient} p-4 md:p-6`}
      >
        <div className="max-w-2xl mx-auto space-y-4">
          {showFeedback && (
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-800 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-2xl border border-green-600 animate-bounce">
              {feedbackMsg}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <span
                className={`text-xs font-bold uppercase tracking-widest ${level.textColor}`}
              >
                Level {level.id}
              </span>
              <h2 className="text-xl font-bold text-white font-cinzel">
                {level.title}
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setScreen("skill_tree")}
                className="text-purple-400 hover:text-purple-300 text-sm border border-purple-700/50 px-3 py-1.5 rounded-lg transition-all"
              >
                ⚡ Skills
              </button>
              <button
                onClick={() => setScreen("inventory")}
                className="text-amber-400 hover:text-amber-300 text-sm border border-amber-700/50 px-3 py-1.5 rounded-lg transition-all"
              >
                🎒 Items
              </button>
              <button
                onClick={() => setScreen("level_map")}
                className="text-slate-400 hover:text-white text-sm border border-slate-700 px-3 py-1.5 rounded-lg transition-all"
              >
                🗺️ Map
              </button>
            </div>
          </div>

          <CharacterCard character={player} compact />

          {karmaFlash && (
            <div className="text-center text-amber-400 text-sm font-bold animate-pulse">
              ⚖️ Karma increased!
            </div>
          )}

          <MissionPanel
            missions={missions}
            currentMissionIndex={missionIndex}
            accentColor={level.accentColor}
            textColor={level.textColor}
          />

          {!currentMission?.completed && currentMission && (
            <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-4">
              <h3
                className={`text-lg font-bold ${level.textColor} font-cinzel mb-1`}
              >
                {currentMission.title}
              </h3>
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                {currentMission.description}
              </p>

              <div className="bg-black/40 border border-amber-700/30 rounded-xl p-3 mb-4">
                <p className="text-amber-300 text-xs font-semibold mb-1">
                  🎯 Active Objective
                </p>
                <p className="text-slate-200 text-sm">
                  {currentMission.objective}
                </p>
              </div>

              <div className="flex items-center gap-2 mb-4 text-xs">
                <span className="text-slate-400">Difficulty:</span>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${i < currentMission.difficulty ? "text-amber-400" : "text-slate-700"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  if (currentMission.type === "dialogue") {
                    setSelectedNpc(level.npcs[dialogueNpc]?.id || null);
                    setScreen("dialogue");
                  } else if (currentMission.type === "puzzle")
                    setScreen("puzzle");
                  else if (currentMission.type === "choice")
                    setScreen("choice");
                  else if (currentMission.type === "combat") {
                    setCombatEnemy(level.boss!);
                    setScreen("combat");
                  } else if (currentMission.type === "stealth")
                    setScreen("stealth");
                  else if (currentMission.type === "escort") {
                    setScreen("escort");
                  } else if (currentMission.type === "resource") {
                    setCluesFound(0);
                    setTrapsDisarmed(0);
                    setScreen("resource");
                  }
                }}
                className="w-full font-bold py-3.5 rounded-xl text-white text-base transition-all hover:scale-105 active:scale-95 border"
                style={{
                  background: `linear-gradient(to right, ${level.accentColor}cc, ${level.accentColor}88)`,
                  borderColor: level.accentColor + "50",
                }}
              >
                {currentMission.type === "combat"
                  ? "⚔️ Enter Combat"
                  : currentMission.type === "puzzle"
                    ? "🧩 Solve the Puzzle"
                    : currentMission.type === "dialogue"
                      ? "💬 Start Dialogue"
                      : currentMission.type === "stealth"
                        ? "🤫 Begin Stealth Mission"
                        : currentMission.type === "escort"
                          ? "🚶 Start Escort"
                          : currentMission.type === "resource"
                            ? "🔍 Gather Resources"
                            : "🌿 Make Your Choice"}{" "}
                →
              </button>
            </div>
          )}

          <div className="bg-indigo-950/40 border border-indigo-800/30 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-indigo-300 mb-1.5">
              {level.lessonTitle}
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              {level.lesson}
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
              👥 Characters in This Level
            </h3>
            <div className="space-y-2">
              {level.npcs.map((npc) => (
                <div
                  key={npc.id}
                  className="flex items-center gap-3 bg-slate-800/40 rounded-xl p-3 border border-slate-700/40"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xl shrink-0">
                    {npc.emoji}
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${npc.color}`}>
                      {npc.name}
                    </p>
                    <p className="text-slate-400 text-xs">{npc.title}</p>
                    <p className="text-slate-300 text-xs italic mt-0.5">
                      "{npc.dialogues[0].substring(0, 60)}..."
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── DIALOGUE SCREEN ─────────────────────────────────────────────────
  if (screen === "dialogue") {
    const npc =
      level.npcs.find((n) => n.id === selectedNpc) || level.npcs[dialogueNpc];
    const line =
      npc?.dialogues[Math.min(dialogueStep, npc.dialogues.length - 1)] || "";
    const atEnd = dialogueStep >= (npc?.dialogues.length || 1) - 1;

    return (
      <div
        className={`min-h-screen bg-gradient-to-b ${level.bgGradient} p-4 md:p-6`}
      >
        <div className="max-w-xl mx-auto space-y-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setScreen("mission_hub")}
              className="text-slate-400 hover:text-white text-sm border border-slate-700 px-3 py-1.5 rounded-lg"
            >
              ← Back
            </button>
            <div>
              <p className={`text-xs font-bold uppercase ${level.textColor}`}>
                Mission {missionIndex + 1} · Dialogue
              </p>
              <p className="text-white font-bold font-cinzel">
                {currentMission?.title}
              </p>
            </div>
          </div>

          <div className={`bg-slate-900/80 border rounded-2xl p-5`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-4xl border border-slate-600">
                {npc?.emoji}
              </div>
              <div>
                <p className={`text-lg font-bold font-cinzel ${npc?.color}`}>
                  {npc?.name}
                </p>
                <p className="text-slate-400 text-xs">{npc?.title}</p>
                <div className="flex gap-1 mt-1">
                  {npc?.dialogues.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 rounded-full w-6 ${i <= dialogueStep ? "bg-amber-500" : "bg-slate-700"}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-black/40 border border-slate-700 rounded-xl p-4 min-h-[80px] flex items-center">
              <p className="text-slate-200 text-sm leading-relaxed">{line}</p>
            </div>
          </div>

          {atEnd ? (
            <div className="space-y-3">
              <p className="text-amber-300 text-sm font-semibold">
                Your response:
              </p>
              {npc?.dialogues.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const nextNpc = dialogueNpc + 1;
                    if (nextNpc < level.npcs.length) {
                      setDialogueNpc(nextNpc);
                      setDialogueStep(0);
                      if (currentMission) completeMission(missionIndex);
                      advanceMission();
                    }
                  }}
                  className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-amber-600 text-white text-sm font-medium py-3 px-4 rounded-xl transition-all text-left"
                >
                  <span className="text-amber-400 mr-2">▶</span>Continue the
                  conversation
                </button>
              ))}
            </div>
          ) : (
            <button
              onClick={() => setDialogueStep((s) => s + 1)}
              className="w-full bg-amber-700 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-all"
            >
              Continue →
            </button>
          )}

          <div className="text-center text-slate-400 text-xs">
            Dialogue {dialogueStep + 1} of {npc?.dialogues.length || 1}
          </div>
        </div>
      </div>
    );
  }

  // ── PUZZLE SCREEN ────────────────────────────────────────────────────
  if (screen === "puzzle") {
    if (currentLevelIndex === 0) {
      return (
        <div
          className={`min-h-screen bg-gradient-to-b ${level.bgGradient} p-4 md:p-6`}
        >
          <div className="max-w-xl mx-auto space-y-5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setScreen("mission_hub")}
                className="text-slate-400 hover:text-white text-sm border border-slate-700 px-3 py-1.5 rounded-lg"
              >
                ← Back
              </button>
              <div>
                <p className={`text-xs font-bold uppercase ${level.textColor}`}>
                  Mission {missionIndex + 1} · Puzzle
                </p>
                <p className="text-white font-bold font-cinzel">
                  {currentMission?.title}
                </p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-amber-700/40 rounded-2xl p-6 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-amber-300 font-cinzel mb-4">
                A clue left at the scene...
              </h3>
              <div className="bg-black/50 border border-slate-700 rounded-xl p-5 mb-4">
                <p className="text-amber-200 text-base leading-relaxed italic font-serif">
                  {GURUKUL_RIDDLE.shloka}
                </p>
              </div>
              <p className="text-slate-400 text-sm">What was stolen?</p>
            </div>

            <div className="space-y-3">
              {GURUKUL_RIDDLE.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPuzzleAnswered(i);
                    if (i === GURUKUL_RIDDLE.correct) {
                      awardXP(75, 5, 0, "🧩 Riddle solved! +75 XP");
                      setTimeout(() => {
                        completeMission(missionIndex);
                        advanceMission();
                      }, 2000);
                    }
                  }}
                  disabled={puzzleAnswered !== null}
                  className={`w-full text-left text-sm font-medium py-3.5 px-5 rounded-xl border transition-all ${puzzleAnswered === null
                    ? "bg-slate-800 hover:bg-slate-700 border-slate-600 hover:border-amber-600 text-white"
                    : puzzleAnswered === i
                      ? i === GURUKUL_RIDDLE.correct
                        ? "bg-green-800 border-green-500 text-white"
                        : "bg-red-900 border-red-600 text-white"
                      : i === GURUKUL_RIDDLE.correct
                        ? "bg-green-900/50 border-green-700 text-green-300"
                        : "bg-slate-800 border-slate-600 text-slate-400 opacity-50"
                    }`}
                >
                  <span className="text-amber-400 mr-2">
                    {["A", "B", "C", "D"][i]}.
                  </span>{" "}
                  {opt}
                </button>
              ))}
            </div>

            {puzzleAnswered !== null && (
              <div
                className={`rounded-xl border p-4 ${puzzleAnswered === GURUKUL_RIDDLE.correct ? "bg-green-950/60 border-green-700" : "bg-red-950/60 border-red-700"}`}
              >
                <p
                  className={`text-sm font-bold mb-1 ${puzzleAnswered === GURUKUL_RIDDLE.correct ? "text-green-400" : "text-red-400"}`}
                >
                  {puzzleAnswered === GURUKUL_RIDDLE.correct
                    ? "✅ Correct!"
                    : "❌ Incorrect — The answer was A."}
                </p>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {GURUKUL_RIDDLE.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (currentLevelIndex === 2) {
      const q =
        GITA_QUESTIONS[Math.min(puzzleIndex, GITA_QUESTIONS.length - 1)];
      const allDone = puzzleIndex >= GITA_QUESTIONS.length;

      if (allDone) {
        return (
          <div
            className={`min-h-screen bg-gradient-to-b ${level.bgGradient} flex items-center justify-center p-4`}
          >
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4">📿</div>
              <h2 className="text-3xl font-bold text-amber-400 font-cinzel mb-3">
                Gita Mastered!
              </h2>
              <p className="text-slate-300 mb-6">
                You have understood the core teachings of the Bhagavad Gita.
              </p>
              <button
                onClick={() => {
                  completeMission(missionIndex);
                  advanceMission();
                }}
                className="bg-amber-700 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-xl"
              >
                ✅ Continue Mission
              </button>
            </div>
          </div>
        );
      }

      return (
        <div
          className={`min-h-screen bg-gradient-to-b ${level.bgGradient} p-4 md:p-6`}
        >
          <div className="max-w-xl mx-auto space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs font-bold uppercase ${level.textColor}`}>
                  Gita Quiz · {puzzleIndex + 1}/{GITA_QUESTIONS.length}
                </p>
                <p className="text-white font-bold font-cinzel">
                  Krishna's Questions
                </p>
              </div>
              <div className="flex gap-1">
                {GITA_QUESTIONS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-6 rounded-full ${i < puzzleIndex ? "bg-green-500" : i === puzzleIndex ? "bg-blue-400" : "bg-slate-700"}`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-blue-950/60 border border-blue-800/40 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🪈</span>
                <div>
                  <p className="text-blue-300 font-bold">Lord Krishna asks:</p>
                  <p className="text-slate-400 text-xs">
                    Bhagavad Gita · Question {puzzleIndex + 1}
                  </p>
                </div>
              </div>
              <p className="text-white text-base leading-relaxed font-medium">
                {q.question}
              </p>
            </div>

            <div className="space-y-3">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPuzzleAnswered(i);
                    if (i === q.correct) {
                      awardXP(30, 5, 0, `✅ Correct! +30 XP`);
                      setTimeout(() => {
                        setPuzzleAnswered(null);
                        setPuzzleIndex((p) => p + 1);
                      }, 2000);
                    } else {
                      setTimeout(() => {
                        setPuzzleAnswered(null);
                        setPuzzleIndex((p) => p + 1);
                      }, 2500);
                    }
                  }}
                  disabled={puzzleAnswered !== null}
                  className={`w-full text-left text-sm font-medium py-3.5 px-4 rounded-xl border transition-all ${puzzleAnswered === null
                    ? "bg-slate-800 hover:bg-slate-700 border-slate-600 hover:border-blue-500 text-white"
                    : puzzleAnswered === i
                      ? i === q.correct
                        ? "bg-green-800 border-green-500 text-white"
                        : "bg-red-900 border-red-600 text-white"
                      : i === q.correct
                        ? "bg-green-900/50 border-green-700 text-green-300"
                        : "bg-slate-800 border-slate-600 text-slate-400 opacity-50"
                    }`}
                >
                  <span className="text-blue-400 mr-2">
                    {["A", "B", "C", "D"][i]}.
                  </span>
                  {opt}
                </button>
              ))}
            </div>

            {puzzleAnswered !== null && (
              <div
                className={`rounded-xl border p-4 ${puzzleAnswered === q.correct ? "bg-green-950/60 border-green-700" : "bg-orange-950/60 border-orange-700"}`}
              >
                <p
                  className={`text-sm font-bold mb-1 ${puzzleAnswered === q.correct ? "text-green-400" : "text-orange-400"}`}
                >
                  {puzzleAnswered === q.correct
                    ? "✅ Correct!"
                    : "📖 Learn from this:"}
                </p>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {q.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (currentLevelIndex === 3) {
      return (
        <div
          className={`min-h-screen bg-gradient-to-b ${level.bgGradient} p-4 md:p-6`}
        >
          <div className="max-w-xl mx-auto space-y-5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setScreen("mission_hub")}
                className="text-slate-400 hover:text-white text-sm border border-slate-700 px-3 py-1.5 rounded-lg"
              >
                ← Back
              </button>
              <div>
                <p className={`text-xs font-bold uppercase ${level.textColor}`}>
                  Mission {missionIndex + 1} · Astronomy Puzzle
                </p>
                <p className="text-white font-bold font-cinzel">
                  The Vedic Star Map
                </p>
              </div>
            </div>

            <div className="bg-amber-950/60 border border-amber-800/40 rounded-2xl p-5">
              <div className="text-center text-4xl mb-3">⭐🌙⭐</div>
              <p className="text-amber-300 text-sm font-semibold mb-3">
                The temple ceiling shows a star map with an inscription from
                Aryabhata's Aryabhatiya...
              </p>
              <div className="bg-black/50 border border-amber-700/30 rounded-xl p-4 mb-3">
                <p className="text-amber-200 text-sm italic font-serif leading-relaxed">
                  "The Earth rotates on its own axis. I have calculated this
                  rotation with great precision. The answer lies in the stars
                  above this very temple."
                </p>
                <p className="text-slate-400 text-xs mt-2">
                  — Aryabhata, 499 CE
                </p>
              </div>
              <p className="text-white text-base font-medium">
                {STAR_MAP_PUZZLE.question}
              </p>
            </div>

            <div className="space-y-3">
              {STAR_MAP_PUZZLE.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPuzzleAnswered(i);
                    if (i === STAR_MAP_PUZZLE.correct) {
                      awardXP(
                        150,
                        10,
                        0,
                        "⭐ Brilliant! +150 XP — You decoded the star map!",
                      );
                      setTimeout(() => {
                        completeMission(missionIndex);
                        advanceMission();
                      }, 2500);
                    }
                  }}
                  disabled={puzzleAnswered !== null}
                  className={`w-full text-left text-sm font-medium py-3.5 px-5 rounded-xl border transition-all ${puzzleAnswered === null
                    ? "bg-slate-800 hover:bg-slate-700 border-slate-600 hover:border-amber-600 text-white"
                    : puzzleAnswered === i
                      ? i === STAR_MAP_PUZZLE.correct
                        ? "bg-green-800 border-green-500 text-white"
                        : "bg-red-900 border-red-600 text-white"
                      : i === STAR_MAP_PUZZLE.correct
                        ? "bg-green-900/50 border-green-700 text-green-300"
                        : "bg-slate-800 border-slate-600 text-slate-400 opacity-50"
                    }`}
                >
                  <span className="text-amber-400 mr-2">
                    {["A", "B", "C", "D"][i]}.
                  </span>
                  {opt}
                </button>
              ))}
            </div>

            {puzzleAnswered !== null && (
              <div
                className={`rounded-xl border p-4 ${puzzleAnswered === STAR_MAP_PUZZLE.correct ? "bg-green-950/60 border-green-700" : "bg-red-950/60 border-red-700"}`}
              >
                <p
                  className={`text-sm font-bold mb-1 ${puzzleAnswered === STAR_MAP_PUZZLE.correct ? "text-green-400" : "text-red-400"}`}
                >
                  {puzzleAnswered === STAR_MAP_PUZZLE.correct
                    ? "✅ Remarkable!"
                    : "📖 The correct answer is B."}
                </p>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {STAR_MAP_PUZZLE.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  }

  // ── CHOICE SCREEN ────────────────────────────────────────────────────
  if (screen === "choice") {
    const scenario =
      VILLAGE_CHOICES[Math.min(choiceScenario, VILLAGE_CHOICES.length - 1)];
    const allDone = choiceScenario >= VILLAGE_CHOICES.length;

    if (allDone) {
      completeMission(missionIndex);
      advanceMission();
      return null;
    }

    return (
      <div
        className={`min-h-screen bg-gradient-to-b ${level.bgGradient} p-4 md:p-6`}
      >
        <div className="max-w-xl mx-auto space-y-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setScreen("mission_hub")}
              className="text-slate-400 hover:text-white text-sm border border-slate-700 px-3 py-1.5 rounded-lg"
            >
              ← Back
            </button>
            <div>
              <p className={`text-xs font-bold uppercase ${level.textColor}`}>
                Mission {missionIndex + 1} · Moral Choices
              </p>
              <p className="text-white font-bold font-cinzel">
                Village Crisis · {choiceScenario + 1}/{VILLAGE_CHOICES.length}
              </p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🏘️</span>
              <p className="text-amber-300 font-bold text-sm">
                Moral Dilemma #{choiceScenario + 1}
              </p>
            </div>
            <p className="text-white text-base leading-relaxed">
              {scenario.scenario}
            </p>
          </div>

          <div className="space-y-3">
            {scenario.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => {
                  awardXP(
                    opt.xp,
                    opt.karma > 0 ? opt.karma : 0,
                    opt.gold || 0,
                    opt.correct
                      ? `✅ +${opt.xp} XP, +${opt.karma} Karma`
                      : "⚠️ That choice reduced your Karma.",
                  );
                  setChoiceScenario((s) => s + 1);
                }}
                className="w-full text-left bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-blue-500 text-white text-sm font-medium py-4 px-4 rounded-xl transition-all"
              >
                <p>{opt.text}</p>
                <p className="text-xs mt-1 text-slate-400">
                  +{opt.xp} XP · {opt.karma > 0 ? `+${opt.karma}` : opt.karma}{" "}
                  Karma · +{opt.gold || 0} Gold
                </p>
              </button>
            ))}
          </div>

          <div className="bg-indigo-950/40 border border-indigo-800/30 rounded-xl p-3">
            <p className="text-indigo-300 text-xs font-semibold mb-1">
              📖 Dharmic Insight:
            </p>
            <p className="text-slate-400 text-xs leading-relaxed">
              {scenario.lesson}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── STEALTH SCREEN ───────────────────────────────────────────────────
  if (screen === "stealth") {
    return (
      <StealthScreen
        level={level}
        onComplete={(success) => {
          if (success) {
            awardXP(
              80,
              10,
              50,
              "🤫 Stealth mission completed! +80 XP, +10 Karma, +50 Gold",
            );
            completeMission(missionIndex);
            advanceMission();
          } else {
            setScreen("mission_hub");
          }
        }}
        onFail={() => setScreen("mission_hub")}
      />
    );
  }

  // ── ESCORT SCREEN ────────────────────────────────────────────────────
  if (screen === "escort") {
    return (
      <EscortScreen
        level={level}
        onComplete={(success) => {
          if (success) {
            awardXP(
              150,
              25,
              120,
              "🚶 Escort completed! +150 XP, +25 Karma, +120 Gold",
            );
            completeMission(missionIndex);
            advanceMission();
          } else {
            setScreen("mission_hub");
          }
        }}
        onFail={() => setScreen("mission_hub")}
      />
    );
  }

  // ── RESOURCE SCREEN ──────────────────────────────────────────────────
  if (screen === "resource") {
    const totalClues = 3;
    const totalTraps = 5;
    const isComplete = cluesFound >= totalClues && trapsDisarmed >= totalTraps;

    return (
      <div
        className={`min-h-screen bg-gradient-to-b ${level.bgGradient} p-4 md:p-6`}
      >
        <div className="max-w-xl mx-auto space-y-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setScreen("mission_hub")}
              className="text-slate-400 hover:text-white text-sm border border-slate-700 px-3 py-1.5 rounded-lg"
            >
              ← Back
            </button>
            <div>
              <p className={`text-xs font-bold uppercase ${level.textColor}`}>
                Mission {missionIndex + 1} · Resource Gathering
              </p>
              <p className="text-white font-bold font-cinzel">
                {currentMission?.title}
              </p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🔍</span>
              <p className="text-amber-300 font-bold text-sm">
                Search the Area
              </p>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed">
              {currentMission?.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/80 border border-amber-700/40 rounded-xl p-4">
              <p className="text-amber-300 text-xs font-semibold mb-2">
                🔍 Clues Found
              </p>
              <div className="flex items-center gap-2">
                <div className="text-2xl">
                  {cluesFound >= totalClues ? "✅" : "🔍"}
                </div>
                <span className="text-white font-bold">
                  {cluesFound}/{totalClues}
                </span>
              </div>
              <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all"
                  style={{ width: `${(cluesFound / totalClues) * 100}%` }}
                />
              </div>
            </div>
            <div className="bg-slate-900/80 border border-red-700/40 rounded-xl p-4">
              <p className="text-red-300 text-xs font-semibold mb-2">
                💣 Traps Disarmed
              </p>
              <div className="flex items-center gap-2">
                <div className="text-2xl">
                  {trapsDisarmed >= totalTraps ? "✅" : "💣"}
                </div>
                <span className="text-white font-bold">
                  {trapsDisarmed}/{totalTraps}
                </span>
              </div>
              <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all"
                  style={{ width: `${(trapsDisarmed / totalTraps) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => {
                if (cluesFound < totalClues) {
                  setCluesFound((c) => c + 1);
                  showMsg("🔍 Found a clue!");
                }
              }}
              disabled={cluesFound >= totalClues}
              className="bg-amber-700 hover:bg-amber-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all"
            >
              🔍 Search Clues
            </button>
            <button
              onClick={() => {
                if (trapsDisarmed < totalTraps) {
                  setTrapsDisarmed((t) => t + 1);
                  showMsg("💣 Disarmed a trap!");
                }
              }}
              disabled={trapsDisarmed >= totalTraps}
              className="bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all"
            >
              💣 Disarm Trap
            </button>
            <button
              onClick={() => {
                if (isComplete) {
                  awardXP(
                    60,
                    5,
                    20,
                    "✅ Resources gathered! +60 XP, +5 Karma, +20 Gold",
                  );
                  completeMission(missionIndex);
                  advanceMission();
                }
              }}
              disabled={!isComplete}
              className="bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all"
            >
              ✅ Complete
            </button>
          </div>

          <div className="bg-indigo-950/40 border border-indigo-800/30 rounded-xl p-3">
            <p className="text-indigo-300 text-xs font-semibold mb-1">
              💡 Tip:
            </p>
            <p className="text-slate-400 text-xs leading-relaxed">
              Search carefully! Some areas may have hidden traps. Use your
              wisdom to navigate safely.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── COMBAT SCREEN ────────────────────────────────────────────────────
  if (screen === "combat" && combatEnemy) {
    return (
      <CombatScreen
        player={player}
        enemy={combatEnemy}
        onVictory={handleCombatVictory}
        onDefeat={handleCombatDefeat}
        onFlee={handleCombatFlee}
        levelAccent={level.accentColor}
      />
    );
  }

  // ── SKILL TREE ───────────────────────────────────────────────────────
  if (screen === "skill_tree") {
    return (
      <SkillTree
        skills={skills}
        player={player}
        onUnlock={unlockSkill}
        onClose={() => setScreen("mission_hub")}
      />
    );
  }

  // ── INVENTORY ────────────────────────────────────────────────────────
  if (screen === "inventory") {
    return (
      <InventoryPanel
        player={player}
        onClose={() => setScreen("mission_hub")}
      />
    );
  }

  // ── LEVEL COMPLETE ───────────────────────────────────────────────────
  if (screen === "level_complete") {
    const isLastLevel = currentLevelIndex >= GAME_LEVELS.length - 1;

    return (
      <div
        className={`min-h-screen bg-gradient-to-b ${level.bgGradient} flex items-center justify-center p-4`}
      >
        <div className="max-w-xl mx-auto text-center space-y-6">
          <div className="text-7xl animate-bounce">🏆</div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-green-400 border border-green-700 rounded-full px-3 py-1">
              Level {level.id} Complete!
            </span>
            <h2 className="text-3xl font-bold text-white font-cinzel mt-3">
              {level.title}
            </h2>
          </div>

          <div className="bg-slate-900/80 border border-green-700/40 rounded-2xl p-5">
            <p className="text-slate-200 text-sm leading-relaxed italic">
              "{level.completionMessage}"
            </p>
          </div>

          <div className="bg-indigo-950/60 border border-indigo-700/40 rounded-2xl p-5 text-left">
            <h3 className="text-indigo-300 font-bold mb-2">
              📚 What You Learned This Level:
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {level.lesson}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Level",
                value: player.stats.level,
                color: "text-amber-400",
              },
              {
                label: "Total XP",
                value: player.stats.xp,
                color: "text-blue-400",
              },
              { label: "Karma", value: player.karma, color: "text-green-400" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-slate-900/60 border border-slate-700 rounded-xl p-3"
              >
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-slate-400 text-xs">{s.label}</p>
              </div>
            ))}
          </div>

          {isLastLevel ? (
            <button
              onClick={() => setScreen("final_victory")}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-4 text-xl rounded-xl transition-all hover:scale-105 font-cinzel"
            >
              🕉️ Complete the Journey
            </button>
          ) : (
            <button
              onClick={() => {
                const nextIdx = currentLevelIndex + 1;
                setUnlockedLevels((prev) =>
                  prev.includes(nextIdx) ? prev : [...prev, nextIdx],
                );
                setScreen("level_map");
              }}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-4 text-xl rounded-xl transition-all hover:scale-105 font-cinzel"
            >
              ⚔️ Continue to Level {currentLevelIndex + 2} →
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── GAME OVER ─────────────────────────────────────────────────────────
  if (screen === "game_over") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-950 via-slate-950 to-black flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center space-y-5">
          <div className="text-7xl">💀</div>
          <h2 className="text-4xl font-bold text-red-400 font-cinzel">
            Fallen in Battle
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            "Even in defeat, the warrior who fought for Dharma gains merit. Rise
            again, Arjun. Your journey is not over."
          </p>
          <p className="text-slate-400 text-xs italic">— Bhagavad Gita 2.37</p>
          <div className="grid grid-cols-2 gap-3 my-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-3">
              <p className="text-2xl font-bold text-blue-400">
                {player.stats.xp}
              </p>
              <p className="text-slate-400 text-xs">XP Earned</p>
            </div>
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-3">
              <p className="text-2xl font-bold text-amber-400">
                {player.karma}
              </p>
              <p className="text-slate-400 text-xs">Karma Built</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setMissions([...GAME_LEVELS[currentLevelIndex].missions]);
                setMissionIndex(0);
                setPlayer((p) => ({
                  ...p,
                  stats: { ...p.stats, hp: p.stats.maxHp },
                }));
                setScreen("mission_hub");
              }}
              className="w-full bg-amber-700 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-all font-cinzel"
            >
              🔄 Retry Level {currentLevelIndex + 1}
            </button>
            <button
              onClick={() => {
                setPlayer(PLAYER_CHARACTER);
                setCurrentLevelIndex(0);
                setUnlockedLevels([0]);
                setScreen("title");
              }}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 rounded-xl transition-all border border-slate-700"
            >
              ↩ Return to Title
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── FINAL VICTORY ────────────────────────────────────────────────────
  if (screen === "final_victory") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-950 via-indigo-950 to-slate-950 flex items-center justify-center p-4">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <div className="text-7xl animate-pulse">🕉️</div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-orange-500 font-cinzel">
            Dharma Fulfilled
          </h1>
          <p className="text-amber-200 text-lg font-cinzel">
            The Journey of Arjun — Complete
          </p>

          <div className="bg-slate-900/70 border border-amber-700/40 rounded-2xl p-6 text-left space-y-3">
            <p className="text-slate-200 text-sm leading-relaxed italic">
              "From the sacred Gurukul to the banks of the Ganga, from the
              plains of Kurukshetra to the temples of Vijayanagara — you have
              walked the path of Dharma."
            </p>
            <p className="text-slate-200 text-sm leading-relaxed italic">
              "You have learned that Dharma is not a law written in stone. It is
              a living, breathing principle — the right action, in the right
              moment, for the right reason."
            </p>
            <p className="text-amber-400 text-sm font-semibold text-center mt-4">
              🕉️ Tat Tvam Asi — Thou Art That 🕉️
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Player Level",
                value: player.stats.level,
                color: "text-amber-400",
                icon: "⭐",
              },
              {
                label: "Total XP",
                value: player.stats.xp,
                color: "text-blue-400",
                icon: "💫",
              },
              {
                label: "Karma Earned",
                value: player.karma,
                color: "text-green-400",
                icon: "⚖️",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-slate-900/60 border border-amber-700/30 rounded-xl p-4"
              >
                <p className="text-2xl mb-1">{s.icon}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-slate-400 text-xs">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-indigo-950/50 border border-indigo-700/30 rounded-2xl p-5 text-left">
            <h3 className="text-indigo-300 font-bold mb-3">
              📚 Ancient Wisdom You Discovered:
            </h3>
            <div className="space-y-2">
              {GAME_LEVELS.map((lv) => (
                <div key={lv.id} className="flex items-start gap-2">
                  <span className="text-green-400 text-sm shrink-0 mt-0.5">
                    ✓
                  </span>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    <span className="text-amber-400 font-semibold">
                      {lv.lessonTitle.split(":")[0]}:
                    </span>{" "}
                    {lv.lesson.substring(0, 100)}...
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              setPlayer(PLAYER_CHARACTER);
              setCurrentLevelIndex(0);
              setUnlockedLevels([0]);
              setMissions([...GAME_LEVELS[0].missions]);
              setSkills(SKILL_TREE);
              setScreen("title");
            }}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-4 text-xl rounded-xl transition-all hover:scale-105 font-cinzel"
          >
            🔄 Begin New Journey
          </button>
        </div>
      </div>
    );
  }

  return null;
}
