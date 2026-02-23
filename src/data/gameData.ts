export type StatType = { hp: number; maxHp: number; attack: number; defense: number; xp: number; level: number };
export type InventoryItem = { id: string; name: string; icon: string; effect: string; used?: boolean; quantity?: number };

export type Character = {
  id: string;
  name: string;
  title: string;
  role: string;
  description: string;
  color: string;
  bgGradient: string;
  avatarBg: string;
  emoji: string;
  stats: StatType;
  inventory: InventoryItem[];
  karma: number;
  dialogues: Record<string, string>;
  skills: string[];
  gold: number;
};

export type Mission = {
  id: string;
  title: string;
  description: string;
  objective: string;
  type: "combat" | "choice" | "puzzle" | "dialogue" | "stealth" | "escort" | "resource" | "boss";
  completed: boolean;
  reward: { xp: number; item?: InventoryItem; karma?: number; gold?: number };
  difficulty: number;
  timeLimit?: number;
  requiredItems?: string[];
};

export type Level = {
  id: number;
  title: string;
  subtitle: string;
  region: string;
  era: string;
  bgTheme: string;
  bgGradient: string;
  accentColor: string;
  textColor: string;
  story: string[];
  lesson: string;
  lessonTitle: string;
  missions: Mission[];
  boss?: Enemy;
  npcs: NPC[];
  unlockCondition: string;
  completionMessage: string;
  resources: { name: string; icon: string; amount: number }[];
};

export type Enemy = {
  id: string;
  name: string;
  title: string;
  description: string;
  emoji: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  specialAbility: string;
  specialCooldown: number;
  weaknesses: string[];
  rewards: { xp: number; item?: InventoryItem; karma: number; gold?: number };
  dialogue: { intro: string; taunt: string; defeat: string };
  phases?: number;
};

export type NPC = {
  id: string;
  name: string;
  title: string;
  emoji: string;
  color: string;
  dialogues: string[];
  quest?: string;
  shop?: boolean;
  shopItems?: InventoryItem[];
};

export type DialogueChoice = {
  text: string;
  response: string;
  effect?: { karma?: number; xp?: number; missionId?: string; gold?: number };
};

export type Skill = {
  id: string;
  name: string;
  icon: string;
  description: string;
  cost: number;
  unlocked: boolean;
  effect: string;
};

// ─────────────────────────────────────────────
// PLAYER CHARACTER
// ─────────────────────────────────────────────
export const PLAYER_CHARACTER: Character = {
  id: "arjun",
  name: "Arjun",
  title: "The Seeker of Dharma",
  role: "Warrior-Sage",
  description:
    "A young warrior from the kingdom of Hastinapura who seeks his true Dharma. Trained in archery and Vedic philosophy, Arjun must navigate the eternal conflict between duty, love, and righteousness.",
  color: "#F59E0B",
  bgGradient: "from-amber-900 to-orange-950",
  avatarBg: "bg-amber-700",
  emoji: "🏹",
  karma: 0,
  gold: 50,
  stats: { hp: 120, maxHp: 120, attack: 22, defense: 15, xp: 0, level: 1 },
  inventory: [
    { id: "gandhiva", name: "Gandhiva Bow", icon: "🏹", effect: "+8 attack in combat", quantity: 1 },
    { id: "healing_herb", name: "Ashwagandha", icon: "🌿", effect: "Restores 30 HP", used: false, quantity: 3 },
    { id: "chariot_token", name: "Chariot Token", icon: "🪙", effect: "Unlocks secret path", quantity: 1 },
  ],
  dialogues: {
    idle: "The Dharma of a warrior is to fight with honor, not with hatred.",
    combat: "I shall meet this challenge with courage and clarity!",
    victory: "Victory belongs to Dharma, not to the sword alone.",
    defeat: "Even in defeat, one who fights with righteousness gains merit.",
  },
  skills: [],
};

// ─────────────────────────────────────────────
// SKILL TREE
// ─────────────────────────────────────────────
export const SKILL_TREE: Skill[] = [
  { id: "swift_strike", name: "Swift Strike", icon: "⚡", description: "Deal 25% more damage on first attack", cost: 50, unlocked: false, effect: "+25% first strike damage" },
  { id: "iron_will", name: "Iron Will", icon: "🛡️", description: "Reduce all incoming damage by 15%", cost: 75, unlocked: false, effect: "-15% damage taken" },
  { id: "healing_hands", name: "Healing Hands", icon: "💚", description: "Heal 15 HP at the start of each combat", cost: 60, unlocked: false, effect: "+15 HP per combat" },
  { id: "karma_shield", name: "Karma Shield", icon: "⚖️", description: "Gain 10% damage boost per 50 karma", cost: 100, unlocked: false, effect: "+10% dmg per 50 karma" },
  { id: "divine_arrow", name: "Divine Arrow", icon: "🎯", description: "Critical hits deal double damage", cost: 120, unlocked: false, effect: "Crits deal 2x damage" },
  { id: "meditation", name: "Deep Meditation", icon: "🧘", description: "Gain 20 wisdom and 10 karma permanently", cost: 80, unlocked: false, effect: "+20 Wisdom, +10 Karma" },
];

// ─────────────────────────────────────────────
// GAME LEVELS - ENHANCED WITH MORE MISSIONS
// ─────────────────────────────────────────────
export const GAME_LEVELS: Level[] = [
  // ══════════════════════════════════════════
  // LEVEL 1 — THE ASHRAM OF GURUKUL
  // ══════════════════════════════════════════
  {
    id: 1,
    title: "The Gurukul Awakening",
    subtitle: "Where the journey of a thousand dharmas begins",
    region: "Himalayan Foothills, Gurukul Ashram",
    era: "Dvapara Yuga — 5000 years ago",
    bgTheme: "forest",
    bgGradient: "from-emerald-950 via-teal-950 to-slate-950",
    accentColor: "#10B981",
    textColor: "text-emerald-300",
    story: [
      "The sun rises over the Himalayan foothills, painting the sky in hues of saffron and gold.",
      "You are Arjun — a 16-year-old student at the Gurukul of the legendary Guru Dronacharya.",
      "Today is the day of the final Guruksha test — a sacred exam that will decide your path as a warrior.",
      "But something is wrong. A sacred scroll containing ancient military mantras has been stolen.",
      "Without it, the Guruksha ceremony cannot begin, and your entire batch of students will be expelled.",
      "Guru Dronacharya looks at you with wise eyes: \"Arjun, you are my finest student. Find the scroll. Prove your Dharma.\"",
    ],
    lesson:
      "Gurukul was the ancient Indian educational system where students lived with their Guru and learned not just academics but ethics, discipline, and life skills. The Guru-Shishya (teacher-student) relationship was sacred and foundational to Indian civilization.",
    lessonTitle: "🎓 Ancient Indian Education: The Gurukul System",
    resources: [
      { name: "Herbs", icon: "🌿", amount: 5 },
      { name: "Gold", icon: "🪙", amount: 50 },
    ],
    missions: [
      {
        id: "m1_1",
        title: "The Morning Assembly",
        description:
          "Attend the morning assembly at the Gurukul. This is where you'll learn about the current situation and meet your fellow students.",
        objective: "Speak with Guru Dronacharya and learn about the stolen scroll",
        type: "dialogue",
        completed: false,
        reward: { xp: 30, karma: 5, gold: 10 },
        difficulty: 1,
      },
      {
        id: "m1_2",
        title: "Interview the Students",
        description:
          "Three students were seen near the sacred vault last night. Question each one to find who knows about the missing scroll.",
        objective: "Talk to Bhima, Duryodhana, and Karna about the missing scroll",
        type: "dialogue",
        completed: false,
        reward: { xp: 50, karma: 5, gold: 15 },
        difficulty: 2,
      },
      {
        id: "m1_3",
        title: "Gather Intelligence",
        description:
          "Search the Gurukul grounds for clues. The thief may have dropped something during their escape.",
        objective: "Find 3 hidden clues scattered around the Gurukul",
        type: "resource",
        completed: false,
        reward: { xp: 40, item: { id: "clue_map", name: "Gurukul Map", icon: "🗺️", effect: "Reveals hidden paths" }, gold: 20 },
        difficulty: 2,
        requiredItems: ["herbs"],
      },
      {
        id: "m1_4",
        title: "Decode the Ancient Clue",
        description:
          "A cryptic Sanskrit shloka was left at the scene. Solve its riddle to find the hiding place of the scroll.",
        objective: "Solve the Sanskrit riddle left by the thief",
        type: "puzzle",
        completed: false,
        reward: { xp: 75, item: { id: "ancient_key", name: "Ancient Key", icon: "🔑", effect: "Opens secret doors" }, gold: 25 },
        difficulty: 3,
      },
      {
        id: "m1_5",
        title: "The Forest Path",
        description:
          "The trail leads to the dense forest behind the Gurukul. Navigate through the forest while avoiding patrolling guards.",
        objective: "Reach the forest clearing without being detected",
        type: "stealth",
        completed: false,
        reward: { xp: 60, karma: 10, gold: 30 },
        difficulty: 3,
        timeLimit: 60,
      },
      {
        id: "m1_6",
        title: "Confront the Betrayer",
        description:
          "The trail leads to the forest. A disgruntled student has taken the scroll and must be confronted. Choose wisely — violence is not always the answer.",
        objective: "Defeat or persuade the scroll thief in the forest",
        type: "choice",
        completed: false,
        reward: { xp: 100, karma: 15, gold: 50 },
        difficulty: 4,
      },
      {
        id: "m1_7",
        title: "Boss: Ashwatthama's Trial",
        description:
          "Ashwatthama, Drona's son, has stolen the scroll out of jealousy. He must be defeated to retrieve it and complete the Guruksha ceremony.",
        objective: "Defeat Ashwatthama in combat",
        type: "boss",
        completed: false,
        reward: { xp: 200, karma: 20, item: { id: "drona_boon", name: "Drona's Boon", icon: "✨", effect: "+20 max HP permanently" }, gold: 100 },
        difficulty: 5,
      },
    ],
    boss: {
      id: "ashwatthama_young",
      name: "Ashwatthama",
      title: "The Resentful Son of Drona",
      description:
        "Drona's own son, who stole the scroll out of jealousy of Arjun's superior skills. Trained equally but consumed by bitterness.",
      emoji: "🗡️",
      hp: 90,
      maxHp: 90,
      attack: 18,
      defense: 10,
      specialAbility: "Fury Strike — Doubles attack when below 30 HP",
      specialCooldown: 3,
      weaknesses: ["compassion", "wisdom"],
      rewards: { xp: 200, karma: 20, gold: 100, item: { id: "drona_boon", name: "Drona's Boon", icon: "✨", effect: "+20 max HP permanently" } },
      dialogue: {
        intro: "You think you're better than me, Arjun? My father taught you everything! But I — I am his son, and still overlooked!",
        taunt: "Your precious Dharma won't save you from my blade!",
        defeat: "I... I was wrong. Jealousy blinded me. Forgive me, Arjun.",
      },
      phases: 1,
    },
    npcs: [
      {
        id: "drona",
        name: "Guru Dronacharya",
        title: "Master of All Weapons",
        emoji: "🧙",
        color: "text-amber-300",
        dialogues: [
          "A true warrior does not merely master weapons, Arjun. He masters himself.",
          "Dharma is not just what is right — it is what is right for YOU, in YOUR role.",
          "The Mahabharata teaches us: righteousness preserved you throughout eternity.",
          "Your Gandhiva bow is a tool — your mind is the true weapon.",
        ],
      },
      {
        id: "bhima",
        name: "Bhima",
        title: "The Mighty Warrior",
        emoji: "💪",
        color: "text-red-300",
        dialogues: [
          "I saw Ashwatthama sneaking near the vault before dawn, Arjun!",
          "He's always been jealous of your relationship with our Guru. This is his doing.",
          "Want me to come with you? I'll smash him into the ground!",
        ],
      },
      {
        id: "karna",
        name: "Karna",
        title: "The Generous Warrior",
        emoji: "☀️",
        color: "text-yellow-300",
        dialogues: [
          "I did not take the scroll, Arjun. But I know who did.",
          "Jealousy is a poison more deadly than any weapon. Remember that.",
          "Even in confronting a thief — choose righteousness over revenge.",
        ],
      },
      {
        id: "vyasa",
        name: "Sage Vyasa",
        title: "The Sage of the Forest",
        emoji: "📿",
        color: "text-purple-300",
        dialogues: [
          "The forest holds many secrets, young Arjun. Walk carefully.",
          "Knowledge gained through struggle is knowledge that stays.",
          "Your journey has only just begun.",
        ],
      },
    ],
    unlockCondition: "Starting level",
    completionMessage:
      "The Guruksha ceremony is saved! Guru Dronacharya places his hand on your head: \"You have passed the true test, Arjun — not of strength, but of Dharma. The journey has just begun.\"",
  },

  // ══════════════════════════════════════════
  // LEVEL 2 — THE RIVER KINGDOM
  // ══════════════════════════════════════════
  {
    id: 2,
    title: "The River of Righteousness",
    subtitle: "Where duty meets compassion on the banks of the sacred Ganga",
    region: "Banks of the Ganga, Kingdom of Panchala",
    era: "Dvapara Yuga — After the Gurukul Years",
    bgTheme: "river",
    bgGradient: "from-blue-950 via-indigo-950 to-slate-950",
    accentColor: "#3B82F6",
    textColor: "text-blue-300",
    story: [
      "Years have passed since the Gurukul. You are now a renowned warrior in the kingdom of Hastinapura.",
      "Your mentor Guru Dronacharya sends you on a critical mission to the kingdom of Panchala.",
      "The sacred Ganga river — mother of all rivers — is being poisoned by a warlord named Kaliya Naga.",
      "His army has blocked the river tributaries, causing crops to fail and villages to starve.",
      "Thousands of farmers, women, and children face famine and death.",
      "But Kaliya Naga is powerful, and attacking him directly would mean war. There must be another way.",
      "King Drupada of Panchala approaches you: \"Arjun, you are the only one with the skill and the heart to face Kaliya Naga. Will you answer the call of Dharma?\"",
    ],
    lesson:
      "Ancient Indian kingdoms were built around sacred rivers like the Ganga, Yamuna, and Saraswati. These rivers were not just water sources — they were considered divine mothers, central to agriculture, culture, and spirituality. Protecting them was considered a sacred duty (Dharma).",
    lessonTitle: "🌊 Sacred Rivers of Ancient India: Lifelines of Civilization",
    resources: [
      { name: "Food", icon: "🍚", amount: 10 },
      { name: "Gold", icon: "🪙", amount: 100 },
    ],
    missions: [
      {
        id: "m2_1",
        title: "The Dying Village",
        description:
          "Three villages along the Ganga are without water. Organize the village elders to find an alternative water route from the forest springs.",
        objective: "Help 3 village elders find the forest spring route",
        type: "choice",
        completed: false,
        reward: { xp: 80, karma: 15, gold: 40 },
        difficulty: 2,
      },
      {
        id: "m2_2",
        title: "The Starving Family",
        description:
          "A mother with three children hasn't eaten in 2 days. She asks for help. You must decide how to help while managing your limited resources.",
        objective: "Help the family without depleting your food supplies",
        type: "resource",
        completed: false,
        reward: { xp: 50, karma: 20, gold: 30 },
        difficulty: 2,
        requiredItems: ["food"],
      },
      {
        id: "m2_3",
        title: "The Hidden Spring",
        description:
          "Explore the forest to find a hidden spring that could provide water to the villages. But beware — Kaliya's scouts patrol the area.",
        objective: "Find the hidden spring while avoiding Kaliya's scouts",
        type: "stealth",
        completed: false,
        reward: { xp: 70, karma: 10, gold: 50 },
        difficulty: 3,
        timeLimit: 90,
      },
      {
        id: "m2_4",
        title: "Infiltrate Kaliya's Camp",
        description:
          "Disguise yourself as a traveling merchant to spy on Kaliya Naga's camp and find the weakness in his dam construction.",
        objective: "Gather 3 pieces of intelligence from Kaliya's camp",
        type: "dialogue",
        completed: false,
        reward: { xp: 100, item: { id: "dam_plans", name: "Dam Blueprints", icon: "📋", effect: "Reveals Kaliya's weak points" }, gold: 60 },
        difficulty: 3,
      },
      {
        id: "m2_5",
        title: "The Poisoned Well",
        description:
          "Kaliya has poisoned the village well. You must find the antidote hidden in the temple's sacred garden.",
        objective: "Solve the temple riddle to find the antidote",
        type: "puzzle",
        completed: false,
        reward: { xp: 90, item: { id: "antidote", name: "River Antidote", icon: "💧", effect: "Cures poison effects" }, gold: 45 },
        difficulty: 3,
      },
      {
        id: "m2_6",
        title: "The Village Defense",
        description:
          "Kaliya's soldiers are attacking a village. You must organize the villagers to defend themselves while you lead the counter-attack.",
        objective: "Defend the village against Kaliya's soldiers",
        type: "combat",
        completed: false,
        reward: { xp: 120, karma: 15, gold: 70 },
        difficulty: 4,
      },
      {
        id: "m2_7",
        title: "Boss: Kaliya Naga",
        description:
          "Kaliya Naga himself awaits at the dam. He must be defeated to restore the sacred river's flow.",
        objective: "Defeat Kaliya Naga in combat",
        type: "boss",
        completed: false,
        reward: { xp: 250, karma: 25, item: { id: "naga_gem", name: "Naga's Repentance Gem", icon: "💎", effect: "+15 attack permanently" }, gold: 150 },
        difficulty: 5,
      },
    ],
    boss: {
      id: "kaliya_naga",
      name: "Kaliya Naga",
      title: "The River Tyrant",
      description:
        "A powerful warlord who grew up in poverty and now controls water supplies to extort kingdoms. His pain is real, but his methods are monstrous.",
      emoji: "🐉",
      hp: 130,
      maxHp: 130,
      attack: 24,
      defense: 14,
      specialAbility: "Poison Wave — Poisons Arjun for 3 turns, dealing 8 damage per turn",
      specialCooldown: 4,
      weaknesses: ["diplomacy", "truth"],
      rewards: { xp: 250, karma: 25, gold: 150, item: { id: "naga_gem", name: "Naga's Repentance Gem", icon: "💎", effect: "+15 attack permanently" } },
      dialogue: {
        intro: "You think you're a hero? You kings never cared about us farmers until we took what you ignored!",
        taunt: "The river belongs to those who FIGHT for it, not those who pray to it!",
        defeat: "You... you didn't kill me. Why? I expected no mercy from a warrior of the kings.",
      },
      phases: 2,
    },
    npcs: [
      {
        id: "drupada",
        name: "King Drupada",
        title: "Righteous King of Panchala",
        emoji: "👑",
        color: "text-amber-300",
        dialogues: [
          "A king's first duty is to his people, not his pride. Remember that, Arjun.",
          "Kaliya Naga was once a farmer whose lands were destroyed by floods. His anger has reason.",
          "Can you defeat him without destroying him? That is the true test of a Dharmic warrior.",
        ],
      },
      {
        id: "draupadi",
        name: "Draupadi",
        title: "Princess of Panchala",
        emoji: "🌺",
        color: "text-pink-300",
        dialogues: [
          "The women of these villages have walked miles for water, Arjun. Every day.",
          "Do not see only the battle ahead. See the thousands who suffer and pray for your victory.",
          "True strength is not in winning — it is in fighting for those who cannot fight.",
        ],
      },
      {
        id: "village_elder",
        name: "Elder Govind",
        title: "Village Elder",
        emoji: "👴",
        color: "text-green-300",
        dialogues: [
          "We have lived by this river for generations. Now it turns against us.",
          "The children are dying, warrior. Help us, and the gods will bless you.",
          "Kaliya's soldiers take our food. We have nothing left to give.",
        ],
      },
    ],
    unlockCondition: "Complete Level 1",
    completionMessage:
      "The iron dam breaks! The sacred Ganga rushes forward, flooding the dry fields with life. Thousands of villagers cheer from the riverbanks. Kaliya Naga, shown mercy, vows to use his strength to protect rather than destroy. You have turned an enemy into an ally through Dharma.",
  },

  // ══════════════════════════════════════════
  // LEVEL 3 — THE KURUKSHETRA DILEMMA
  // ══════════════════════════════════════════
  {
    id: 3,
    title: "The Kurukshetra Dilemma",
    subtitle: "On the battlefield where the Gita was born",
    region: "Plains of Kurukshetra, The Great War",
    era: "The Great Mahabharata War",
    bgTheme: "war",
    bgGradient: "from-red-950 via-orange-950 to-slate-950",
    accentColor: "#EF4444",
    textColor: "text-red-300",
    story: [
      "The conches have blown. The war drums thunder across the plains of Kurukshetra.",
      "Eighteen akshauhini armies face each other — the greatest war the world has ever seen.",
      "You stand in your chariot, guided by Lord Krishna himself, your charioteer and divine counsel.",
      "But when you see your Gurus, uncles, cousins, and friends on the opposite side — you falter.",
      "Your Gandiva bow slips from your hands. Your knees give way. Tears blur your vision.",
      "\"I cannot fight my own people, Krishna. What kingdom, what victory is worth this price?\"",
      "And then Krishna begins to speak — words that will echo through eternity.",
      "This is the moment of the Bhagavad Gita. Your greatest test is not the war outside, but the war within.",
    ],
    lesson:
      "The Bhagavad Gita (Song of God) is a 700-verse scripture within the Mahabharata. It contains Lord Krishna's counsel to Arjun about Dharma, duty, the immortal soul, yoga, and the nature of action. It remains one of humanity's most profound philosophical texts, studied worldwide.",
    lessonTitle: "📖 The Bhagavad Gita: When God Became a Charioteer",
    resources: [
      { name: "Divine Blessings", icon: "✨", amount: 3 },
      { name: "Gold", icon: "🪙", amount: 200 },
    ],
    missions: [
      {
        id: "m3_1",
        title: "The Inner War Begins",
        description:
          "Your mind is in turmoil. Face your inner doubts — manifestations of fear, attachment, and grief — in a battle of the soul.",
        objective: "Defeat the 3 manifestations of inner weakness: Fear, Attachment, and Grief",
        type: "combat",
        completed: false,
        reward: { xp: 120, karma: 20, gold: 80 },
        difficulty: 3,
      },
      {
        id: "m3_2",
        title: "Krishna's First Teaching",
        description:
          "Krishna reveals the first chapter of divine wisdom. Listen carefully to understand the nature of the soul.",
        objective: "Understand Krishna's teaching about the immortal soul",
        type: "dialogue",
        completed: false,
        reward: { xp: 80, karma: 15, gold: 50 },
        difficulty: 2,
      },
      {
        id: "m3_3",
        title: "The Fallen Warrior",
        description:
          "A young warrior on the enemy side has fallen. His mother begs you to let her give him a proper burial. But time is short.",
        objective: "Decide whether to grant the burial or continue the march",
        type: "choice",
        completed: false,
        reward: { xp: 100, karma: 25, gold: 60 },
        difficulty: 3,
      },
      {
        id: "m3_4",
        title: "Understand the Gita's Teaching",
        description:
          "Krishna reveals the 18 chapters of divine wisdom. Choose your understanding of each key shloka to gain clarity.",
        objective: "Answer Krishna's 5 questions about Dharma correctly",
        type: "puzzle",
        completed: false,
        reward: { xp: 150, item: { id: "gita_wisdom", name: "Gita's Wisdom", icon: "📿", effect: "+25 max HP and +5 attack" }, gold: 100 },
        difficulty: 4,
      },
      {
        id: "m3_5",
        title: "The Chariot Inspection",
        description:
          "Before the great battle, inspect your chariot and divine weapons. Ensure everything is in perfect order.",
        objective: "Check and prepare your chariot for battle",
        type: "resource",
        completed: false,
        reward: { xp: 60, item: { id: "chariot_token", name: "Chariot Token", icon: "🪙", effect: "Unlocks secret path" }, gold: 70 },
        difficulty: 2,
      },
      {
        id: "m3_6",
        title: "The Betrayal of Drona",
        description:
          "Your beloved Guru Drona has been killed in an dishonorable way. You must decide how to honor his memory while following the rules of war.",
        objective: "Choose the proper way to honor Guru Drona",
        type: "choice",
        completed: false,
        reward: { xp: 110, karma: 20, gold: 90 },
        difficulty: 4,
      },
      {
        id: "m3_7",
        title: "The Final Stand",
        description:
          "Armed with divine clarity, face the greatest warrior on the opposing side — your own teacher Karna, who fights for the wrong side for honor's sake.",
        objective: "Face Karna in the ultimate test of Dharmic combat",
        type: "boss",
        completed: false,
        reward: { xp: 300, karma: 30, item: { id: "vijaya_bow", name: "Vijaya — Karna's Bow", icon: "🏹", effect: "+20 attack. Unlocks divine arrow ability." }, gold: 200 },
        difficulty: 5,
      },
    ],
    boss: {
      id: "karna_boss",
      name: "Karna",
      title: "The Invincible Son of the Sun",
      description:
        "Arjun's greatest rival and secret brother. Karna fights for Duryodhana not out of malice, but out of unwavering loyalty and honor — proving that even the most righteous warriors can stand on opposite sides.",
      emoji: "☀️",
      hp: 180,
      maxHp: 180,
      attack: 30,
      defense: 20,
      specialAbility: "Surya Kavach — Divine armor that blocks 1 attack completely every 2 turns",
      specialCooldown: 2,
      weaknesses: ["truth", "compassion"],
      rewards: { xp: 300, karma: 30, gold: 200, item: { id: "surya_armor", name: "Fragment of Surya Kavach", icon: "🛡️", effect: "Block 1 attack per battle" } },
      dialogue: {
        intro: "So it comes to this, Arjun. I have always known this day would come. Do not hold back — fight me as the warrior you truly are!",
        taunt: "Your Krishna whispers strategy in your ear. I have only my own strength — and yet I still stand!",
        defeat: "You fought with honor, Arjun. That is all a warrior can ask. Tell me one thing... who am I truly?",
      },
      phases: 2,
    },
    npcs: [
      {
        id: "krishna",
        name: "Lord Krishna",
        title: "Divine Charioteer, Bhagavan",
        emoji: "🪈",
        color: "text-blue-300",
        dialogues: [
          "\"You have a right to perform your prescribed duty, but never to the fruits of action.\" — Gita 2.47",
          "\"The soul is neither born nor dies at any time. It is not slain when the body is slain.\" — Gita 2.20",
          "\"One who performs duty without attachment, surrendering the results to the Supreme, is unaffected by sin.\" — Gita 5.10",
          "\"Set thy heart upon thy work, but never on its reward.\" — Bhagavad Gita",
          "Arjun, your grief comes from attachment to the body. The warriors you see are not just bodies — they are eternal souls.",
        ],
      },
      {
        id: "vyasa",
        name: "Sage Vyasa",
        title: "Author of the Mahabharata",
        emoji: "🖋️",
        color: "text-purple-300",
        dialogues: [
          "What is not in the Mahabharata, is not in this world.",
          "This war teaches us that even the most moral choices carry consequences.",
          "Dharma is complex — it is not black and white. That is its greatest teaching.",
        ],
      },
      {
        id: "bhisma",
        name: "Granduncle Bhisma",
        title: "The Grandsire of the Kurus",
        emoji: "⚔️",
        color: "text-cyan-300",
        dialogues: [
          "Arjun, I am bound by my vow. I cannot fight you, but I cannot join you either.",
          "The war will destroy everything we have built. But sometimes, destruction is necessary for renewal.",
          "Remember your Dharma, even when it is painful.",
        ],
      },
    ],
    unlockCondition: "Complete Level 2",
    completionMessage:
      "The battle is won. But as you stand amid the silence that follows the greatest war in history, you understand what Krishna taught you: victory is not the goal — righteous action is. You have fought not for kingdoms, but for Dharma itself. And in that, you are forever victorious.",
  },

  // ══════════════════════════════════════════
  // LEVEL 4 — THE CITY OF TEMPLES
  // ══════════════════════════════════════════
  {
    id: 4,
    title: "The Lost City of Temples",
    subtitle: "Uncover the ancient knowledge hidden beneath a forgotten civilization",
    region: "Vijayanagara — The City of Victory",
    era: "Post-Kali Yuga — 1500 CE",
    bgTheme: "temple",
    bgGradient: "from-amber-950 via-yellow-950 to-slate-950",
    accentColor: "#F59E0B",
    textColor: "text-amber-300",
    story: [
      "Centuries have passed since Kurukshetra. You are now a reincarnated guardian — a warrior-sage chosen to protect ancient Indian wisdom.",
      "The mighty Vijayanagara Empire — the last great Hindu empire — is under threat.",
      "Invaders have arrived with one goal: destroy the great temples and erase the knowledge within them.",
      "The Hampi temples contain thousands of years of astronomical, mathematical, and philosophical knowledge.",
      "These are the same scriptures that gave the world zero, algebra, and the heliocentric model centuries before Copernicus.",
      "A corrupt general named Ravan Das has allied with the invaders to loot the temples.",
      "The temple priests have hidden the sacred Vedic library — but only you can decode its location.",
    ],
    lesson:
      "The Vijayanagara Empire (1336–1646 CE) was one of the greatest empires in South Indian history. Their capital Hampi is now a UNESCO World Heritage Site. Ancient Indian scholars like Aryabhata, Brahmagupta, and Charaka made revolutionary discoveries in mathematics, astronomy, and medicine centuries ahead of the Western world.",
    lessonTitle: "🏛️ Vijayanagara & Ancient Indian Scientific Achievements",
    resources: [
      { name: "Sacred Oil", icon: "🪔", amount: 5 },
      { name: "Gold", icon: "🪙", amount: 300 },
    ],
    missions: [
      {
        id: "m4_1",
        title: "The Temple Patrol",
        description:
          "Ravan Das's soldiers are patrolling the temple grounds. You must gather information about their movements.",
        objective: "Observe and record the patrol patterns of enemy soldiers",
        type: "stealth",
        completed: false,
        reward: { xp: 70, karma: 10, gold: 80 },
        difficulty: 3,
        timeLimit: 120,
      },
      {
        id: "m4_2",
        title: "Protect the Temple Priests",
        description:
          "Twenty temple priests are being hunted by Ravan Das's soldiers. Escort them safely to the hidden cave monastery.",
        objective: "Escort all 20 priests to the cave monastery undetected",
        type: "escort",
        completed: false,
        reward: { xp: 150, karma: 25, gold: 120 },
        difficulty: 4,
        timeLimit: 180,
      },
      {
        id: "m4_3",
        title: "The Secret Passage",
        description:
          "The priests reveal a hidden passage beneath the temple. You must navigate through it while avoiding traps.",
        objective: "Navigate the secret passage and disarm 5 traps",
        type: "puzzle",
        completed: false,
        reward: { xp: 100, item: { id: "secret_key", name: "Temple Key", icon: "🗝️", effect: "Opens temple doors" }, gold: 90 },
        difficulty: 4,
      },
      {
        id: "m4_4",
        title: "The Burning Library",
        description:
          "Ravan Das has found the entrance to the library. You must stop him before he burns the 10,000 manuscripts inside.",
        objective: "Defeat Ravan Das and protect the library",
        type: "combat",
        completed: false,
        reward: { xp: 180, karma: 20, gold: 150 },
        difficulty: 5,
      },
      {
        id: "m4_5",
        title: "Decode the Astronomical Map",
        description:
          "The library's location is encoded in the temple's ceiling — a star map using ancient Indian astronomical knowledge. Decode it.",
        objective: "Use Vedic astronomy to decode the star map in the Virupaksha temple",
        type: "puzzle",
        completed: false,
        reward: { xp: 150, item: { id: "vedic_star_map", name: "Vedic Star Map", icon: "⭐", effect: "Reveals the hidden library location" }, gold: 100 },
        difficulty: 4,
      },
      {
        id: "m4_6",
        title: "The Merchant's Dilemma",
        description:
          "A merchant offers to sell you information about Ravan Das's plans. But he demands a high price. Decide whether to pay or find another way.",
        objective: "Decide how to obtain the merchant's information",
        type: "choice",
        completed: false,
        reward: { xp: 90, karma: 15, gold: 110 },
        difficulty: 3,
      },
      {
        id: "m4_7",
        title: "Boss: Ravan Das",
        description:
          "Ravan Das himself awaits at the library entrance. He must be defeated to save the ancient knowledge.",
        objective: "Defeat Ravan Das in combat",
        type: "boss",
        completed: false,
        reward: { xp: 350, karma: 35, item: { id: "divine_torch", name: "Torch of Enlightenment", icon: "🔦", effect: "Reveals hidden choices in all future levels" }, gold: 300 },
        difficulty: 5,
      },
      {
        id: "m4_8",
        title: "The Final Archive",
        description:
          "With Ravan Das defeated, enter the library and retrieve the most important manuscripts before the invaders return.",
        objective: "Collect 5 sacred manuscripts from the library",
        type: "resource",
        completed: false,
        reward: { xp: 200, karma: 30, gold: 250 },
        difficulty: 4,
        timeLimit: 150,
      },
    ],
    boss: {
      id: "ravan_das",
      name: "Ravan Das",
      title: "The Knowledge Destroyer",
      description:
        "A corrupt general who believes that destroying ancient knowledge will make his masters more powerful. He fears what the old texts might reveal about justice and equality.",
      emoji: "🔥",
      hp: 160,
      maxHp: 160,
      attack: 28,
      defense: 18,
      specialAbility: "Hellfire — Sets the battlefield ablaze, dealing 10 damage to Arjun each turn for 3 turns",
      specialCooldown: 5,
      weaknesses: ["knowledge", "light"],
      rewards: { xp: 350, karma: 35, gold: 300, item: { id: "divine_torch", name: "Torch of Enlightenment", icon: "🔦", effect: "Reveals hidden choices in all future levels" } },
      dialogue: {
        intro: "Ancient scrolls? Old superstitions! Burn it all! The new world has no room for forgotten gods!",
        taunt: "You fight for dust and old paper. I fight for POWER. Let's see which wins!",
        defeat: "HOW?! You... you should have fled. Why do you care so much about old books?",
      },
      phases: 2,
    },
    npcs: [
      {
        id: "vidyaranya",
        name: "Sage Vidyaranya",
        title: "Protector of Ancient Wisdom",
        emoji: "📚",
        color: "text-amber-300",
        dialogues: [
          "Aryabhata declared that the Earth rotates on its axis in 499 CE — over 1000 years before Copernicus.",
          "Our ancestors calculated the distance to the Moon accurately without telescopes.",
          "The zero — shunyata — was not just a number to us. It was a philosophy of existence.",
          "Protect this library, Arjun. Inside are the roots of the world's knowledge.",
        ],
      },
      {
        id: "hampi_queen",
        name: "Queen Nagalakshmi",
        title: "Defender of Hampi",
        emoji: "⚔️",
        color: "text-rose-300",
        dialogues: [
          "A civilization is not made of stones and temples. It is made of knowledge and values.",
          "The invaders can burn our walls. But they cannot burn what lives in minds and hearts.",
          "Fight for the future, Arjun. Our descendants need to know who they truly are.",
        ],
      },
      {
        id: "temple_guard",
        name: "Captain Ranga",
        title: "Temple Guard Captain",
        emoji: "🛡️",
        color: "text-green-300",
        dialogues: [
          "The priests have hidden in the caves. But we cannot leave without securing the library.",
          "Ravan Das will not stop until everything burns. We must hold the line.",
          "Your skills are needed, warrior. The fate of our knowledge rests on your shoulders.",
        ],
      },
    ],
    unlockCondition: "Complete Level 3",
    completionMessage:
      "The library is saved! 10,000 manuscripts survive — among them, texts on medicine, mathematics, astronomy, music, and philosophy. You stand in the vast library as oil lamps flicker and illuminate centuries of wisdom. This knowledge will survive and inspire generations.",
  },
];

// ─────────────────────────────────────────────
// GITA QUIZ (for Level 3 puzzle)
// ─────────────────────────────────────────────
export const GITA_QUESTIONS = [
  {
    question: "What does Krishna say is the eternal nature of the soul?",
    options: [
      "The soul is born with the body and dies with it",
      "The soul is eternal — it is never born and never dies",
      "The soul goes to heaven after death",
      "The soul can be destroyed by a powerful weapon",
    ],
    correct: 1,
    explanation: "Gita 2.20: 'The soul is never born nor dies at any time. It has not come into being, does not come into being, and will not come into being. It is unborn, eternal, ever-existing, and primeval.'",
  },
  {
    question: "What is the core teaching of 'Nishkama Karma' in the Gita?",
    options: [
      "Avoid all action to achieve peace",
      "Act only for personal reward",
      "Perform your duty without attachment to results",
      "Fight only when you will win",
    ],
    correct: 2,
    explanation: "Gita 2.47: 'You have a right to perform your prescribed duty, but you are not entitled to the fruits of action.' This is the foundation of Karma Yoga.",
  },
  {
    question: "When Arjun refuses to fight, what does Krishna call this feeling?",
    options: [
      "Wisdom and compassion",
      "Cowardice and delusion born of attachment",
      "True Dharma",
      "The highest virtue",
    ],
    correct: 1,
    explanation: "Krishna tells Arjun that his grief is born of delusion (moha) and that yielding to weakness of heart is not worthy of an Aryan. He must rise and fight his prescribed duty.",
  },
  {
    question: "What are the three paths to God described in the Bhagavad Gita?",
    options: [
      "War, Peace, and Surrender",
      "Karma (Action), Jnana (Knowledge), and Bhakti (Devotion)",
      "Wealth, Power, and Wisdom",
      "Silence, Prayer, and Fasting",
    ],
    correct: 1,
    explanation: "The Gita describes three main paths: Karma Yoga (path of selfless action), Jnana Yoga (path of knowledge), and Bhakti Yoga (path of devotion) — all leading to liberation (Moksha).",
  },
  {
    question: "What does 'Dharma' mean in the context of the Mahabharata?",
    options: [
      "Religion alone",
      "Following any law blindly",
      "The righteous duty unique to each person's role and situation",
      "Winning at any cost",
    ],
    correct: 2,
    explanation: "Dharma in the Mahabharata is deeply contextual — it is the right action based on one's role, situation, time, and values. It is not a rigid rulebook but a living, evolving principle of righteousness.",
  },
];

// ─────────────────────────────────────────────
// RIDDLE (for Level 1 puzzle)
// ─────────────────────────────────────────────
export const GURUKUL_RIDDLE = {
  shloka: "\"I have no mouth but I speak. I have no eyes but I see all. I hold the knowledge of armies, yet I cause no harm. I am lost when hidden, found when read. What am I?\"",
  options: ["A sacred scroll", "A Guru", "A sword", "A divine vision"],
  correct: 0,
  explanation: "The scroll holds written knowledge — it speaks without a mouth, contains strategic wisdom, causes no harm, and its value is lost when it is hidden away from learning.",
};

// ─────────────────────────────────────────────
// STAR MAP PUZZLE (for Level 4 puzzle)
// ─────────────────────────────────────────────
export const STAR_MAP_PUZZLE = {
  question: "Aryabhata stated that Earth rotates on its axis, completing one rotation in how many hours, as calculated in his Aryabhatiya (499 CE)?",
  options: ["Exactly 24 hours", "23 hours, 56 minutes, and 4 seconds (sidereal day)", "12 hours", "48 hours"],
  correct: 1,
  explanation: "Aryabhata's calculation of Earth's rotation was extraordinarily precise — 23 hours, 56 minutes, and 4.1 seconds — nearly identical to modern measurements. He also proposed a heliocentric model 1000 years before Copernicus!",
};

// ─────────────────────────────────────────────
// VILLAGE CHOICES (for Level 2)
// ─────────────────────────────────────────────
export const VILLAGE_CHOICES = [
  {
    scenario: "Elder Govind's village has no water. The river is 5 km away.",
    options: [
      { text: "🪣 Organize a human chain to carry water from the forest spring", karma: 10, xp: 25, gold: 20, correct: true },
      { text: "⚔️ March to Kaliya's dam immediately and fight everyone in sight", karma: -5, xp: 5, gold: 50, correct: false },
      { text: "🛣️ Help villagers dig a temporary channel from the spring to the village", karma: 15, xp: 30, gold: 30, correct: true },
    ],
    lesson: "The most Dharmic solution considers both immediate relief and long-term solutions without unnecessary violence.",
  },
  {
    scenario: "A mother with three children hasn't eaten in 2 days. She asks for help.",
    options: [
      { text: "🌾 Share your own rations and help her join the evacuation group", karma: 15, xp: 25, gold: 10, correct: true },
      { text: "🤷 Tell her you have a bigger mission and can't help individuals", karma: -10, xp: 0, gold: 0, correct: false },
      { text: "📣 Organize the village to collectively share remaining food", karma: 20, xp: 35, gold: 25, correct: true },
    ],
    lesson: "A true warrior's mission is always the people, not just the battles.",
  },
  {
    scenario: "You discover a hidden food cache that Kaliya's men hoarded.",
    options: [
      { text: "📦 Distribute all food to the starving villages immediately", karma: 20, xp: 30, gold: 15, correct: true },
      { text: "🔒 Keep some as battle supplies for the coming fight", karma: 5, xp: 15, gold: 40, correct: false },
      { text: "🤝 Leave a portion and distribute the rest — balance practical needs with compassion", karma: 15, xp: 25, gold: 20, correct: true },
    ],
    lesson: "Dharma often requires balancing multiple competing goods — pure altruism and practical needs.",
  },
];

// ─────────────────────────────────────────────
// STEALTH CHALLENGE LOCATIONS
// ─────────────────────────────────────────────
export const STEALTH_LOCATIONS = [
  {
    id: "forest_path",
    name: "The Forest Path",
    description: "A winding path through dense forest. Enemy scouts patrol every 30 seconds.",
    difficulty: 3,
    timeLimit: 60,
    obstacles: ["Patrol", "Trap", "Guard Tower"],
    rewards: { xp: 60, karma: 10, gold: 30 },
  },
  {
    id: "kaliya_camp",
    name: "Kaliya's Camp",
    description: "The enemy camp is heavily guarded. You must move silently and avoid detection.",
    difficulty: 4,
    timeLimit: 90,
    obstacles: ["Patrol", "Guard", "Watch Tower", "Trap"],
    rewards: { xp: 100, karma: 5, gold: 60 },
  },
  {
    id: "temple_grounds",
    name: "Temple Grounds",
    description: "Ravan Das's soldiers patrol the sacred grounds. Move carefully.",
    difficulty: 4,
    timeLimit: 120,
    obstacles: ["Patrol", "Guard", "Trap", "Watch Tower"],
    rewards: { xp: 70, karma: 15, gold: 80 },
  },
];

// ─────────────────────────────────────────────
// ESCORT MISSIONS
// ─────────────────────────────────────────────
export const ESCORT_MISSIONS = [
  {
    id: "priest_escort",
    name: "Escort the Priests",
    description: "20 temple priests need to reach the cave monastery safely.",
    npcCount: 20,
    enemies: ["Soldier", "Scout", "Captain"],
    timeLimit: 180,
    difficulty: 4,
    rewards: { xp: 150, karma: 25, gold: 120 },
  },
];
