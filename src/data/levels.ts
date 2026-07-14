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
  // ═══════════════════════════════════════════════════════════════
  // LEVEL 0: SANDBOX
  // ═══════════════════════════════════════════════════════════════
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

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 1: NATURAL WHITE KEYS (with curiosities)
  // ═══════════════════════════════════════════════════════════════
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
      createNoteTarget('C', 'natural', 4, 'treble',
        'Do Central (C4 / Middle C) — Es la primera nota que aprende todo pianista. Está justo a la izquierda del par de 2 teclas negras en el centro del teclado. 🎹 Curiosidad: En la Edad Media no existían los nombres C, D, E... ¡se usaban letras del alfabeto griego!',
        'Middle C (C4) — The first note every pianist learns. Located left of the pair of 2 black keys in the center. 🎹 Fun fact: In medieval times, notes were named with Greek alphabet letters, not C-D-E!'),
      createNoteTarget('D', 'natural', 4, 'treble',
        'D4 (Re) — Encajado justo en el centro del par de 2 teclas negras, como un "sándwich". Es el punto de referencia visual más fácil del piano.',
        'D4 (Re) — Nestled right between the pair of 2 black keys, like a sandwich. It\'s the easiest visual landmark on the piano.'),
      createNoteTarget('E', 'natural', 4, 'treble',
        'E4 (Mi) — A la derecha del par de 2 teclas negras. 🎹 Curiosidad: Entre E y F no hay tecla negra. Es uno de los 2 "semitonos naturales" del piano (el otro es B→C). ¡Por eso el piano tiene ese patrón irregular!',
        'E4 (Mi) — Right of the pair of 2 black keys. 🎹 Fun fact: There\'s no black key between E and F. It\'s one of 2 "natural semitones" on piano (the other is B→C). That\'s why the keyboard has that irregular pattern!'),
      createNoteTarget('F', 'natural', 4, 'treble',
        'F4 (Fa) — A la izquierda del grupo de 3 teclas negras. Los pianistas usan estos grupos de teclas negras (2 y 3) como guía visual para orientarse sin mirar las manos.',
        'F4 (Fa) — Left of the group of 3 black keys. Pianists use these black key groups (2 and 3) as visual guides to navigate without looking at their hands.'),
      createNoteTarget('G', 'natural', 4, 'treble',
        'G4 (Sol) — Dentro del grupo de 3 teclas negras, después de F. 🎹 Curiosidad: El nombre "Sol" en solfeo viene de "Solve" del himno medieval a San Juan Bautista (siglo XI). ¡Guido d\'Arezzo inventó el solfeo usando ese himno!',
        'G4 (Sol) — Inside the group of 3 black keys, after F. 🎹 Fun fact: The solfège name "Sol" comes from "Solve" in an 11th-century hymn to St. John the Baptist. Guido d\'Arezzo invented solfège using that hymn!'),
      createNoteTarget('A', 'natural', 4, 'treble',
        'A4 (La) — Entre la 2da y 3ra tecla negra del grupo triple. 🎹 Curiosidad: A4 = 440 Hz es el ESTÁNDAR UNIVERSAL de afinación. Todas las orquestas del mundo afinan con esta nota. Antes de 1955, cada país usaba una frecuencia diferente.',
        'A4 (La) — Between the 2nd and 3rd black key of the triple group. 🎹 Fun fact: A4 = 440 Hz is the UNIVERSAL tuning standard. Every orchestra in the world tunes to this note. Before 1955, each country used a different frequency!'),
      createNoteTarget('B', 'natural', 4, 'treble',
        'B4 (Si) — A la derecha del grupo de 3 teclas negras. 🎹 Curiosidad: En Alemania, B se llama "H". Esto permitió a J.S. Bach firmar su música con las notas B♭-A-C-B, que en alemán se escriben B-A-C-H. ¡Su nombre era literalmente un motivo musical!',
        'B4 (Si) — Right of the 3 black keys. 🎹 Fun fact: In Germany, B is called "H". This allowed J.S. Bach to sign his music with the notes B♭-A-C-B, which in German spell B-A-C-H. His name was literally a musical motif!'),
      createNoteTarget('C', 'natural', 5, 'treble',
        'C5 (Do Agudo) — Una octava por encima del Do Central. 🎹 Curiosidad: Al subir una octava, la frecuencia se DUPLICA exactamente: C4 = 261.6 Hz, C5 = 523.2 Hz. ¡Por eso suenan "igual pero más agudo"!',
        'C5 (High C) — One octave above Middle C. 🎹 Fun fact: Going up one octave EXACTLY doubles the frequency: C4 = 261.6 Hz, C5 = 523.2 Hz. That\'s why they sound "the same but higher"!'),
    ],
    passingCriteria: { minCorrect: 8 },
  },

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 2: BLACK KEYS & ACCIDENTALS (with etymology)
  // ═══════════════════════════════════════════════════════════════
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
      createNoteTarget('C', 'sharp', 4, 'treble',
        'C#4 (Do sostenido) / Db4 (Re bemol) — La tecla negra justo arriba de C4. 🎹 Curiosidad: El símbolo # (sostenido) viene del latín medieval "b quadratum" — una letra B cuadrada que con el tiempo se fue deformando hasta parecer una reja (#). ¡El hashtag viene de la música!',
        'C#4 (C-sharp) / Db4 (D-flat) — The black key just above C4. 🎹 Fun fact: The # (sharp) symbol comes from medieval Latin "b quadratum" — a square letter B that gradually morphed into the hash sign (#). The hashtag comes from music!'),
      createNoteTarget('E', 'flat', 4, 'treble',
        'Eb4 (Mi bemol) / D#4 (Re sostenido) — La tecla negra justo debajo de E4. 🎹 Curiosidad: La palabra "BEMOL" viene del latín "b molle" (b suave/redonda). En la Edad Media, la nota B tenía 2 formas: la B redonda (♭ = más grave) y la B cuadrada (♮ = más aguda). ¡El símbolo ♭ es literalmente una "b" minúscula redondeada!',
        'Eb4 (E-flat) / D#4 (D-sharp) — The black key just below E4. 🎹 Fun fact: The word "FLAT" comes from the Latin "b molle" (soft/round b). In medieval times, the note B had 2 forms: round B (♭ = lower) and square B (♮ = higher). The ♭ symbol is literally a rounded lowercase "b"!'),
      createNoteTarget('F', 'sharp', 4, 'treble',
        'F#4 (Fa sostenido) / Gb4 (Sol bemol) — Primera tecla negra del grupo de 3. 🎹 Curiosidad: F# y Gb son "enarmónicos": MISMO sonido, DISTINTO nombre. Es como decir "cero" y "nada" — mismo concepto, diferente palabra. ¡El contexto musical decide cuál nombre usar!',
        'F#4 (F-sharp) / Gb4 (G-flat) — First black key in the triple group. 🎹 Fun fact: F# and Gb are "enharmonic equivalents": SAME sound, DIFFERENT name. It\'s like saying "zero" and "nothing" — same concept, different word. The musical context decides which name to use!'),
      createNoteTarget('A', 'flat', 4, 'treble',
        'Ab4 (La bemol) / G#4 (Sol sostenido) — La tecla negra central del grupo de 3. 🎹 Curiosidad: Si tocas SOLO las 5 teclas negras en secuencia, obtienes la escala pentatónica — suena como música china, celta o japonesa. ¡Es la escala más antigua del mundo, usada por culturas de todos los continentes!',
        'Ab4 (A-flat) / G#4 (G-sharp) — The middle black key in the triple group. 🎹 Fun fact: If you play ONLY the 5 black keys in sequence, you get the pentatonic scale — it sounds like Chinese, Celtic, or Japanese music. It\'s the oldest scale in the world, used by cultures on every continent!'),
      createNoteTarget('B', 'flat', 4, 'treble',
        'Bb4 (Si bemol) / A#4 (La sostenido) — La tercera tecla negra del grupo de 3. 🎹 Curiosidad: Bb es la nota MÁS IMPORTANTE del jazz. La trompeta, el saxo tenor y el clarinete están todos afinados en Bb. ¡Por eso tantos standards de jazz están en tonalidades con bemoles!',
        'Bb4 (B-flat) / A#4 (A-sharp) — The third black key in the triple group. 🎹 Fun fact: Bb is the MOST IMPORTANT note in jazz. The trumpet, tenor sax, and clarinet are all pitched in Bb. That\'s why so many jazz standards are in flat keys!'),
    ],
    passingCriteria: { minCorrect: 5 },
  },

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 3: 5-OCTAVE RANGE (C2 to C6) — EXPANDED
  // ═══════════════════════════════════════════════════════════════
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
      createNoteTarget('C', 'natural', 2, 'bass',
        'C2 (Do grave profundo) — El extremo más grave de tu Yamaha PSR-E383. 🎹 Curiosidad: C2 vibra a solo 65.4 Hz. ¡Tan grave que algunos altavoces pequeños no pueden reproducirlo! El oído humano empieza a escuchar desde ~20 Hz.',
        'C2 (Deep low C) — The lowest extreme of your Yamaha PSR-E383. 🎹 Fun fact: C2 vibrates at just 65.4 Hz. So low that some small speakers can\'t even reproduce it! Human hearing starts at ~20 Hz.'),
      createNoteTarget('E', 'natural', 2, 'bass',
        'E2 (Mi grave) — En la octava más grave del teclado. 🎹 Curiosidad: E2 es la nota de la cuerda más grave de una guitarra estándar. Si algún día tocas guitarra, ya conocerás esta nota.',
        'E2 (Low E) — In the lowest octave of the keyboard. 🎹 Fun fact: E2 is the note of the lowest string on a standard guitar. If you ever play guitar, you\'ll already know this note!'),
      createNoteTarget('A', 'natural', 2, 'bass',
        'A2 (La grave) — En la zona grave. 🎹 Curiosidad: Los bajos eléctricos suelen afinarse E2-A2-D3-G3. Si tocas A2, estás tocando la 2da cuerda de un bajo.',
        'A2 (Low A) — In the bass zone. 🎹 Fun fact: Electric basses are typically tuned E2-A2-D3-G3. If you play A2, you\'re playing the 2nd string of a bass guitar!'),
      createNoteTarget('C', 'natural', 3, 'bass',
        'C3 (Do grave) — Una octava debajo del Do Central. En Clave de Fa, se ubica en la 2da línea.',
        'C3 (Low C) — One octave below Middle C. Located on the 2nd ledger line below Bass Clef staff.'),
      createNoteTarget('G', 'natural', 3, 'bass',
        'G3 (Sol grave) — En la 4ta línea de Clave de Fa. 🎹 Curiosidad: La Clave de Fa (𝄢) es una letra F estilizada. Los dos puntos marcan la línea donde va F3. ¡De ahí su nombre!',
        'G3 (Bass G) — On Bass Clef 4th line. 🎹 Fun fact: The Bass Clef symbol (𝄢) is a stylized letter F. The two dots mark the line where F3 sits. That\'s where it gets its name!'),
      createNoteTarget('B', 'flat', 3, 'bass',
        'Bb3 (Si bemol grave) — En Clave de Fa con signo bemol. Practicar alteraciones en registro grave fortalece tu lectura en ambas claves.',
        'Bb3 (Bass B-flat) — In Bass Clef with flat symbol. Practicing accidentals in the bass register strengthens reading in both clefs.'),
      createNoteTarget('F', 'natural', 4, 'treble',
        'F4 (Fa medio) — En el 1er espacio de Clave de Sol. 🎹 Curiosidad: La Clave de Sol (𝄞) es una letra G ornamentada. El rizo de la clave envuelve la 2da línea, que es donde va G4.',
        'F4 (Treble F) — On Treble Clef 1st space. 🎹 Fun fact: The Treble Clef symbol (𝄞) is an ornamental letter G. The curl of the clef wraps around the 2nd line, where G4 sits.'),
      createNoteTarget('C', 'sharp', 5, 'treble',
        'C#5 (Do sostenido agudo) — En el 3er espacio de Clave de Sol con signo sostenido.',
        'C#5 (High C-sharp) — In Treble Clef 3rd space with sharp symbol.'),
      createNoteTarget('E', 'natural', 5, 'treble',
        'E5 (Mi agudo) — En el 4to espacio de Clave de Sol. Una octava arriba de E4.',
        'E5 (High E) — On Treble Clef 4th space. One octave above E4.'),
      createNoteTarget('A', 'natural', 5, 'treble',
        'A5 (La agudo) — Bien arriba en el pentagrama. 🎹 Curiosidad: A5 = 880 Hz, el doble de A4 (440 Hz). Cada octava duplica la frecuencia.',
        'A5 (High A) — High up on the staff. 🎹 Fun fact: A5 = 880 Hz, double of A4 (440 Hz). Each octave doubles the frequency.'),
      createNoteTarget('C', 'natural', 6, 'treble',
        'C6 (Do sobreagudo) — El extremo más agudo del rango estándar de 61 teclas. 🎹 Curiosidad: C6 = 1046.5 Hz. En la soprano operática, esta nota se llama "High C" y es un hito vocal impresionante.',
        'C6 (Super-high C) — The highest extreme of the standard 61-key range. 🎹 Fun fact: C6 = 1046.5 Hz. In operatic soprano, this note is called "High C" and is an impressive vocal milestone.'),
    ],
    passingCriteria: { minCorrect: 11 },
  },

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 4: ALL 7 NATURAL-ROOT MAJOR TRIADS (including B Major)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 4,
    title: {
      es: 'Nivel 4 — Tríadas Mayores (Las 7 Raíces Naturales)',
      en: 'Level 4 — Major Triads (All 7 Natural Roots)',
    },
    subtitle: {
      es: 'Fórmula de Construcción: 1 - 3 - 5 (0, 4, 7 Semitonos)',
      en: 'Chord Building Formula: 1 - 3 - 5 (0, 4, 7 Semitones)',
    },
    description: {
      es: 'Las tríadas mayores tienen un sonido brillante, alegre y estable. Se componen de 3 notas simultáneas: Fundamental (0 semitonos), Tercera Mayor (+4 semitonos) y Quinta Justa (+7 semitonos). Aprende las 7 tríadas mayores con raíz en tecla blanca.',
      en: 'Major triads sound bright, happy, and stable. Consists of Root (0 semitones), Major 3rd (+4 semitones), and Perfect 5th (+7 semitones). Learn all 7 major triads with white-key roots.',
    },
    showKeyboardHelp: true,
    showSolfegeBridge: false,
    enforceInversion: false,
    targets: [
      createChordTarget(ALL_12_ROOTS[0], 'major', 0, 4, 'treble',
        'C Major: C4 + E4 + G4. El acorde "blanco puro" — ¡las 3 notas son teclas blancas! Es el primer acorde que aprende todo pianista. 🎹 Curiosidad: C Major es la ÚNICA escala mayor sin sostenidos ni bemoles. ¡Por eso el piano se diseñó con las teclas blancas en C Major!',
        'C Major: C4 + E4 + G4. The "pure white" chord — all 3 notes are white keys! It\'s the first chord every pianist learns. 🎹 Fun fact: C Major is the ONLY major scale with no sharps or flats. That\'s why the piano was designed with white keys in C Major!'),
      createChordTarget(ALL_12_ROOTS[2], 'major', 0, 4, 'treble',
        'D Major: D4 + F#4 + A4. ¡Tu primer acorde con tecla negra (F#)! 🎹 Curiosidad: D Major es la tonalidad favorita de la música barroca para cuerdas — los violines suenan especialmente brillantes en D.',
        'D Major: D4 + F#4 + A4. Your first chord with a black key (F#)! 🎹 Fun fact: D Major is the favorite key for Baroque string music — violins sound especially brilliant in D.'),
      createChordTarget(ALL_12_ROOTS[4], 'major', 0, 4, 'treble',
        'E Major: E4 + G#4 + B4. Nota la tecla negra G#. 🎹 Curiosidad: E Major es el acorde favorito del rock y el blues. La guitarra tiene su cuerda más grave y más aguda ambas afinadas en E.',
        'E Major: E4 + G#4 + B4. Note the black key G#. 🎹 Fun fact: E Major is the favorite chord of rock and blues. The guitar has both its lowest and highest strings tuned to E.'),
      createChordTarget(ALL_12_ROOTS[5], 'major', 0, 4, 'treble',
        'F Major: F4 + A4 + C5. ¡Todas teclas blancas! 🎹 Curiosidad: F Major es el acorde "espejo" de C Major en el Círculo de Quintas — están separados por una quinta justa. La progresión C→F es una de las más naturales en la música.',
        'F Major: F4 + A4 + C5. All white keys! 🎹 Fun fact: F Major is the "mirror" chord of C Major in the Circle of Fifths — they\'re separated by a perfect fifth. The C→F progression is one of the most natural in music.'),
      createChordTarget(ALL_12_ROOTS[7], 'major', 0, 4, 'treble',
        'G Major: G4 + B4 + D5. ¡Todas teclas blancas! 🎹 Curiosidad: La progresión G→C→D→G es la base del ~50% de las canciones pop del mundo. ¡Si la dominas, puedes tocar cientos de canciones!',
        'G Major: G4 + B4 + D5. All white keys! 🎹 Fun fact: The progression G→C→D→G is the foundation of ~50% of pop songs worldwide. Master it and you can play hundreds of songs!'),
      createChordTarget(ALL_12_ROOTS[9], 'major', 0, 4, 'treble',
        'A Major: A4 + C#5 + E5. Nota la tecla negra C#. 🎹 Curiosidad: A Major contiene C#, que le da su carácter brillante y "country". Muchas canciones de rock clásico (AC/DC, por ejemplo) están en A.',
        'A Major: A4 + C#5 + E5. Note the black key C#. 🎹 Fun fact: A Major contains C#, which gives it a bright, "country" character. Many classic rock songs (AC/DC, for example) are in A.'),
      createChordTarget(ALL_12_ROOTS[11], 'major', 0, 4, 'treble',
        'B Major: B4 + D#5 + F#5. ¡Necesita 2 teclas negras (D# y F#)! 🎹 Curiosidad: B Major es uno de los acordes más difíciles para principiantes por usar 2 teclas negras. Pero en tonalidades con muchos sostenidos (como B, que tiene 5), ¡las teclas negras se sienten más "naturales" que las blancas!',
        'B Major: B4 + D#5 + F#5. Needs 2 black keys (D# and F#)! 🎹 Fun fact: B Major is one of the hardest chords for beginners because it uses 2 black keys. But in keys with many sharps (like B, which has 5), black keys feel more "natural" than white ones!'),
    ],
    passingCriteria: { minCorrect: 7 },
  },

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 5: ALL 7 NATURAL-ROOT MINOR TRIADS (including B Minor & F Minor)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 5,
    title: {
      es: 'Nivel 5 — Tríadas Menores (Las 7 Raíces Naturales)',
      en: 'Level 5 — Minor Triads (All 7 Natural Roots)',
    },
    subtitle: {
      es: 'Fórmula de Construcción: 1 - b3 - 5 (0, 3, 7 Semitonos)',
      en: 'Chord Building Formula: 1 - b3 - 5 (0, 3, 7 Semitones)',
    },
    description: {
      es: 'Las tríadas menores poseen una sonoridad sombría y emotiva. En comparación con las mayores, la nota central (la 3ra) se reduce 1 semitono, produciendo intervalos de 0, 3 y 7 semitonos. Aprende las 7 tríadas menores con raíz en tecla blanca.',
      en: 'Minor triads carry a somber, melancholic tone. Compared to Major, the 3rd is lowered by 1 semitone (0, 3, 7 semitones). Learn all 7 minor triads with white-key roots.',
    },
    showKeyboardHelp: true,
    showSolfegeBridge: false,
    enforceInversion: false,
    targets: [
      createChordTarget(ALL_12_ROOTS[0], 'minor', 0, 4, 'treble',
        'C Minor: C4 + Eb4 + G4. 🎹 Curiosidad: La ÚNICA diferencia entre C Mayor y C Menor es 1 semitono — la E baja a Eb. ¡Ese minúsculo cambio transforma "alegría" en "melancolía"! Beethoven usó C Minor para su dramática Sinfonía No. 5 (ta-ta-ta-TAAA).',
        'C Minor: C4 + Eb4 + G4. 🎹 Fun fact: The ONLY difference between C Major and C Minor is 1 semitone — E drops to Eb. That tiny change transforms "joy" into "melancholy"! Beethoven used C Minor for his dramatic Symphony No. 5 (da-da-da-DAAA).'),
      createChordTarget(ALL_12_ROOTS[2], 'minor', 0, 4, 'treble',
        'D Minor: D4 + F4 + A4. ¡Todas teclas blancas! 🎹 Curiosidad: D Minor es famoso por ser "el acorde más triste del mundo" según Nigel Tufnel de la película Spinal Tap (1984). Se volvió un meme musical. Aunque cualquier acorde menor puede sonar triste, ¡Dm tiene cierta melancolía especial!',
        'D Minor: D4 + F4 + A4. All white keys! 🎹 Fun fact: D Minor is famous for being "the saddest key of all" according to Nigel Tufnel from the movie Spinal Tap (1984). It became a musical meme. While any minor chord can sound sad, Dm does have a special melancholy!'),
      createChordTarget(ALL_12_ROOTS[4], 'minor', 0, 4, 'treble',
        'E Minor: E4 + G4 + B4. ¡Todas teclas blancas! 🎹 Curiosidad: E Minor y A Minor son los 2 únicos acordes menores que usan SOLO teclas blancas. Son los más fáciles y los primeros que se enseñan en guitarra también.',
        'E Minor: E4 + G4 + B4. All white keys! 🎹 Fun fact: E Minor and A Minor are the only 2 minor chords using ONLY white keys. They\'re the easiest and the first ones taught on guitar too.'),
      createChordTarget(ALL_12_ROOTS[5], 'minor', 0, 4, 'treble',
        'F Minor: F4 + Ab4 + C5. Nota la tecla negra Ab. 🎹 Curiosidad: F Minor tiene un carácter oscuro y dramático intenso. Beethoven lo eligió para su Sonata "Appassionata" (Op. 57), una de las piezas más apasionadas de la historia del piano.',
        'F Minor: F4 + Ab4 + C5. Note the black key Ab. 🎹 Fun fact: F Minor has an intense, dark, dramatic character. Beethoven chose it for his "Appassionata" Sonata (Op. 57), one of the most passionate pieces in piano history.'),
      createChordTarget(ALL_12_ROOTS[7], 'minor', 0, 4, 'treble',
        'G Minor: G4 + Bb4 + D5. Nota la tecla negra Bb. 🎹 Curiosidad: Mozart adoraba Sol Menor. Su Sinfonía No. 40 en G Minor (K. 550) es una de las obras más famosas de la historia — ese tema que seguro has escuchado sin saber que era Mozart.',
        'G Minor: G4 + Bb4 + D5. Note the black key Bb. 🎹 Fun fact: Mozart loved G Minor. His Symphony No. 40 in G Minor (K. 550) is one of the most famous works in history — that theme you\'ve definitely heard without knowing it was Mozart.'),
      createChordTarget(ALL_12_ROOTS[9], 'minor', 0, 4, 'treble',
        'A Minor: A4 + C5 + E5. ¡Todas teclas blancas! 🎹 Curiosidad: A Minor es el "RELATIVO MENOR" de C Major — comparten TODAS las mismas notas (solo teclas blancas). La diferencia es el punto de partida. ¡Cada tonalidad mayor tiene un relativo menor, y viceversa!',
        'A Minor: A4 + C5 + E5. All white keys! 🎹 Fun fact: A Minor is the "RELATIVE MINOR" of C Major — they share ALL the same notes (only white keys). The difference is the starting point. Every major key has a relative minor, and vice versa!'),
      createChordTarget(ALL_12_ROOTS[11], 'minor', 0, 4, 'treble',
        'B Minor: B4 + D5 + F#5. Nota la tecla negra F#. 🎹 Curiosidad: Schubert escribió su famosa "Sinfonía Inconclusa" en B Minor — solo completó 2 movimientos de 4. Nadie sabe por qué la dejó incompleta. ¡Es uno de los grandes misterios de la música clásica!',
        'B Minor: B4 + D5 + F#5. Note the black key F#. 🎹 Fun fact: Schubert wrote his famous "Unfinished Symphony" in B Minor — he only completed 2 of 4 movements. Nobody knows why he left it incomplete. It\'s one of the great mysteries of classical music!'),
    ],
    passingCriteria: { minCorrect: 7 },
  },

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 6: ALL 10 ALTERED-ROOT TRIADS (5 Major + 5 Minor on black keys)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 6,
    title: {
      es: 'Nivel 6 — Las 12 Tonalidades: Raíces Alteradas (Teclas Negras)',
      en: 'Level 6 — All 12 Tonalities: Altered Roots (Black Keys)',
    },
    subtitle: {
      es: 'Dominio Cromático Completo — Mayor y Menor en las 5 Teclas Negras',
      en: 'Complete Chromatic Mastery — Major & Minor on All 5 Black Keys',
    },
    description: {
      es: 'Completa tu dominio de las 12 tonalidades formando tríadas mayores y menores empezando en las 5 teclas negras (C#, Eb, F#, Ab, Bb). Combinado con los niveles 4 y 5, esto cubre las 24 tríadas básicas.',
      en: 'Complete your mastery of all 12 tonalities by building major and minor triads starting on all 5 black keys (C#, Eb, F#, Ab, Bb). Combined with levels 4 and 5, this covers all 24 basic triads.',
    },
    showKeyboardHelp: true,
    showSolfegeBridge: false,
    enforceInversion: false,
    targets: [
      // C#/Db Major & Minor
      createChordTarget(ALL_12_ROOTS[1], 'major', 0, 4, 'treble',
        'C# Major (Db Major): C#4 + E#4(F4) + G#4. 🎹 Curiosidad: ¡E# suena igual que F! Se escribe E# para mantener la lógica de la escala (C#-D#-E#-F#...). Cada nota de la escala necesita su propia letra. A esto se le llama "ortografía musical".',
        'C# Major (Db Major): C#4 + E#4(F4) + G#4. 🎹 Fun fact: E# sounds the same as F! It\'s written E# to maintain scale logic (C#-D#-E#-F#...). Each scale note needs its own letter. This is called "musical spelling".'),
      createChordTarget(ALL_12_ROOTS[1], 'minor', 0, 4, 'treble',
        'C# Minor: C#4 + E4 + G#4. 🎹 Curiosidad: C# Minor es la tonalidad de la "Sonata Claro de Luna" de Beethoven — probablemente la pieza de piano más famosa del mundo. ¡Sus primeros compases son un arpegio de C#m!',
        'C# Minor: C#4 + E4 + G#4. 🎹 Fun fact: C# Minor is the key of Beethoven\'s "Moonlight Sonata" — probably the most famous piano piece in the world. Its opening bars are a C#m arpeggio!'),
      // Eb Major & Minor
      createChordTarget(ALL_12_ROOTS[3], 'major', 0, 4, 'treble',
        'Eb Major: Eb4 + G4 + Bb4. 🎹 Curiosidad: Eb Major era la tonalidad FAVORITA de Beethoven para obras heroicas. Su Sinfonía No. 3 "Eroica" y su Concierto "Emperador" están en Eb. ¡La llamaban la tonalidad de la grandeza!',
        'Eb Major: Eb4 + G4 + Bb4. 🎹 Fun fact: Eb Major was Beethoven\'s FAVORITE key for heroic works. His Symphony No. 3 "Eroica" and "Emperor" Concerto are in Eb. They called it the key of grandeur!'),
      createChordTarget(ALL_12_ROOTS[3], 'minor', 0, 4, 'treble',
        'Eb Minor: Eb4 + Gb4 + Bb4. ¡Tres teclas negras! 🎹 Curiosidad: Eb Minor tiene 6 bemoles — es una de las tonalidades más "oscuras" emocionalmente. Chopin la usó en su Preludio Op. 28 No. 14, una pieza turbulenta y agitada.',
        'Eb Minor: Eb4 + Gb4 + Bb4. Three black keys! 🎹 Fun fact: Eb Minor has 6 flats — it\'s one of the emotionally "darkest" keys. Chopin used it in his Prelude Op. 28 No. 14, a turbulent and agitated piece.'),
      // F# Major & Minor
      createChordTarget(ALL_12_ROOTS[6], 'major', 0, 4, 'treble',
        'F# Major: F#4 + A#4 + C#5. ¡Tres teclas negras! 🎹 Curiosidad: F# Major y Gb Major son la MISMA tonalidad con nombres diferentes (enarmónicos). F# tiene 6 sostenidos, Gb tiene 6 bemoles. ¡Son el punto exacto opuesto del Círculo de Quintas!',
        'F# Major: F#4 + A#4 + C#5. Three black keys! 🎹 Fun fact: F# Major and Gb Major are the SAME key with different names (enharmonic). F# has 6 sharps, Gb has 6 flats. They\'re at the exact opposite point of the Circle of Fifths!'),
      createChordTarget(ALL_12_ROOTS[6], 'minor', 0, 4, 'treble',
        'F# Minor: F#4 + A4 + C#5. 🎹 Curiosidad: F# Minor es una tonalidad popular en el metal y el rock progresivo. Dream Theater y Metallica la han usado extensamente. Su carácter es oscuro pero con energía.',
        'F# Minor: F#4 + A4 + C#5. 🎹 Fun fact: F# Minor is a popular key in metal and progressive rock. Dream Theater and Metallica have used it extensively. Its character is dark but energetic.'),
      // Ab Major & Minor
      createChordTarget(ALL_12_ROOTS[8], 'major', 0, 4, 'treble',
        'Ab Major: Ab4 + C5 + Eb5. 🎹 Curiosidad: Ab Major es una tonalidad "cálida" y "romántica". Muchas baladas pop y canciones de amor están en Ab. Adele la ha usado varias veces en sus grandes éxitos.',
        'Ab Major: Ab4 + C5 + Eb5. 🎹 Fun fact: Ab Major is a "warm" and "romantic" key. Many pop ballads and love songs are in Ab. Adele has used it multiple times in her biggest hits.'),
      createChordTarget(ALL_12_ROOTS[8], 'minor', 0, 4, 'treble',
        'Ab Minor: Ab4 + B4(Cb5) + Eb5. 🎹 Curiosidad: ¡La 3ra de Ab Minor se escribe Cb (Do bemol), que suena igual que B! Otro caso de ortografía enarmónica. Ab Minor tiene 7 bemoles — ¡la tonalidad con más bemoles posible!',
        'Ab Minor: Ab4 + B4(Cb5) + Eb5. 🎹 Fun fact: The 3rd of Ab Minor is written Cb (C-flat), which sounds the same as B! Another case of enharmonic spelling. Ab Minor has 7 flats — the key with the most flats possible!'),
      // Bb Major & Minor
      createChordTarget(ALL_12_ROOTS[10], 'major', 0, 4, 'treble',
        'Bb Major: Bb4 + D5 + F5. 🎹 Curiosidad: Bb Major es la tonalidad "reina del jazz y de las bandas". Como la trompeta y el clarinete están afinados en Bb, cuando tocan su "Do" suena un Bb real. ¡Por eso la música de banda siempre está llena de bemoles!',
        'Bb Major: Bb4 + D5 + F5. 🎹 Fun fact: Bb Major is the "queen of jazz and concert bands". Since trumpets and clarinets are pitched in Bb, when they play their "C" it sounds a real Bb. That\'s why band music is always full of flats!'),
      createChordTarget(ALL_12_ROOTS[10], 'minor', 0, 4, 'treble',
        'Bb Minor: Bb4 + Db5 + F5. 🎹 Curiosidad: Bb Minor tiene 5 bemoles y un carácter sombrío y fúnebre. Chopin escribió su famosa Marcha Fúnebre (de la Sonata No. 2) en Bb Minor — esa melodía que asocias con funerales.',
        'Bb Minor: Bb4 + Db5 + F5. 🎹 Fun fact: Bb Minor has 5 flats and a somber, funeral-like character. Chopin wrote his famous Funeral March (from Sonata No. 2) in Bb Minor — that melody you associate with funerals.'),
    ],
    passingCriteria: { minCorrect: 10 },
  },

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 7: DIMINISHED & AUGMENTED
  // ═══════════════════════════════════════════════════════════════
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
      createChordTarget(ALL_12_ROOTS[0], 'diminished', 0, 4, 'treble',
        'C Diminished: C4 + Eb4 + Gb4. 🎹 Curiosidad: Los acordes disminuidos son los favoritos de las películas de TERROR. Ese sonido "chirriante" que escuchas cuando el villano aparece es casi siempre un acorde disminuido. ¡La distancia de 6 semitonos (tritono) se llamaba "Diabolus in Musica" en la Edad Media!',
        'C Diminished: C4 + Eb4 + Gb4. 🎹 Fun fact: Diminished chords are the favorites of HORROR movies. That "screeching" sound when the villain appears is almost always a diminished chord. The 6-semitone interval (tritone) was called "Diabolus in Musica" in the Middle Ages!'),
      createChordTarget(ALL_12_ROOTS[0], 'augmented', 0, 4, 'treble',
        'C Augmented: C4 + E4 + G#4. 🎹 Curiosidad: Los acordes aumentados suenan "flotantes" y "oníricos" porque dividen la octava en 3 partes iguales (4+4+4 semitonos). The Beatles los usaron en "Oh! Darling" y "Because". ¡Son el sonido de los sueños!',
        'C Augmented: C4 + E4 + G#4. 🎹 Fun fact: Augmented chords sound "floating" and "dreamy" because they divide the octave into 3 equal parts (4+4+4 semitones). The Beatles used them in "Oh! Darling" and "Because". They\'re the sound of dreams!'),
      createChordTarget(ALL_12_ROOTS[4], 'diminished', 0, 4, 'treble',
        'E Diminished: E4 + G4 + Bb4. 🎹 Curiosidad: Hay SOLO 3 acordes disminuidos únicos en toda la música (Cdim = Ebdim = Gbdim = Adim, etc.). ¡Cada acorde disminuido se repite 4 veces con diferente nombre!',
        'E Diminished: E4 + G4 + Bb4. 🎹 Fun fact: There are ONLY 3 unique diminished chords in all of music (Cdim = Ebdim = Gbdim = Adim, etc.). Each diminished chord repeats 4 times with different names!'),
      createChordTarget(ALL_12_ROOTS[2], 'augmented', 0, 4, 'treble',
        'D Augmented: D4 + F#4 + A#4. 🎹 Curiosidad: Similarmente, solo hay 4 acordes aumentados únicos. ¡Daug = F#aug = A#aug! Es por la simetría perfecta de sus intervalos.',
        'D Augmented: D4 + F#4 + A#4. 🎹 Fun fact: Similarly, there are only 4 unique augmented chords. Daug = F#aug = A#aug! It\'s because of the perfect symmetry of their intervals.'),
    ],
    passingCriteria: { minCorrect: 4 },
  },

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 8: TWO-HAND SEPARATION
  // ═══════════════════════════════════════════════════════════════
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
          es: 'Mano izquierda: C2 (MIDI 36) en Clave de Fa. Mano derecha: C4-E4-G4 en Clave de Sol. 🎹 Curiosidad: La independencia de manos es la habilidad más difícil del piano. Tu cerebro literalmente crea nuevas conexiones neuronales (neuroplasticidad) al practicar esto.',
          en: 'Left Hand: Bass C2 (MIDI 36) in Bass Clef. Right Hand: C4-E4-G4 in Treble Clef. 🎹 Fun fact: Hand independence is the hardest piano skill. Your brain literally creates new neural connections (neuroplasticity) when practicing this.',
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
          es: 'Mano izquierda: G2 (MIDI 43) en Clave de Fa. Mano derecha: G4-B4-D5 en Clave de Sol.',
          en: 'Left Hand: Bass G2 (MIDI 43) in Bass Clef. Right Hand: G4-B4-D5 in Treble Clef.',
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
          es: 'Mano izquierda: F2 (MIDI 41) en Clave de Fa. Mano derecha: F4-A4-C5 en Clave de Sol. 🎹 Curiosidad: En una partitura de piano, el pentagrama superior (Clave de Sol) es para la mano derecha y el inferior (Clave de Fa) para la izquierda. Juntos forman el "Gran Pentagrama" (Grand Staff).',
          en: 'Left Hand: Bass F2 (MIDI 41) in Bass Clef. Right Hand: F4-A4-C5 in Treble Clef. 🎹 Fun fact: In piano sheet music, the upper staff (Treble Clef) is for the right hand and the lower (Bass Clef) for the left. Together they form the "Grand Staff".',
        },
      },
    ],
    passingCriteria: { minCorrect: 3 },
  },

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 9: CHORD INVERSIONS
  // ═══════════════════════════════════════════════════════════════
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
      createChordTarget(ALL_12_ROOTS[0], 'major', 1, 4, 'treble',
        'C Major 1ra Inversión: E4 (Bajo) - G4 - C5. ¡La 3ra (E) es la voz más grave! 🎹 Curiosidad: Las inversiones existen para hacer transiciones suaves entre acordes. Sin inversiones, tus manos saltarían por todo el teclado. ¡Es la base de la "conducción de voces" (voice leading)!',
        'C Major 1st Inversion: E4 (Bass) - G4 - C5. The 3rd (E) is the lowest voice! 🎹 Fun fact: Inversions exist to create smooth transitions between chords. Without them, your hands would jump all over the keyboard. This is the basis of "voice leading"!'),
      createChordTarget(ALL_12_ROOTS[0], 'major', 2, 4, 'treble',
        'C Major 2da Inversión: G4 (Bajo) - C5 - E5. ¡La 5ta (G) es la voz más grave! 🎹 Curiosidad: La 2da inversión tiene un sonido "inestable" que pide resolución. Se usa mucho como acorde de paso antes del acorde final de una canción (cadencia).',
        'C Major 2nd Inversion: G4 (Bass) - C5 - E5. The 5th (G) is the lowest voice! 🎹 Fun fact: 2nd inversion has an "unstable" sound that begs for resolution. It\'s often used as a passing chord before the final chord of a song (cadence).'),
      createChordTarget(ALL_12_ROOTS[7], 'major', 1, 4, 'treble',
        'G Major 1ra Inversión: B4 (Bajo) - D5 - G5.',
        'G Major 1st Inversion: B4 (Bass) - D5 - G5.'),
      createChordTarget(ALL_12_ROOTS[9], 'minor', 1, 4, 'treble',
        'A Minor 1ra Inversión: C5 (Bajo) - E5 - A5. 🎹 Curiosidad: Cuando inviertes Am, el C queda en el bajo. ¡Suena casi como un acorde de C Mayor con sexta! Esta ambigüedad es lo que hace la armonía tan fascinante.',
        'A Minor 1st Inversion: C5 (Bass) - E5 - A5. 🎹 Fun fact: When you invert Am, C is in the bass. It sounds almost like a C Major chord with a 6th! This ambiguity is what makes harmony so fascinating.'),
      createChordTarget(ALL_12_ROOTS[5], 'major', 2, 4, 'treble',
        'F Major 2da Inversión: C5 (Bajo) - F5 - A5.',
        'F Major 2nd Inversion: C5 (Bass) - F5 - A5.'),
    ],
    passingCriteria: { minCorrect: 5 },
  },

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 10: PURE SHEET MUSIC EXAM MODE
  // ═══════════════════════════════════════════════════════════════
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
      createNoteTarget('F', 'sharp', 4, 'treble',
        'Lee la nota en Clave de Sol con alteración sostenida. ¡Sin pistas visuales!',
        'Read note on Treble Clef with sharp accidental sign. No visual hints!'),
      createNoteTarget('B', 'natural', 3, 'bass',
        'Lee la nota en Clave de Fa. Recuerda: la Clave de Fa marca la línea de F3.',
        'Read note on Bass Clef. Remember: the Bass Clef marks the F3 line.'),
      createChordTarget(ALL_12_ROOTS[0], 'major', 0, 4, 'treble',
        'Lee el acorde apilado de 3 notas en Clave de Sol.',
        'Read standard 3-note stacked chord in Treble Clef.'),
      createChordTarget(ALL_12_ROOTS[2], 'minor', 0, 4, 'treble',
        'Lee el acorde menor apilado en el pentagrama.',
        'Read 3-note stacked minor chord.'),
      createChordTarget(ALL_12_ROOTS[11], 'major', 0, 4, 'treble',
        'Lee el acorde de B Major — ¿puedes identificar D# y F# en la partitura?',
        'Read the B Major chord — can you identify D# and F# on the score?'),
      createChordTarget(ALL_12_ROOTS[10], 'major', 0, 4, 'treble',
        'Lee el acorde alterado con bemoles en la partitura.',
        'Read altered chord with flat signs on score.'),
      createChordTarget(ALL_12_ROOTS[6], 'minor', 0, 4, 'treble',
        'Lee el acorde menor alterado con sostenidos en la partitura.',
        'Read altered minor chord with sharp signs on score.'),
    ],
    passingCriteria: { minCorrect: 7 },
  },
];
