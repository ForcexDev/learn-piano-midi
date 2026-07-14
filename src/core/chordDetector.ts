import { ActiveNotesState, LevelTarget } from '../types/midi';
import { Language } from '../data/translations';

export interface EvaluationResult {
  isCorrect: boolean;
  status: 'perfect' | 'correct-notes-wrong-inversion' | 'missing-notes' | 'extra-notes' | 'incorrect' | 'waiting';
  feedback: string;
  matchedMidiNotes: number[];
}

const FEEDBACK_MESSAGES = {
  es: {
    waiting: 'Toca las teclas en tu teclado MIDI para practicar',
    correctNote: '¡Correcto!',
    wrongOctave: 'Letra correcta, pero en la octava equivocada',
    keepSearching: 'Sigue buscando la nota',
    extraNotes: '¡Tocas las notas correctas, pero estás presionando teclas extra!',
    wrongInversion: '¡Notas de acorde correctas, pero inversión/bajo equivocado!',
    correctChord: '¡Excelente trabajo!',
    holding: 'Mantienes',
    of: 'de',
    notes: 'notas. ¡Sigue manteniendo!',
    keepTrying: 'Sigue intentando',
  },
  en: {
    waiting: 'Play keys on your MIDI keyboard to match target',
    correctNote: 'Correct!',
    wrongOctave: 'Right note letter, but in wrong octave',
    keepSearching: 'Keep searching for',
    extraNotes: 'Correct chord notes are held, but you are pressing extra notes!',
    wrongInversion: 'Right chord notes, but wrong inversion bass note!',
    correctChord: 'Great job!',
    holding: 'Holding',
    of: 'of',
    notes: 'notes. Keep holding!',
    keepTrying: 'Keep trying',
  },
};

/**
 * Validates active pressed MIDI notes against a given level target.
 */
export function evaluateTarget(
  activeNotesState: ActiveNotesState,
  target: LevelTarget,
  enforceInversion = false,
  language: Language = 'es'
): EvaluationResult {
  const activeMidiNumbers = Object.keys(activeNotesState).map(Number).sort((a, b) => a - b);
  const msg = FEEDBACK_MESSAGES[language];

  if (activeMidiNumbers.length === 0) {
    return {
      isCorrect: false,
      status: 'waiting',
      feedback: msg.waiting,
      matchedMidiNotes: [],
    };
  }

  // --- SINGLE NOTE EVALUATION ---
  if (target.type === 'single-note' && target.note) {
    const expectedMidi = target.expectedMidiNumbers[0];
    const isExactMatch = activeMidiNumbers.includes(expectedMidi);
    const expectedPitchClass = expectedMidi % 12;
    const isPitchClassMatch = activeMidiNumbers.some(m => (m % 12 + 12) % 12 === expectedPitchClass);

    if (isExactMatch) {
      return {
        isCorrect: true,
        status: 'perfect',
        feedback: `${msg.correctNote} ${target.note.displayName}`,
        matchedMidiNotes: [expectedMidi],
      };
    } else if (isPitchClassMatch) {
      return {
        isCorrect: false,
        status: 'incorrect',
        feedback: `${target.note.letter}: ${msg.wrongOctave}`,
        matchedMidiNotes: activeMidiNumbers.filter(m => (m % 12 + 12) % 12 === expectedPitchClass),
      };
    } else {
      return {
        isCorrect: false,
        status: 'incorrect',
        feedback: `${msg.keepSearching} ${target.note.displayName}`,
        matchedMidiNotes: [],
      };
    }
  }

  // --- CHORD EVALUATION ---
  if (target.type === 'chord' && target.chord) {
    const expectedMidiSet = target.expectedMidiNumbers;
    const expectedPitchClasses = expectedMidiSet.map(m => (m % 12 + 12) % 12);
    const activePitchClasses = activeMidiNumbers.map(m => (m % 12 + 12) % 12);

    const matchedPitches = activePitchClasses.filter(pc => expectedPitchClasses.includes(pc));
    const uniqueMatchedPitches = Array.from(new Set(matchedPitches));
    const uniqueExpectedPitches = Array.from(new Set(expectedPitchClasses));

    const allExpectedPitchesPressed = uniqueExpectedPitches.every(pc => activePitchClasses.includes(pc));
    const extraNotesPressed = activePitchClasses.some(pc => !expectedPitchClasses.includes(pc));

    if (allExpectedPitchesPressed) {
      if (extraNotesPressed) {
        return {
          isCorrect: false,
          status: 'extra-notes',
          feedback: msg.extraNotes,
          matchedMidiNotes: activeMidiNumbers.filter(m => expectedPitchClasses.includes((m % 12 + 12) % 12)),
        };
      }

      // Check root order / inversion if required
      if (enforceInversion && target.chord.inversion !== undefined) {
        const lowestActiveNote = activeMidiNumbers[0];
        const lowestActivePitchClass = (lowestActiveNote % 12 + 12) % 12;
        const expectedLowestPitchClass = (expectedMidiSet[0] % 12 + 12) % 12;

        if (lowestActivePitchClass !== expectedLowestPitchClass) {
          return {
            isCorrect: false,
            status: 'correct-notes-wrong-inversion',
            feedback: msg.wrongInversion,
            matchedMidiNotes: activeMidiNumbers,
          };
        }
      }

      return {
        isCorrect: true,
        status: 'perfect',
        feedback: `${msg.correctChord} ${target.chord.displayName}`,
        matchedMidiNotes: activeMidiNumbers,
      };
    } else {
      return {
        isCorrect: false,
        status: 'missing-notes',
        feedback: `${msg.holding} ${uniqueMatchedPitches.length} ${msg.of} ${uniqueExpectedPitches.length} ${msg.notes}`,
        matchedMidiNotes: activeMidiNumbers.filter(m => expectedPitchClasses.includes((m % 12 + 12) % 12)),
      };
    }
  }

  return {
    isCorrect: false,
    status: 'incorrect',
    feedback: msg.keepTrying,
    matchedMidiNotes: [],
  };
}
