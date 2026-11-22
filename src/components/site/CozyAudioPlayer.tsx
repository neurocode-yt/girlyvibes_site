import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
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
  const [rainVolume, setRainVolume] = useState(0.2);
  const [audioFailed, setAudioFailed] = useState(false);
  const switchingAudio = useRef(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const mainGainRef = useRef<GainNode | null>(null);
  const rainGainRef = useRef<GainNode | null>(null);
  const currentChordIdx = useRef(0);

  // Initialize Audio Context on click to satisfy browser policies
  const initAudio = () => {
    if (audioCtxRef.current) return;

    const AudioContextClass =
      window.AudioContext ??
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) throw new Error("Audio playback is unavailable");
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
  const playBubbleSFX = useCallback(() => {
    const ctx = audioCtxRef.current;
    const masterGain = mainGainRef.current;
    if (!ctx || ctx.state !== "running" || !masterGain) return;

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
      gain.connect(masterGain);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch (e) {
      console.warn("Audio pop failure", e);
    }
  }, []);

  // Sound Effect 2: Synthesize Sparkle Chime (Twinkle)
  const playSparkleSFX = useCallback(() => {
    const ctx = audioCtxRef.current;
    const masterGain = mainGainRef.current;
    if (!ctx || ctx.state !== "running" || !masterGain) return;

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
        gain.connect(masterGain);

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
  }, []);

  // Generative Lofi chords playing loop
  const triggerNextLofiChord = useCallback(() => {
    const ctx = audioCtxRef.current;
    const masterGain = mainGainRef.current;
    if (!ctx || ctx.state !== "running" || !masterGain) return;

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
        const strumDelay = Math.max(0, index * 0.05 + (Math.random() - 0.5) * 0.02);

        // Long soft envelope
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + strumDelay + 1.2); // slow attack
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.8); // slow decay

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc.start(ctx.currentTime + strumDelay);
        osc.stop(ctx.currentTime + 4.2);
      });
    } catch (e) {
      console.warn("Generative chord failure", e);
    }
  }, []);

  // Handle Play/Mute state
  const handlePlayToggle = async () => {
    if (switchingAudio.current) return;
    switchingAudio.current = true;
    setAudioFailed(false);
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      const gain = mainGainRef.current?.gain;
      if (!ctx || !gain) throw new Error("Audio is unavailable");

      gain.cancelScheduledValues(ctx.currentTime);
      if (isPlaying) {
        setIsPlaying(false);
        gain.setTargetAtTime(0, ctx.currentTime, 0.045);
        await new Promise((resolve) => window.setTimeout(resolve, 200));
        await ctx.suspend();
      } else {
        await ctx.resume();
        gain.setTargetAtTime(0.5, ctx.currentTime, 0.06);
        setIsPlaying(true);
      }
    } catch {
      setAudioFailed(true);
    } finally {
      switchingAudio.current = false;
    }
  };

  useEffect(() => {
    if (!isPlaying) return;
    triggerNextLofiChord();
    const interval = window.setInterval(triggerNextLofiChord, 4200);
    return () => window.clearInterval(interval);
  }, [isPlaying, triggerNextLofiChord]);

  useEffect(() => {
    if (!isPlaying || !enableSFX) return;
    const controlAt = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return null;
      const control = target.closest("button, a[href], input, select, [role='button']");
      return control?.matches(":disabled, [aria-disabled='true']") ? null : control;
    };
    const hover = (event: PointerEvent) => {
      const control = controlAt(event.target);
      if (event.pointerType !== "mouse" || !control) return;
      if (!(event.relatedTarget instanceof Node) || !control.contains(event.relatedTarget)) {
        playBubbleSFX();
      }
    };
    const click = (event: MouseEvent) => {
      if (controlAt(event.target)) playSparkleSFX();
    };
    document.addEventListener("pointerover", hover, { passive: true });
    document.addEventListener("click", click, { passive: true });
    return () => {
      document.removeEventListener("pointerover", hover);
      document.removeEventListener("click", click);
    };
  }, [enableSFX, isPlaying, playBubbleSFX, playSparkleSFX]);

  useEffect(
    () => () => {
      const ctx = audioCtxRef.current;
      if (ctx && ctx.state !== "closed") void ctx.close().catch(() => {});
    },
    [],
  );

  // Adjust rain gain on volume state change
  useEffect(() => {
    if (rainGainRef.current && audioCtxRef.current) {
      const gain = rainGainRef.current.gain;
      const now = audioCtxRef.current.currentTime;
      gain.cancelScheduledValues(now);
      gain.setTargetAtTime(rainVolume, now, 0.05);
    }
  }, [rainVolume]);

  const soundLabel = isAr ? "صوت هادئ" : "Ambient sound";
  const rainLabel = isAr ? "مستوى صوت المطر" : "Rain volume";
  const effectsLabel = isAr ? "أصوات التفاعل" : "Interaction sounds";
  const volumePercent = new Intl.NumberFormat(isAr ? "ar-EG" : "en", { style: "percent" }).format(
    rainVolume / 0.4,
  );

  return (
    <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] end-4 z-40 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-2">
      {audioFailed && (
        <p
          role="status"
          className="rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] p-3 text-sm"
        >
          {isAr ? "تعذّر تشغيل الصوت في المتصفح ده." : "Sound couldn’t play in this browser."}
        </p>
      )}
      {isPlaying && (
        <div
          id="cozy-audio-controls"
          role="region"
          aria-label={soundLabel}
          className="grid w-64 max-w-full gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-4 text-[color:var(--mauve)] shadow-card"
        >
          <div className="grid gap-1">
            <label
              htmlFor="cozy-rain-volume"
              className="flex justify-between gap-3 text-sm font-semibold"
            >
              {rainLabel}
              <span aria-hidden="true">{volumePercent}</span>
            </label>
            <input
              id="cozy-rain-volume"
              type="range"
              min="0"
              max="0.4"
              step="0.05"
              value={rainVolume}
              aria-valuetext={volumePercent}
              onChange={(event) => setRainVolume(Number(event.target.value))}
              className="h-8 w-full cursor-pointer accent-[color:var(--rose-deep)]"
            />
          </div>
          <button
            type="button"
            aria-pressed={enableSFX}
            onClick={() => setEnableSFX((enabled) => !enabled)}
            className="flex min-h-11 cursor-pointer items-center justify-between gap-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--rose-soft)]/40 px-3 text-start text-sm font-semibold hover:bg-[color:var(--rose-soft)]"
          >
            {effectsLabel}
            <span aria-hidden="true" className="shrink-0 text-sm">
              {enableSFX ? (isAr ? "مفعّلة" : "On") : isAr ? "متوقفة" : "Off"}
            </span>
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={handlePlayToggle}
        aria-label={soundLabel}
        aria-pressed={isPlaying}
        aria-controls={isPlaying ? "cozy-audio-controls" : undefined}
        title={soundLabel}
        className={`inline-flex size-12 cursor-pointer items-center justify-center rounded-full border border-[color:var(--border)] shadow-soft transition-colors ${
          isPlaying
            ? "bg-[color:var(--mauve)] text-[color:var(--background)] hover:opacity-90"
            : "bg-[color:var(--card)] text-[color:var(--mauve)] hover:bg-[color:var(--rose-soft)]"
        }`}
      >
        {isPlaying ? (
          <Volume2 aria-hidden="true" className="size-5" />
        ) : (
          <VolumeX aria-hidden="true" className="size-5" />
        )}
      </button>
    </div>
  );
}
