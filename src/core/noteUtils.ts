import { NoteLetter, Accidental, NoteName } from '../types/midi';

export const PITCH_CLASSES: { letter: NoteLetter; accidental: Accidental; sharpName: string; flatName: string; solfege: string }[] = [
  { letter: 'C', accidental: 'natural', sharpName: 'C', flatName: 'C', solfege: 'Do' },
  { letter: 'C', accidental: 'sharp', sharpName: 'C#', flatName: 'Db', solfege: 'Do#' },
  { letter: 'D', accidental: 'natural', sharpName: 'D', flatName: 'D', solfege: 'Re' },
  { letter: 'D', accidental: 'sharp', sharpName: 'D#', flatName: 'Eb', solfege: 'Re#' },
  { letter: 'E', accidental: 'natural', sharpName: 'E', flatName: 'E', solfege: 'Mi' },
  { letter: 'F', accidental: 'natural', sharpName: 'F', flatName: 'F', solfege: 'Fa' },
  { letter: 'F', accidental: 'sharp', sharpName: 'F#', flatName: 'Gb', solfege: 'Fa#' },
  { letter: 'G', accidental: 'natural', sharpName: 'G', flatName: 'G', solfege: 'Sol' },
  { letter: 'G', accidental: 'sharp', sharpName: 'G#', flatName: 'Ab', solfege: 'Sol#' },
  { letter: 'A', accidental: 'natural', sharpName: 'A', flatName: 'A', solfege: 'La' },
  { letter: 'A', accidental: 'sharp', sharpName: 'A#', flatName: 'Bb', solfege: 'La#' },
  { letter: 'B', accidental: 'natural', sharpName: 'B', flatName: 'B', solfege: 'Si' },
];

export const SOLFEGE_MAP: Record<NoteLetter, string> = {
  C: 'Do',
  D: 'Re',
  E: 'Mi',
  F: 'Fa',
  G: 'Sol',
  A: 'La',
  B: 'Si',
};

/**
 * Converts a MIDI note number (0-127) to a structured NoteName object.
 * C4 = MIDI 60 (Middle C).
 */
export function midiToNoteName(midiNumber: number, preferSharps = true): NoteName {
  const pitchClassIndex = (midiNumber % 12 + 12) % 12;
  const octave = Math.floor(midiNumber / 12) - 1;
  const pitchInfo = PITCH_CLASSES[pitchClassIndex];

  const displayName = (preferSharps || pitchInfo.accidental === 'natural')
    ? pitchInfo.sharpName
    : pitchInfo.flatName;

  // Derive Solfège for bridge
  let solfegeAccidental = '';
  if (displayName.includes('#')) solfegeAccidental = '#';
  if (displayName.includes('b')) solfegeAccidental = 'b';
  const solfegeEquivalent = `${SOLFEGE_MAP[pitchInfo.letter]}${solfegeAccidental}${octave}`;

  return {
    letter: pitchInfo.letter,
    accidental: displayName.includes('#') ? 'sharp' : displayName.includes('b') ? 'flat' : 'natural',
    octave,
    midiNumber,
    displayName: `${displayName}${octave}`,
    solfegeEquivalent,
  };
}

/**
 * Gets MIDI note number from letter, accidental, and octave.
 */
export function noteToMidiNumber(letter: NoteLetter, accidental: Accidental = 'natural', octave = 4): number {
  const baseOffset: Record<NoteLetter, number> = {
    C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11
  };
  let offset = baseOffset[letter];
  if (accidental === 'sharp') offset += 1;
  if (accidental === 'flat') offset -= 1;

  return (octave + 1) * 12 + offset;
}

/**
 * Returns true if a pitch class index represents a black key on piano.
 */
export function isBlackKey(midiNumber: number): boolean {
  const pitchClass = (midiNumber % 12 + 12) % 12;
  return [1, 3, 6, 8, 10].includes(pitchClass);
}

/**
 * Formats a pitch class name given root and accidental.
 */
export function formatPitchName(letter: NoteLetter, accidental: Accidental): string {
  if (accidental === 'sharp') return `${letter}#`;
  if (accidental === 'flat') return `${letter}b`;
  return letter;
}
