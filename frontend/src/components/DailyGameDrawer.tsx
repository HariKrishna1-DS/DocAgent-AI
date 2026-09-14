import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Flame,
  Clock,
  RotateCcw,
  Lightbulb,
  Trophy,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import {
  DAILY_PUZZLES,
  getStreakData,
  recordGameWin,
  formatGameTime,
  isValidWord,
  type Puzzle,
  type GameStreakData
} from '../services/gamePuzzles';

interface DailyGameDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onStreakUpdated?: (streak: number) => void;
}

interface SelectedTile {
  r: number;
  c: number;
  letter: string;
}

interface SlotState {
  index: number;
  length: number;
  word: string | null;
  hint: string;
}

interface SolvedWordRecord {
  slotIndex: number;
  word: string;
  tiles: { r: number; c: number }[];
}

export const DailyGameDrawer: React.FC<DailyGameDrawerProps> = ({
  isOpen,
  onClose,
  onStreakUpdated,
}) => {
  const [puzzleIndex, setPuzzleIndex] = useState<number>(0);
  const currentPuzzle: Puzzle = DAILY_PUZZLES[puzzleIndex % DAILY_PUZZLES.length];

  const [selectedTiles, setSelectedTiles] = useState<SelectedTile[]>([]);
  const [slots, setSlots] = useState<SlotState[]>([]);
  const [usedTiles, setUsedTiles] = useState<{ r: number; c: number }[]>([]);
  const [solvedHistory, setSolvedHistory] = useState<SolvedWordRecord[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [hintMessage, setHintMessage] = useState<string>('');
  const [streakInfo, setStreakInfo] = useState<GameStreakData>(getStreakData());

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Initialize slots whenever puzzle changes
  useEffect(() => {
    const initialSlots: SlotState[] = currentPuzzle.slots.map((s, idx) => ({
      index: idx,
      length: s.length,
      word: null,
      hint: s.hint,
    }));
    setSlots(initialSlots);
    setUsedTiles([]);
    setSolvedHistory([]);
    setSelectedTiles([]);
    setSeconds(0);
    setIsTimerRunning(false);
    setHasWon(false);
    setHintMessage('');
  }, [puzzleIndex, currentPuzzle]);

  // Load streak data
  useEffect(() => {
    const s = getStreakData();
    setStreakInfo(s);
    if (onStreakUpdated) onStreakUpdated(s.streak);
  }, []);

  // Timer runner
  useEffect(() => {
    if (isTimerRunning && !hasWon) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, hasWon]);

  // Check victory condition
  useEffect(() => {
    if (slots.length > 0 && slots.every((s) => s.word !== null) && !hasWon) {
      setHasWon(true);
      setIsTimerRunning(false);
      const updatedStreak = recordGameWin(seconds);
      setStreakInfo(updatedStreak);
      if (onStreakUpdated) onStreakUpdated(updatedStreak.streak);
    }
  }, [slots, hasWon, seconds, onStreakUpdated]);

  if (!isOpen) return null;

  const foundCount = slots.filter((s) => s.word !== null).length;

  // Evaluate formed word and assign to matching slot
  const checkAndSubmitWord = (wordCandidate: string): boolean => {
    if (!wordCandidate || wordCandidate.length < 3) return false;
    const upper = wordCandidate.toUpperCase();

    // Check if already found
    if (slots.some((s) => s.word === upper)) {
      setHintMessage(`"${upper}" has already been found!`);
      setTimeout(() => setHintMessage(''), 2500);
      return false;
    }

    // Check validity
    const valid = isValidWord(upper) || currentPuzzle.primaryWords?.includes(upper);
    if (!valid) {
      setHintMessage(`"${upper}" is not in the dictionary.`);
      setTimeout(() => setHintMessage(''), 2500);
      return false;
    }

    // Check for open slot of this length
    const matchingSlot = slots.find(
      (s) => s.length === upper.length && s.word === null
    );

    if (matchingSlot) {
      const tileCoords = selectedTiles.map((t) => ({ r: t.r, c: t.c }));
      setSlots((prev) =>
        prev.map((s) => (s.index === matchingSlot.index ? { ...s, word: upper } : s))
      );
      // Mark these tiles as used and disabled
      setUsedTiles((prev) => [
        ...prev,
        ...tileCoords,
      ]);
      // Save to solved history for Undo support
      setSolvedHistory((prev) => [
        ...prev,
        { slotIndex: matchingSlot.index, word: upper, tiles: tileCoords },
      ]);
      setSelectedTiles([]);
      setHintMessage(`🎉 Found: ${upper}!`);
      setTimeout(() => setHintMessage(''), 2500);
      return true;
    } else {
      setHintMessage(`Valid word "${upper}", but all ${upper.length}-letter slots are already filled!`);
      setTimeout(() => setHintMessage(''), 2500);
      return false;
    }
  };

  // Drag Gesture Handlers
  const handleTilePointerDown = (r: number, c: number, letter: string | null) => {
    if (!letter || hasWon) return;

    // Guard: Tile already used in a solved word
    if (usedTiles.some((ut) => ut.r === r && ut.c === c)) return;

    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }

    setIsDragging(true);
    setSelectedTiles([{ r, c, letter }]);
    setHintMessage('');
  };

  const handleContainerPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || hasWon || selectedTiles.length === 0) return;

    const elem = document.elementFromPoint(e.clientX, e.clientY);
    const tileElem = elem?.closest('[data-tile]');
    if (!tileElem) return;

    const r = Number(tileElem.getAttribute('data-r'));
    const c = Number(tileElem.getAttribute('data-c'));
    const letter = tileElem.getAttribute('data-letter');

    if (!letter) return; // Obstacle / empty cell

    // Guard: Tile already used in a solved word
    if (usedTiles.some((ut) => ut.r === r && ut.c === c)) return;

    const last = selectedTiles[selectedTiles.length - 1];
    if (last.r === r && last.c === c) return; // Same tile

    // Backtracking: if dragging back to previous tile, remove last tile
    if (selectedTiles.length >= 2) {
      const secondLast = selectedTiles[selectedTiles.length - 2];
      if (secondLast.r === r && secondLast.c === c) {
        setSelectedTiles((prev) => prev.slice(0, -1));
        return;
      }
    }

    // Avoid self-intersections
    if (selectedTiles.some((t) => t.r === r && t.c === c)) return;

    // Check adjacency (horizontal, vertical, or diagonal)
    const isAdjacent = Math.abs(r - last.r) <= 1 && Math.abs(c - last.c) <= 1;
    if (isAdjacent) {
      setSelectedTiles((prev) => [...prev, { r, c, letter }]);
    }
  };

  const handleContainerPointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (selectedTiles.length >= 3) {
      const word = selectedTiles.map((t) => t.letter).join('');
      const success = checkAndSubmitWord(word);
      if (!success) {
        // Leave for brief moment or user can click Enter
      }
    }
  };

  // Undo either current drag selection, or last submitted word to retry
  const handleUndo = () => {
    // 1. If actively dragging/selecting tiles, undo the last selected letter
    if (selectedTiles.length > 0) {
      setSelectedTiles((prev) => prev.slice(0, -1));
      return;
    }

    // 2. If words have been solved, undo the most recent solved word so user can retry!
    if (solvedHistory.length > 0) {
      const lastSolved = solvedHistory[solvedHistory.length - 1];

      // Re-open the slot
      setSlots((prev) =>
        prev.map((s) => (s.index === lastSolved.slotIndex ? { ...s, word: null } : s))
      );

      // Re-enable the tiles
      setUsedTiles((prev) =>
        prev.filter(
          (ut) => !lastSolved.tiles.some((lt) => lt.r === ut.r && lt.c === ut.c)
        )
      );

      // Pop from history
      setSolvedHistory((prev) => prev.slice(0, -1));

      // Resume timer if won
      if (hasWon) {
        setHasWon(false);
        setIsTimerRunning(true);
      }

      setHintMessage(`↩️ Undid "${lastSolved.word}". Letter tiles are active again!`);
      setTimeout(() => setHintMessage(''), 2500);
    }
  };

  // Undo a specific word by clicking on its slot
  const handleUndoWordBySlot = (slotIndex: number) => {
    const record = solvedHistory.find((h) => h.slotIndex === slotIndex);
    if (!record) return;

    setSlots((prev) =>
      prev.map((s) => (s.index === slotIndex ? { ...s, word: null } : s))
    );

    setUsedTiles((prev) =>
      prev.filter(
        (ut) => !record.tiles.some((lt) => lt.r === ut.r && lt.c === ut.c)
      )
    );

    setSolvedHistory((prev) => prev.filter((h) => h.slotIndex !== slotIndex));

    if (hasWon) {
      setHasWon(false);
      setIsTimerRunning(true);
    }

    setHintMessage(`↩️ Removed "${record.word}". You can retry with a different word!`);
    setTimeout(() => setHintMessage(''), 2500);
  };

  const handleClear = () => {
    setSelectedTiles([]);
    setHintMessage('');
  };

  const handleManualSubmit = () => {
    if (selectedTiles.length >= 3) {
      const word = selectedTiles.map((t) => t.letter).join('');
      checkAndSubmitWord(word);
    }
  };

  const handleHint = () => {
    const nextUnsolved = slots.find((s) => s.word === null);
    if (nextUnsolved) {
      setHintMessage(`Clue (${nextUnsolved.length} letters): ${nextUnsolved.hint}`);
    }
  };

  const handleResetGame = () => {
    setSlots(
      currentPuzzle.slots.map((s, idx) => ({
        index: idx,
        length: s.length,
        word: null,
        hint: s.hint,
      }))
    );
    setSelectedTiles([]);
    setUsedTiles([]);
    setSolvedHistory([]);
    setSeconds(0);
    setIsTimerRunning(false);
    setHasWon(false);
    setHintMessage('');
  };

  const handleNextPuzzle = () => {
    setPuzzleIndex((prev) => prev + 1);
  };

  return (
    <aside className="w-[380px] sidebar-bg border-l border-theme-subtle flex flex-col h-screen shrink-0 z-30 transition-all duration-200 select-none shadow-2xl">
      
      {/* Top Header */}
      <div className="p-4 border-b border-theme-subtle flex items-center justify-between header-bg">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500 shadow-sm">
            <Flame className="w-5 h-5 fill-amber-500 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-black text-theme-primary font-heading flex items-center gap-1.5">
              <span>Daily Puzzle</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/40">
                🔥 {streakInfo.streak} Streak
              </span>
            </h2>
            <p className="text-[11px] font-semibold text-theme-muted">{currentPuzzle.title}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          title="Close Game"
          className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-theme-muted hover:text-theme-primary transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Scrollable Game Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Timer Bar */}
        <div className="flex items-center justify-between p-2.5 rounded-2xl glass-panel border border-theme-subtle shadow-sm">
          <div className="flex items-center space-x-2 text-theme-primary font-mono text-sm font-black">
            <Clock className={`w-4 h-4 ${isTimerRunning ? 'text-blue-500 animate-spin' : 'text-theme-muted'}`} />
            <span>⏱ {formatGameTime(seconds)}</span>
          </div>

          <button
            onClick={handleResetGame}
            title="Reset Game"
            className="p-1.5 text-xs font-bold text-theme-muted hover:text-theme-primary hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Live Formed Word & Action Bar */}
        <div className="p-3 rounded-2xl input-bg border border-theme-medium shadow-sm flex items-center justify-between min-h-[52px]">
          <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
            {selectedTiles.length === 0 ? (
              <span className="text-xs font-bold text-theme-muted italic">
                Drag or tap across adjacent letters to form words...
              </span>
            ) : (
              selectedTiles.map((st, i) => (
                <span
                  key={i}
                  className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-md animate-scale-in"
                >
                  {st.letter}
                </span>
              ))
            )}
          </div>

          {selectedTiles.length > 0 && (
            <div className="flex items-center space-x-1 shrink-0">
              <button
                onClick={handleClear}
                className="p-1.5 text-xs font-bold text-theme-muted hover:text-theme-primary rounded-lg transition-colors cursor-pointer"
              >
                Clear
              </button>
              <button
                onClick={handleManualSubmit}
                className="px-2.5 py-1 text-xs font-black text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                Enter
              </button>
            </div>
          )}
        </div>

        {/* Hint Notification Message */}
        {hintMessage && (
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-300 text-xs font-bold shadow-sm animate-fade-in">
            {hintMessage}
          </div>
        )}

        {/* 5x5 Grid Board with Drag & Click Support */}
        <div
          ref={gridRef}
          onPointerMove={handleContainerPointerMove}
          onPointerUp={handleContainerPointerUp}
          onPointerLeave={handleContainerPointerUp}
          className="p-3 rounded-3xl card-bg border-2 border-slate-700 dark:border-slate-300 shadow-xl max-w-[320px] mx-auto select-none touch-none"
        >
          <div className="grid grid-cols-5 gap-1.5 relative">
            {currentPuzzle.grid.map((row, r) =>
              row.map((letter, c) => {
                const isBlocked = letter === null;
                const isUsed = usedTiles.some((t) => t.r === r && t.c === c);
                const isSelected = selectedTiles.some((t) => t.r === r && t.c === c);
                const orderIndex = selectedTiles.findIndex((t) => t.r === r && t.c === c);

                if (isBlocked) {
                  return (
                    <div
                      key={`${r}-${c}`}
                      className="aspect-square rounded-xl bg-slate-400/35 dark:bg-slate-700/60 border border-slate-400/40 dark:border-slate-600/40 shadow-inner flex items-center justify-center pointer-events-none"
                    />
                  );
                }

                return (
                  <button
                    key={`${r}-${c}`}
                    data-tile="true"
                    data-r={r}
                    data-c={c}
                    data-letter={letter}
                    disabled={isUsed}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      handleTilePointerDown(r, c, letter);
                    }}
                    className={`aspect-square rounded-xl text-base font-black flex flex-col items-center justify-center transition-all relative shadow-sm ${
                      isUsed
                        ? 'bg-emerald-600 text-white border-2 border-emerald-400 opacity-80 cursor-not-allowed shadow-inner'
                        : isSelected
                        ? 'bg-blue-600 text-white scale-95 shadow-md shadow-blue-500/40 border-2 border-blue-300 z-10 cursor-pointer'
                        : 'card-bg hover:bg-black/5 dark:hover:bg-white/10 text-theme-primary border border-theme-subtle hover:scale-105 active:scale-95 cursor-pointer'
                    }`}
                  >
                    <span>{letter}</span>
                    {isUsed && (
                      <span className="absolute top-0.5 right-1 text-[9px] text-emerald-200 font-bold">
                        ✓
                      </span>
                    )}
                    {isSelected && (
                      <span className="absolute bottom-0.5 right-1 text-[9px] font-mono opacity-80">
                        {orderIndex + 1}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Target Words Solved Status Boxes (Matches the letter boxes in screenshot) */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-theme-muted uppercase tracking-wider">
              Words to Find ({foundCount}/{slots.length})
            </span>
          </div>

          <div className="space-y-2">
            {slots.map((slot) => {
              const isFilled = slot.word !== null;
              return (
                <div key={slot.index} className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1.5">
                    {Array.from({ length: slot.length }).map((_, charIdx) => (
                      <div
                        key={charIdx}
                        className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-black transition-all ${
                          isFilled
                            ? 'bg-emerald-500 border-emerald-600 text-white shadow-md animate-scale-in'
                            : 'bg-black/5 dark:bg-white/5 border-theme-medium text-transparent'
                        }`}
                      >
                        {isFilled ? slot.word![charIdx].toUpperCase() : ''}
                      </div>
                    ))}
                  </div>

                  {isFilled && (
                    <div className="flex items-center space-x-1.5 text-emerald-500 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span className="text-[11px] uppercase tracking-wide font-black">{slot.word}</span>
                      <button
                        onClick={() => handleUndoWordBySlot(slot.index)}
                        title={`Undo "${slot.word}" to retry`}
                        className="p-1 rounded-md hover:bg-red-500/15 text-theme-muted hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Undo and Hint Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={handleUndo}
            disabled={selectedTiles.length === 0 && solvedHistory.length === 0}
            title={
              selectedTiles.length > 0
                ? 'Undo last letter'
                : solvedHistory.length > 0
                ? `Undo "${solvedHistory[solvedHistory.length - 1].word}" to retry`
                : 'Undo'
            }
            className={`py-2 px-3 text-xs font-bold rounded-xl card-bg border border-theme-subtle transition-all flex items-center justify-center space-x-1.5 shadow-sm ${
              selectedTiles.length > 0 || solvedHistory.length > 0
                ? 'hover:bg-black/5 dark:hover:bg-white/10 text-theme-primary cursor-pointer hover:border-blue-500'
                : 'opacity-40 cursor-not-allowed text-theme-muted'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>
              {selectedTiles.length > 0
                ? 'Undo Letter'
                : solvedHistory.length > 0
                ? `Undo "${solvedHistory[solvedHistory.length - 1].word}"`
                : 'Undo'}
            </span>
          </button>

          <button
            onClick={handleHint}
            className="py-2 px-3 text-xs font-bold rounded-xl card-bg border border-theme-subtle hover:bg-black/5 dark:hover:bg-white/10 transition-all text-theme-primary cursor-pointer flex items-center justify-center space-x-1.5 shadow-sm"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Hint</span>
          </button>
        </div>

        {/* Victory Celebration Modal */}
        {hasWon && (
          <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-500/20 via-blue-500/20 to-purple-500/20 border-2 border-emerald-500/40 shadow-xl text-center space-y-3 animate-scale-in mt-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/40 animate-bounce">
              <Trophy className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-theme-primary font-heading">
                Puzzle Completed! 🎉
              </h3>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Solved in {formatGameTime(seconds)} • Day Streak: {streakInfo.streak} Days 🔥
              </p>
            </div>

            <p className="text-[11px] font-semibold text-theme-muted">
              Great job! All {slots.length} words found. Your streak has been updated!
            </p>

            <button
              onClick={handleNextPuzzle}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>Play Bonus Practice Puzzle</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-theme-subtle text-center text-[10px] font-bold text-theme-muted header-bg flex items-center justify-between px-4">
        <span>Daily Word Puzzle</span>
        <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-theme-subtle font-bold">
          {streakInfo.totalPlayed} Solved Total
        </span>
      </div>

    </aside>
  );
};
