import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Sparkles, Award, ArrowRight, Zap } from 'lucide-react';
import {
  LEVELS,
  buildChart,
  TIER,
  TIER_COLOR,
  LANE_COLORS,
  PERFECT_WINDOW,
  GOOD_WINDOW,
  type Chart,
  type Level,
} from '../../lib/pulse/levels';
import { PulseAudio } from '../../lib/pulse/audio';

interface PulseGameProps {
  onUnlockVoucher: (code: string) => void;
  onGoToPricing: () => void;
  voucherUnlocked?: boolean;
}

const KEYS = ['KeyD', 'KeyF', 'KeyJ', 'KeyK'];
const KEY_LABELS = ['D', 'F', 'J', 'K'];

export const PulseGame: React.FC<PulseGameProps> = ({
  onUnlockVoucher,
  onGoToPricing,
  voucherUnlocked = false,
}) => {
  const [levelIdx, setLevelIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [hits, setHits] = useState(0);
  const [totalNotes, setTotalNotes] = useState(0);
  const [finished, setFinished] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<PulseAudio | null>(null);
  const chartRef = useRef<Chart | null>(null);
  const stateRef = useRef<{
    startTime: number;
    score: number;
    combo: number;
    maxCombo: number;
    hits: number;
    notesJudged: number;
    soundIndex: number;
    lanePress: boolean[];
  }>({
    startTime: 0,
    score: 0,
    combo: 0,
    maxCombo: 0,
    hits: 0,
    notesJudged: 0,
    soundIndex: 0,
    lanePress: [false, false, false, false],
  });

  const level = LEVELS[levelIdx] || LEVELS[0];

  const initGame = () => {
    chartRef.current = buildChart(level);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setAccuracy(100);
    setHits(0);
    setTotalNotes(chartRef.current.notes.length);
    setFinished(false);

    stateRef.current = {
      startTime: 0,
      score: 0,
      combo: 0,
      maxCombo: 0,
      hits: 0,
      notesJudged: 0,
      soundIndex: 0,
      lanePress: [false, false, false, false],
    };
  };

  useEffect(() => {
    initGame();
  }, [levelIdx]);

  const handleStart = async () => {
    if (!audioRef.current) {
      audioRef.current = new PulseAudio();
    }
    await audioRef.current.resume();

    initGame();
    setPlaying(true);
    stateRef.current.startTime = performance.now() / 1000 + 0.3;
  };

  const handleStop = () => {
    setPlaying(false);
  };

  const judgeLane = (lane: number) => {
    if (!playing || !chartRef.current) return;
    const now = performance.now() / 1000 - stateRef.current.startTime;

    const unjudged = chartRef.current.notes.filter((n) => n.lane === lane && !n.judged);
    if (unjudged.length === 0) return;

    // Find closest note
    let closest = unjudged[0];
    let minDiff = Math.abs(closest.t - now);

    for (let i = 1; i < unjudged.length; i++) {
      const diff = Math.abs(unjudged[i].t - now);
      if (diff < minDiff) {
        minDiff = diff;
        closest = unjudged[i];
      }
    }

    if (minDiff <= GOOD_WINDOW) {
      closest.judged = true;
      closest.hit = true;
      stateRef.current.notesJudged++;
      stateRef.current.hits++;
      stateRef.current.combo++;
      if (stateRef.current.combo > stateRef.current.maxCombo) {
        stateRef.current.maxCombo = stateRef.current.combo;
      }

      const isPerfect = minDiff <= PERFECT_WINDOW;
      const pts = isPerfect ? 300 : 150;
      stateRef.current.score += pts * Math.min(4, Math.floor(stateRef.current.combo / 10) + 1);

      audioRef.current?.blip();
    } else if (minDiff <= GOOD_WINDOW * 2) {
      closest.judged = true;
      closest.hit = false;
      stateRef.current.notesJudged++;
      stateRef.current.combo = 0;
    }

    const acc =
      stateRef.current.notesJudged > 0
        ? Math.round((stateRef.current.hits / stateRef.current.notesJudged) * 100)
        : 100;

    setScore(stateRef.current.score);
    setCombo(stateRef.current.combo);
    setMaxCombo(stateRef.current.maxCombo);
    setHits(stateRef.current.hits);
    setAccuracy(acc);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const idx = KEYS.indexOf(e.code);
      if (idx !== -1 && !e.repeat) {
        stateRef.current.lanePress[idx] = true;
        judgeLane(idx);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const idx = KEYS.indexOf(e.code);
      if (idx !== -1) {
        stateRef.current.lanePress[idx] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playing]);

  // Main game loop (RAF)
  useEffect(() => {
    if (!playing) return;

    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const now = performance.now() / 1000 - stateRef.current.startTime;
      const chart = chartRef.current;

      if (!chart) return;

      // Audio Event Triggering
      if (soundEnabled && audioRef.current) {
        while (
          stateRef.current.soundIndex < chart.events.length &&
          chart.events[stateRef.current.soundIndex].t <= now
        ) {
          const ev = chart.events[stateRef.current.soundIndex];
          audioRef.current.play(ev, audioRef.current.ctx.currentTime, level.wave);
          stateRef.current.soundIndex++;
        }
      }

      // Check for missed notes
      for (const note of chart.notes) {
        if (!note.judged && note.t < now - GOOD_WINDOW) {
          note.judged = true;
          note.hit = false;
          stateRef.current.notesJudged++;
          stateRef.current.combo = 0;
          setCombo(0);
          const acc = Math.round((stateRef.current.hits / stateRef.current.notesJudged) * 100);
          setAccuracy(acc);
        }
      }

      // Check level completion
      if (now >= chart.duration) {
        setPlaying(false);
        setFinished(true);
        const finalAcc =
          stateRef.current.notesJudged > 0
            ? Math.round((stateRef.current.hits / stateRef.current.notesJudged) * 100)
            : 0;
        if (finalAcc >= 50) {
          onUnlockVoucher('PULSE250');
        }
        return;
      }

      // DRAW CANVAS
      const w = canvas.width;
      const h = canvas.height;
      const laneW = w / 4;
      const hitY = h - 60;

      // Background clear
      ctx.fillStyle = '#090a0f';
      ctx.fillRect(0, 0, w, h);

      // Lane dividers & glow
      for (let i = 0; i < 4; i++) {
        ctx.strokeStyle = '#1b2030';
        ctx.lineWidth = 1;
        ctx.strokeRect(i * laneW, 0, laneW, h);

        if (stateRef.current.lanePress[i]) {
          ctx.fillStyle = 'rgba(153, 69, 255, 0.12)';
          ctx.fillRect(i * laneW, 0, laneW, h);
        }
      }

      // Hit Line
      ctx.strokeStyle = '#f5a623';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, hitY);
      ctx.lineTo(w, hitY);
      ctx.stroke();

      // Draw Approaching Notes
      const approachSec = level.approach;
      for (const note of chart.notes) {
        if (note.judged) continue;

        const timeDiff = note.t - now;
        if (timeDiff > -0.2 && timeDiff < approachSec) {
          const progress = 1 - timeDiff / approachSec;
          const y = progress * hitY;

          ctx.fillStyle = LANE_COLORS[note.lane];
          ctx.fillRect(note.lane * laneW + 4, y - 8, laneW - 8, 16);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(note.lane * laneW + 8, y - 4, laneW - 16, 8);
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [playing, soundEnabled, level]);

  const currentTier = TIER(accuracy);
  const tierColor = TIER_COLOR[currentTier] || '#9945FF';

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 text-ink">
      {/* Title & Voucher Notice */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-xs border border-purple/40 bg-purple/10 px-3 py-1 text-[10px] uppercase tracking-[2.5px] text-purple font-bold">
          <Zap className="h-3 w-3" />
          <span>Synaptic Reaction Miner</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-black text-ink">
          YabbAI Pulse Miner
        </h2>
        <p className="text-[12px] text-dim font-mono">
          Calibrate your reflexes. Hit the falling pulses using <kbd className="border border-line px-1 rounded">D</kbd> <kbd className="border border-line px-1 rounded">F</kbd> <kbd className="border border-line px-1 rounded">J</kbd> <kbd className="border border-line px-1 rounded">K</kbd> or click the lane pads. Complete a song with 50%+ accuracy to unlock a <span className="text-green font-bold">$250 USD voucher</span> on any build package!
        </p>

        {voucherUnlocked && (
          <div className="mt-3 inline-flex items-center gap-2 border border-green/50 bg-green/10 px-4 py-2 rounded-xs text-[11px] text-green font-mono font-bold">
            <Sparkles className="h-4 w-4" />
            <span>VOUCHER CODE UNLOCKED: PULSE250 (-$250 USD applied at checkout)</span>
          </div>
        )}
      </div>

      {/* Level Selector */}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {LEVELS.map((lvl, idx) => (
          <button
            key={lvl.id}
            onClick={() => {
              if (playing) handleStop();
              setLevelIdx(idx);
            }}
            className={`px-3 py-2 text-[10.5px] uppercase tracking-[1.5px] font-bold rounded-xs border transition ${
              levelIdx === idx
                ? 'border-purple bg-panel text-ink shadow-[0_0_12px_rgba(153,69,255,0.3)]'
                : 'border-line bg-panel/60 text-dim hover:text-ink'
            }`}
          >
            {lvl.name} ({lvl.difficulty})
          </button>
        ))}
      </div>

      {/* HUD Bar */}
      <div className="mt-6 border border-line bg-panel p-3 rounded-t-xs flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-dim">Score: </span>
            <span className="font-bold text-ink">{score}</span>
          </div>
          <div>
            <span className="text-dim">Combo: </span>
            <span className="font-bold text-purple">{combo}x</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <span className="text-dim">Accuracy: </span>
            <span className="font-bold" style={{ color: tierColor }}>
              {accuracy}% ({currentTier})
            </span>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-dim hover:text-ink"
            title="Toggle Web Audio"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4 text-green" /> : <VolumeX className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="relative border-x border-b border-line bg-void overflow-hidden flex justify-center">
        <canvas
          ref={canvasRef}
          width={380}
          height={440}
          className="block w-full max-w-[380px] h-[440px] select-none"
        />

        {/* Start / Finished Overlay */}
        {!playing && (
          <div className="absolute inset-0 bg-void/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
            {finished ? (
              <div className="space-y-4">
                <Award className="h-12 w-12 text-green mx-auto" />
                <div className="font-display text-2xl font-black text-ink">
                  Diagnostic Complete!
                </div>
                <div className="text-[13px] font-mono" style={{ color: tierColor }}>
                  Rank: {currentTier} · Accuracy: {accuracy}% · Score: {score}
                </div>

                <div className="border border-green/40 bg-green/10 p-3 rounded-xs text-[11px] font-mono text-green max-w-sm">
                  ✓ Voucher Code <strong>PULSE250</strong> is now active. You get $250 USD deducted from any package!
                </div>

                <div className="flex gap-2 justify-center pt-2">
                  <button
                    onClick={handleStart}
                    className="border border-line bg-panel px-4 py-2 text-[10.5px] uppercase tracking-[1.5px] text-ink hover:border-purple rounded-xs"
                  >
                    Play Again
                  </button>
                  <button
                    onClick={onGoToPricing}
                    className="bg-green px-5 py-2 text-[10.5px] uppercase tracking-[1.5px] font-bold text-void hover:bg-green-hover rounded-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(20,241,149,0.4)]"
                  >
                    <span>Claim $250 Off At Checkout</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="font-display text-2xl font-black text-ink">{level.name}</div>
                <p className="text-[11.5px] text-dim font-mono max-w-xs">{level.tagline}</p>
                <button
                  onClick={handleStart}
                  className="rounded-xs bg-purple px-8 py-3 text-[12px] font-bold uppercase tracking-[2px] text-white hover:bg-purple-hover hover:shadow-[0_0_24px_rgba(153,69,255,0.45)] flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Start Session</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* On-Screen Touch / Click Buttons for mobile & desktop */}
      <div className="mt-3 grid grid-cols-4 gap-2 max-w-[380px] mx-auto">
        {KEY_LABELS.map((label, idx) => (
          <button
            key={label}
            onPointerDown={() => judgeLane(idx)}
            className="border border-line bg-panel hover:bg-panel2 active:bg-purple/30 py-3 rounded-xs text-center font-display font-black text-ink transition active:scale-95 text-lg"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};
