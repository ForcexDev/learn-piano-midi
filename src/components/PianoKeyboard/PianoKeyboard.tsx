import React, { useMemo } from 'react';
import { ActiveNotesState, LevelTarget } from '../../types/midi';
import { midiToNoteName, isBlackKey } from '../../core/noteUtils';
import { useProgressStore } from '../../store/progressStore';

interface PianoKeyboardProps {
  activeNotes: ActiveNotesState;
  target?: LevelTarget;
  showKeyboardHelp?: boolean;
  showSolfegeBridge?: boolean;
  startMidi?: number; // default 36 (C2)
  endMidi?: number;   // default 96 (C7)
  onNoteOn: (midi: number) => void;
  onNoteOff: (midi: number) => void;
}

export const PianoKeyboard: React.FC<PianoKeyboardProps> = ({
  activeNotes,
  target,
  showKeyboardHelp = true,
  showSolfegeBridge = true,
  startMidi = 36, // C2
  endMidi = 96,   // C7
  onNoteOn,
  onNoteOff,
}) => {
  const settings = useProgressStore(state => state.settings);

  // Generate range of 61 MIDI keys (36 white, 25 black)
  const keys = useMemo(() => {
    const list: number[] = [];
    for (let m = startMidi; m <= endMidi; m++) {
      list.push(m);
    }
    return list;
  }, [startMidi, endMidi]);

  const whiteKeys = useMemo(() => {
    return keys.filter(m => !isBlackKey(m));
  }, [keys]);

  // Set of expected MIDI numbers for target
  const targetMidiSet = useMemo(() => {
    if (!target || !showKeyboardHelp) return new Set<number>();
    return new Set(target.expectedMidiNumbers);
  }, [target, showKeyboardHelp]);

  const totalWhite = whiteKeys.length; // 36 keys for full 5 octaves

  return (
    <div className="w-full flex flex-col items-center select-none py-0.5 sm:py-1">
      <div className="relative w-full bg-slate-950 p-1.5 sm:p-2.5 rounded-2xl shadow-2xl border border-slate-800/90 overflow-hidden">
        {/* Render 36 White Keys with Proportional Responsive Height */}
        <div className="w-full flex relative h-[25vh] max-h-[230px] min-h-[140px]">
          {whiteKeys.map((midiNumber) => {
            const noteObj = midiToNoteName(midiNumber, settings.preferSharpsOverFlats);
            const isPressed = activeNotes[midiNumber] !== undefined;
            const isTarget = targetMidiSet.has(midiNumber);
            const isMiddleC = midiNumber === 60;
            const isCKey = noteObj.letter === 'C';

            let keyBgClass = 'bg-gradient-to-b from-white via-slate-100 to-slate-200 text-slate-800 shadow-md hover:from-white hover:to-slate-50';
            let borderClass = 'border-r border-slate-300/80 last:border-r-0';

            if (isPressed) {
              if (isTarget) {
                keyBgClass = 'bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600 text-white shadow-emerald-500/50 shadow-xl ring-2 ring-emerald-300';
              } else {
                keyBgClass = 'bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700 text-white shadow-blue-500/50 shadow-xl ring-2 ring-blue-300';
              }
            } else if (isTarget) {
              keyBgClass = 'bg-gradient-to-b from-amber-100 via-amber-200 to-amber-300 text-amber-950 border-2 border-amber-500 ring-2 ring-amber-400/40 animate-pulse';
            }

            return (
              <button
                key={midiNumber}
                onMouseDown={() => onNoteOn(midiNumber)}
                onMouseUp={() => onNoteOff(midiNumber)}
                onMouseLeave={() => onNoteOff(midiNumber)}
                onTouchStart={(e) => { e.preventDefault(); onNoteOn(midiNumber); }}
                onTouchEnd={(e) => { e.preventDefault(); onNoteOff(midiNumber); }}
                className={`flex-1 relative rounded-b-xl flex flex-col justify-end items-center pb-1.5 sm:pb-3 transition-all duration-75 origin-top ${keyBgClass} ${borderClass}`}
              >
                {/* Middle C Indicator Marker */}
                {isMiddleC && (
                  <div className="absolute top-1 sm:top-1.5 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-blue-600 ring-2 ring-blue-300 shadow-md" title="Middle C (C4)" />
                    <span className="text-[8px] sm:text-[9px] font-extrabold text-blue-600 mt-0.5">C4</span>
                  </div>
                )}

                {/* Octave Marker for other C keys */}
                {!isMiddleC && isCKey && (
                  <span className="absolute top-1 sm:top-1.5 left-1/2 -translate-x-1/2 text-[8px] sm:text-[9px] font-bold text-slate-400">
                    C{noteObj.octave}
                  </span>
                )}

                {/* Note Labels */}
                <div className="flex flex-col items-center z-10 pointer-events-none mb-0.5 sm:mb-1">
                  <span className={`text-[9px] sm:text-xs md:text-sm font-extrabold tracking-tight ${
                    isPressed ? 'text-white' : isTarget ? 'text-amber-950' : 'text-slate-800'
                  }`}>
                    {noteObj.displayName}
                  </span>
                  {showSolfegeBridge && settings.showSolfegeBridge && noteObj.solfegeEquivalent && (
                    <span className={`text-[7px] sm:text-[9px] font-medium leading-none opacity-80 ${
                      isPressed ? 'text-white' : 'text-slate-500'
                    }`}>
                      ({noteObj.solfegeEquivalent.replace(/[0-9]/g, '')})
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Render 25 Overlay Black Keys with Proportional 60% Height */}
        <div className="absolute top-1.5 sm:top-2.5 left-1.5 sm:left-2.5 right-1.5 sm:right-2.5 h-[60%] pointer-events-none">
          {whiteKeys.map((midiNumber, index) => {
            const nextMidi = midiNumber + 1;
            const hasBlackKeyAfter = isBlackKey(nextMidi);

            if (!hasBlackKeyAfter || index === whiteKeys.length - 1) {
              return null;
            }

            const blackMidi = nextMidi;
            const noteObj = midiToNoteName(blackMidi, settings.preferSharpsOverFlats);
            const isPressed = activeNotes[blackMidi] !== undefined;
            const isTarget = targetMidiSet.has(blackMidi);

            let keyBgClass = 'bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 text-slate-100 shadow-2xl';
            let borderClass = 'border border-slate-700/80';

            if (isPressed) {
              if (isTarget) {
                keyBgClass = 'bg-gradient-to-b from-emerald-500 via-emerald-600 to-emerald-700 text-white shadow-emerald-500/50 shadow-2xl ring-2 ring-emerald-300';
              } else {
                keyBgClass = 'bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700 text-white shadow-blue-500/50 shadow-2xl ring-2 ring-blue-300';
              }
            } else if (isTarget) {
              keyBgClass = 'bg-gradient-to-b from-amber-500 via-amber-600 to-amber-700 text-amber-100 border-2 border-amber-400 ring-2 ring-amber-400/40 animate-pulse';
            }

            const seamPercent = ((index + 1) / totalWhite) * 100;
            const keyWidthPercent = (100 / totalWhite) * 0.65;
            const leftPositionPercent = seamPercent - (keyWidthPercent / 2);

            return (
              <button
                key={blackMidi}
                style={{
                  left: `${leftPositionPercent}%`,
                  width: `${keyWidthPercent}%`,
                }}
                onMouseDown={() => onNoteOn(blackMidi)}
                onMouseUp={() => onNoteOff(blackMidi)}
                onMouseLeave={() => onNoteOff(blackMidi)}
                onTouchStart={(e) => { e.preventDefault(); onNoteOn(blackMidi); }}
                onTouchEnd={(e) => { e.preventDefault(); onNoteOff(blackMidi); }}
                className={`absolute top-0 h-full rounded-b-lg flex flex-col justify-end items-center pb-1.5 sm:pb-2.5 pointer-events-auto transition-all duration-75 z-20 origin-top ${keyBgClass} ${borderClass}`}
              >
                <span className="text-[7.5px] sm:text-[9.5px] md:text-xs font-bold leading-tight tracking-tight select-none">
                  {noteObj.displayName}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
