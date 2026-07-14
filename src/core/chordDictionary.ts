import { ChordQuality, ChordDefinition, NoteLetter, Accidental } from '../types/midi';
import { noteToMidiNumber, formatPitchName } from './noteUtils';

export const CHORD_FORMULAS: Record<ChordQuality, number[]> = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  diminished: [0, 3, 6],
  augmented: [0, 4, 8],
  major7: [0, 4, 7, 11],
  minor7: [0, 3, 7, 10],
  dominant7: [0, 4, 7, 10],
};

export const CHORD_QUALITY_LABELS: Record<ChordQuality, string> = {
  major: 'Major',
  minor: 'Minor',
  diminished: 'Diminished',
  augmented: 'Augmented',
  major7: 'Major 7th',
  minor7: 'Minor 7th',
  dominant7: 'Dominant 7th',
};

export interface RootSpec {
  letter: NoteLetter;
  accidental: Accidental;
  displayName: string;
}

export const ALL_12_ROOTS: RootSpec[] = [
  { letter: 'C', accidental: 'natural', displayName: 'C' },
  { letter: 'C', accidental: 'sharp', displayName: 'C#' },
  { letter: 'D', accidental: 'natural', displayName: 'D' },
  { letter: 'E', accidental: 'flat', displayName: 'Eb' },
  { letter: 'E', accidental: 'natural', displayName: 'E' },
  { letter: 'F', accidental: 'natural', displayName: 'F' },
  { letter: 'F', accidental: 'sharp', displayName: 'F#' },
  { letter: 'G', accidental: 'natural', displayName: 'G' },
  { letter: 'A', accidental: 'flat', displayName: 'Ab' },
  { letter: 'A', accidental: 'natural', displayName: 'A' },
  { letter: 'B', accidental: 'flat', displayName: 'Bb' },
  { letter: 'B', accidental: 'natural', displayName: 'B' },
];

/**
 * Creates a structured ChordDefinition given a root specification and chord quality.
 */
export function createChordDefinition(
  root: RootSpec,
  quality: ChordQuality,
  inversion: 0 | 1 | 2 = 0
): ChordDefinition {
  const qualityText = CHORD_QUALITY_LABELS[quality];
  const invText = inversion === 1 ? ' (1st Inv)' : inversion === 2 ? ' (2nd Inv)' : '';

  return {
    root: root.letter,
    rootAccidental: root.accidental,
    quality,
    intervals: CHORD_FORMULAS[quality],
    inversion,
    displayName: `${root.displayName} ${qualityText}${invText}`,
  };
}

/**
 * Calculates exact expected MIDI numbers for a chord given a base root octave (e.g. octave 4).
 * Handles inversions correctly.
 */
export function getChordMidiNumbers(
  chord: ChordDefinition,
  rootOctave = 4
): number[] {
  const rootMidi = noteToMidiNumber(chord.root, chord.rootAccidental, rootOctave);
  let notes = chord.intervals.map(interval => rootMidi + interval);

  if (chord.inversion === 1 && notes.length >= 3) {
    // Move 1st note up an octave
    notes = [notes[1], notes[2], ...notes.slice(3), notes[0] + 12];
  } else if (chord.inversion === 2 && notes.length >= 3) {
    // Move 1st and 2nd notes up an octave
    notes = [notes[2], ...notes.slice(3), notes[0] + 12, notes[1] + 12];
  }

  return notes;
}
