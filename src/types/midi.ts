import { Language } from '../data/translations';

export interface MidiNoteEvent {
  midiNumber: number;       // 0-127
  velocity: number;         // 0-127
  timestamp: number;
}

export interface ActiveNotesState {
  [midiNumber: number]: {
    velocity: number;
    timestamp: number;
  };
}

export type NoteLetter = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
export type Accidental = 'natural' | 'sharp' | 'flat';

export interface NoteName {
  letter: NoteLetter;
  accidental: Accidental;
  octave: number;           // Scientific notation: C4 = middle C (MIDI 60)
  midiNumber: number;
  displayName: string;      // e.g. "C#4", "Bb3"
  solfegeEquivalent?: string; // e.g. "Do#4", "Sib3" (for bridge level 0-1)
}

export type ChordQuality =
  | 'major'
  | 'minor'
  | 'diminished'
  | 'augmented'
  | 'major7'
  | 'minor7'
  | 'dominant7';

export interface ChordDefinition {
  root: NoteLetter;
  rootAccidental: Accidental;
  quality: ChordQuality;
  intervals: number[];       // semitones from root e.g. [0, 4, 7]
  inversion?: 0 | 1 | 2;      // 0 = root position, 1 = 1st, 2 = 2nd
  displayName: string;       // e.g. "F# Major", "Bb Minor"
}

export interface LevelTarget {
  id: string;
  type: 'single-note' | 'chord';
  clef?: 'treble' | 'bass' | 'both';
  note?: NoteName;
  chord?: ChordDefinition;
  expectedMidiNumbers: number[];
  label: string;                 // Displayed target in English notation, e.g. "Find Note: C4" or "Play: F# Minor"
  explanation: {
    es: string;
    en: string;
  };
}

export interface LevelConfig {
  id: number;
  title: {
    es: string;
    en: string;
  };
  subtitle: {
    es: string;
    en: string;
  };
  description: {
    es: string;
    en: string;
  };
  showKeyboardHelp: boolean;   // Highlights target keys on virtual keyboard
  showSolfegeBridge: boolean;  // Enables small solfège subtext (only for L0 & L1)
  enforceInversion: boolean;   // Whether exact inversion order is required (L9+)
  targets: LevelTarget[];
  passingCriteria: {
    minCorrect: number;
  };
}

export interface UserProgress {
  completedLevels: number[];
  bestScores: Record<number, { correct: number; total: number }>;
  settings: {
    language: Language;
    showSolfegeBridge: boolean;
    preferSharpsOverFlats: boolean;
    audioFeedbackEnabled: boolean;
  };
}
