import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Music, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";

// Beautiful MIDI frequency helper
const midiToFreq = (note: number) => 440 * Math.pow(2, (note - 69) / 12);

// Chords definitions (using MIDI numbers for cozy voicing)
const CHORDS = [
  [48, 55, 59, 62, 64], // Cmaj9 [C3, G3, B3, D4, E4]
  [45, 52, 55, 59, 60], // Am9 [A2, E3, G3, B3, C4]
  [41, 48, 52, 55, 57], // Fmaj9 [F2, C3, E3, G3, A3]
  [43, 50, 53, 57, 60], // G9sus4 [G2, D3, F3, A3, C4]
];

export function CozyAudioPlayer() {
  const { lang } = useI18n();
  const isAr = lang === "ar";
  const [isPlaying, setIsPlaying] = useState(false);
  const [enableSFX, setEnableSFX] = useState(true);
  const [rainVolume, setRainVolume] = useState(0.2); // Cozy rain background volume

  const audioCtxRef = useRef<AudioContext | null>(null);
  const mainGainRef = useRef<GainNode | null>(null);
  const rainGainRef = useRef<GainNode | null>(null);
  const musicIntervalRef = useRef<number | null>(null);
  const currentChordIdx = useRef(0);

  // Initialize Audio Context on click to satisfy browser policies
  const initAudio = () => {
    if (audioCtxRef.current) return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    // Create Main volume nodes
    const mainGain = ctx.createGain();
    mainGain.gain.setValueAtTime(0.5, ctx.currentTime);
    mainGain.connect(ctx.destination);
    mainGainRef.current = mainGain;

    // Create Synthesized Rain Generator (White Noise + Bandpass Filter with LFO modulation)
    const bufferSize = ctx.sampleRate * 2; // 2 seconds of noise
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Lowpass filter to make it rain-like
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(350, ctx.currentTime);

    // LFO to modulate rain filter slightly to sound like wind gusts
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.08, ctx.currentTime); // very slow wind cycles

    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(80, ctx.currentTime); // sweep range

    lfo.connect(lfoGain);
    lfoGain.connect(lowpass.frequency);

    const rainGain = ctx.createGain();
    rainGain.gain.setValueAtTime(rainVolume, ctx.currentTime);
    rainGainRef.current = rainGain;

    // Connect noise to filter, then to gain, then to main
    noiseSource.connect(lowpass);
    lowpass.connect(rainGain);
    rainGain.connect(mainGain);

    // Start rain nodes
    lfo.start();
    noiseSource.start();
  };

  // Sound Effect 1: Synthesize Bubble Pop
  const playBubbleSFX = () => {
    const ctx = audioCtxRef.current;
    if (!ctx || !enableSFX || ctx.state === "suspended") return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      // Sweet upward pitch sweep
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(680, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch (e) {
      console.warn("Audio pop failure", e);
    }
  };

  // Sound Effect 2: Synthesize Sparkle Chime (Twinkle)
  const playSparkleSFX = () => {
    const ctx = audioCtxRef.current;
    if (!ctx || !enableSFX || ctx.state === "suspended") return;

    try {
      const playSingleChime = (delay: number, pitch: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(pitch, ctx.currentTime + delay);

        gain.gain.setValueAtTime(0.0, ctx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + delay + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.35);
      };

      // Play a lovely high-pitched sparkling chord progression
      playSingleChime(0, 1100);
      playSingleChime(0.04, 1320);
      playSingleChime(0.08, 1650);
      playSingleChime(0.12, 1980);
    } catch (e) {
      console.warn("Audio chime failure", e);
    }
  };

  // Generative Lofi chords playing loop
  const triggerNextLofiChord = () => {
    const ctx = audioCtxRef.current;
    if (!ctx || ctx.state === "suspended") return;

    try {
      const chord = CHORDS[currentChordIdx.current];
      currentChordIdx.current = (currentChordIdx.current + 1) % CHORDS.length;

      // Schedule notes inside chord
      chord.forEach((midiNote, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        // 70% sine, 30% triangle wave combination
        osc.type = index % 2 === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(midiToFreq(midiNote), ctx.currentTime);

        // Soft, cozy Lofi filtering
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(600, ctx.currentTime);

        // Stagger/arpeggiate the keys slightly for human strumming feeling
        const strumDelay = index * 0.05 + (Math.random() - 0.5) * 0.02;

        // Long soft envelope
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + strumDelay + 1.2); // slow attack
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.8); // slow decay

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(mainGainRef.current!);

        osc.start(ctx.currentTime + strumDelay);
        osc.stop(ctx.currentTime + 4.2);
      });
    } catch (e) {
      console.warn("Generative chord failure", e);
    }
  };

  // Handle Play/Mute state
  const handlePlayToggle = async () => {
    if (!audioCtxRef.current) {
      initAudio();
    }

    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (isPlaying) {
      // Mute the master volume smoothly
      mainGainRef.current?.gain.setValueAtTime(mainGainRef.current.gain.value, ctx.currentTime);
      mainGainRef.current?.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
      setTimeout(() => {
        ctx.suspend();
        setIsPlaying(false);
      }, 220);
    } else {
      await ctx.resume();
      mainGainRef.current?.gain.setValueAtTime(mainGainRef.current.gain.value, ctx.currentTime);
      mainGainRef.current?.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 0.3);
      setIsPlaying(true);

      // Instantly play first chord
      triggerNextLofiChord();

      // Clear any previous interval and start scheduling chords every 4.2s
      if (musicIntervalRef.current) window.clearInterval(musicIntervalRef.current);
      musicIntervalRef.current = window.setInterval(triggerNextLofiChord, 4200);

      // Play click chime sound
      playSparkleSFX();
    }
  };

  // Sync SFX elements (Attach bubble sound on hovers and sparkles on clicks globally)
  useEffect(() => {
    const handleElementHover = () => playBubbleSFX();
    const handleElementClick = () => playSparkleSFX();

    let cleanups: (() => void)[] = [];

    const attachSoundHandlers = () => {
      // Find all buttons, links, clickable items
      const elements = document.querySelectorAll("button, a, input, select, [role='button']");
      elements.forEach((el) => {
        // Avoid adding multiple listeners if re-attached
        el.addEventListener("mouseenter", handleElementHover, { passive: true });
        el.addEventListener("mousedown", handleElementClick, { passive: true });

        cleanups.push(() => {
          el.removeEventListener("mouseenter", handleElementHover);
          el.removeEventListener("mousedown", handleElementClick);
        });
      });
    };

    // Attach initially and periodically to catch newly rendered components
    attachSoundHandlers();
    const interval = setInterval(attachSoundHandlers, 2500);

    return () => {
      clearInterval(interval);
      cleanups.forEach((cleanup) => cleanup());
      if (musicIntervalRef.current) window.clearInterval(musicIntervalRef.current);
    };
  }, [enableSFX, isPlaying]);

  // Adjust rain gain on volume state change
  useEffect(() => {
    if (rainGainRef.current && audioCtxRef.current) {
      rainGainRef.current.gain.setValueAtTime(rainGainRef.current.gain.value, audioCtxRef.current.currentTime);
      rainGainRef.current.gain.exponentialRampToValueAtTime(Math.max(0.0001, rainVolume), audioCtxRef.current.currentTime + 0.2);
    }
  }, [rainVolume]);

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end gap-3 select-none pointer-events-auto">
      {/* Expanded Dashboard Panel (Only visible when playing) */}
      {isPlaying && (
        <div className="p-4 rounded-3xl glass border border-white/40 shadow-soft w-64 text-[color:var(--mauve)] flex flex-col gap-3 animate-fade-in animate-duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold flex items-center gap-1.5 text-[color:var(--rose-deep)]">
              <Music className="w-3.5 h-3.5 animate-pulse" />
              {isAr ? "نغمات هادئة 📻" : "Generative Cozy Lofi"}
            </span>
            <span className="text-[10px] bg-white/70 px-2 py-0.5 rounded-full border border-[color:var(--border)] uppercase tracking-wider font-bold">
              {isAr ? "نشط" : "Synth Live"}
            </span>
          </div>

          {/* Soundscapes Control */}
          <div className="flex flex-col gap-1.5 mt-1">
            <label className="text-[10px] opacity-75 flex justify-between">
              <span>🌧️ {isAr ? "صوت المطر" : "Gentle Rain"}</span>
              <span>{Math.round(rainVolume * 100)}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="0.4"
              step="0.05"
              value={rainVolume}
              onChange={(e) => setRainVolume(parseFloat(e.target.value))}
              className="w-full h-1 bg-[color:var(--border)] rounded-lg appearance-none cursor-pointer accent-[color:var(--rose-deep)]"
            />
          </div>

          {/* Effects Toggle */}
          <button
            onClick={() => setEnableSFX(!enableSFX)}
            className={`flex items-center justify-between p-2 rounded-2xl border text-xs transition duration-200 ${
              enableSFX
                ? "bg-[color:var(--rose-soft)]/50 border-[color:var(--rose-deep)]/40 text-[color:var(--rose-deep)]"
                : "bg-white/40 border-[color:var(--border)] opacity-60"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {isAr ? "مؤثرات بابل وبريق" : "Interactive SFX Sounds"}
            </span>
            <span className="font-bold">{enableSFX ? "ON" : "OFF"}</span>
          </button>
        </div>
      )}

      {/* Retro Cassette Graphic Button */}
      <button
        onClick={handlePlayToggle}
        className={`group relative flex items-center justify-center p-3 rounded-full border shadow-soft transition-all duration-300 pointer-events-auto active:scale-95 ${
          isPlaying
            ? "bg-rose-gradient text-white border-transparent scale-105 float-slow"
            : "bg-white text-[color:var(--rose-deep)] border-[color:var(--border)] hover:bg-[color:var(--rose-soft)]"
        }`}
        title={isAr ? "شغلي النغمات الهادئة" : "Play cozy lofi soundscape"}
      >
        {/* Glowing aura when playing */}
        {isPlaying && (
          <div className="absolute inset-0 rounded-full bg-[color:var(--rose-deep)] opacity-30 blur-md scale-110 animate-pulse pointer-events-none" />
        )}

        <div className="relative flex items-center gap-2">
          {isPlaying ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}

          {/* Cassette cassette body */}
          <div className={`flex items-center gap-1 overflow-hidden transition-all duration-300 ${isPlaying ? "w-28 opacity-100" : "w-0 opacity-0"}`}>
            <span className="text-[10px] font-display font-medium tracking-wide">
              {isAr ? "موسيقى وراقة 🌸" : "COZY VIBES"}
            </span>
            {/* Spinning hubs */}
            <div className="flex gap-1 items-center">
              <div className="w-2.5 h-2.5 rounded-full border border-dashed border-white animate-spin animate-duration-3000" />
              <div className="w-2.5 h-2.5 rounded-full border border-dashed border-white animate-spin animate-duration-3000" />
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
