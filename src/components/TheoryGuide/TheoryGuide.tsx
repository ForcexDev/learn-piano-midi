import React, { useState } from 'react';
import { BookOpen, Music, Key, Hash, Layers, ArrowLeft, Lightbulb, GraduationCap, CheckCircle2, Music2, Sparkles, HelpCircle, Flame, CircleDot, ArrowUpDown } from 'lucide-react';
import { StaffDisplay } from '../StaffDisplay/StaffDisplay';
import { useProgressStore } from '../../store/progressStore';

export const TheoryGuide: React.FC<{ onBackToTrainer: () => void }> = ({ onBackToTrainer }) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'keyboard' | 'staff' | 'accidentals' | 'intervals' | 'chords' | 'circle' | 'inversions'>('notes');
  const language = useProgressStore((state) => state.settings.language) || 'es';
  const t = language === 'es';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Guide Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 sticky top-0 z-30 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-black text-white tracking-tight">
              {t ? 'Centro de Aprendizaje y Teoría de Piano' : 'Piano & Music Theory Learning Hub'}
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              {t ? 'Guía Completa Paso a Paso de Nomenclatura y Armonía Musical' : 'Complete Step-by-Step English Notation & Harmony Guide'}
            </p>
          </div>
        </div>

        <button
          onClick={onBackToTrainer}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-blue-600/30"
        >
          <ArrowLeft className="w-4 h-4" />
          {t ? 'Volver al Entrenador Interactivo' : 'Back to Interactive Trainer'}
        </button>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-72 shrink-0 space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            {t ? 'Temas Teóricos Paso a Paso' : 'Step-by-Step Theory Topics'}
          </div>

          {[
            {
              id: 'notes',
              label: t ? '1. Nombres en Inglés (C D E)' : '1. English Note Names',
              icon: Music,
              desc: t ? 'C, D, E, F, G, A, B vs Solfeo (Do, Re, Mi)' : 'C, D, E, F, G, A, B vs Solfège',
            },
            {
              id: 'keyboard',
              label: t ? '2. Guía del Teclado de 61 Teclas' : '2. 61-Key Keyboard Guide',
              icon: Key,
              desc: t ? 'Referencias visuales en tu PSR-E383' : 'Visual landmarks on PSR-E383',
            },
            {
              id: 'staff',
              label: t ? '3. Pentagrama y Claves' : '3. Staff & Clefs Guide',
              icon: BookOpen,
              desc: t ? 'Clave de Sol, Clave de Fa y Gran Pentagrama' : 'Treble, Bass & Grand Staff',
            },
            {
              id: 'accidentals',
              label: t ? '4. Sostenidos (#), Bemoles (b)' : '4. Sharps (#) & Flats (b)',
              icon: Hash,
              desc: t ? 'Semitonos, enarmonía y etimología' : 'Semitones, enharmonics & etymology',
            },
            {
              id: 'intervals',
              label: t ? '5. Intervalos Musicales' : '5. Musical Intervals',
              icon: ArrowUpDown,
              desc: t ? 'La distancia entre 2 notas explicada' : 'The distance between 2 notes explained',
            },
            {
              id: 'chords',
              label: t ? '6. Construcción de Acordes' : '6. Chord Building Formulas',
              icon: Layers,
              desc: t ? 'Tríadas Mayores, Menores, Dis y Aug' : 'Major, Minor, Dim & Aug Triads',
            },
            {
              id: 'circle',
              label: t ? '7. Círculo de Quintas' : '7. Circle of Fifths',
              icon: CircleDot,
              desc: t ? 'El mapa maestro de todas las tonalidades' : 'The master map of all keys',
            },
            {
              id: 'inversions',
              label: t ? '8. Inversiones de Acordes' : '8. Chord Inversions',
              icon: Lightbulb,
              desc: t ? '1ra y 2da Inversión y conducción de voces' : '1st & 2nd Inversions & voice leading',
            },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  isActive
                    ? 'bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500 shadow-xl'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                <div>
                  <div className="text-sm font-bold leading-tight">{item.label}</div>
                  <div className="text-xs text-slate-400 mt-1">{item.desc}</div>
                </div>
              </button>
            );
          })}
        </aside>

        {/* Dynamic Topic Article */}
        <main className="flex-1 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl space-y-8 overflow-hidden">
          {/* ═══════════════════════════════════════════════════ */}
          {/* SECTION 1: ENGLISH NOTE NAMES */}
          {/* ═══════════════════════════════════════════════════ */}
          {activeTab === 'notes' && (
            <article className="space-y-8 animate-in fade-in duration-200">
              <div className="space-y-3 border-b border-slate-800 pb-5">
                <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400">
                  {t ? 'Tema 01 — Guía de Nomenclatura' : 'Topic 01 — Notation Guide'}
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white">
                  {t ? 'Entendiendo la Nomenclatura en Inglés (C, D, E, F, G, A, B)' : 'Understanding English Notation (C, D, E, F, G, A, B)'}
                </h2>
                <p className="text-base text-slate-300 leading-relaxed">
                  {t ? (
                    <>
                      Si aprendiste música en español, probablemente conozcas las notas como <i>Do, Re, Mi, Fa, Sol, La, Si</i>. Sin embargo, en el mundo moderno (partituras de canciones populares, cifrados de acordes en internet y teclados MIDI como tu Yamaha PSR-E383), las notas se escriben <strong className="text-white font-bold">SIEMPRE con letras del alfabeto en inglés</strong>.
                    </>
                  ) : (
                    <>
                      If you learned music in Spanish, you likely know notes as Do, Re, Mi, Fa, Sol, La, Si. Modern sheet music, chord charts, and MIDI keyboards use <strong className="text-white font-bold">English Letters</strong> exclusively.
                    </>
                  )}
                </p>
              </div>

              {/* Step-by-Step Conversion Chart */}
              <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
                <h3 className="font-bold text-white text-lg flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  {t ? 'Tabla de Conversión Directa de Notas' : 'Direct Note Conversion Chart'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { letter: 'C', solfege: 'Do', ruleEs: 'A la izquierda del par de 2 teclas negras', ruleEn: 'Left of pair of 2 black keys' },
                    { letter: 'D', solfege: 'Re', ruleEs: 'Justo en el centro del par de 2 teclas negras', ruleEn: 'Middle of pair of 2 black keys' },
                    { letter: 'E', solfege: 'Mi', ruleEs: 'A la derecha del par de 2 teclas negras', ruleEn: 'Right of pair of 2 black keys' },
                    { letter: 'F', solfege: 'Fa', ruleEs: 'A la izquierda del grupo de 3 teclas negras', ruleEn: 'Left of group of 3 black keys' },
                    { letter: 'G', solfege: 'Sol', ruleEs: 'Primera tecla dentro del grupo de 3 negras', ruleEn: 'First key inside group of 3 black keys' },
                    { letter: 'A', solfege: 'La', ruleEs: 'Segunda tecla dentro del grupo de 3 negras', ruleEn: 'Second key inside group of 3 black keys' },
                    { letter: 'B', solfege: 'Si', ruleEs: 'A la derecha del grupo de 3 teclas negras', ruleEn: 'Right of group of 3 black keys' },
                  ].map((item) => (
                    <div key={item.letter} className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-black text-blue-400">{item.letter}</span>
                        <span className="text-sm font-bold text-slate-300 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                          ({item.solfege})
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 leading-normal">{t ? item.ruleEs : item.ruleEn}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Explanatory Callout */}
              <div className="p-6 rounded-3xl bg-blue-950/40 border border-blue-900/60 space-y-3">
                <h4 className="font-extrabold text-white text-base flex items-center gap-2 text-blue-300">
                  <Flame className="w-5 h-5 text-amber-400" />
                  {t ? '¿Por qué la letra A no empieza en Do?' : 'Why doesn\'t letter A start on C?'}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {t
                    ? 'Históricamente, la escala musical antigua comenzaba en la nota La (A). Por eso las letras van A, B, C, D, E, F, G. Sin embargo, en el piano moderno la escala mayor estándar empieza en C (Do). ¡Así que la secuencia en el piano es C - D - E - F - G - A - B!'
                    : 'Historically, ancient scales started on note A. That is why letters order A, B, C, D, E, F, G. However, modern piano scales start on C. So the piano sequence is C - D - E - F - G - A - B!'}
                </p>
              </div>

              {/* Why E-F and B-C have no black key */}
              <div className="p-6 rounded-3xl bg-amber-950/30 border border-amber-900/50 space-y-3">
                <h4 className="font-extrabold text-white text-base flex items-center gap-2 text-amber-300">
                  <Flame className="w-5 h-5 text-amber-400" />
                  {t ? '¿Por qué no hay tecla negra entre E-F y B-C?' : 'Why is there no black key between E-F and B-C?'}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {t
                    ? 'El piano refleja la escala mayor natural (C Major). En esta escala, la distancia entre cada nota es de 1 tono (2 semitonos), EXCEPTO entre E→F y B→C, donde la distancia es de solo medio tono (1 semitono). Como ya están a distancia de semitono, no hace falta una tecla negra entre ellas. ¡Esto crea el patrón irregular de 2+3 teclas negras que ves repetirse en todo el teclado!'
                    : 'The piano reflects the natural major scale (C Major). In this scale, the distance between each note is 1 whole tone (2 semitones), EXCEPT between E→F and B→C, where it\'s only a half tone (1 semitone). Since they\'re already a semitone apart, no black key is needed. This creates the irregular 2+3 black key pattern you see repeating across the keyboard!'}
                </p>
              </div>
            </article>
          )}

          {/* ═══════════════════════════════════════════════════ */}
          {/* SECTION 2: 61-KEY KEYBOARD LANDMARKS */}
          {/* ═══════════════════════════════════════════════════ */}
          {activeTab === 'keyboard' && (
            <article className="space-y-8 animate-in fade-in duration-200">
              <div className="space-y-3 border-b border-slate-800 pb-5">
                <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400">
                  {t ? 'Tema 02 — Guía del Teclado' : 'Topic 02 — Keyboard Guide'}
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white">
                  {t ? 'Cómo Encontrar Cualquier Nota en tu Piano de 61 Teclas' : 'How to Find Any Note on Your 61-Key Piano'}
                </h2>
                <p className="text-base text-slate-300 leading-relaxed">
                  {t
                    ? 'Tu teclado Yamaha PSR-E383 tiene 61 teclas (36 blancas y 25 negras) divididas en 5 octavas idénticas. Para ubicarte al instante sin dudar, sólo debes buscar el patrón de las teclas negras.'
                    : 'Your Yamaha PSR-E383 has 61 keys (36 white and 25 black) divided into 5 identical octaves. Locate keys instantly by looking at the black key patterns.'}
                </p>
              </div>

              {/* Detailed Step by Step Steps */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-black text-sm">1</span>
                    <h4 className="font-extrabold text-white text-base text-blue-400">
                      {t ? 'Grupo de 2 Teclas Negras (C, D, E)' : 'Group of 2 Black Keys (C, D, E)'}
                    </h4>
                  </div>
                  <ul className="text-sm text-slate-300 space-y-3 leading-relaxed">
                    <li className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                      <b className="text-white">{t ? 'Nota C (Do):' : 'Note C (Do):'}</b> {t ? 'Se encuentra inmediatamente a la izquierda del grupo de 2 teclas negras.' : 'Located immediately left of the group of 2 black keys.'}
                    </li>
                    <li className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                      <b className="text-white">{t ? 'Nota D (Re):' : 'Note D (Re):'}</b> {t ? 'Se encuentra atrapada exactamente en medio de las 2 teclas negras.' : 'Nestled exactly between the 2 black keys.'}
                    </li>
                    <li className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                      <b className="text-white">{t ? 'Nota E (Mi):' : 'Note E (Mi):'}</b> {t ? 'Se encuentra inmediatamente a la derecha del grupo de 2 teclas negras.' : 'Located immediately right of the group of 2 black keys.'}
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-black text-sm">2</span>
                    <h4 className="font-extrabold text-white text-base text-indigo-400">
                      {t ? 'Grupo de 3 Teclas Negras (F, G, A, B)' : 'Group of 3 Black Keys (F, G, A, B)'}
                    </h4>
                  </div>
                  <ul className="text-sm text-slate-300 space-y-3 leading-relaxed">
                    <li className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                      <b className="text-white">{t ? 'Nota F (Fa):' : 'Note F (Fa):'}</b> {t ? 'Se encuentra inmediatamente a la izquierda del grupo de 3 teclas negras.' : 'Located immediately left of the group of 3 black keys.'}
                    </li>
                    <li className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                      <b className="text-white">{t ? 'Notas G y A (Sol y La):' : 'Notes G and A (Sol and La):'}</b> {t ? 'Son las dos teclas blancas encajadas dentro del grupo de 3 negras.' : 'The two white keys nestled inside the group of 3 black keys.'}
                    </li>
                    <li className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                      <b className="text-white">{t ? 'Nota B (Si):' : 'Note B (Si):'}</b> {t ? 'Se encuentra inmediatamente a la derecha del grupo de 3 teclas negras.' : 'Located immediately right of the group of 3 black keys.'}
                    </li>
                  </ul>
                </div>
              </div>

              {/* Middle C Feature Box */}
              <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-3">
                <h4 className="font-extrabold text-emerald-400 text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  {t ? 'El Ancla Central: Do Central (C4)' : 'Central Anchor: Middle C (C4)'}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {t
                    ? 'El Do Central (C4) es el 3er "C" contando desde la izquierda en tu piano de 61 teclas. Es la nota de referencia fundamental: todo lo que toque tu mano derecha suele escribirse en Clave de Sol desde C4 hacia arriba, y todo lo que toque tu mano izquierda se escribe en Clave de Fa desde C4 hacia abajo.'
                    : 'Middle C (C4) is the 3rd C key from the left on your 61-key keyboard. It\'s the fundamental reference note: everything your right hand plays is typically written in Treble Clef from C4 upward, and everything your left hand plays is written in Bass Clef from C4 downward.'}
                </p>
              </div>

              {/* Octave numbering explanation */}
              <div className="p-6 rounded-3xl bg-indigo-950/30 border border-indigo-900/50 space-y-3">
                <h4 className="font-extrabold text-white text-base flex items-center gap-2 text-indigo-300">
                  <Flame className="w-5 h-5 text-amber-400" />
                  {t ? '¿Qué significan los números C4, D5, A3?' : 'What do the numbers C4, D5, A3 mean?'}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {t
                    ? 'El número después de la letra indica la OCTAVA. C4 es el "Do Central", C3 es una octava más grave, C5 es una octava más aguda. Tu Yamaha PSR-E383 va de C2 (la más grave) hasta C7 (la más aguda). Cada octava contiene las mismas 12 notas (7 blancas + 5 negras), solo que más agudas o graves.'
                    : 'The number after the letter indicates the OCTAVE. C4 is "Middle C", C3 is one octave lower, C5 is one octave higher. Your Yamaha PSR-E383 goes from C2 (lowest) to C7 (highest). Each octave contains the same 12 notes (7 white + 5 black), just at higher or lower pitches.'}
                </p>
              </div>
            </article>
          )}

          {/* ═══════════════════════════════════════════════════ */}
          {/* SECTION 3: STAFF & CLEFS */}
          {/* ═══════════════════════════════════════════════════ */}
          {activeTab === 'staff' && (
            <article className="space-y-8 animate-in fade-in duration-200">
              <div className="space-y-3 border-b border-slate-800 pb-5">
                <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400">
                  {t ? 'Tema 03 — Lectura de Partitura' : 'Topic 03 — Score Reading'}
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white">
                  {t ? 'Cómo Leer el Pentagrama: Clave de Sol, Clave de Fa y Gran Pentagrama' : 'Reading Sheet Music: Treble Clef, Bass Clef & Grand Staff'}
                </h2>
                <p className="text-base text-slate-300 leading-relaxed">
                  {t
                    ? 'Un pentagrama consta de 5 líneas paralelas y 4 espacios entre ellas. Las notas escritas más arriba representan sonidos agudos, mientras las notas escritas más abajo representan sonidos graves.'
                    : 'A musical staff consists of 5 parallel lines and 4 spaces between them. Higher positions represent higher pitches, lower positions represent lower pitches.'}
                </p>
              </div>

              {/* Side by Side Treble & Bass Clef Cards */}
              <div className="grid md:grid-cols-2 gap-6 items-start">
                {/* Treble Clef Card */}
                <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between overflow-hidden">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-white text-lg text-blue-400 flex items-center gap-2">
                        <Music2 className="w-5 h-5 text-blue-400" />
                        {t ? 'Clave de Sol (Treble Clef)' : 'Treble Clef'}
                      </h3>
                      <span className="text-xs font-bold text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">
                        {t ? 'Mano Derecha' : 'Right Hand'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {t ? 'Usada para registros medios y agudos desde C4 hacia arriba. El símbolo 𝄞 es una letra G ornamentada — su rizo envuelve la 2da línea, donde se ubica G4.' : 'Used for middle and high register notes from C4 upwards. The 𝄞 symbol is an ornamental letter G — its curl wraps around the 2nd line, where G4 sits.'}
                    </p>
                  </div>

                  <div className="w-full flex justify-center py-2">
                    <StaffDisplay
                      activeNotes={{}}
                      target={{ id: 't1', type: 'single-note', clef: 'treble', expectedMidiNumbers: [60, 64, 67], label: '', explanation: { es: '', en: '' } }}
                      width={320}
                      height={160}
                    />
                  </div>

                  <div className="text-xs text-slate-200 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1.5 leading-relaxed">
                    <div className="font-bold text-blue-300 text-sm mb-1">{t ? 'Memorización en Clave de Sol:' : 'Treble Clef Mnemonics:'}</div>
                    <div><b>{t ? 'Líneas (Abajo a Arriba):' : 'Lines (Bottom to Top):'}</b> E4 - G4 - B4 - D5 - F5</div>
                    <div><b>{t ? 'Espacios (Abajo a Arriba):' : 'Spaces (Bottom to Top):'}</b> F4 - A4 - C5 - E5</div>
                    <div className="text-slate-400 italic pt-1">{t ? 'Truco: Las líneas deletrean "Every Good Boy Does Fine" en inglés.' : 'Trick: Lines spell "Every Good Boy Does Fine". Spaces spell "FACE".'}</div>
                  </div>
                </div>

                {/* Bass Clef Card */}
                <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between overflow-hidden">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-white text-lg text-indigo-400 flex items-center gap-2">
                        <Music2 className="w-5 h-5 text-indigo-400" />
                        {t ? 'Clave de Fa (Bass Clef)' : 'Bass Clef'}
                      </h3>
                      <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
                        {t ? 'Mano Izquierda' : 'Left Hand'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {t ? 'Usada para registros graves de bajo por debajo de C4. El símbolo 𝄢 es una letra F estilizada — los dos puntos marcan la 4ta línea, donde se ubica F3.' : 'Used for low bass register notes below C4. The 𝄢 symbol is a stylized letter F — the two dots mark the 4th line, where F3 sits.'}
                    </p>
                  </div>

                  <div className="w-full flex justify-center py-2">
                    <StaffDisplay
                      activeNotes={{}}
                      target={{ id: 't2', type: 'single-note', clef: 'bass', expectedMidiNumbers: [36, 43, 48], label: '', explanation: { es: '', en: '' } }}
                      width={320}
                      height={160}
                    />
                  </div>

                  <div className="text-xs text-slate-200 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1.5 leading-relaxed">
                    <div className="font-bold text-indigo-300 text-sm mb-1">{t ? 'Memorización en Clave de Fa:' : 'Bass Clef Mnemonics:'}</div>
                    <div><b>{t ? 'Líneas (Abajo a Arriba):' : 'Lines (Bottom to Top):'}</b> G2 - B2 - D3 - F3 - A3</div>
                    <div><b>{t ? 'Espacios (Abajo a Arriba):' : 'Spaces (Bottom to Top):'}</b> A2 - C3 - E3 - G3</div>
                    <div className="text-slate-400 italic pt-1">{t ? 'Truco: Las líneas deletrean "Good Boys Do Fine Always".' : 'Trick: Lines spell "Good Boys Do Fine Always". Spaces spell "All Cows Eat Grass".'}</div>
                  </div>
                </div>
              </div>

              {/* Grand Staff Banner Card */}
              <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                  <h3 className="font-extrabold text-white text-lg sm:text-xl">
                    {t ? 'Gran Pentagrama (Sistema Real de Piano)' : 'Grand Staff (Authentic Two Hand System)'}
                  </h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {t
                    ? 'En partituras reales de piano, ambos pentagramas se muestran juntos unidos por una llave. El pentagrama superior es la Clave de Sol (Mano Derecha) y el inferior es la Clave de Fa (Mano Izquierda). El Do Central (C4) se ubica exactamente en el espacio entre ambos pentagramas mediante una línea adicional.'
                    : 'In piano sheet music, both staves are joined together by a brace bracket. Top stave is Treble Clef (Right Hand) and bottom is Bass Clef (Left Hand). Middle C (C4) sits on a ledger line exactly between the two staves.'}
                </p>
                <div className="w-full flex justify-center py-2">
                  <StaffDisplay
                    activeNotes={{}}
                    target={{ id: 'grand-staff-demo', type: 'chord', clef: 'both', expectedMidiNumbers: [36, 48, 60, 64, 67], label: '', explanation: { es: '', en: '' } }}
                    width={480}
                    height={260}
                  />
                </div>
              </div>
            </article>
          )}

          {/* ═══════════════════════════════════════════════════ */}
          {/* SECTION 4: SHARPS & FLATS */}
          {/* ═══════════════════════════════════════════════════ */}
          {activeTab === 'accidentals' && (
            <article className="space-y-8 animate-in fade-in duration-200">
              <div className="space-y-3 border-b border-slate-800 pb-5">
                <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400">
                  {t ? 'Tema 04 — Alteraciones y Enarmonía' : 'Topic 04 — Accidentals & Enharmonics'}
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white">
                  {t ? 'Sostenidos (#), Bemoles (b) y Reglas Enarmónicas' : 'Sharps (#), Flats (b), and Enharmonic Rules'}
                </h2>
                <p className="text-base text-slate-300 leading-relaxed">
                  {t
                    ? 'En la música existen las alteraciones (# y b) que modifican la nota 1 semitono hacia arriba o hacia abajo. Un semitono es la distancia más corta posible entre dos teclas contiguas del piano.'
                    : 'Accidentals (# and b) modify note pitches by 1 semitone up or down. A semitone is the smallest distance between two adjacent keys on the piano.'}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Sharp Card */}
                <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-amber-400 text-lg">Sharp (#) — {t ? 'Sostenido' : 'Sharp'}</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {t ? (
                        <>
                          Eleva el sonido de una nota <strong className="text-white font-bold">1 semitono hacia la DERECHA</strong> (sonido más agudo). Por ejemplo, C#4 es la tecla negra inmediatamente a la derecha de C4.
                        </>
                      ) : (
                        <>
                          Raises pitch by <strong className="text-white font-bold">1 semitone to the RIGHT</strong> (higher pitch). Example: C#4 is the black key immediately right of C4.
                        </>
                      )}
                    </p>
                  </div>
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs font-mono text-amber-300 font-bold">
                    {t ? 'Regla: Nota + 1 Tecla derecha = #' : 'Rule: Note + 1 Key right = #'}
                  </div>
                </div>

                {/* Flat Card */}
                <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-blue-400 text-lg">Flat (b) — {t ? 'Bemol' : 'Flat'}</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {t ? (
                        <>
                          Baja el sonido de una nota <strong className="text-white font-bold">1 semitono hacia la IZQUIERDA</strong> (sonido más grave). Por ejemplo, Db4 es la tecla negra inmediatamente a la izquierda de D4.
                        </>
                      ) : (
                        <>
                          Lowers pitch by <strong className="text-white font-bold">1 semitone to the LEFT</strong> (lower pitch). Example: Db4 is the black key immediately left of D4.
                        </>
                      )}
                    </p>
                  </div>
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs font-mono text-blue-300 font-bold">
                    {t ? 'Regla: Nota - 1 Tecla izquierda = b' : 'Rule: Note - 1 Key left = b'}
                  </div>
                </div>

                {/* Enharmonic Card */}
                <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-emerald-400 text-lg">{t ? 'Enarmonía (Enharmonics)' : 'Enharmonic Equivalents'}</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {t ? (
                        <>
                          ¡Dos nombres diferentes para la <strong className="text-white font-bold">MISMA tecla física</strong> del piano! Como la tecla negra está entre C y D, puede llamarse C# (si vienes desde C) o Db (si vienes desde D).
                        </>
                      ) : (
                        <>
                          Two different names for the <strong className="text-white font-bold">exact same physical key</strong> on the piano! Since the black key sits between C and D, it can be called C# (going up from C) or Db (going down from D).
                        </>
                      )}
                    </p>
                  </div>
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 font-bold">
                    C# = Db | D# = Eb | F# = Gb | G# = Ab | A# = Bb
                  </div>
                </div>
              </div>

              {/* Etymology Curiosity */}
              <div className="p-6 rounded-3xl bg-purple-950/30 border border-purple-900/50 space-y-3">
                <h4 className="font-extrabold text-white text-base flex items-center gap-2 text-purple-300">
                  <Flame className="w-5 h-5 text-amber-400" />
                  {t ? '¿De dónde vienen los nombres "Sostenido" y "Bemol"?' : 'Where do the names "Sharp" and "Flat" come from?'}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {t
                    ? 'En la Edad Media, la nota B tenía 2 versiones: una "B redonda" (b molle = b suave, la más grave) y una "B cuadrada" (b durum = b dura, la más aguda). La B redonda se convirtió en el símbolo ♭ (bemol = "b molle") y la B cuadrada se deformó hasta parecer # (sostenido, del "b quadratum"). ¡Así que el hashtag (#) y el emoji de bemol (♭) nacieron de la misma letra B medieval!'
                    : 'In the Middle Ages, the note B had 2 versions: a "round B" (b molle = soft b, lower pitch) and a "square B" (b durum = hard b, higher pitch). The round B became the ♭ symbol (flat = "b molle") and the square B warped into # (sharp, from "b quadratum"). So the hashtag (#) and the flat symbol (♭) both evolved from the same medieval letter B!'}
                </p>
              </div>

              {/* Special cases E#=F, B#=C */}
              <div className="p-6 rounded-3xl bg-rose-950/30 border border-rose-900/50 space-y-3">
                <h4 className="font-extrabold text-white text-base flex items-center gap-2 text-rose-300">
                  <HelpCircle className="w-5 h-5 text-rose-400" />
                  {t ? '¿Existe E# y B#? ¿Y Cb y Fb?' : 'Do E# and B# exist? What about Cb and Fb?'}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {t
                    ? '¡Sí existen teóricamente! E# suena igual que F, y B# suena igual que C (son enarmónicos). Lo mismo con Cb = B y Fb = E. Se usan en contextos teóricos para mantener la "ortografía" correcta de ciertas escalas. Por ejemplo, en la escala de F# Major, la 7ma nota se escribe E# (no F), porque cada nota de la escala necesita su propia letra.'
                    : 'They do exist theoretically! E# sounds the same as F, and B# sounds the same as C (they\'re enharmonic). Same with Cb = B and Fb = E. They\'re used in theoretical contexts to maintain correct scale "spelling". For example, in the F# Major scale, the 7th note is written E# (not F), because each scale note needs its own letter.'}
                </p>
              </div>
            </article>
          )}

          {/* ═══════════════════════════════════════════════════ */}
          {/* SECTION 5: INTERVALS */}
          {/* ═══════════════════════════════════════════════════ */}
          {activeTab === 'intervals' && (
            <article className="space-y-8 animate-in fade-in duration-200">
              <div className="space-y-3 border-b border-slate-800 pb-5">
                <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400">
                  {t ? 'Tema 05 — Intervalos Musicales' : 'Topic 05 — Musical Intervals'}
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white">
                  {t ? 'Intervalos: La Distancia entre Dos Notas' : 'Intervals: The Distance Between Two Notes'}
                </h2>
                <p className="text-base text-slate-300 leading-relaxed">
                  {t
                    ? 'Un intervalo es la distancia entre 2 notas, medida en semitonos. Los intervalos son los "bloques de construcción" de los acordes y las melodías. Entenderlos te permite construir CUALQUIER acorde desde cero.'
                    : 'An interval is the distance between 2 notes, measured in semitones. Intervals are the "building blocks" of chords and melodies. Understanding them lets you build ANY chord from scratch.'}
                </p>
              </div>

              <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="font-bold text-white text-lg flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  {t ? 'Tabla de Intervalos (desde C4)' : 'Interval Reference Table (from C4)'}
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b border-slate-800">
                        <th className="py-2 px-3 text-slate-400 font-bold">{t ? 'Semitonos' : 'Semitones'}</th>
                        <th className="py-2 px-3 text-slate-400 font-bold">{t ? 'Nombre del Intervalo' : 'Interval Name'}</th>
                        <th className="py-2 px-3 text-slate-400 font-bold">{t ? 'Ejemplo' : 'Example'}</th>
                        <th className="py-2 px-3 text-slate-400 font-bold">{t ? 'Suena como...' : 'Sounds like...'}</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-300">
                      {[
                        { st: 0, nameEs: 'Unísono', nameEn: 'Unison', ex: 'C → C', soundEs: 'La misma nota', soundEn: 'The same note' },
                        { st: 1, nameEs: 'Segunda Menor (m2)', nameEn: 'Minor 2nd (m2)', ex: 'C → C#', soundEs: 'Tiburón (Jaws) 🦈', soundEn: 'Jaws theme 🦈' },
                        { st: 2, nameEs: 'Segunda Mayor (M2)', nameEn: 'Major 2nd (M2)', ex: 'C → D', soundEs: 'Happy Birthday 🎂', soundEn: 'Happy Birthday 🎂' },
                        { st: 3, nameEs: 'Tercera Menor (m3)', nameEn: 'Minor 3rd (m3)', ex: 'C → Eb', soundEs: 'Sonido triste/menor 😢', soundEn: 'Sad/minor sound 😢' },
                        { st: 4, nameEs: 'Tercera Mayor (M3)', nameEn: 'Major 3rd (M3)', ex: 'C → E', soundEs: 'Sonido alegre/mayor 😊', soundEn: 'Happy/major sound 😊' },
                        { st: 5, nameEs: 'Cuarta Justa (P4)', nameEn: 'Perfect 4th (P4)', ex: 'C → F', soundEs: 'Himno de boda 💒', soundEn: 'Wedding march 💒' },
                        { st: 6, nameEs: 'Tritono (dim5)', nameEn: 'Tritone (dim5)', ex: 'C → F#', soundEs: '¡El Diabolus in Musica! 😈', soundEn: 'The Devil in Music! 😈' },
                        { st: 7, nameEs: 'Quinta Justa (P5)', nameEn: 'Perfect 5th (P5)', ex: 'C → G', soundEs: 'Star Wars ⭐', soundEn: 'Star Wars ⭐' },
                        { st: 8, nameEs: 'Sexta Menor (m6)', nameEn: 'Minor 6th (m6)', ex: 'C → Ab', soundEs: 'The Entertainer 🎪', soundEn: 'The Entertainer 🎪' },
                        { st: 9, nameEs: 'Sexta Mayor (M6)', nameEn: 'Major 6th (M6)', ex: 'C → A', soundEs: 'My Bonnie 🏴󠁧󠁢󠁳󠁣󠁴󠁿', soundEn: 'My Bonnie 🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
                        { st: 10, nameEs: 'Séptima Menor (m7)', nameEn: 'Minor 7th (m7)', ex: 'C → Bb', soundEs: 'Star Trek 🖖', soundEn: 'Star Trek 🖖' },
                        { st: 11, nameEs: 'Séptima Mayor (M7)', nameEn: 'Major 7th (M7)', ex: 'C → B', soundEs: 'Tensión dramática 🎬', soundEn: 'Dramatic tension 🎬' },
                        { st: 12, nameEs: 'Octava (P8)', nameEn: 'Octave (P8)', ex: 'C → C', soundEs: 'Somewhere Over the Rainbow 🌈', soundEn: 'Somewhere Over the Rainbow 🌈' },
                      ].map((row) => (
                        <tr key={row.st} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 font-mono font-bold text-blue-400">{row.st}</td>
                          <td className="py-2.5 px-3 font-bold text-white">{t ? row.nameEs : row.nameEn}</td>
                          <td className="py-2.5 px-3 font-mono text-emerald-300">{row.ex}</td>
                          <td className="py-2.5 px-3 text-slate-400">{t ? row.soundEs : row.soundEn}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-blue-950/40 border border-blue-900/60 space-y-3">
                <h4 className="font-extrabold text-white text-base flex items-center gap-2 text-blue-300">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  {t ? '¿Por qué importan los intervalos?' : 'Why do intervals matter?'}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {t
                    ? 'Los intervalos son la base de TODO en la música. Un acorde Mayor = Fundamental + Tercera Mayor (4 semitonos) + Quinta Justa (7 semitonos). Un acorde Menor = Fundamental + Tercera Menor (3 semitonos) + Quinta Justa (7 semitonos). ¡La ÚNICA diferencia entre Mayor y Menor es 1 semitono en la tercera! Si dominas los intervalos, puedes construir cualquier acorde en cualquier tonalidad.'
                    : 'Intervals are the foundation of EVERYTHING in music. A Major chord = Root + Major 3rd (4 semitones) + Perfect 5th (7 semitones). A Minor chord = Root + Minor 3rd (3 semitones) + Perfect 5th (7 semitones). The ONLY difference between Major and Minor is 1 semitone in the 3rd! Master intervals and you can build any chord in any key.'}
                </p>
              </div>
            </article>
          )}

          {/* ═══════════════════════════════════════════════════ */}
          {/* SECTION 6: CHORD FORMULAS */}
          {/* ═══════════════════════════════════════════════════ */}
          {activeTab === 'chords' && (
            <article className="space-y-8 animate-in fade-in duration-200">
              <div className="space-y-3 border-b border-slate-800 pb-5">
                <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400">
                  {t ? 'Tema 06 — Fórmulas de Acordes' : 'Topic 06 — Chord Formulas'}
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white">
                  {t ? 'Paso a Paso: Cómo Construir Cualquier Acorde (Tríadas)' : 'Step-by-Step Chord Building Guide'}
                </h2>
                <p className="text-base text-slate-300 leading-relaxed">
                  {t
                    ? 'Un acorde de 3 notas (tríada) se construye contando la cantidad exacta de semitonos partiendo desde la nota Fundamental (Root).'
                    : 'Triad chords consist of 3 notes built by counting semitone intervals from the Root.'}
                </p>
              </div>

              {/* Step-by-Step Method Explanation */}
              <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="font-extrabold text-white text-lg flex items-center gap-2 text-blue-400">
                  <HelpCircle className="w-5 h-5 text-blue-400" />
                  {t ? 'Método de 3 Pasos para Construir un Acorde' : '3-Step Method to Build Any Chord'}
                </h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-300">
                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <b className="text-blue-300 font-bold">{t ? 'Paso 1: Fundamental (1)' : 'Step 1: Root (1)'}</b>
                    <p className="text-xs text-slate-400">{t ? 'Escoge la nota inicial del acorde (ej. si deseas formar C Major, tu fundamental es C).' : 'Choose the starting note (e.g. for C Major, your root is C).'}</p>
                  </div>
                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <b className="text-indigo-300 font-bold">{t ? 'Paso 2: La Tercera (3 o b3)' : 'Step 2: The Third (3 or b3)'}</b>
                    <p className="text-xs text-slate-400">{t ? 'Cuenta +4 semitonos para Mayor, o +3 semitonos para Menor.' : 'Count +4 semitones for Major, or +3 semitones for Minor.'}</p>
                  </div>
                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <b className="text-emerald-300 font-bold">{t ? 'Paso 3: La Quinta (5)' : 'Step 3: The Fifth (5)'}</b>
                    <p className="text-xs text-slate-400">{t ? 'Cuenta +7 semitonos desde la fundamental para la Quinta Justa.' : 'Count +7 semitones from root for Perfect 5th.'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    nameEs: 'Major Triad (Tríada Mayor)',
                    nameEn: 'Major Triad',
                    formula: '1 - 3 - 5 (0, 4, 7)',
                    descEs: 'Sonido alegre, brillante y estable. Tercera Mayor (+4) + Quinta Justa (+7).',
                    descEn: 'Sounds bright, happy, and confident. Major 3rd (+4) + Perfect 5th (+7).',
                    example: 'C Major: C - E - G | G Major: G - B - D',
                    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
                  },
                  {
                    nameEs: 'Minor Triad (Tríada Menor)',
                    nameEn: 'Minor Triad',
                    formula: '1 - b3 - 5 (0, 3, 7)',
                    descEs: 'Sonido melancólico y emotivo. Tercera Menor (+3) + Quinta Justa (+7). La ÚNICA diferencia con Mayor es 1 semitono en la 3ra.',
                    descEn: 'Sounds sad, emotional. Minor 3rd (+3) + Perfect 5th (+7). The ONLY difference from Major is 1 semitone in the 3rd.',
                    example: 'C Minor: C - Eb - G | A Minor: A - C - E',
                    color: 'text-blue-400 border-blue-500/30 bg-blue-950/20',
                  },
                  {
                    nameEs: 'Diminished Triad (Tríada Disminuida)',
                    nameEn: 'Diminished Triad',
                    formula: '1 - b3 - b5 (0, 3, 6)',
                    descEs: 'Sonido tenso y dramático. Tercera Menor (+3) + Quinta Disminuida (+6). El intervalo de 6 semitonos (tritono) se llamaba "Diabolus in Musica" en la Edad Media — ¡lo prohibía la Iglesia!',
                    descEn: 'Sounds tense and dramatic. Minor 3rd (+3) + Diminished 5th (+6). The 6-semitone interval (tritone) was called "Diabolus in Musica" in the Middle Ages — the Church banned it!',
                    example: 'C Dim: C - Eb - Gb | B Dim: B - D - F',
                    color: 'text-amber-400 border-amber-500/30 bg-amber-950/20',
                  },
                  {
                    nameEs: 'Augmented Triad (Tríada Aumentada)',
                    nameEn: 'Augmented Triad',
                    formula: '1 - 3 - #5 (0, 4, 8)',
                    descEs: 'Sonido misterioso y flotante. Tercera Mayor (+4) + Quinta Aumentada (+8). Divide la octava en 3 partes iguales — ¡por eso suena "suspendido en el aire"!',
                    descEn: 'Sounds dreamy and floating. Major 3rd (+4) + Augmented 5th (+8). Divides the octave into 3 equal parts — that\'s why it sounds "suspended in air"!',
                    example: 'C Aug: C - E - G# | D Aug: D - F# - A#',
                    color: 'text-purple-400 border-purple-500/30 bg-purple-950/20',
                  },
                ].map((chord) => (
                  <div key={chord.example} className={`p-6 rounded-3xl border ${chord.color} space-y-3`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-extrabold text-lg text-white">{t ? chord.nameEs : chord.nameEn}</h4>
                      <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-200">
                        {chord.formula}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{t ? chord.descEs : chord.descEn}</p>
                    <div className="text-sm font-bold text-white bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
                      {t ? 'Ejemplo:' : 'Example:'} <span className="font-mono text-blue-300 font-bold">{chord.example}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Relative Major/Minor explanation */}
              <div className="p-6 rounded-3xl bg-indigo-950/30 border border-indigo-900/50 space-y-3">
                <h4 className="font-extrabold text-white text-base flex items-center gap-2 text-indigo-300">
                  <Flame className="w-5 h-5 text-amber-400" />
                  {t ? '¿Por qué D Menor "parece" C Mayor?' : 'Why does D Minor "look like" C Major?'}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {t
                    ? 'Cada tonalidad mayor tiene un "relativo menor" que comparte las mismas notas. El relativo menor de C Major es A Minor (ambos solo usan teclas blancas). Dm (D-F-A) también usa solo teclas blancas, pero no es el relativo menor de C — es el ii grado de la escala de C Major. ¡D Minor suena diferente porque el punto de REPOSO cambia! Los acordes ii-V-I (Dm-G-C) son la progresión más importante de toda la música occidental.'
                    : 'Every major key has a "relative minor" sharing the same notes. C Major\'s relative minor is A Minor (both use only white keys). Dm (D-F-A) also uses only white keys, but it\'s not C\'s relative minor — it\'s the ii chord of C Major. D Minor sounds different because the point of REST changes! The ii-V-I progression (Dm-G-C) is the most important progression in all Western music.'}
                </p>
              </div>
            </article>
          )}

          {/* ═══════════════════════════════════════════════════ */}
          {/* SECTION 7: CIRCLE OF FIFTHS */}
          {/* ═══════════════════════════════════════════════════ */}
          {activeTab === 'circle' && (
            <article className="space-y-8 animate-in fade-in duration-200">
              <div className="space-y-3 border-b border-slate-800 pb-5">
                <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400">
                  {t ? 'Tema 07 — Círculo de Quintas' : 'Topic 07 — Circle of Fifths'}
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white">
                  {t ? 'El Círculo de Quintas: El Mapa Maestro de la Música' : 'The Circle of Fifths: Music\'s Master Map'}
                </h2>
                <p className="text-base text-slate-300 leading-relaxed">
                  {t
                    ? 'El Círculo de Quintas es la herramienta más poderosa de la teoría musical. Organiza las 12 tonalidades en un círculo donde cada paso en sentido horario sube una Quinta Justa (+7 semitonos) y añade 1 sostenido.'
                    : 'The Circle of Fifths is the most powerful tool in music theory. It organizes all 12 keys in a circle where each clockwise step goes up a Perfect 5th (+7 semitones) and adds 1 sharp.'}
                </p>
              </div>

              {/* Circle representation */}
              <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
                <h3 className="font-bold text-white text-lg flex items-center gap-2 text-amber-400">
                  <CircleDot className="w-6 h-6 text-amber-400" />
                  {t ? 'Las 12 Tonalidades Mayores en el Círculo' : 'All 12 Major Keys on the Circle'}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { key: 'C', sharps: 0, flats: 0, desc: t ? '0 alteraciones' : '0 accidentals', pos: '12:00' },
                    { key: 'G', sharps: 1, flats: 0, desc: t ? '1 sostenido (F#)' : '1 sharp (F#)', pos: '1:00' },
                    { key: 'D', sharps: 2, flats: 0, desc: t ? '2 sostenidos (F#, C#)' : '2 sharps (F#, C#)', pos: '2:00' },
                    { key: 'A', sharps: 3, flats: 0, desc: t ? '3 sostenidos (F#, C#, G#)' : '3 sharps (F#, C#, G#)', pos: '3:00' },
                    { key: 'E', sharps: 4, flats: 0, desc: t ? '4 sostenidos' : '4 sharps', pos: '4:00' },
                    { key: 'B', sharps: 5, flats: 0, desc: t ? '5 sostenidos' : '5 sharps', pos: '5:00' },
                    { key: 'F#/Gb', sharps: 6, flats: 6, desc: t ? '6 # ó 6 b (enarmónico)' : '6 # or 6 b (enharmonic)', pos: '6:00' },
                    { key: 'Db', sharps: 0, flats: 5, desc: t ? '5 bemoles' : '5 flats', pos: '7:00' },
                    { key: 'Ab', sharps: 0, flats: 4, desc: t ? '4 bemoles' : '4 flats', pos: '8:00' },
                    { key: 'Eb', sharps: 0, flats: 3, desc: t ? '3 bemoles (Bb, Eb, Ab)' : '3 flats (Bb, Eb, Ab)', pos: '9:00' },
                    { key: 'Bb', sharps: 0, flats: 2, desc: t ? '2 bemoles (Bb, Eb)' : '2 flats (Bb, Eb)', pos: '10:00' },
                    { key: 'F', sharps: 0, flats: 1, desc: t ? '1 bemol (Bb)' : '1 flat (Bb)', pos: '11:00' },
                  ].map((item) => (
                    <div key={item.key} className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 text-center space-y-1.5">
                      <div className="text-2xl font-black text-blue-400">{item.key}</div>
                      <div className="text-xs text-slate-400">{item.desc}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{item.pos}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rules */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-emerald-950/30 border border-emerald-900/50 space-y-3">
                  <h4 className="font-extrabold text-emerald-300 text-base">
                    {t ? '→ Sentido Horario = Quintas (+7 semitonos)' : '→ Clockwise = Fifths (+7 semitones)'}
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {t
                      ? 'Cada paso a la derecha sube una Quinta Justa y AÑADE 1 sostenido. C → G (+F#) → D (+C#) → A (+G#)... Los nuevos sostenidos aparecen en el orden: F#, C#, G#, D#, A#, E#, B#.'
                      : 'Each step right goes up a Perfect 5th and ADDS 1 sharp. C → G (+F#) → D (+C#) → A (+G#)... New sharps appear in order: F#, C#, G#, D#, A#, E#, B#.'}
                  </p>
                </div>
                <div className="p-6 rounded-3xl bg-blue-950/30 border border-blue-900/50 space-y-3">
                  <h4 className="font-extrabold text-blue-300 text-base">
                    {t ? '← Sentido Antihorario = Cuartas (+5 semitonos)' : '← Counter-clockwise = Fourths (+5 semitones)'}
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {t
                      ? 'Cada paso a la izquierda sube una Cuarta Justa y AÑADE 1 bemol. C → F (+Bb) → Bb (+Eb) → Eb (+Ab)... Los nuevos bemoles aparecen en el orden: Bb, Eb, Ab, Db, Gb, Cb, Fb.'
                      : 'Each step left goes up a Perfect 4th and ADDS 1 flat. C → F (+Bb) → Bb (+Eb) → Eb (+Ab)... New flats appear in order: Bb, Eb, Ab, Db, Gb, Cb, Fb.'}
                  </p>
                </div>
              </div>

              {/* Relative Minor */}
              <div className="p-6 rounded-3xl bg-purple-950/30 border border-purple-900/50 space-y-3">
                <h4 className="font-extrabold text-white text-base flex items-center gap-2 text-purple-300">
                  <Flame className="w-5 h-5 text-amber-400" />
                  {t ? 'Truco: El Relativo Menor está 3 semitonos ABAJO' : 'Trick: The Relative Minor is 3 semitones BELOW'}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {t
                    ? 'Cada tonalidad mayor tiene un relativo menor que comparte las mismas notas. Para encontrarlo, baja 3 semitonos desde la fundamental mayor. C Major → A Minor. G Major → E Minor. F Major → D Minor. ¡Ambas tonalidades usan exactamente las mismas notas, solo cambia el punto de inicio!'
                    : 'Every major key has a relative minor sharing the same notes. To find it, go down 3 semitones from the major root. C Major → A Minor. G Major → E Minor. F Major → D Minor. Both keys use exactly the same notes, only the starting point changes!'}
                </p>
              </div>
            </article>
          )}

          {/* ═══════════════════════════════════════════════════ */}
          {/* SECTION 8: CHORD INVERSIONS */}
          {/* ═══════════════════════════════════════════════════ */}
          {activeTab === 'inversions' && (
            <article className="space-y-8 animate-in fade-in duration-200">
              <div className="space-y-3 border-b border-slate-800 pb-5">
                <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400">
                  {t ? 'Tema 08 — Inversiones de Acordes' : 'Topic 08 — Inversions'}
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white">
                  {t ? 'Guía de Inversiones de Acordes y Conducción de Voces' : 'Chord Inversions & Voice Leading Guide'}
                </h2>
                <p className="text-base text-slate-300 leading-relaxed">
                  {t
                    ? 'Invertir un acorde significa cambiar qué nota se toca en el bajo (la nota más grave). Esto permite enlazar acordes con movimientos de dedos mínimos al acompañar canciones reales. Es la diferencia entre tocar como principiante y tocar como profesional.'
                    : 'Inverting chords changes which note is played lowest in the bass. This creates smooth finger movements in real songs. It\'s the difference between playing like a beginner and playing like a pro.'}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-blue-400 text-lg">{t ? 'Posición Fundamental (Root)' : 'Root Position'}</h4>
                    <div className="text-xs font-mono font-bold text-white bg-slate-900 p-2.5 rounded-xl">{t ? 'Orden: C4 - E4 - G4' : 'Order: C4 - E4 - G4'}</div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {t ? 'La nota Fundamental (C) es la más grave. Es la posición estándar básica. Suena "completo" y "resuelto".' : 'The Root note (C) is in the lowest position. Standard basic position. Sounds "complete" and "resolved".'}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-indigo-400 text-lg">{t ? '1ra Inversión (1st Inversion)' : '1st Inversion'}</h4>
                    <div className="text-xs font-mono font-bold text-white bg-slate-900 p-2.5 rounded-xl">{t ? 'Orden: E4 - G4 - C5' : 'Order: E4 - G4 - C5'}</div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {t ? 'La 3ra (E) pasa al bajo, y la Fundamental (C) sube una octava. Suena más "ligero" y "abierto".' : 'The 3rd (E) moves to the lowest position. The Root (C) goes up an octave. Sounds "lighter" and "more open".'}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-emerald-400 text-lg">{t ? '2da Inversión (2nd Inversion)' : '2nd Inversion'}</h4>
                    <div className="text-xs font-mono font-bold text-white bg-slate-900 p-2.5 rounded-xl">{t ? 'Orden: G4 - C5 - E5' : 'Order: G4 - C5 - E5'}</div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {t ? 'La 5ta (G) pasa al bajo. Tiene un sonido "inestable" que pide resolución. Muy usada antes del acorde final.' : 'The 5th (G) moves to the lowest position. Has an "unstable" sound that begs for resolution. Often used before the final chord.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Voice Leading explanation */}
              <div className="p-6 rounded-3xl bg-amber-950/30 border border-amber-900/50 space-y-3">
                <h4 className="font-extrabold text-white text-base flex items-center gap-2 text-amber-300">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  {t ? '¿Por qué usar inversiones en la práctica real?' : 'Why use inversions in real practice?'}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {t
                    ? 'Imagina tocar C Major (C-E-G) y luego F Major (F-A-C) en posición fundamental — tus dedos saltan mucho. Pero si tocas F Major en 2da inversión (C-F-A), ¡tu dedo meñique se queda en C y solo mueves 2 dedos! Esto se llama "conducción de voces" (voice leading) y es lo que hace que una progresión de acordes suene profesional y fluida en vez de "entrecortada".'
                    : 'Imagine playing C Major (C-E-G) then F Major (F-A-C) in root position — your fingers jump a lot. But if you play F Major in 2nd inversion (C-F-A), your pinky stays on C and you only move 2 fingers! This is called "voice leading" and it\'s what makes chord progressions sound professional and smooth instead of "choppy".'}
                </p>
              </div>
            </article>
          )}
        </main>
      </div>
    </div>
  );
};
