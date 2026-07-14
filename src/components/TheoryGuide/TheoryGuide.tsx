import React, { useState } from 'react';
import { BookOpen, Music, Key, Hash, Layers, ArrowLeft, Lightbulb, GraduationCap, CheckCircle2, Music2, Sparkles, HelpCircle, Flame } from 'lucide-react';
import { StaffDisplay } from '../StaffDisplay/StaffDisplay';
import { useProgressStore } from '../../store/progressStore';

export const TheoryGuide: React.FC<{ onBackToTrainer: () => void }> = ({ onBackToTrainer }) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'keyboard' | 'staff' | 'accidentals' | 'chords' | 'inversions'>('notes');
  const language = useProgressStore((state) => state.settings.language) || 'es';

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
              {language === 'es' ? 'Centro de Aprendizaje y Teoría de Piano' : 'Piano & Music Theory Learning Hub'}
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              {language === 'es' ? 'Guía Completa Paso a Paso de Nomenclatura y Armonía Musical' : 'Complete Step-by-Step English Notation & Harmony Guide'}
            </p>
          </div>
        </div>

        <button
          onClick={onBackToTrainer}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-blue-600/30"
        >
          <ArrowLeft className="w-4 h-4" />
          {language === 'es' ? 'Volver al Entrenador Interactivo' : 'Back to Interactive Trainer'}
        </button>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-72 shrink-0 space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            {language === 'es' ? 'Temas Teóricos Paso a Paso' : 'Step-by-Step Theory Topics'}
          </div>

          {[
            {
              id: 'notes',
              label: language === 'es' ? '1. Nombres en Inglés (C D E)' : '1. English Note Names',
              icon: Music,
              desc: language === 'es' ? 'C, D, E, F, G, A, B vs Solfeo (Do, Re, Mi)' : 'C, D, E, F, G, A, B vs Solfège',
            },
            {
              id: 'keyboard',
              label: language === 'es' ? '2. Guía del Teclado de 61 Teclas' : '2. 61-Key Keyboard Guide',
              icon: Key,
              desc: language === 'es' ? 'Referencias visuales en tu PSR-E383' : 'Visual landmarks on PSR-E383',
            },
            {
              id: 'staff',
              label: language === 'es' ? '3. Pentagrama y Claves' : '3. Staff & Clefs Guide',
              icon: BookOpen,
              desc: language === 'es' ? 'Clave de Sol, Clave de Fa y Gran Pentagrama' : 'Treble, Bass & Grand Staff',
            },
            {
              id: 'accidentals',
              label: language === 'es' ? '4. Sostenidos (#), Bemoles (b)' : '4. Sharps (#) & Flats (b)',
              icon: Hash,
              desc: language === 'es' ? 'Semitonos y Reglas de Enarmonía' : 'Semitones & Enharmonic Rules',
            },
            {
              id: 'chords',
              label: language === 'es' ? '5. Construcción de Acordes' : '5. Chord Building Formulas',
              icon: Layers,
              desc: language === 'es' ? 'Tríadas Mayores, Menores, Dis y Aug' : 'Major, Minor, Dim & Aug Triads',
            },
            {
              id: 'inversions',
              label: language === 'es' ? '6. Inversiones de Acordes' : '6. Chord Inversions',
              icon: Lightbulb,
              desc: language === 'es' ? '1ra y 2da Inversión de Voces en el bajo' : '1st & 2nd Inversions Voice Leading',
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
          {/* SECTION 1: ENGLISH NOTE NAMES */}
          {activeTab === 'notes' && (
            <article className="space-y-8 animate-in fade-in duration-200">
              <div className="space-y-3 border-b border-slate-800 pb-5">
                <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400">
                  {language === 'es' ? 'Tema 01 — Guía de Nomenclatura' : 'Topic 01 — Notation Guide'}
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white">
                  {language === 'es' ? 'Entendiendo la Nomenclatura en Inglés (C, D, E, F, G, A, B)' : 'Understanding English Nomenclatures (C, D, E, F, G, A, B)'}
                </h2>
                <p className="text-base text-slate-300 leading-relaxed">
                  {language === 'es' ? (
                    <>
                      Si aprendiste música en español, probablemente conozcas las notas como <i>Do, Re, Mi, Fa, Sol, La, Si</i>. Sin embargo, en el mundo moderno (partituras de canciones populares, cifrados de acordes en internet y teclados MIDI como tu Yamaha PSR-E383), las notas se escriben <strong className="text-white font-bold">SIEMPRE con letras del alfabeto en inglés</strong>.
                    </>
                  ) : (
                    <>
                      If you learned music in Spanish, you likely know notes as Do, Re, Mi, Fa, Sol, La, Si. Modern sheet music, chord charts, and MIDI keyboards use <strong className="text-white font-bold">English Letters</strong>.
                    </>
                  )}
                </p>
              </div>

              {/* Step-by-Step Conversion Chart */}
              <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
                <h3 className="font-bold text-white text-lg flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  {language === 'es' ? 'Tabla de Conversión Directa de Notas' : 'Direct Note Conversion Chart'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { letter: 'C', solfege: 'Do', nicknameEs: 'Do Central / C4', nicknameEn: 'Middle C / C4', ruleEs: 'A la izquierda del par de 2 teclas negras', ruleEn: 'Left of pair of 2 black keys' },
                    { letter: 'D', solfege: 'Re', nicknameEs: 'Re / D', nicknameEn: 'D', ruleEs: 'Justo en el centro del par de 2 teclas negras', ruleEn: 'Middle of pair of 2 black keys' },
                    { letter: 'E', solfege: 'Mi', nicknameEs: 'Mi / E', nicknameEn: 'E', ruleEs: 'A la derecha del par de 2 teclas negras', ruleEn: 'Right of pair of 2 black keys' },
                    { letter: 'F', solfege: 'Fa', nicknameEs: 'Fa / F', nicknameEn: 'F', ruleEs: 'A la izquierda del grupo de 3 teclas negras', ruleEn: 'Left of group of 3 black keys' },
                    { letter: 'G', solfege: 'Sol', nicknameEs: 'Sol / G', nicknameEn: 'G', ruleEs: 'Primera tecla dentro del grupo de 3 negras', ruleEn: 'First key inside group of 3 black keys' },
                    { letter: 'A', solfege: 'La', nicknameEs: 'La / A', nicknameEn: 'A', ruleEs: 'Segunda tecla dentro del grupo de 3 negras', ruleEn: 'Second key inside group of 3 black keys' },
                    { letter: 'B', solfege: 'Si', nicknameEs: 'Si / B', nicknameEn: 'B', ruleEs: 'A la derecha del grupo de 3 teclas negras', ruleEn: 'Right of group of 3 black keys' },
                  ].map((item) => (
                    <div key={item.letter} className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-black text-blue-400">{item.letter}</span>
                        <span className="text-sm font-bold text-slate-300 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                          ({item.solfege})
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-200">{language === 'es' ? item.nicknameEs : item.nicknameEn}</div>
                      <div className="text-xs text-slate-400 leading-normal">{language === 'es' ? item.ruleEs : item.ruleEn}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Explanatory Callout */}
              <div className="p-6 rounded-3xl bg-blue-950/40 border border-blue-900/60 space-y-3">
                <h4 className="font-extrabold text-white text-base flex items-center gap-2 text-blue-300">
                  <Flame className="w-5 h-5 text-amber-400" />
                  {language === 'es' ? '¿Por qué la letra A no empieza en Do?' : 'Why doesn\'t letter A start on C?'}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {language === 'es'
                    ? 'Históricamente, la escala musical antigua comenzaba en la nota La (A). Por eso las letras van A, B, C, D, E, F, G. Sin embargo, en el piano moderno la escala mayor estándar empieza en C (Do). ¡Así que la secuencia en el piano es C - D - E - F - G - A - B!'
                    : 'Historically, ancient scales started on note A. That is why letters order A, B, C, D, E, F, G. However, modern piano scales start on C. So the piano sequence is C - D - E - F - G - A - B!'}
                </p>
              </div>
            </article>
          )}

          {/* SECTION 2: 61-KEY KEYBOARD LANDMARKS */}
          {activeTab === 'keyboard' && (
            <article className="space-y-8 animate-in fade-in duration-200">
              <div className="space-y-3 border-b border-slate-800 pb-5">
                <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400">
                  {language === 'es' ? 'Tema 02 — Guía del Teclado' : 'Topic 02 — Keyboard Guide'}
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white">
                  {language === 'es' ? 'Cómo Encontrar Cualquier Nota en tu Piano de 61 Teclas' : 'How to Find Any Note on Your 61-Key Piano'}
                </h2>
                <p className="text-base text-slate-300 leading-relaxed">
                  {language === 'es'
                    ? 'Tu teclado Yamaha PSR-E383 tiene 61 teclas (36 blancas y 25 negras) divididas en 5 octavas idénticas. Para ubicarte al instante sin dudar, sólo debes buscar el patrón de las teclas negras.'
                    : 'Your Yamaha PSR-E383 has 61 keys (36 white and 25 black) divided into 5 identical octaves. Locate keys by looking at the black key patterns.'}
                </p>
              </div>

              {/* Detailed Step by Step Steps */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-black text-sm">1</span>
                    <h4 className="font-extrabold text-white text-base text-blue-400">
                      {language === 'es' ? 'Grupo de 2 Teclas Negras (C, D, E)' : 'Group of 2 Black Keys (C, D, E)'}
                    </h4>
                  </div>
                  <ul className="text-sm text-slate-300 space-y-3 leading-relaxed">
                    <li className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                      <b className="text-white">Nota C (Do):</b> Se encuentra inmediatamente a la izquierda del grupo de 2 teclas negras.
                    </li>
                    <li className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                      <b className="text-white">Nota D (Re):</b> Se encuentra atrapada exactamente en medio de las 2 teclas negras.
                    </li>
                    <li className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                      <b className="text-white">Nota E (Mi):</b> Se encuentra inmediatamente a la derecha del grupo de 2 teclas negras.
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-black text-sm">2</span>
                    <h4 className="font-extrabold text-white text-base text-indigo-400">
                      {language === 'es' ? 'Grupo de 3 Teclas Negras (F, G, A, B)' : 'Group of 3 Black Keys (F, G, A, B)'}
                    </h4>
                  </div>
                  <ul className="text-sm text-slate-300 space-y-3 leading-relaxed">
                    <li className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                      <b className="text-white">Nota F (Fa):</b> Se encuentra inmediatamente a la izquierda del grupo de 3 teclas negras.
                    </li>
                    <li className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                      <b className="text-white">Notas G y A (Sol y La):</b> Son las dos teclas blancas encajadas dentro del grupo de 3 negras.
                    </li>
                    <li className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                      <b className="text-white">Nota B (Si):</b> Se encuentra inmediatamente a la derecha del grupo de 3 teclas negras.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Middle C Feature Box */}
              <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-3">
                <h4 className="font-extrabold text-emerald-400 text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  {language === 'es' ? 'El Ancla Central: Do Central (C4)' : 'Central Anchor: Middle C (C4)'}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {language === 'es'
                    ? 'El Do Central (C4) es el 3er "C" contando desde la izquierda en tu piano de 61 teclas. Es la nota de referencia fundamental: todo lo que toque tu mano derecha suele escribirse en Clave de Sol desde C4 hacia arriba, y todo lo que toque tu mano izquierda se escribe en Clave de Fa desde C4 hacia abajo.'
                    : 'Middle C (C4) is the 3rd C key from the left on your 61-key keyboard. Reference note dividing Right Hand (Treble Clef) and Left Hand (Bass Clef).'}
                </p>
              </div>
            </article>
          )}

          {/* SECTION 3: STAFF & CLEFS */}
          {activeTab === 'staff' && (
            <article className="space-y-8 animate-in fade-in duration-200">
              <div className="space-y-3 border-b border-slate-800 pb-5">
                <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400">
                  {language === 'es' ? 'Tema 03 — Lectura de Partitura' : 'Topic 03 — Score Reading'}
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white">
                  {language === 'es' ? 'Cómo Leer el Pentagrama: Clave de Sol, Clave de Fa y Gran Pentagrama' : 'Reading Sheet Music: Treble Clef, Bass Clef & Grand Staff'}
                </h2>
                <p className="text-base text-slate-300 leading-relaxed">
                  {language === 'es'
                    ? 'Un pentagrama consta de 5 líneas paralelas y 4 espacios entre ellas. Las notas escritas más arriba representan sonidos agudos, mientras las notas escritas más abajo representan sonidos graves.'
                    : 'A musical staff consists of 5 parallel lines and 4 spaces between them. Higher positions represent higher pitches, lower positions lower pitches.'}
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
                        {language === 'es' ? 'Clave de Sol (Treble Clef)' : 'Treble Clef'}
                      </h3>
                      <span className="text-xs font-bold text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">
                        {language === 'es' ? 'Mano Derecha' : 'Right Hand'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {language === 'es' ? 'Usada para registros medios y agudos desde C4 hacia arriba.' : 'Used for middle and high register notes from C4 upwards.'}
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
                    <div className="font-bold text-blue-300 text-sm mb-1">{language === 'es' ? 'Memorización en Clave de Sol:' : 'Treble Clef Mnemonics:'}</div>
                    <div><b>{language === 'es' ? 'Líneas (Abajo a Arriba):' : 'Lines (Bottom to Top):'}</b> E4 - G4 - B4 - D5 - F5</div>
                    <div><b>{language === 'es' ? 'Espacios (Abajo a Arriba):' : 'Spaces (Bottom to Top):'}</b> F4 - A4 - C5 - E5</div>
                  </div>
                </div>

                {/* Bass Clef Card */}
                <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between overflow-hidden">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-white text-lg text-indigo-400 flex items-center gap-2">
                        <Music2 className="w-5 h-5 text-indigo-400" />
                        {language === 'es' ? 'Clave de Fa (Bass Clef)' : 'Bass Clef'}
                      </h3>
                      <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
                        {language === 'es' ? 'Mano Izquierda' : 'Left Hand'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {language === 'es' ? 'Usada para registros graves de bajo por debajo de C4.' : 'Used for low bass register notes below C4.'}
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
                    <div className="font-bold text-indigo-300 text-sm mb-1">{language === 'es' ? 'Memorización en Clave de Fa:' : 'Bass Clef Mnemonics:'}</div>
                    <div><b>{language === 'es' ? 'Líneas (Abajo a Arriba):' : 'Lines (Bottom to Top):'}</b> G2 - B2 - D3 - F3 - A3</div>
                    <div><b>{language === 'es' ? 'Espacios (Abajo a Arriba):' : 'Spaces (Bottom to Top):'}</b> A2 - C3 - E3 - G3</div>
                  </div>
                </div>
              </div>

              {/* Grand Staff Banner Card */}
              <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                  <h3 className="font-extrabold text-white text-lg sm:text-xl">
                    {language === 'es' ? 'Gran Pentagrama (Sistema Real de Piano)' : 'Grand Staff (Authentic Two Hand System)'}
                  </h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {language === 'es'
                    ? 'En partituras reales de piano, ambos pentagramas se muestran juntos unidos por una llave. El pentagrama superior es la Clave de Sol (Mano Derecha) y el inferior es la Clave de Fa (Mano Izquierda). El Do Central (C4) se ubica exactamente en el espacio entre ambos pentagramas mediante una línea adicional.'
                    : 'In piano sheet music, both staves are joined together by a brace bracket. Top stave is Treble Clef (Right Hand) and bottom is Bass Clef (Left Hand).'}
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

          {/* SECTION 4: SHARPS & FLATS */}
          {activeTab === 'accidentals' && (
            <article className="space-y-8 animate-in fade-in duration-200">
              <div className="space-y-3 border-b border-slate-800 pb-5">
                <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400">
                  {language === 'es' ? 'Tema 04 — Alteraciones y Enarmonía' : 'Topic 04 — Accidentals & Enharmonics'}
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white">
                  {language === 'es' ? 'Sostenidos (#), Bemoles (b) y Reglas Enarmónicas Paso a Paso' : 'Sharps (#), Flats (b), and Enharmonic Rules Step by Step'}
                </h2>
                <p className="text-base text-slate-300 leading-relaxed">
                  {language === 'es'
                    ? 'En la música existen las alteraciones (# y b) que modifican la nota 1 semitono hacia arriba o hacia abajo. Un semitono es la distancia más corta posible entre dos teclas contiguas del piano.'
                    : 'Accidentals (# and b) modify note pitches by 1 semitone up or down.'}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Sharp Card */}
                <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-amber-400 text-lg">Sharp (#) — Sostenido</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {language === 'es' ? (
                        <>
                          Eleva el sonido de una nota <strong className="text-white font-bold">1 semitono hacia la DERECHA</strong> (sonido más agudo). Por ejemplo, C#4 es la tecla negra inmediatamente a la derecha de C4.
                        </>
                      ) : (
                        <>
                          Raises pitch by <strong className="text-white font-bold">1 semitone to the RIGHT</strong>. Example: C#4 is black key above C4.
                        </>
                      )}
                    </p>
                  </div>
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs font-mono text-amber-300 font-bold">
                    Regla: Nota + 1 Tecla derecha = #
                  </div>
                </div>

                {/* Flat Card */}
                <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-blue-400 text-lg">Flat (b) — Bemol</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {language === 'es' ? (
                        <>
                          Baja el sonido de una nota <strong className="text-white font-bold">1 semitono hacia la IZQUIERDA</strong> (sonido más grave). Por ejemplo, Db4 es la tecla negra inmediatamente a la izquierda de D4.
                        </>
                      ) : (
                        <>
                          Lowers pitch by <strong className="text-white font-bold">1 semitone to the LEFT</strong>. Example: Db4 is black key below D4.
                        </>
                      )}
                    </p>
                  </div>
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs font-mono text-blue-300 font-bold">
                    Regla: Nota - 1 Tecla izquierda = b
                  </div>
                </div>

                {/* Enharmonic Card */}
                <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-emerald-400 text-lg">Enharmonics (Enarmonía)</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {language === 'es' ? (
                        <>
                          ¡Dos nombres diferentes para la <strong className="text-white font-bold">MISMA tecla física</strong> del piano! Como la tecla negra está entre C y D, puede llamarse C# (si vienes desde C) o Db (si vienes desde D).
                        </>
                      ) : (
                        <>
                          Two different names for the <strong className="text-white font-bold">exact same physical key</strong> on the piano! Example: C# = Db, F# = Gb, A# = Bb.
                        </>
                      )}
                    </p>
                  </div>
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 font-bold">
                    C# = Db | F# = Gb | A# = Bb
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* SECTION 5: CHORD FORMULAS */}
          {activeTab === 'chords' && (
            <article className="space-y-8 animate-in fade-in duration-200">
              <div className="space-y-3 border-b border-slate-800 pb-5">
                <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400">
                  {language === 'es' ? 'Tema 05 — Fórmulas de Acordes' : 'Topic 05 — Chord Formulas'}
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white">
                  {language === 'es' ? 'Paso a Paso: Cómo Construir Cualquier Acorde (Tríadas)' : 'Step-by-Step Chord Building Guide'}
                </h2>
                <p className="text-base text-slate-300 leading-relaxed">
                  {language === 'es'
                    ? 'Un acorde de 3 notas (tríada) se construye contando la cantidad exacta de semitonos partiendo desde la nota Fundamental (Root).'
                    : 'Triad chords consist of 3 notes built by counting semitone intervals from the Root.'}
                </p>
              </div>

              {/* Step-by-Step Method Explanation */}
              <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="font-extrabold text-white text-lg flex items-center gap-2 text-blue-400">
                  <HelpCircle className="w-5 h-5 text-blue-400" />
                  {language === 'es' ? 'Método de 3 Pasos para Construir un Acorde' : '3-Step Method to Build Any Chord'}
                </h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-300">
                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <b className="text-blue-300 font-bold">Paso 1: Fundamental (1)</b>
                    <p className="text-xs text-slate-400">Escoge la nota inicial del acorde (ej. si deseas formar C Major, tu fundamental es C).</p>
                  </div>
                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <b className="text-indigo-300 font-bold">Paso 2: La Tercera (3 o b3)</b>
                    <p className="text-xs text-slate-400">Cuenta +4 semitonos para Acorde Mayor (E), o +3 semitonos para Acorde Menor (Eb).</p>
                  </div>
                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <b className="text-emerald-300 font-bold">Paso 3: La Quinta (5)</b>
                    <p className="text-xs text-slate-400">Cuenta +7 semitonos desde la fundamental para obtener la Quinta Justa (G).</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    nameEs: 'Major Triad (Tríada Mayor)',
                    nameEn: 'Major Triad',
                    formula: '1 - 3 - 5 (0, 4, 7 semitonos)',
                    descEs: 'Sonido alegre, brillante y estable. Se forma contando +4 semitonos para la 3ra Mayor y +7 semitonos para la 5ta Justa.',
                    descEn: 'Sounds bright, happy, and confident. Root + Major 3rd (+4 semitones) + Perfect 5th (+7 semitones).',
                    example: 'C Major: C - E - G | F# Major: F# - A# - C#',
                    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
                  },
                  {
                    nameEs: 'Minor Triad (Tríada Menor)',
                    nameEn: 'Minor Triad',
                    formula: '1 - b3 - 5 (0, 3, 7 semitonos)',
                    descEs: 'Sonido melancólico y emotivo. En comparación con la mayor, la nota del centro disminuye 1 semitono (+3 semitonos).',
                    descEn: 'Sounds sad, emotional, and introspective. Middle note (3rd) lowered 1 semitone (+3 semitones).',
                    example: 'C Minor: C - Eb - G | A Minor: A - C - E',
                    color: 'text-blue-400 border-blue-500/30 bg-blue-950/20',
                  },
                  {
                    nameEs: 'Diminished Triad (Tríada Disminuida)',
                    nameEn: 'Diminished Triad',
                    formula: '1 - b3 - b5 (0, 3, 6 semitonos)',
                    descEs: 'Sonido tenso y dramático de suspenso. Se forma con 0, +3 semitonos y +6 semitonos.',
                    descEn: 'Sounds tense, suspenseful, and unstable. Built with 0, +3, and +6 semitones.',
                    example: 'C Diminished: C - Eb - Gb',
                    color: 'text-amber-400 border-amber-500/30 bg-amber-950/20',
                  },
                  {
                    nameEs: 'Augmented Triad (Tríada Aumentada)',
                    nameEn: 'Augmented Triad',
                    formula: '1 - 3 - #5 (0, 4, 8 semitonos)',
                    descEs: 'Sonido misterioso y espacial. Se forma con 0, +4 semitonos y +8 semitonos.',
                    descEn: 'Sounds dreamy, floating, and mysterious. Built with 0, +4, and +8 semitones.',
                    example: 'C Augmented: C - E - G#',
                    color: 'text-purple-400 border-purple-500/30 bg-purple-950/20',
                  },
                ].map((chord) => (
                  <div key={chord.example} className={`p-6 rounded-3xl border ${chord.color} space-y-3`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-extrabold text-lg text-white">{language === 'es' ? chord.nameEs : chord.nameEn}</h4>
                      <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-200">
                        {chord.formula}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{language === 'es' ? chord.descEs : chord.descEn}</p>
                    <div className="text-sm font-bold text-white bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
                      {language === 'es' ? 'Ejemplo:' : 'Example:'} <span className="font-mono text-blue-300 font-bold">{chord.example}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          )}

          {/* SECTION 6: CHORD INVERSIONS */}
          {activeTab === 'inversions' && (
            <article className="space-y-8 animate-in fade-in duration-200">
              <div className="space-y-3 border-b border-slate-800 pb-5">
                <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400">
                  {language === 'es' ? 'Tema 06 — Inversiones de Acordes' : 'Topic 06 — Inversions'}
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white">
                  {language === 'es' ? 'Guía de Inversiones de Acordes y Bajo' : 'Chord Inversions & Bass Voice Leading Guide'}
                </h2>
                <p className="text-base text-slate-300 leading-relaxed">
                  {language === 'es'
                    ? 'Invertir un acorde significa cambiar qué nota se toca en el bajo (la nota más grave). Esto permite enlazar acordes con movimientos de dedos mínimos al acompañar canciones reales.'
                    : 'Inverting chords changes which note is played lowest in the bass. This creates smooth finger movements in real songs.'}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-blue-400 text-lg">{language === 'es' ? 'Posición Fundamental (Root)' : 'Root Position'}</h4>
                    <div className="text-xs font-mono font-bold text-white bg-slate-900 p-2.5 rounded-xl">Order: C4 - E4 - G4</div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {language === 'es' ? 'La nota Fundamental (C) es la más grave de abajo. Es la posición estándar básica.' : 'The Root note (C) is in the lowest position.'}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-indigo-400 text-lg">{language === 'es' ? '1ra Inversión (1st Inversion)' : '1st Inversion'}</h4>
                    <div className="text-xs font-mono font-bold text-white bg-slate-900 p-2.5 rounded-xl">Order: E4 - G4 - C5</div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {language === 'es' ? 'La 3ra (E) pasa al bajo, y la Fundamental (C) sube una octava.' : 'The 3rd (E) moves to the lowest position.'}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-emerald-400 text-lg">{language === 'es' ? '2da Inversión (2nd Inversion)' : '2nd Inversion'}</h4>
                    <div className="text-xs font-mono font-bold text-white bg-slate-900 p-2.5 rounded-xl">Order: G4 - C5 - E5</div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {language === 'es' ? 'La 5ta (G) pasa al bajo, creando un enlace armónico fluido.' : 'The 5th (G) is in the lowest position.'}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          )}
        </main>
      </div>
    </div>
  );
};
