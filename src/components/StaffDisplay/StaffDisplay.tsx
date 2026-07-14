import React, { useEffect, useRef } from 'react';
import { Renderer, Stave, StaveNote, Accidental, Formatter, StaveConnector } from 'vexflow';
import { ActiveNotesState, LevelTarget } from '../../types/midi';
import { midiToNoteName } from '../../core/noteUtils';
import { useProgressStore } from '../../store/progressStore';

interface StaffDisplayProps {
  activeNotes: ActiveNotesState;
  target?: LevelTarget;
  clef?: 'treble' | 'bass' | 'both';
  width?: number;
  height?: number;
}

function midiToVexFlowKey(midiNumber: number): { key: string; accidental?: string } {
  const noteObj = midiToNoteName(midiNumber);
  const letter = noteObj.letter.toLowerCase();
  const octave = noteObj.octave;

  let accidental: string | undefined = undefined;
  if (noteObj.displayName.includes('#')) accidental = '#';
  if (noteObj.displayName.includes('b')) accidental = 'b';

  return {
    key: `${letter}/${octave}`,
    accidental,
  };
}

export const StaffDisplay: React.FC<StaffDisplayProps> = ({
  activeNotes,
  target,
  clef: propClef = 'both',
  width: customWidth,
  height: customHeight,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const language = useProgressStore((state) => state.settings.language) || 'es';

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    const activeMidiNumbers = Object.keys(activeNotes).map(Number).sort((a, b) => a - b);
    const targetMidiNumbers = target?.expectedMidiNumbers || [];
    const midiNumbersToRender = activeMidiNumbers.length > 0 ? activeMidiNumbers : targetMidiNumbers;

    const effectiveClef = propClef;
    const width = customWidth || 600;
    const height = customHeight || (effectiveClef === 'both' ? 290 : 200);

    try {
      const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
      renderer.resize(width, height);
      const context = renderer.getContext();

      context.setFont('Arial', 11, 'bold');
      context.setStrokeStyle('#cbd5e1');
      context.setFillStyle('#f8fafc');

      if (effectiveClef === 'both') {
        const trebleStave = new Stave(35, 55, width - 60);
        trebleStave.addClef('treble');
        trebleStave.setContext(context).draw();

        const bassStave = new Stave(35, 165, width - 60);
        bassStave.addClef('bass');
        bassStave.setContext(context).draw();

        const connector = new StaveConnector(trebleStave, bassStave);
        connector.setType(StaveConnector.type.BRACE);
        connector.setContext(context).draw();

        const lineConnector = new StaveConnector(trebleStave, bassStave);
        lineConnector.setType(StaveConnector.type.SINGLE_LEFT);
        lineConnector.setContext(context).draw();

        if (midiNumbersToRender.length > 0) {
          const trebleMidis = midiNumbersToRender.filter(m => m >= 60);
          const bassMidis = midiNumbersToRender.filter(m => m < 60);

          if (trebleMidis.length > 0) {
            const keys = trebleMidis.map(m => midiToVexFlowKey(m));
            const staveNote = new StaveNote({
              clef: 'treble',
              keys: keys.map(k => k.key),
              duration: 'w',
            });

            keys.forEach((k, idx) => {
              if (k.accidental) {
                staveNote.addModifier(new Accidental(k.accidental), idx);
              }
            });

            Formatter.FormatAndDraw(context, trebleStave, [staveNote]);
          }

          if (bassMidis.length > 0) {
            const keys = bassMidis.map(m => midiToVexFlowKey(m));
            const staveNote = new StaveNote({
              clef: 'bass',
              keys: keys.map(k => k.key),
              duration: 'w',
            });

            keys.forEach((k, idx) => {
              if (k.accidental) {
                staveNote.addModifier(new Accidental(k.accidental), idx);
              }
            });

            Formatter.FormatAndDraw(context, bassStave, [staveNote]);
          }
        }
      } else {
        const staveY = Math.max(45, (height / 2) - 35);
        const stave = new Stave(20, staveY, width - 40);
        stave.addClef(effectiveClef).setContext(context).draw();

        if (midiNumbersToRender.length > 0) {
          const keys = midiNumbersToRender.map(m => midiToVexFlowKey(m));
          const staveNote = new StaveNote({
            clef: effectiveClef,
            keys: keys.map(k => k.key),
            duration: 'w',
          });

          keys.forEach((k, idx) => {
            if (k.accidental) {
              staveNote.addModifier(new Accidental(k.accidental), idx);
            }
          });

          Formatter.FormatAndDraw(context, stave, [staveNote]);
        }
      }
    } catch (err) {
      console.warn('VexFlow rendering exception:', err);
    }
  }, [activeNotes, target, propClef, customWidth, customHeight]);

  return (
    <div className="w-full max-w-5xl flex flex-col items-center justify-center p-3 bg-slate-900/95 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur overflow-hidden">
      <div className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-blue-400 mb-1">
        {language === 'es' ? 'Gran Pentagrama Auténtico (Sol Arriba • Fa Abajo)' : 'Authentic Grand Staff (Treble Top • Bass Bottom)'}
      </div>
      <div ref={containerRef} className="max-w-full overflow-hidden flex justify-center items-center" />
    </div>
  );
};
