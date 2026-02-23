/**
 * Audio Manager for Dharma Warriors
 * Uses HTML Audio Elements to fetch royalty-free public domain tracks
 */

// Global Audio Instances
let bgmAudio: HTMLAudioElement | null = null;

// Sitar & Flute Background Track (Royalty Free CDN Link)
const BGM_URL = "https://cdn.pixabay.com/download/audio/2022/10/24/audio_3d1da94c50.mp3?filename=indian-flute-123282.mp3";

// Generic UI Click Sound (Royalty Free short click)
const CLICK_SFX_URL = "https://cdn.pixabay.com/download/audio/2022/03/15/audio_24e3d36b7b.mp3?filename=button-pressed-38129.mp3";

// Combat Hit Sound
const COMBAT_HIT_URL = "https://cdn.pixabay.com/download/audio/2021/08/04/audio_27357c9635.mp3?filename=punch-140236.mp3";

/**
 * Initializes and plays the Background Music.
 * Loops continuously. Lowers volume so game elements are audible.
 */
export const playBGM = () => {
    if (!bgmAudio) {
        bgmAudio = new Audio(BGM_URL);
        bgmAudio.loop = true;
        bgmAudio.volume = 0.3; // 30% volume
    }

    // Browsers block autoplay without interaction. 
    // We wrap this in a promise catch to silently ignore if user hasn't interacted yet.
    bgmAudio.play().catch((err) => {
        console.warn("Autoplay prevented by browser. Audio will start on next interaction.", err);
    });
};

/**
 * Pauses the Background Music.
 */
export const pauseBGM = () => {
    if (bgmAudio) {
        bgmAudio.pause();
    }
};

/**
 * Plays a discrete, short sound effect for button clicks.
 */
export const playClickSFX = () => {
    const sfx = new Audio(CLICK_SFX_URL);
    sfx.volume = 0.6;
    sfx.play().catch(() => { });
};

/**
 * Plays a discrete sound effect for combat hits.
 */
export const playCombatHitSFX = () => {
    const sfx = new Audio(COMBAT_HIT_URL);
    sfx.volume = 0.7;
    sfx.play().catch(() => { });
};
