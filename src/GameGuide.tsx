import { useState } from "react";

type Step = {
  step: number;
  title: string;
  icon: string;
  color: string;
  borderColor: string;
  bgColor: string;
  description: string;
  tips: string[];
  example?: string;
};

type Section = {
  id: string;
  label: string;
  icon: string;
};

const STEPS: Step[] = [
  {
    step: 1,
    title: "Watch the Intro Cinematic",
    icon: "🎬",
    color: "text-purple-300",
    borderColor: "border-purple-500",
    bgColor: "bg-purple-900/30",
    description:
      "When the game loads, you'll see a dark screen with the sacred Om symbol (🕉️) and a series of narrated lines fading in one by one. This is the lore intro — the story of your soul entering the cycle of Samsara.",
    tips: [
      "Wait and watch all 6 narration lines. They set the tone of the game.",
      "Lines fade in every 2.5 seconds automatically.",
      "After the last line, you'll be taken to the main exploration screen.",
      "You cannot skip this — it is intentional, like a meditative entry into the world.",
    ],
    example: "Example lines: \"You are a soul on the eternal journey of Samsara.\" → \"Your choices will shape your destiny.\"",
  },
  {
    step: 2,
    title: "Understand Your Three Core Stats",
    icon: "📊",
    color: "text-amber-300",
    borderColor: "border-amber-500",
    bgColor: "bg-amber-900/30",
    description:
      "At the top of the screen, you'll see three glowing stat boxes. These are the heart of the game — every choice you make increases one or more of these stats, and they determine your final ending.",
    tips: [
      "🟢 KARMA — Righteousness, compassion, and moral duty. Represents the path of Dharma.",
      "🔵 WISDOM — Knowledge, enlightenment, and understanding. Represents the path of Jnana.",
      "🔴 STRENGTH — Power, courage, and warrior spirit. Represents the path of Shakti.",
      "Stats can never go below 0 — even bad choices won't hurt you permanently.",
      "Hover over choices to preview stat changes before committing.",
    ],
    example: "If Karma = 80, Wisdom = 30, Strength = 20 → You are on the Path of Dharma.",
  },
  {
    step: 3,
    title: "Start at The Ancient Ashram",
    icon: "🌅",
    color: "text-orange-300",
    borderColor: "border-orange-500",
    bgColor: "bg-orange-900/30",
    description:
      "Your journey begins in a serene Himalayan ashram. A wise sage sits by the sacred fire. You are presented with your FIRST choices. This is your fork in the road — each option leads to a completely different region of the game world.",
    tips: [
      "\"Approach the sage respectfully\" → +10 Wisdom → Leads to the Sage dialogue and path selection.",
      "\"Explore the surrounding forest\" → +5 Strength → Leads to the Enchanted Forest and the Golden Deer.",
      "\"Meditate by the river\" → +10 Karma → Leads to the Sacred River meditation spot.",
      "There is no wrong first choice — all paths eventually loop back to the Ashram.",
    ],
    example: "First playthrough tip: Try the sage first. He reveals the three core paths of the game.",
  },
  {
    step: 4,
    title: "Choose Your Sacred Path",
    icon: "🛤️",
    color: "text-yellow-300",
    borderColor: "border-yellow-500",
    bgColor: "bg-yellow-900/30",
    description:
      "If you speak with the sage, he offers you the three legendary paths of ancient Indian philosophy. This is the most important narrative decision in the early game — it unlocks unique locations and lore specific to each path.",
    tips: [
      "⚖️ Path of Dharma (+20 Karma) → Opens: Village Defense, Teaching, Justice Meditation.",
      "🔮 Path of Jnana (+20 Wisdom) → Opens: Cosmic Study, Hidden Library, Maya (illusion).",
      "⚔️ Path of Shakti (+20 Strength) → Opens: Trishula, Divine Bow, Combat Training.",
      "You are not locked into one path — you can explore all three across multiple runs.",
      "The path you focus on the most determines your final game ending.",
    ],
    example: "Example: Choose Jnana → Seek the Hidden Library → Read the Scroll of Enlightenment → +40 Wisdom.",
  },
  {
    step: 5,
    title: "Explore Locations & Read Descriptions",
    icon: "🗺️",
    color: "text-green-300",
    borderColor: "border-green-500",
    bgColor: "bg-green-900/30",
    description:
      "Each location has a large emoji icon, a poetic title, and a rich description drawn from ancient Indian settings. Read every description carefully — they contain philosophical hints that guide the best choices.",
    tips: [
      "Every location has 2–4 choices. Some give single stats, others give combinations.",
      "Locations with 'Continue your journey' lead back to the Ashram to explore again.",
      "The Temple of Time (🏛️) and Sacred Peak (⛰️) are the two most powerful locations.",
      "The Hidden Library (📚) is the hardest to find — go: Sage → Jnana → Hidden Library.",
      "The Sacred River connects to the most locations — treat it as your hub.",
    ],
    example: "Sacred River → Meditate deeply → Inner Truth → Find the Light Within → +30 Wisdom +20 Karma.",
  },
  {
    step: 6,
    title: "Make Moral Choice Decisions",
    icon: "⚖️",
    color: "text-cyan-300",
    borderColor: "border-cyan-500",
    bgColor: "bg-cyan-900/30",
    description:
      "The soul of this game is moral decision-making inspired by the Mahabharata and Ramayana. Many locations present you with situations that have no 'correct' answer — only consequences that reflect your values.",
    tips: [
      "When facing the bandit leader: Spare him (+Karma +Wisdom) vs Show No Mercy (+Strength -Karma).",
      "In the forest: Compassion for the deer (+Karma) vs Challenging it (+Strength).",
      "At the mountain: Prayer (+Karma) vs Riddles (+Wisdom) vs Combat (+Strength).",
      "Negative karma (-10) only occurs from the 'Show No Mercy' choice — so choose mindfully.",
      "Every moral choice has a consequence shown after you confirm it.",
    ],
    example: "Dilemma: Bandits threaten a village. Negotiate peacefully (+Wisdom +Karma) OR Fight them (+Strength +Karma).",
  },
  {
    step: 7,
    title: "Enter Combat Mode",
    icon: "⚔️",
    color: "text-red-300",
    borderColor: "border-red-500",
    bgColor: "bg-red-900/30",
    description:
      "Some choices trigger the Combat Screen — a red-toned battle arena. The screen changes completely and you face an enemy with a health bar. Combat is turn-based: you act, then the enemy retaliates.",
    tips: [
      "⚔️ ATTACK: Deals damage based on your Strength + Wisdom bonus. High wisdom = more damage.",
      "🛡️ DEFEND: Reduces enemy damage by 50% on their next turn. Use when enemy health is high.",
      "🏃 FLEE: Immediately escapes combat and returns you to the Ashram. No penalty.",
      "Watch the Combat Log (black box) — it shows every action taken in real-time.",
      "You restore +20 HP after winning a combat encounter.",
    ],
    example: "Strategy: If enemy HP is 150+, use Defend for the first 2 turns, then Attack repeatedly.",
  },
  {
    step: 8,
    title: "Know Your Enemies",
    icon: "👹",
    color: "text-rose-300",
    borderColor: "border-rose-500",
    bgColor: "bg-rose-900/30",
    description:
      "There are 5 unique enemies in the game, each with a backstory rooted in Indian mythology. They appear based on your choices, not randomly — so you can prepare by building your stats first.",
    tips: [
      "🗡️ Bandit Leader (100 HP, 15 ATK) — A desperate warrior. Triggered via Village Defense path.",
      "🦌 Forest Guardian (120 HP, 20 ATK) — A mystical being. Triggered by challenging the Golden Deer.",
      "🌑 Shadow Self (80 HP, 12 ATK) — Your inner darkness. Triggered in the Inner Truth location.",
      "⛰️ Mountain Guardian (150 HP, 25 ATK) — Protects the Sacred Peak. Hardest early-game fight.",
      "😈 Demonic Asura (180 HP, 30 ATK) — The final boss. Leads to the ending screen when defeated.",
    ],
    example: "Tip: Build Strength to 50+ before attempting the Mountain Guardian for best results.",
  },
  {
    step: 9,
    title: "Manage Your Health",
    icon: "❤️",
    color: "text-pink-300",
    borderColor: "border-pink-500",
    bgColor: "bg-pink-900/30",
    description:
      "You start with 100/100 HP. Health only changes during combat — non-combat choices never reduce your health. If your health reaches 0 in combat, the game triggers the ending screen immediately.",
    tips: [
      "Always check your HP bar (green bar) before entering combat-triggering choices.",
      "Winning combat restores +20 HP automatically.",
      "Using DEFEND in combat halves incoming damage — crucial for survival.",
      "If health is low, choose FLEE to survive and come back with better stats.",
      "There are no healing items — surviving combat = strategic defending and smart attacking.",
    ],
    example: "Health at 30 HP facing a 25 ATK enemy? Defend first (takes 12 damage), then Attack to win safely.",
  },
  {
    step: 10,
    title: "Build Stats Through Multiple Loops",
    icon: "🔄",
    color: "text-indigo-300",
    borderColor: "border-indigo-500",
    bgColor: "bg-indigo-900/30",
    description:
      "After completing a location that says 'Continue your journey', you return to the Ashram (start). This is intentional — the game loops, representing the cycle of Samsara (rebirth). Each loop makes you stronger.",
    tips: [
      "Each loop through the Ashram, pick a DIFFERENT starting path to explore new areas.",
      "Stats accumulate permanently across all choices — there's no stat reset until you start a New Journey.",
      "Aim for 100+ in your preferred stat before checking your ending.",
      "The Temple of Time and Sacred Peak give the highest stat rewards (+30 to +40).",
      "After 4–5 loops, you'll have explored most of the game's content.",
    ],
    example: "Loop 1: Sage → Dharma. Loop 2: Forest → River. Loop 3: Temple → Mountain. Now check your ending!",
  },
  {
    step: 11,
    title: "Reach the Ending Screen",
    icon: "✨",
    color: "text-amber-200",
    borderColor: "border-amber-400",
    bgColor: "bg-amber-900/20",
    description:
      "The Ending Screen triggers when: (1) You defeat the Demonic Asura, (2) Your health drops to 0 in combat, or (3) You navigate to the 'ending' location. Your final stats determine which of 4 unique endings you receive.",
    tips: [
      "🌿 DHARMA ENDING: Karma is highest → 'You walked the path of righteousness, choosing duty over desire.'",
      "📖 JNANA ENDING: Wisdom is highest → 'You sought knowledge and understanding above all else.'",
      "⚔️ SHAKTI ENDING: Strength is highest → 'You embraced strength and the warrior spirit.'",
      "☯️ BALANCED ENDING: All stats are roughly equal → 'You balanced all paths, finding harmony in the middle way.'",
      "Your Total Score is displayed — aim for 300+ for a complete playthrough.",
    ],
    example: "Karma: 120, Wisdom: 60, Strength: 40 → Total: 220 → DHARMA ENDING achieved.",
  },
  {
    step: 12,
    title: "Start a New Journey",
    icon: "🔮",
    color: "text-violet-300",
    borderColor: "border-violet-500",
    bgColor: "bg-violet-900/30",
    description:
      "After seeing your ending, click 'Begin New Journey' to reset all stats to 0 and replay from the intro cinematic. This time, try a completely different path to unlock a different ending. The game rewards replayability.",
    tips: [
      "Each new run takes about 10–15 minutes to explore fully.",
      "Try to achieve all 4 endings: Dharma, Jnana, Shakti, and Balanced.",
      "On your second run, skip familiar locations and explore ones you missed.",
      "The 'Balanced' ending is the hardest — requires roughly equal investment in all 3 stats.",
      "Challenge yourself: Can you reach a total score of 500+ in a single run?",
    ],
    example: "Run 1: Max Karma. Run 2: Max Wisdom. Run 3: Max Strength. Run 4: Balance all three.",
  },
];

const PATH_GUIDE = [
  {
    name: "Path of Dharma",
    icon: "⚖️",
    color: "from-green-800 to-emerald-900",
    border: "border-green-500",
    stat: "Karma",
    statColor: "text-green-400",
    route: ["Ashram → Sage → Dharma → Village Defense → Negotiate (peaceful) → Spare the Leader → Ashram"],
    ending: "Dharma Ending",
    description: "Focus on karma-gaining choices. Always choose compassion, peace, and teaching others.",
    keyLocations: ["Ancient Ashram", "Sage", "Village Defense", "Teaching", "Sacred River", "Inner Light"],
  },
  {
    name: "Path of Jnana",
    icon: "📖",
    color: "from-blue-800 to-indigo-900",
    border: "border-blue-500",
    stat: "Wisdom",
    statColor: "text-blue-400",
    route: ["Ashram → Sage → Jnana → Hidden Library → Enlightenment Scroll → Peak Meditation → Ashram"],
    ending: "Jnana Ending",
    description: "Focus on wisdom-gaining choices. Seek knowledge, study murals, meditate, and solve riddles.",
    keyLocations: ["Sage", "Jnana Path", "Hidden Library", "Temple of Time", "Cosmic Study", "Summit of Wisdom"],
  },
  {
    name: "Path of Shakti",
    icon: "⚔️",
    color: "from-red-800 to-rose-900",
    border: "border-red-500",
    stat: "Strength",
    statColor: "text-red-400",
    route: ["Ashram → Forest → Challenge Deer → Honorable Fight → Ashram → Shakti → Trishula → Warrior Court"],
    ending: "Shakti Ending",
    description: "Focus on strength-gaining choices. Challenge enemies, pick up divine weapons, train with warriors.",
    keyLocations: ["Enchanted Forest", "Shakti Path", "Trishula", "Divine Bow", "Warrior's Courtyard", "Mountain Guardian"],
  },
  {
    name: "Balanced Path",
    icon: "☯️",
    color: "from-purple-800 to-violet-900",
    border: "border-purple-500",
    stat: "All Equal",
    statColor: "text-purple-400",
    route: ["Ashram → Meditation → Inner Truth → Transcendence → Temple → Inner Sanctum → Mountain → Heavenly Prayer"],
    ending: "Balanced Ending",
    description: "Spread choices equally across all three stats. The hardest path — requires careful planning.",
    keyLocations: ["Sacred River", "Temple of Time", "Inner Sanctum", "Sacred Peak", "Heavenly Prayer", "Balanced Fight"],
  },
];

const LOCATIONS_MAP = [
  { name: "Ancient Ashram", icon: "🌅", type: "Hub", connects: ["Sage", "Enchanted Forest", "Sacred River"] },
  { name: "Sage", icon: "🙏", type: "Story", connects: ["Dharma Path", "Jnana Path", "Shakti Path"] },
  { name: "Enchanted Forest", icon: "🦌", type: "Action", connects: ["Compassion", "Combat: Deer", "Secrets"] },
  { name: "Sacred River", icon: "🌊", type: "Meditation", connects: ["Inner Truth", "Mountain", "Temple", "Protection"] },
  { name: "Temple of Time", icon: "🏛️", type: "Exploration", connects: ["Creation Study", "Inner Sanctum", "Warrior's Court"] },
  { name: "Sacred Peak", icon: "⛰️", type: "Boss", connects: ["Peak Meditation", "Combat: Guardian", "Heavenly Prayer"] },
  { name: "Hidden Library", icon: "📚", type: "Secret", connects: ["Enlightenment", "Creation Scroll", "Respectful Exit"] },
  { name: "Village Defense", icon: "🏘️", type: "Moral", connects: ["Combat: Bandits", "Negotiate", "Evacuate"] },
];

const SECTIONS: Section[] = [
  { id: "steps", label: "Step-by-Step", icon: "📋" },
  { id: "paths", label: "Sacred Paths", icon: "🛤️" },
  { id: "map", label: "World Map", icon: "🗺️" },
  { id: "combat", label: "Combat Guide", icon: "⚔️" },
  { id: "endings", label: "Endings", icon: "✨" },
];

export function GameGuide({ onClose }: { onClose: () => void }) {
  const [activeSection, setActiveSection] = useState("steps");
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur border-b border-amber-700/40 shadow-lg shadow-amber-900/20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📜</span>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-amber-400 font-serif leading-tight">
                Game Guide
              </h1>
              <p className="text-xs text-slate-400">Samsara: The Eternal Journey</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-2 bg-amber-700 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:scale-105 active:scale-95"
          >
            🎮 Play Game
          </button>
        </div>

        {/* Section Tabs */}
        <div className="max-w-5xl mx-auto px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeSection === s.id
                  ? "bg-amber-500 text-slate-950"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 pb-16">

        {/* ── STEP-BY-STEP SECTION ── */}
        {activeSection === "steps" && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-amber-400 font-serif">
                🎮 How to Play — Step by Step
              </h2>
              <p className="text-slate-400 mt-2 text-sm">
                Follow these 12 steps to master the full game. Click any step to expand it.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8 bg-slate-800/60 rounded-xl p-4 border border-slate-700">
              <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide">Your Gameplay Progress Checklist</p>
              <div className="grid grid-cols-6 md:grid-cols-12 gap-1">
                {STEPS.map((s) => (
                  <button
                    key={s.step}
                    onClick={() => setExpandedStep(s.step === expandedStep ? null : s.step)}
                    className={`aspect-square rounded-lg text-xs font-bold flex items-center justify-center transition-all hover:scale-110 ${
                      expandedStep === s.step
                        ? "bg-amber-500 text-slate-950"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    {s.step}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {STEPS.map((step) => (
                <div
                  key={step.step}
                  className={`rounded-xl border transition-all duration-300 overflow-hidden ${step.borderColor} ${
                    expandedStep === step.step ? step.bgColor : "bg-slate-900/40 border-slate-700"
                  }`}
                >
                  {/* Step Header */}
                  <button
                    className="w-full flex items-center gap-4 p-4 text-left hover:opacity-90 transition-opacity"
                    onClick={() => setExpandedStep(expandedStep === step.step ? null : step.step)}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                      expandedStep === step.step ? "bg-amber-500 text-slate-950" : "bg-slate-700 text-white"
                    }`}>
                      {step.step}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{step.icon}</span>
                        <span className={`font-bold text-base md:text-lg ${expandedStep === step.step ? step.color : "text-white"}`}>
                          {step.title}
                        </span>
                      </div>
                    </div>
                    <span className="text-slate-400 text-xl shrink-0">
                      {expandedStep === step.step ? "▲" : "▼"}
                    </span>
                  </button>

                  {/* Step Body */}
                  {expandedStep === step.step && (
                    <div className="px-5 pb-5 space-y-4">
                      <p className="text-slate-200 leading-relaxed text-sm md:text-base">
                        {step.description}
                      </p>

                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                          💡 Key Tips
                        </p>
                        <ul className="space-y-2">
                          {step.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                              <span className="text-amber-400 mt-0.5 shrink-0">›</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {step.example && (
                        <div className="bg-black/40 rounded-lg p-3 border border-slate-600">
                          <p className="text-xs text-amber-400 uppercase tracking-wide font-semibold mb-1">
                            📌 Example
                          </p>
                          <p className="text-sm text-slate-300 italic">{step.example}</p>
                        </div>
                      )}

                      {/* Next Step Button */}
                      {step.step < 12 && (
                        <button
                          onClick={() => setExpandedStep(step.step + 1)}
                          className="mt-2 text-sm text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors"
                        >
                          Next: Step {step.step + 1} →
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SACRED PATHS SECTION ── */}
        {activeSection === "paths" && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-amber-400 font-serif">🛤️ The Four Sacred Paths</h2>
              <p className="text-slate-400 mt-2 text-sm">
                Each path leads to a unique ending. Here's how to follow each one.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {PATH_GUIDE.map((path) => (
                <div key={path.name} className={`rounded-xl border ${path.border} bg-gradient-to-br ${path.color} p-5`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{path.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white">{path.name}</h3>
                      <p className={`text-sm font-semibold ${path.statColor}`}>
                        Focus Stat: {path.stat} → {path.ending}
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm mb-4 leading-relaxed">{path.description}</p>

                  <div className="mb-4">
                    <p className="text-xs uppercase tracking-widest text-slate-400 mb-2 font-semibold">Recommended Route</p>
                    <div className="bg-black/40 rounded-lg p-3">
                      {path.route.map((r, i) => (
                        <p key={i} className="text-xs text-amber-300 font-mono leading-relaxed">{r}</p>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400 mb-2 font-semibold">Key Locations</p>
                    <div className="flex flex-wrap gap-1.5">
                      {path.keyLocations.map((loc) => (
                        <span key={loc} className="bg-black/30 text-slate-300 text-xs px-2 py-1 rounded-full border border-slate-600">
                          {loc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Comparison */}
            <div className="mt-6 bg-slate-900/60 rounded-xl border border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-700">
                <h3 className="font-bold text-amber-300">📊 Quick Path Comparison</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-800/60">
                      <th className="text-left px-4 py-3 text-slate-400 font-medium">Path</th>
                      <th className="text-left px-4 py-3 text-slate-400 font-medium">Focus</th>
                      <th className="text-left px-4 py-3 text-slate-400 font-medium">Difficulty</th>
                      <th className="text-left px-4 py-3 text-slate-400 font-medium">Best For</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    <tr>
                      <td className="px-4 py-3 text-green-400 font-semibold">⚖️ Dharma</td>
                      <td className="px-4 py-3 text-slate-300">Karma</td>
                      <td className="px-4 py-3 text-green-400">Easy ★☆☆</td>
                      <td className="px-4 py-3 text-slate-400">New players</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-blue-400 font-semibold">📖 Jnana</td>
                      <td className="px-4 py-3 text-slate-300">Wisdom</td>
                      <td className="px-4 py-3 text-yellow-400">Medium ★★☆</td>
                      <td className="px-4 py-3 text-slate-400">Story lovers</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-red-400 font-semibold">⚔️ Shakti</td>
                      <td className="px-4 py-3 text-slate-300">Strength</td>
                      <td className="px-4 py-3 text-orange-400">Hard ★★☆</td>
                      <td className="px-4 py-3 text-slate-400">Combat fans</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-purple-400 font-semibold">☯️ Balanced</td>
                      <td className="px-4 py-3 text-slate-300">All Equal</td>
                      <td className="px-4 py-3 text-red-400">Expert ★★★</td>
                      <td className="px-4 py-3 text-slate-400">Completionists</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── WORLD MAP SECTION ── */}
        {activeSection === "map" && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-amber-400 font-serif">🗺️ World Map</h2>
              <p className="text-slate-400 mt-2 text-sm">
                All locations, their types, and what they connect to.
              </p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-2 mb-6 bg-slate-900/50 rounded-xl p-4 border border-slate-700">
              <p className="w-full text-xs text-slate-400 uppercase tracking-wider mb-1 font-semibold">Location Types</p>
              {[
                { type: "Hub", color: "bg-amber-600", desc: "Central starting point" },
                { type: "Story", color: "bg-purple-600", desc: "Major narrative decision" },
                { type: "Action", color: "bg-red-700", desc: "May trigger combat" },
                { type: "Meditation", color: "bg-blue-700", desc: "Wisdom & karma focus" },
                { type: "Exploration", color: "bg-green-700", desc: "Multi-path discovery" },
                { type: "Boss", color: "bg-rose-800", desc: "Hardest encounters" },
                { type: "Secret", color: "bg-indigo-700", desc: "Hidden / hard to find" },
                { type: "Moral", color: "bg-teal-700", desc: "Ethical dilemma zones" },
              ].map((l) => (
                <div key={l.type} className="flex items-center gap-1.5">
                  <span className={`w-3 h-3 rounded-sm ${l.color}`}></span>
                  <span className="text-xs text-slate-300">
                    <strong className="text-white">{l.type}</strong>: {l.desc}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {LOCATIONS_MAP.map((loc) => {
                const typeColors: Record<string, string> = {
                  Hub: "border-amber-500 bg-amber-900/20",
                  Story: "border-purple-500 bg-purple-900/20",
                  Action: "border-red-500 bg-red-900/20",
                  Meditation: "border-blue-500 bg-blue-900/20",
                  Exploration: "border-green-500 bg-green-900/20",
                  Boss: "border-rose-500 bg-rose-900/20",
                  Secret: "border-indigo-500 bg-indigo-900/20",
                  Moral: "border-teal-500 bg-teal-900/20",
                };
                const badgeColors: Record<string, string> = {
                  Hub: "bg-amber-600",
                  Story: "bg-purple-600",
                  Action: "bg-red-700",
                  Meditation: "bg-blue-700",
                  Exploration: "bg-green-700",
                  Boss: "bg-rose-800",
                  Secret: "bg-indigo-700",
                  Moral: "bg-teal-700",
                };

                return (
                  <div key={loc.name} className={`rounded-xl border p-4 ${typeColors[loc.type]}`}>
                    <div className="flex items-start gap-3">
                      <span className="text-4xl shrink-0">{loc.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-white">{loc.name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full text-white font-medium ${badgeColors[loc.type]}`}>
                            {loc.type}
                          </span>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Connects to:</p>
                          <div className="flex flex-wrap gap-1">
                            {loc.connects.map((c) => (
                              <span key={c} className="text-xs bg-slate-700/60 text-slate-300 px-2 py-0.5 rounded border border-slate-600">
                                → {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Optimal Route */}
            <div className="mt-6 bg-slate-900/60 rounded-xl border border-amber-700/40 p-5">
              <h3 className="font-bold text-amber-300 mb-3">🏆 Optimal First Playthrough Route</h3>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                {[
                  "🌅 Ashram",
                  "→",
                  "🙏 Sage",
                  "→",
                  "📜 Dharma",
                  "→",
                  "🏘️ Village",
                  "→",
                  "🤝 Negotiate",
                  "→",
                  "🌅 Ashram",
                  "→",
                  "🌊 River",
                  "→",
                  "⛰️ Mountain",
                  "→",
                  "🙏 Heavenly Prayer",
                  "→",
                  "🏛️ Temple",
                  "→",
                  "✨ Enlightenment",
                  "→",
                  "🏁 Ending",
                ].map((node, i) => (
                  <span
                    key={i}
                    className={node === "→" ? "text-slate-500" : "bg-slate-800 text-amber-200 px-2 py-1 rounded-md border border-slate-700 text-xs"}
                  >
                    {node}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── COMBAT GUIDE SECTION ── */}
        {activeSection === "combat" && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-amber-400 font-serif">⚔️ Combat Guide</h2>
              <p className="text-slate-400 mt-2 text-sm">
                Master the combat system to defeat all 5 enemies.
              </p>
            </div>

            {/* Combat Screen Anatomy */}
            <div className="bg-slate-900/60 rounded-xl border border-red-700/40 p-5 mb-5">
              <h3 className="font-bold text-red-300 mb-4 text-lg">🖥️ Reading the Combat Screen</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {[
                  { area: "Your Health Bar (Green)", desc: "Your remaining HP. Starts at 100. Reaches 0 = Game Over / Ending." },
                  { area: "Enemy Health Bar (Red)", desc: "Enemy's remaining HP. Reduce to 0 to win the fight." },
                  { area: "Enemy Display (👹)", desc: "Shows enemy emoji, name, and philosophical description." },
                  { area: "Combat Log (Black Box)", desc: "Records every action. Scroll to see full battle history." },
                  { area: "⚔️ Attack Button", desc: "Deals damage: (Random × Strength) + (Wisdom Bonus × 2%). No defense." },
                  { area: "🛡️ Defend Button", desc: "Halves incoming enemy damage this turn. You deal no damage." },
                  { area: "🏃 Flee Button", desc: "Instantly escape. Returns to Ashram. Safe, no penalty." },
                ].map((item) => (
                  <div key={item.area} className="flex gap-3 bg-slate-800/60 rounded-lg p-3">
                    <div className="w-1 bg-red-500 rounded shrink-0"></div>
                    <div>
                      <p className="font-semibold text-white">{item.area}</p>
                      <p className="text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enemy Cards */}
            <h3 className="font-bold text-white text-lg mb-3">👹 Enemy Bestiary</h3>
            <div className="space-y-3 mb-5">
              {[
                { name: "Bandit Leader", icon: "🗡️", hp: 100, atk: 15, trigger: "Choose 'Fight bandits directly' in Village Defense", strategy: "Attack immediately — low HP means this is over quickly. Spare him for +Karma bonus afterwards.", difficulty: 1 },
                { name: "Forest Guardian", icon: "🦌", hp: 120, atk: 20, trigger: "Choose 'Challenge the deer to a test of strength' in the Forest", strategy: "Defend on turn 1 to survive first hit, then attack. Consider fleeing if health is below 40.", difficulty: 2 },
                { name: "Shadow Self", icon: "🌑", hp: 80, atk: 12, trigger: "Appears from the Inner Truth → Shadow path", strategy: "Easiest enemy. Attack every turn — 3–4 hits and it's done.", difficulty: 1 },
                { name: "Mountain Guardian", icon: "⛰️", hp: 150, atk: 25, trigger: "Choose 'Face the mountain guardian' at the Sacred Peak", strategy: "Most dangerous non-boss. Defend first 2 turns, attack when below 100 HP. Flee if health < 30.", difficulty: 3 },
                { name: "Demonic Asura", icon: "😈", hp: 180, atk: 30, trigger: "Final encounter — triggered late game via specific paths", strategy: "Hardest fight. Alternate Defend and Attack. Need Strength 50+ to do meaningful damage. Defeat it for a special ending.", difficulty: 3 },
              ].map((enemy) => (
                <div key={enemy.name} className="bg-red-950/40 rounded-xl border border-red-800/40 p-4">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{enemy.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <h4 className="font-bold text-white text-lg">{enemy.name}</h4>
                        <div className="flex gap-1">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <span key={i} className={`text-sm ${i < enemy.difficulty ? "text-red-400" : "text-slate-700"}`}>★</span>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        <div className="bg-slate-800/60 rounded p-2">
                          <p className="text-slate-400 text-xs">Max HP</p>
                          <p className="text-green-400 font-bold">{enemy.hp}</p>
                        </div>
                        <div className="bg-slate-800/60 rounded p-2">
                          <p className="text-slate-400 text-xs">Attack</p>
                          <p className="text-red-400 font-bold">{enemy.atk} per turn</p>
                        </div>
                      </div>
                      <p className="text-xs text-amber-300 mb-1"><span className="font-semibold">Trigger: </span>{enemy.trigger}</p>
                      <p className="text-xs text-slate-300"><span className="font-semibold text-blue-300">Strategy: </span>{enemy.strategy}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Combat Tips */}
            <div className="bg-blue-950/40 rounded-xl border border-blue-700/40 p-5">
              <h3 className="font-bold text-blue-300 mb-3 text-lg">🧠 Pro Combat Tips</h3>
              <div className="space-y-2">
                {[
                  "Build Wisdom to 30+ before combat — it increases your attack damage by 60%.",
                  "The formula: Damage = (Random(0–Strength) + 10) × (1 + Wisdom × 0.02).",
                  "If Strength is 0, you still deal 1–10 base damage per attack.",
                  "After winning a combat, you gain +20 HP automatically (capped at max).",
                  "You can always Flee — there is no shame. Return with better stats.",
                  "Defend is optimal when enemy HP > 100 (prevents early death).",
                  "Attack is optimal when enemy HP < 50 (finish them before they whittle you down).",
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-blue-400 font-bold shrink-0">{i + 1}.</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ENDINGS SECTION ── */}
        {activeSection === "endings" && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-amber-400 font-serif">✨ All Endings Guide</h2>
              <p className="text-slate-400 mt-2 text-sm">
                There are 4 unique endings. Here's how to unlock each one.
              </p>
            </div>

            <div className="space-y-5 mb-8">
              {[
                {
                  name: "The Dharma Ending",
                  icon: "🌿",
                  color: "from-green-900 to-emerald-950",
                  border: "border-green-500",
                  condition: "Karma is higher than both Wisdom and Strength",
                  quote: "You walked the path of righteousness, choosing duty over desire.",
                  howTo: [
                    "Always choose peaceful and compassionate options",
                    "Visit: Sage → Dharma → Village (negotiate) → Spare Leader → River → Inner Light",
                    "Avoid choices with negative karma (like 'Show No Mercy')",
                    "Target: Karma 100+, Wisdom & Strength both below 100",
                  ],
                  scoreRange: "200–350+ total score",
                  badge: "🏆 Easiest to unlock",
                },
                {
                  name: "The Jnana Ending",
                  icon: "📖",
                  color: "from-blue-900 to-indigo-950",
                  border: "border-blue-500",
                  condition: "Wisdom is higher than both Karma and Strength",
                  quote: "You sought knowledge and understanding above all else.",
                  howTo: [
                    "Prioritize meditation, study, and riddle-solving choices",
                    "Visit: Sage → Jnana → Hidden Library → Scroll of Enlightenment → Peak Meditation",
                    "The Temple of Time's Creation Study gives +25 Wisdom",
                    "Target: Wisdom 100+, Karma & Strength both below 100",
                  ],
                  scoreRange: "180–320+ total score",
                  badge: "📚 Best lore ending",
                },
                {
                  name: "The Shakti Ending",
                  icon: "⚔️",
                  color: "from-red-900 to-rose-950",
                  border: "border-red-500",
                  condition: "Strength is higher than both Karma and Wisdom",
                  quote: "You embraced strength and the warrior spirit.",
                  howTo: [
                    "Choose combat and power-focused options at every turn",
                    "Visit: Forest (challenge deer) → Shakti → Trishula → Warrior Court → Combat Training",
                    "Win all combat encounters instead of fleeing",
                    "Target: Strength 100+, Karma & Wisdom both below 100",
                  ],
                  scoreRange: "150–280+ total score",
                  badge: "⚔️ Action-focused ending",
                },
                {
                  name: "The Balanced Ending",
                  icon: "☯️",
                  color: "from-purple-900 to-violet-950",
                  border: "border-purple-500",
                  condition: "No single stat is dominant — all are roughly equal",
                  quote: "You balanced all paths, finding harmony in the middle way.",
                  howTo: [
                    "Deliberately spread your choices across all three stat types",
                    "After gaining 30+ in one stat, switch to building another",
                    "Visit all hub locations: Ashram → River → Temple → Mountain → Forest",
                    "Target: All three stats within 20 points of each other (e.g., 80/75/70)",
                  ],
                  scoreRange: "200–400+ total score",
                  badge: "☯️ Rarest & hardest ending",
                },
              ].map((ending) => (
                <div key={ending.name} className={`rounded-xl border ${ending.border} bg-gradient-to-br ${ending.color} p-5`}>
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-5xl shrink-0">{ending.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white">{ending.name}</h3>
                      <span className="text-xs bg-black/40 text-amber-300 px-2 py-0.5 rounded-full border border-amber-600/30">
                        {ending.badge}
                      </span>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-3 mb-4 border border-white/10">
                    <p className="text-sm text-slate-300 italic">"{ending.quote}"</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">Unlock Condition</p>
                      <p className="text-slate-200">{ending.condition}</p>
                      <p className="text-amber-400 mt-1 font-mono text-xs">{ending.scoreRange}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">How to Achieve</p>
                      <ul className="space-y-1">
                        {ending.howTo.map((h, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-slate-300">
                            <span className="text-amber-400 shrink-0">›</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Score Guide */}
            <div className="bg-slate-900/60 rounded-xl border border-amber-700/40 p-5">
              <h3 className="font-bold text-amber-300 text-lg mb-4">🏅 Score Rating Guide</h3>
              <div className="space-y-2">
                {[
                  { range: "0–99", rating: "Novice Seeker", icon: "🌱", desc: "Just beginning the journey" },
                  { range: "100–199", rating: "Dharmic Wanderer", icon: "🚶", desc: "Explored some paths" },
                  { range: "200–299", rating: "Enlightened Soul", icon: "🌟", desc: "Mastered one path fully" },
                  { range: "300–399", rating: "Sacred Warrior", icon: "⚔️", desc: "Explored multiple paths deeply" },
                  { range: "400–499", rating: "Cosmic Guardian", icon: "🌌", desc: "Near complete mastery" },
                  { range: "500+", rating: "Avatar of Dharma", icon: "🕉️", desc: "Achieved full enlightenment — true completion!" },
                ].map((tier) => (
                  <div key={tier.range} className="flex items-center gap-3 bg-slate-800/50 rounded-lg p-3">
                    <span className="text-2xl w-8 text-center shrink-0">{tier.icon}</span>
                    <div className="flex-1 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-white text-sm">{tier.rating}</p>
                        <p className="text-slate-400 text-xs">{tier.desc}</p>
                      </div>
                      <span className="text-amber-400 font-mono text-sm shrink-0">{tier.range}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Play CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/95 border-t border-amber-700/40 backdrop-blur px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <p className="text-slate-400 text-sm hidden md:block">
            Ready to begin your eternal journey?
          </p>
          <button
            onClick={onClose}
            className="w-full md:w-auto bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 active:scale-95 text-sm"
          >
            🎮 Start Playing Now
          </button>
        </div>
      </div>
    </div>
  );
}
