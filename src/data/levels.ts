import { LevelConfig, LevelTarget, NoteLetter, Accidental } from '../types/midi';
import { midiToNoteName, noteToMidiNumber } from '../core/noteUtils';
import { ALL_12_ROOTS, createChordDefinition, getChordMidiNumbers, RootSpec } from '../core/chordDictionary';

function createNoteTarget(
  letter: NoteLetter,
  accidental: Accidental = 'natural',
  octave = 4,
  clef: 'treble' | 'bass' = 'treble',
  expEs?: string,
  expEn?: string
): LevelTarget {
  const midi = noteToMidiNumber(letter, accidental, octave);
  const note = midiToNoteName(midi, accidental !== 'flat');
  const baseLabel = note.solfegeEquivalent
    ? `Find Note: ${note.displayName} (${note.solfegeEquivalent.replace(/[0-9]/g, '')})`
    : `Find Note: ${note.displayName}`;

  return {
    id: `note-${midi}`,
    type: 'single-note',
    clef,
    note,
    expectedMidiNumbers: [midi],
    label: baseLabel,
    explanation: {
      es: expEs || (accidental === 'natural' ? `Tecla blanca natural en la octava ${octave}` : `Tecla negra alterada en la octava ${octave}`),
      en: expEn || (accidental === 'natural' ? `Natural White Key in Octave ${octave}` : `Accidental Black Key in Octave ${octave}`),
    },
  };
}

function createChordTarget(
  root: RootSpec,
  quality: 'major' | 'minor' | 'diminished' | 'augmented',
  inversion: 0 | 1 | 2 = 0,
  rootOctave = 4,
  clef: 'treble' | 'bass' | 'both' = 'treble',
  expEs?: string,
  expEn?: string
): LevelTarget {
  const chordDef = createChordDefinition(root, quality, inversion);
  const midiNumbers = getChordMidiNumbers(chordDef, rootOctave);

  const defaultFormulaEs = `Fórmula: Fundamental + ${quality === 'major' || quality === 'augmented' ? 'Tercera Mayor (+4 semitonos)' : 'Tercera Menor (+3 semitonos)'} + ${quality === 'diminished' ? 'Quinta Disminuida (+6 semitonos)' : quality === 'augmented' ? 'Quinta Aumentada (+8 semitonos)' : 'Quinta Justa (+7 semitonos)'}`;
  const defaultFormulaEn = `Formula: Root + ${quality === 'major' || quality === 'augmented' ? 'Major 3rd (+4 semitones)' : 'Minor 3rd (+3 semitones)'} + ${quality === 'diminished' ? 'Dim 5th (+6 semitones)' : quality === 'augmented' ? 'Aug 5th (+8 semitones)' : 'Perfect 5th (+7 semitones)'}`;

  return {
    id: `chord-${root.displayName}-${quality}-inv${inversion}`,
    type: 'chord',
    clef,
    chord: chordDef,
    expectedMidiNumbers: midiNumbers,
    label: `Play: ${chordDef.displayName}`,
    explanation: {
      es: expEs || defaultFormulaEs,
      en: expEn || defaultFormulaEn,
    },
  };
}

export const LEVELS: LevelConfig[] = [
  // LEVEL 0: SANDBOX
  {
    id: 0,
    title: {
      es: 'Nivel 0 — Sandbox Libre y Diagnóstico',
      en: 'Level 0 — Free Sandbox & Hardware Test',
    },
    subtitle: {
      es: 'Exploración Libre de Teclas y Sonido',
      en: 'Free Exploration & Key Identification',
    },
    description: {
      es: 'Experimenta libremente en tu Yamaha PSR-E383 o teclado virtual. Este nivel te introduce al sistema de nombres en inglés (C, D, E, F, G, A, B) junto con el puente opcional de Solfeo (Do, Re, Mi) y lectura en partitura.',
      en: 'Experiment freely on your Yamaha PSR-E383 or virtual keyboard. Introduces English note names (C, D, E, F, G, A, B) alongside optional Solfège bridge and sheet music rendering.',
    },
    showKeyboardHelp: true,
    showSolfegeBridge: true,
    enforceInversion: false,
    targets: [
      {
        id: 'sandbox-free',
        type: 'single-note',
        label: 'Free Practice — Play Any Key',
        explanation: {
          es: 'Presiona cualquier tecla de tu piano para probar el sonido en tiempo real, el pentagrama y la identificación de notas.',
          en: 'Press any key on your MIDI keyboard to test real-time sound, sheet music display, and key identification.',
        },
        expectedMidiNumbers: [],
      }
    ],
    passingCriteria: { minCorrect: 1 },
  },

  // LEVEL 1: NATURAL WHITE KEYS
  {
    id: 1,
    title: {
      es: 'Nivel 1 — Teclas Blancas Naturales (C, D, E, F, G, A, B)',
      en: 'Level 1 — Natural White Keys (C, D, E, F, G, A, B)',
    },
    subtitle: {
      es: 'Nomenclatura Base en Inglés',
      en: 'Foundational English Note Nomenclature',
    },
    description: {
      es: 'Aprende a asociar las letras en inglés con las teclas blancas del piano. Regla nemotécnica: C es la tecla blanca inmediatamente a la izquierda del grupo de 2 teclas negras, y F está a la izquierda del grupo de 3 teclas negras.',
      en: 'Learn to associate English note letters with white piano keys. Rule of thumb: C is immediately left of 2 black keys, F is left of 3 black keys.',
    },
    showKeyboardHelp: true,
    showSolfegeBridge: true,
    enforceInversion: false,
    targets: [
      createNoteTarget('C', 'natural', 4, 'treble', 'Do Central (C4 / Middle C) — Ubicado a la izquierda del par de 2 teclas negras en el centro del teclado.', 'Middle C (C4) — Located left of the pair of 2 black keys in the center.'),
      createNoteTarget('E', 'natural', 4, 'treble', 'E4 (Mi) — Ubicado a la derecha del par de 2 teclas negras.', 'E4 (Mi) — Located right of the pair of 2 black keys.'),
      createNoteTarget('G', 'natural', 4, 'treble', 'G4 (Sol) — Ubicado dentro del grupo de 3 teclas negras, después de F.', 'G4 (Sol) — Located inside the group of 3 black keys, after F.'),
      createNoteTarget('D', 'natural', 4, 'treble', 'D4 (Re) — Encajado justo en el centro del par de 2 teclas negras.', 'D4 (Re) — Nestled right between the pair of 2 black keys.'),
      createNoteTarget('F', 'natural', 4, 'treble', 'F4 (Fa) — Ubicado a la izquierda del grupo de 3 teclas negras.', 'F4 (Fa) — Located left of the group of 3 black keys.'),
      createNoteTarget('A', 'natural', 4, 'treble', 'A4 (La) — Ubicado entre la 2da y 3ra tecla negra del grupo triple.', 'A4 (La) — Located between the 2nd and 3rd black key of the triple group.'),
      createNoteTarget('B', 'natural', 4, 'treble', 'B4 (Si) — Ubicado a la derecha del grupo de 3 teclas negras.', 'B4 (Si) — Located to the right of the 3 black keys.'),
      createNoteTarget('C', 'natural', 5, 'treble', 'C5 (Do Agudo) — Una octava por encima del Do Central (C4).', 'C5 (High C) — One octave above Middle C.'),
    ],
    passingCriteria: { minCorrect: 6 },
  },

  // LEVEL 2: BLACK KEYS & ACCIDENTALS
  {
    id: 2,
    title: {
      es: 'Nivel 2 — Teclas Negras: Sostenidos (#) y Bemoles (b)',
      en: 'Level 2 — Black Keys: Sharps (#) & Flats (b)',
    },
    subtitle: {
      es: 'Transición Completa a Notación en Inglés',
      en: 'Complete Cognitive Transition to English',
    },
    description: {
      es: 'Domina las teclas negras y la equivalencia enarmónica (C# = Db, D# = Eb, F# = Gb, G# = Ab, A# = Bb). Un sostenido (#) eleva 1 semitono a la derecha, un bemol (b) baja 1 semitono a la izquierda. El puente de solfeo queda desactivado.',
      en: 'Master black keys and enharmonic equivalence (C# = Db, D# = Eb, F# = Gb, G# = Ab, A# = Bb). A sharp (#) raises pitch by 1 semitone, a flat (b) lowers by 1 semitone.',
    },
    showKeyboardHelp: true,
    showSolfegeBridge: false,
    enforceInversion: false,
    targets: [
      createNoteTarget('C', 'sharp', 4, 'treble', 'C#4 (C sostenido) / Db4 (D bemol) — Tecla negra inmediatamente superior a C4.', 'C#4 (C-sharp) / Db4 (D-flat) — Black key immediately above C4.'),
      createNoteTarget('E', 'flat', 4, 'treble', 'Eb4 (E bemol) / D#4 (D sostenido) — Tecla negra inmediatamente inferior a E4.', 'Eb4 (E-flat) / D#4 (D-sharp) — Black key immediately below E4.'),
      createNoteTarget('F', 'sharp', 4, 'treble', 'F#4 (F sostenido) / Gb4 (G bemol) — Primera tecla negra del grupo de 3.', 'F#4 (F-sharp) / Gb4 (G-flat) — First black key in the triple group.'),
      createNoteTarget('A', 'flat', 4, 'treble', 'Ab4 (A bemol) / G#4 (G sostenido) — Tecla negra central del grupo de 3.', 'Ab4 (A-flat) / G#4 (G-sharp) — Middle black key in the triple group.'),
      createNoteTarget('A', 'sharp', 4, 'treble', 'A#4 (A sostenido) / Bb4 (B bemol) — Tercera tecla negra del grupo de 3.', 'A#4 (A-sharp) / Bb4 (B-flat) — Third black key in the triple group.'),
      createNoteTarget('D', 'sharp', 4, 'treble', 'D#4 (D sostenido) / Eb4 (E bemol) — Segunda tecla negra del grupo de 2.', 'D#4 (D-sharp) / Eb4 (E-flat) — Second black key in the pair group.'),
      createNoteTarget('B', 'flat', 4, 'treble', 'Bb4 (B bemol) / A#4 (A sostenido) — Tecla negra inmediatamente inferior a B4.', 'Bb4 (B-flat) / A#4 (A-sharp) — Black key immediately below B4.'),
    ],
    passingCriteria: { minCorrect: 5 },
  },

  // LEVEL 3: 5-OCTAVE RANGE IDENTIFICATION
  {
    id: 3,
    title: {
      es: 'Nivel 3 — Rango Extendido de 5 Octavas y Lectura de Claves',
      en: 'Level 3 — Extended 5-Octave Range & Clef Reading',
    },
    subtitle: {
      es: 'Navegando Registros desde C2 hasta C6',
      en: 'Navigating Pitch Registers Across Octaves C2 to C6',
    },
    description: {
      es: 'Amplía tu rango de lectura en todo el teclado de 61 teclas. Las notas más graves que C4 se escriben en Clave de Fa (bajos/mano izquierda), mientras las notas más agudas van en Clave de Sol (mano derecha).',
      en: 'Expand reading across 61-key spectrum. Notes lower than C4 are written in Bass Clef (left hand), higher notes in Treble Clef (right hand).',
    },
    showKeyboardHelp: true,
    showSolfegeBridge: false,
    enforceInversion: false,
    targets: [
      createNoteTarget('C', 'natural', 3, 'bass', 'C3 (Do grave) — Ubicado en la 2da línea del pentagrama en Clave de Fa.', 'C3 (Low C) — Located in Bass Clef 2nd space.'),
      createNoteTarget('G', 'natural', 3, 'bass', 'G3 (Sol grave) — Ubicado en la 4ta línea de Clave de Fa.', 'G3 (Bass G) — Located on Bass Clef 4th line.'),
      createNoteTarget('F', 'natural', 4, 'treble', 'F4 (Fa medio) — Ubicado en el 1er espacio de Clave de Sol.', 'F4 (Treble F) — Located on Treble Clef 1st space.'),
      createNoteTarget('C', 'sharp', 5, 'treble', 'C#5 (Do sostenido agudo) — Ubicado en el 3er espacio de Clave de Sol con el signo sostenido.', 'C#5 (High C-sharp) — Located in Treble Clef 3rd space with sharp symbol.'),
      createNoteTarget('B', 'flat', 3, 'bass', 'Bb3 (Si bemol grave) — Ubicado en la 2da línea de Clave de Fa con el signo bemol.', 'Bb3 (Bass B-flat) — Located on Bass Clef 2nd line with flat symbol.'),
      createNoteTarget('E', 'natural', 5, 'treble', 'E5 (Mi agudo) — Ubicado en el 4to espacio de Clave de Sol.', 'E5 (High E) — Located on Treble Clef 4th space.'),
    ],
    passingCriteria: { minCorrect: 5 },
  },

  // LEVEL 4: MAJOR TRIADS
  {
    id: 4,
    title: {
      es: 'Nivel 4 — Tríadas Mayores (Posición Fundamental)',
      en: 'Level 4 — Major Triads (Root Position)',
    },
    subtitle: {
      es: 'Fórmula de Construcción: 1 - 3 - 5 (0, 4, 7 Semitonos)',
      en: 'Chord Building Formula: 1 - 3 - 5 (0, 4, 7 Semitones)',
    },
    description: {
      es: 'Las tríadas mayores tienen un sonido brillante, alegre y estable. Se componen de 3 notas simultáneas: Fundamental (0 semitonos), Tercera Mayor (+4 semitonos) y Quinta Justa (+7 semitonos).',
      en: 'Major triads sound bright, happy, and stable. Consists of Root (0 semitones), Major 3rd (+4 semitones), and Perfect 5th (+7 semitones).',
    },
    showKeyboardHelp: true,
    showSolfegeBridge: false,
    enforceInversion: false,
    targets: [
      createChordTarget(ALL_12_ROOTS[0], 'major', 0, 4, 'treble', 'Tríada de C Major: C4 (Fundamental) + E4 (+4 semitonos) + G4 (+7 semitonos).', 'C Major Triad: C4 (Root) + E4 (+4 semitones) + G4 (+7 semitones).'),
      createChordTarget(ALL_12_ROOTS[7], 'major', 0, 4, 'treble', 'Tríada de G Major: G4 (Fundamental) + B4 (+4 semitonos) + D5 (+7 semitonos).', 'G Major Triad: G4 (Root) + B4 (+4 semitones) + D5 (+7 semitones).'),
      createChordTarget(ALL_12_ROOTS[5], 'major', 0, 4, 'treble', 'Tríada de F Major: F4 (Fundamental) + A4 (+4 semitonos) + C5 (+7 semitonos).', 'F Major Triad: F4 (Root) + A4 (+4 semitones) + C5 (+7 semitones).'),
      createChordTarget(ALL_12_ROOTS[2], 'major', 0, 4, 'treble', 'Tríada de D Major: D4 (Fundamental) + F#4 (+4 semitonos) + A4 (+7 semitonos). ¡Nota la tecla negra F#!', 'D Major Triad: D4 (Root) + F#4 (+4 semitones) + A4 (+7 semitones). Note the black key F#!'),
      createChordTarget(ALL_12_ROOTS[9], 'major', 0, 4, 'treble', 'Tríada de A Major: A4 (Fundamental) + C#5 (+4 semitonos) + E5 (+7 semitonos). ¡Nota la tecla negra C#!', 'A Major Triad: A4 (Root) + C#5 (+4 semitones) + E5 (+7 semitones). Note the black key C#!'),
      createChordTarget(ALL_12_ROOTS[4], 'major', 0, 4, 'treble', 'Tríada de E Major: E4 (Fundamental) + G#4 (+4 semitonos) + B4 (+7 semitonos). ¡Nota la tecla negra G#!', 'E Major Triad: E4 (Root) + G#4 (+4 semitones) + B4 (+7 semitones). Note the black key G#!'),
    ],
    passingCriteria: { minCorrect: 5 },
  },

  // LEVEL 5: MINOR TRIADS
  {
    id: 5,
    title: {
      es: 'Nivel 5 — Tríadas Menores (Posición Fundamental)',
      en: 'Level 5 — Minor Triads (Root Position)',
    },
    subtitle: {
      es: 'Fórmula de Construcción: 1 - b3 - 5 (0, 3, 7 Semitonos)',
      en: 'Chord Building Formula: 1 - b3 - 5 (0, 3, 7 Semitones)',
    },
    description: {
      es: 'Las tríadas menores poseen una sonoridad sombría y emotiva. En comparación con las mayores, la nota central (la 3ra) se reduce 1 semitono, produciendo intervalos de 0, 3 y 7 semitonos.',
      en: 'Minor triads carry a somber, melancholic tone. Compared to Major, the 3rd is lowered by 1 semitone (0, 3, 7 semitones).',
    },
    showKeyboardHelp: true,
    showSolfegeBridge: false,
    enforceInversion: false,
    targets: [
      createChordTarget(ALL_12_ROOTS[0], 'minor', 0, 4, 'treble', 'Tríada de C Minor: C4 (Fundamental) + Eb4 (Tercera Menor) + G4 (Quinta Justa).', 'C Minor Triad: C4 (Root) + Eb4 (Minor 3rd) + G4 (Perfect 5th).'),
      createChordTarget(ALL_12_ROOTS[9], 'minor', 0, 4, 'treble', 'Tríada de A Minor: A4 (Fundamental) + C5 (Tercera Menor) + E5 (Quinta Justa) — ¡Todas teclas blancas!', 'A Minor Triad: A4 (Root) + C5 (Minor 3rd) + E5 (Perfect 5th) — All natural keys!'),
      createChordTarget(ALL_12_ROOTS[4], 'minor', 0, 4, 'treble', 'Tríada de E Minor: E4 (Fundamental) + G4 (Tercera Menor) + B4 (Quinta Justa) — ¡Todas teclas blancas!', 'E Minor Triad: E4 (Root) + G4 (Minor 3rd) + B4 (Perfect 5th) — All natural keys!'),
      createChordTarget(ALL_12_ROOTS[2], 'minor', 0, 4, 'treble', 'Tríada de D Minor: D4 (Fundamental) + F4 (Tercera Menor) + A4 (Quinta Justa) — ¡Todas teclas blancas!', 'D Minor Triad: D4 (Root) + F4 (Minor 3rd) + A4 (Perfect 5th) — All natural keys!'),
      createChordTarget(ALL_12_ROOTS[7], 'minor', 0, 4, 'treble', 'Tríada de G Minor: G4 (Fundamental) + Bb4 (Tercera Menor) + D5 (Quinta Justa).', 'G Minor Triad: G4 (Root) + Bb4 (Minor 3rd) + D5 (Perfect 5th).'),
    ],
    passingCriteria: { minCorrect: 4 },
  },

  // LEVEL 6: ALL 12 KEYS (ALTERED ROOTS)
  {
    id: 6,
    title: {
      es: 'Nivel 6 — Las 12 Tonalidades (Fundamentales Alteradas)',
      en: 'Level 6 — All 12 Tonalities (Altered Roots)',
    },
    subtitle: {
      es: 'Dominio de Acordes Cromáticos en todas las Teclas Negras',
      en: 'Complete Chromatic Chord Mastery',
    },
    description: {
      es: 'Forma tríadas mayores y menores empezando en teclas negras (como F# Major, Bb Minor y Eb Major). Esto desarrolla confianza armónica completa en las 12 notas.',
      en: 'Build Major and Minor triads starting on altered black key roots (F# Major, Bb Minor, Eb Major). Builds full harmonic confidence.',
    },
    showKeyboardHelp: true,
    showSolfegeBridge: false,
    enforceInversion: false,
    targets: [
      createChordTarget(ALL_12_ROOTS[6], 'major', 0, 4, 'treble', 'Tríada de F# Major: F#4 (Fundamental) + A#4 (+4) + C#5 (+7) — ¡3 teclas negras!', 'F# Major Triad: F#4 (Root) + A#4 (Maj 3rd) + C#5 (Perf 5th) — 3 black keys!'),
      createChordTarget(ALL_12_ROOTS[10], 'minor', 0, 4, 'treble', 'Tríada de Bb Minor: Bb4 (Fundamental) + Db5 (Tercera Menor) + F5 (Quinta Justa).', 'Bb Minor Triad: Bb4 (Root) + Db5 (Min 3rd) + F5 (Perf 5th).'),
      createChordTarget(ALL_12_ROOTS[3], 'major', 0, 4, 'treble', 'Tríada de Eb Major: Eb4 (Fundamental) + G4 (Tercera Mayor) + Bb4 (Quinta Justa).', 'Eb Major Triad: Eb4 (Root) + G4 (Maj 3rd) + Bb4 (Perf 5th).'),
      createChordTarget(ALL_12_ROOTS[1], 'minor', 0, 4, 'treble', 'Tríada de C# Minor: C#4 (Fundamental) + E4 (Tercera Menor) + G#4 (Quinta Justa).', 'C# Minor Triad: C#4 (Root) + E4 (Min 3rd) + G#4 (Perf 5th).'),
      createChordTarget(ALL_12_ROOTS[8], 'major', 0, 4, 'treble', 'Tríada de Ab Major: Ab4 (Fundamental) + C5 (Tercera Mayor) + Eb5 (Quinta Justa).', 'Ab Major Triad: Ab4 (Root) + C5 (Maj 3rd) + Eb5 (Perf 5th).'),
    ],
    passingCriteria: { minCorrect: 4 },
  },

  // LEVEL 7: DIMINISHED & AUGMENTED
  {
    id: 7,
    title: {
      es: 'Nivel 7 — Acordes Disminuidos y Aumentados',
      en: 'Level 7 — Diminished & Augmented Color Triads',
    },
    subtitle: {
      es: 'Colores Armónicos de Tensión y Suspenso',
      en: 'Harmonic Tension & Resolution Color Formulas',
    },
    description: {
      es: 'Las tríadas disminuidas (0-3-6 semitonos) transmiten suspenso y drama. Las tríadas aumentadas (0-4-8 semitonos) suenan misteriosas y flotantes. Práctica estos dos colores armónicos.',
      en: 'Diminished triads (0-3-6 semitones) sound tense. Augmented triads (0-4-8 semitones) sound mysterious. Practice forming these colors.',
    },
    showKeyboardHelp: true,
    showSolfegeBridge: false,
    enforceInversion: false,
    targets: [
      createChordTarget(ALL_12_ROOTS[0], 'diminished', 0, 4, 'treble', 'C Diminished: C4 + Eb4 (+3 semitonos) + Gb4 (+6 semitonos). Quinta disminuida tensa.', 'C Diminished: C4 + Eb4 (+3 semitones) + Gb4 (+6 semitones). Tense diminished 5th.'),
      createChordTarget(ALL_12_ROOTS[0], 'augmented', 0, 4, 'treble', 'C Augmented: C4 + E4 (+4 semitonos) + G#4 (+8 semitonos). Quinta aumentada misteriosa.', 'C Augmented: C4 + E4 (+4 semitones) + G#4 (+8 semitones). Mysterious augmented 5th.'),
      createChordTarget(ALL_12_ROOTS[4], 'diminished', 0, 4, 'treble', 'E Diminished: E4 + G4 (+3 semitonos) + Bb4 (+6 semitonos).', 'E Diminished: E4 + G4 (+3 semitones) + Bb4 (+6 semitones).'),
      createChordTarget(ALL_12_ROOTS[2], 'augmented', 0, 4, 'treble', 'D Augmented: D4 + F#4 (+4 semitonos) + A#4 (+8 semitonos).', 'D Augmented: D4 + F#4 (+4 semitones) + A#4 (+8 semitones).'),
    ],
    passingCriteria: { minCorrect: 3 },
  },

  // LEVEL 8: TWO-HAND SEPARATION
  {
    id: 8,
    title: {
      es: 'Nivel 8 — Separación de Manos (Clave de Fa + Clave de Sol)',
      en: 'Level 8 — Two-Hand Separation (Bass Clef + Treble Clef)',
    },
    subtitle: {
      es: 'Acompañamiento Bajo Mano Izquierda + Acorde Mano Derecha',
      en: 'Left Hand Bass Accompaniment + Right Hand Harmony',
    },
    description: {
      es: 'Desarrolla independencia tocando una nota baja de bajo con tu mano izquierda en Clave de Fa (C2–C3) mientras simultáneamente formas el acorde con tu mano derecha en Clave de Sol.',
      en: 'Develop hand independence by holding a low bass note with left hand in Bass Clef (C2–C3) while playing chord with right hand in Treble Clef.',
    },
    showKeyboardHelp: true,
    showSolfegeBridge: false,
    enforceInversion: false,
    targets: [
      {
        id: 'two-hand-c-maj',
        type: 'chord',
        clef: 'both',
        chord: createChordDefinition(ALL_12_ROOTS[0], 'major'),
        expectedMidiNumbers: [36, 60, 64, 67],
        label: 'LH Bass C2 + RH C Major Triad',
        explanation: {
          es: 'La mano izquierda toca C2 (MIDI 36) en Clave de Fa. La mano derecha toca C4 - E4 - G4 en Clave de Sol.',
          en: 'Left Hand plays Bass C2 (MIDI 36) in Bass Clef. Right Hand plays C4 - E4 - G4 in Treble Clef.',
        },
      },
      {
        id: 'two-hand-g-maj',
        type: 'chord',
        clef: 'both',
        chord: createChordDefinition(ALL_12_ROOTS[7], 'major'),
        expectedMidiNumbers: [43, 67, 71, 74],
        label: 'LH Bass G2 + RH G Major Triad',
        explanation: {
          es: 'La mano izquierda toca G2 (MIDI 43) en Clave de Fa. La mano derecha toca G4 - B4 - D5 en Clave de Sol.',
          en: 'Left Hand plays Bass G2 (MIDI 43) in Bass Clef. Right Hand plays G4 - B4 - D5 in Treble Clef.',
        },
      },
      {
        id: 'two-hand-f-maj',
        type: 'chord',
        clef: 'both',
        chord: createChordDefinition(ALL_12_ROOTS[5], 'major'),
        expectedMidiNumbers: [41, 65, 69, 72],
        label: 'LH Bass F2 + RH F Major Triad',
        explanation: {
          es: 'La mano izquierda toca F2 (MIDI 41) en Clave de Fa. La mano derecha toca F4 - A4 - C5 en Clave de Sol.',
          en: 'Left Hand plays Bass F2 (MIDI 41) in Bass Clef. Right Hand plays F4 - A4 - C5 in Treble Clef.',
        },
      },
    ],
    passingCriteria: { minCorrect: 2 },
  },

  // LEVEL 9: CHORD INVERSIONS
  {
    id: 9,
    title: {
      es: 'Nivel 9 — Inversiones de Acordes (1ra y 2da Inversión)',
      en: 'Level 9 — Triad Inversions (1st & 2nd Inversions)',
    },
    subtitle: {
      es: 'Conducción de Voces y Verificación de Bajo',
      en: 'Voice Leading & Bass Order Verification',
    },
    description: {
      es: 'Las inversiones cambian qué nota del acorde queda más grave. Posición fundamental = Fundamental abajo. 1ra Inversión = 3ra abajo (ej. E-G-C). 2da Inversión = 5ta abajo (ej. G-C-E). El motor de evaluación verifica estrictamente la nota del bajo.',
      en: 'Inversions change which note is lowest. Root = Root in bass. 1st Inversion = 3rd in bass (E-G-C). 2nd Inversion = 5th in bass (G-C-E). The engine strictly validates bass note.',
    },
    showKeyboardHelp: true,
    showSolfegeBridge: false,
    enforceInversion: true,
    targets: [
      createChordTarget(ALL_12_ROOTS[0], 'major', 1, 4, 'treble', 'C Major 1ra Inversión: Toca E4 (Bajo) - G4 - C5. ¡La 3ra (E) es la voz más grave!', 'C Major 1st Inversion: Play E4 (Bass) - G4 - C5. The 3rd (E) is the lowest voice!'),
      createChordTarget(ALL_12_ROOTS[0], 'major', 2, 4, 'treble', 'C Major 2da Inversión: Toca G4 (Bajo) - C5 - E5. ¡La 5ta (G) es la voz más grave!', 'C Major 2nd Inversion: Play G4 (Bass) - C5 - E5. The 5th (G) is the lowest voice!'),
      createChordTarget(ALL_12_ROOTS[7], 'major', 1, 4, 'treble', 'G Major 1ra Inversión: Toca B4 (Bajo) - D5 - G5.', 'G Major 1st Inversion: Play B4 (Bass) - D5 - G5.'),
      createChordTarget(ALL_12_ROOTS[9], 'minor', 1, 4, 'treble', 'A Minor 1ra Inversión: Toca C5 (Bajo) - E5 - A5.', 'A Minor 1st Inversion: Play C5 (Bass) - E5 - A5.'),
      createChordTarget(ALL_12_ROOTS[5], 'major', 2, 4, 'treble', 'F Major 2da Inversión: Toca C5 (Bajo) - F5 - A5.', 'F Major 2nd Inversion: Play C5 (Bass) - F5 - A5.'),
    ],
    passingCriteria: { minCorrect: 4 },
  },

  // LEVEL 10: PURE SHEET MUSIC EXAM MODE
  {
    id: 10,
    title: {
      es: 'Nivel 10 — Modo Examen de Lectura Pura en Partitura',
      en: 'Level 10 — Pure Sheet Music Exam Mode',
    },
    subtitle: {
      es: 'Sin Ayuda Visual en Teclado ni Textos de Ayuda',
      en: 'No On-Screen Text or Keyboard Highlights',
    },
    description: {
      es: 'Pon a prueba tu capacidad de lectura directa. La iluminación visual del teclado y las pistas de texto quedan completamente desactivadas. Identifica y toca el objetivo únicamente leyendo el pentagrama.',
      en: 'Test your sight-reading abilities under real-world conditions. Visual key highlighting and textual hints are removed. Read directly from score.',
    },
    showKeyboardHelp: false,
    showSolfegeBridge: false,
    enforceInversion: true,
    targets: [
      createNoteTarget('F', 'sharp', 4, 'treble', 'Lee la nota en Clave de Sol con alteración sostenida.', 'Read note on Treble Clef with sharp accidental sign.'),
      createChordTarget(ALL_12_ROOTS[0], 'major', 0, 4, 'treble', 'Lee el acorde apilado de 3 notas en Clave de Sol.', 'Read standard 3-note stacked chord in Treble Clef.'),
      createChordTarget(ALL_12_ROOTS[2], 'minor', 0, 4, 'treble', 'Lee el acorde menor apilado en el pentagrama.', 'Read 3-note stacked minor chord.'),
      createChordTarget(ALL_12_ROOTS[10], 'major', 0, 4, 'treble', 'Lee el acorde alterado con bemoles en la partitura.', 'Read altered chord with flat signs on score.'),
      createChordTarget(ALL_12_ROOTS[6], 'minor', 0, 4, 'treble', 'Lee el acorde menor alterado con sostenidos en la partitura.', 'Read altered minor chord with sharp signs on score.'),
    ],
    passingCriteria: { minCorrect: 4 },
  },
];
