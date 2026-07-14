import { NoteLetter, Accidental } from '../types/midi';

/**
 * Standard enharmonic spelling map for root keys.
 * Specifies whether a given key traditionally uses sharps or flats.
 */
export const KEY_ACCIDENTAL_PREFERENCE: Record<string, 'sharp' | 'flat'> = {
  // Natural roots
  'C': 'sharp',
  'G': 'sharp',
  'D': 'sharp',
  'A': 'sharp',
  'E': 'sharp',
  'B': 'sharp',
  'F': 'flat',
  
  // Sharp roots
  'F#': 'sharp',
  'C#': 'sharp',
  'G#': 'sharp',
  'D#': 'sharp',
  'A#': 'sharp',

  // Flat roots
  'Bb': 'flat',
  'Eb': 'flat',
  'Ab': 'flat',
  'Db': 'flat',
  'Gb': 'flat',
  'Cb': 'flat',
};

/**
 * Normalizes pitch class (0-11) to preferred display spelling based on root context.
 */
export function getEnharmonicSpelling(midiNumber: number, rootKeyName?: string): { name: string; letter: NoteLetter; accidental: Accidental } {
  const pitchClass = (midiNumber % 12 + 12) % 12;
  const pref = rootKeyName ? (KEY_ACCIDENTAL_PREFERENCE[rootKeyName] || 'sharp') : 'sharp';

  const sharpMap: Record<number, { name: string; letter: NoteLetter; accidental: Accidental }> = {
    0: { name: 'C', letter: 'C', accidental: 'natural' },
    1: { name: 'C#', letter: 'C', accidental: 'sharp' },
    2: { name: 'D', letter: 'D', accidental: 'natural' },
    3: { name: 'D#', letter: 'D', accidental: 'sharp' },
    4: { name: 'E', letter: 'E', accidental: 'natural' },
    5: { name: 'F', letter: 'F', accidental: 'natural' },
    6: { name: 'F#', letter: 'F', accidental: 'sharp' },
    7: { name: 'G', letter: 'G', accidental: 'natural' },
    8: { name: 'G#', letter: 'G', accidental: 'sharp' },
    9: { name: 'A', letter: 'A', accidental: 'natural' },
    10: { name: 'A#', letter: 'A', accidental: 'sharp' },
    11: { name: 'B', letter: 'B', accidental: 'natural' },
  };

  const flatMap: Record<number, { name: string; letter: NoteLetter; accidental: Accidental }> = {
    0: { name: 'C', letter: 'C', accidental: 'natural' },
    1: { name: 'Db', letter: 'D', accidental: 'flat' },
    2: { name: 'D', letter: 'D', accidental: 'natural' },
    3: { name: 'Eb', letter: 'E', accidental: 'flat' },
    4: { name: 'E', letter: 'E', accidental: 'natural' },
    5: { name: 'F', letter: 'F', accidental: 'natural' },
    6: { name: 'Gb', letter: 'G', accidental: 'flat' },
    7: { name: 'G', letter: 'G', accidental: 'natural' },
    8: { name: 'Ab', letter: 'A', accidental: 'flat' },
    9: { name: 'A', letter: 'A', accidental: 'natural' },
    10: { name: 'Bb', letter: 'B', accidental: 'flat' },
    11: { name: 'B', letter: 'B', accidental: 'natural' },
  };

  return pref === 'flat' ? flatMap[pitchClass] : sharpMap[pitchClass];
}
