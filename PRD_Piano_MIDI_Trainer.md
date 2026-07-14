# PRD + Plan de Implementación: Piano MIDI Trainer

> Documento de especificación técnica completo, listo para entregar a un agente de IA (Claude Code, Cursor, etc.) **sin contexto previo**. El agente debe poder leer solo este archivo y ejecutar el proyecto de principio a fin.

---

## 0. Resumen para el agente de IA

Vas a construir una **Single Page Application (SPA)** 100% frontend (sin backend, sin base de datos, sin login) que enseña piano a un usuario que:

- Ya sabe solfeo (do, re, mi, fa, sol, la, si) pero **no domina la nomenclatura anglosajona** (C, D, E, F, G, A, B). Este es el objetivo pedagógico #1 de la app.
- Sabe tocar algo de oído, pero **no tiene teoría musical real**: no forma acordes conscientemente ni lee pentagrama con fluidez.
- Quiere dominar **acordes completos**: mayores, menores, con sostenidos (#) y bemoles (b), en las 12 tonalidades, y eventualmente inversiones.
- Tiene un teclado físico **Yamaha PSR-E383** conectado por USB, que usará como controlador MIDI.

La app debe compararse en tiempo real contra lo que el usuario toca físicamente y decirle si acertó, usando siempre nombres de nota en inglés.

---

## 1. Restricciones y stack (no negociables)

| Aspecto | Decisión |
|---|---|
| Backend | Ninguno. Todo corre en el navegador. |
| Base de datos / login | Ninguno. |
| Persistencia | `localStorage` exclusivamente, vía Zustand + middleware `persist`. |
| Framework | React + TypeScript + Vite. |
| Notación musical (render) | VexFlow (última versión estable, `vexflow` en npm). |
| Estilos | Tailwind CSS. |
| Entrada de notas | Web MIDI API nativa (`navigator.requestMIDIAccess`). **No usar micrófono/pitch detection** — se necesita precisión exacta en polifonía (acordes). |
| Deploy objetivo | Vercel (build estático, sin variables de entorno secretas necesarias). |
| Idioma de la interfaz | **Inglés para toda nomenclatura musical** (nombres de nota, acordes, teoría). El resto de la UI (botones, menús) puede ir en español si se desea, pero notas y acordes SIEMPRE en notación anglosajona. |

---

## 2. Hardware de referencia (confirmado)

El usuario usa un **Yamaha PSR-E383**:

- 61 teclas, sensibles a velocidad (velocity-sensitive / touch response).
- Conexión **USB TO HOST (tipo B)**, que transmite MIDI de forma nativa y "class-compliant": no requiere drivers ni interfaz MIDI adicional, solo un cable USB estándar a la computadora.
- Rango típico de 5 octavas. **Importante para el agente:** no hardcodear el rango de teclas asumiendo que empieza en un número MIDI fijo. El código debe detectar dinámicamente el rango de notas que llegan por MIDI y renderizar el teclado virtual en base a eso (con un rango configurable de fallback, ej. C2–C7, por si no hay eventos aún).
- Al no tener teclas ponderadas (acción tipo órgano/synth), no hay pedal de sustain por defecto conectado; el código puede ignorar el pedal de sustain en la v1, pero debe estar preparado para recibir el Control Change 64 (sustain) sin romperse si llega.

---

## 3. Filosofía pedagógica clave: "todo en inglés, desde la tecla número uno"

Este es el requisito diferencial más importante del proyecto, y debe guiar el diseño de cada pantalla:

1. **Nunca** se muestra "Do", "Re", "Mi" como nombre principal de una nota. El nombre grande y central siempre es la letra en inglés (C, D, E, F#, Bb, etc.).
2. Excepción: en el **Nivel 0 (Sandbox)** puede existir un toggle opcional "Show solfège equivalent" que muestra el nombre en solfeo en texto pequeño entre paréntesis, como puente cognitivo inicial (ej. `C (Do)`). Este toggle:
   - Está disponible únicamente en Nivel 0 y Nivel 1.
   - Se apaga automáticamente y desaparece de la UI a partir del Nivel 2 en adelante, para forzar la transición completa a inglés.
3. Los nombres de acordes también van siempre en inglés: "C Major", "D Minor", "F# Major", "Bb Minor" — nunca "Do Mayor".

---

## 4. Arquitectura técnica

### 4.1 Estructura de carpetas propuesta

```
piano-midi-trainer/
├── src/
│   ├── core/                     # Lógica musical pura (sin JSX, testeable)
│   │   ├── noteUtils.ts          # midiNoteToName, nameToMidiNote, octava, etc.
│   │   ├── chordDictionary.ts    # fórmulas de intervalos por tipo de acorde
│   │   ├── chordDetector.ts      # dado un set de midi notes, ¿qué acorde es?
│   │   └── enharmonics.ts        # reglas de cuándo usar # vs b
│   ├── hooks/
│   │   ├── useMidi.ts            # conexión hardware + estado de notas activas
│   │   └── useLevelEngine.ts     # lógica de progreso/validación por nivel
│   ├── store/
│   │   └── progressStore.ts      # Zustand + persist (localStorage)
│   ├── components/
│   │   ├── PianoKeyboard/        # teclado virtual SVG/HTML
│   │   ├── StaffDisplay/         # pentagrama con VexFlow
│   │   ├── LevelHUD/             # objetivo actual, feedback, progreso
│   │   ├── MidiStatusBadge/      # indicador de conexión MIDI
│   │   └── SettingsPanel/        # toggle solfeo, tema, etc.
│   ├── data/
│   │   └── levels.ts             # configuración estática de niveles
│   ├── types/
│   │   └── midi.d.ts             # tipado de eventos y estructuras
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

### 4.2 Tipado clave (TypeScript)

```typescript
// types/midi.d.ts

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
  octave: number;           // notación científica: C4 = Do central
  midiNumber: number;
  displayName: string;      // ej. "C#4", "Bb3"
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
  intervals: number[];       // semitonos desde la fundamental, ej. [0,4,7]
  inversion?: 0 | 1 | 2;      // 0 = fundamental (root position)
}

export interface LevelTarget {
  type: 'single-note' | 'chord';
  clef?: 'treble' | 'bass' | 'both';
  note?: NoteName;
  chord?: ChordDefinition;
  label: string;              // lo que se muestra al usuario, ej. "F# Major"
}

export interface LevelConfig {
  id: number;
  title: string;
  description: string;
  showKeyboardHelp: boolean;   // ilumina teclas objetivo en el teclado virtual
  showSolfegeBridge: boolean;  // solo true en niveles 0-1
  targets: LevelTarget[];      // secuencia de ejercicios del nivel
  passingCriteria: {
    minCorrect: number;
    maxAttempts?: number;
  };
}
```

### 4.3 `useMidi` — hook de conexión (primera tarea del agente)

Responsabilidades:
- Solicitar acceso MIDI vía `navigator.requestMIDIAccess({ sysex: false })`.
- Enumerar `inputs`, escuchar el Yamaha PSR-E383 (y cualquier otro dispositivo conectado — no hardcodear el nombre del dispositivo, debe funcionar con cualquier teclado MIDI genérico).
- Parsear mensajes MIDI crudos (`onmidimessage`):
  - Status byte `0x90` (144) con velocity > 0 → `noteon`.
  - Status byte `0x80` (128) o `0x90` con velocity 0 → `noteoff` (ambos casos deben tratarse igual, es un comportamiento estándar de MIDI).
  - Ignorar Control Change, Program Change, etc. en v1 (excepto no romper con ellos).
- Mantener un estado global (`ActiveNotesState`) de notas actualmente presionadas, expuesto vía contexto o Zustand.
- Exponer también: `isConnected: boolean`, `deviceName: string | null`, `error: string | null` (para mostrar mensajes claros si el navegador no soporta Web MIDI o si el usuario niega el permiso).
- **Importante:** Web MIDI API solo funciona en navegadores basados en Chromium (Chrome, Edge) y requiere contexto seguro (HTTPS o localhost). El agente debe mostrar un mensaje de error claro si `navigator.requestMIDIAccess` no existe (ej. en Firefox o Safari).

---

## 5. Lógica musical (`core/`)

Esta es la parte más delicada y debe programarse con tests unitarios simples (no requiere un framework de testing pesado; puede ser funciones puras verificadas con un par de `console.assert` o Vitest si el agente quiere ser prolijo).

### 5.1 Conversión MIDI → nombre de nota

- Fórmula base: `octave = Math.floor(midiNumber / 12) - 1`, con **C4 = MIDI 60** (Do central, convención estándar).
- Mapeo de pitch class (0-11) a letra + alteración. Para las teclas negras, la app debe decidir si mostrar sostenido o bemol según el contexto armónico (ver `enharmonics.ts`), no siempre por defecto.
- Regla simple para v1: en modo Sandbox (Nivel 0-3), mostrar el nombre con sostenido por defecto (convención más común para principiantes), pero permitir que el motor de niveles fuerce el bemol cuando el ejercicio lo requiera (ej. "encuentra Bb").

### 5.2 Diccionario de acordes (`chordDictionary.ts`)

Fórmulas de intervalos en semitonos desde la fundamental:

```typescript
export const CHORD_FORMULAS: Record<ChordQuality, number[]> = {
  major:      [0, 4, 7],
  minor:      [0, 3, 7],
  diminished: [0, 3, 6],
  augmented:  [0, 4, 8],
  major7:     [0, 4, 7, 11],
  minor7:     [0, 3, 7, 10],
  dominant7:  [0, 4, 7, 10],
};
```

Con esto se generan programáticamente las 12 tonalidades para cada calidad de acorde (no hay que escribir a mano los 12 x N acordes).

### 5.3 Validador de acordes (`chordDetector.ts`)

- Tomar el set de `midiNumber` activos, reducir a *pitch classes* (`midiNumber % 12`), normalizar y comparar contra el set de intervalos del acorde objetivo (también normalizado, empezando desde la fundamental correspondiente).
- Para niveles de **posición fundamental** (root position): la nota más grave presionada debe corresponder a la fundamental del acorde.
- Para niveles de **inversiones** (Nivel 9+): permitir que la fundamental esté en cualquier voz, pero validar que el set de pitch classes sea exactamente el del acorde (sin notas extra, sin notas faltantes).
- Feedback granular: no solo "correcto/incorrecto", sino estados intermedios como "faltan notas", "sobra una nota", "acorde correcto pero en inversión equivocada" — esto es clave para que el usuario entienda *qué* corrigió o qué le falta.

---

## 6. Componentes visuales

### 6.1 Teclado virtual (`PianoKeyboard`)

- Renderizar dinámicamente 2-5 octavas (ideal: reflejar el rango real detectado del PSR-E383, con scroll horizontal en pantallas chicas/tablet).
- Cada tecla, al recibir `noteon` desde `useMidi`, se ilumina (color distinto para: presionada correctamente = verde, presionada pero no es el objetivo = azul neutro, objetivo no presionado aún = contorno punteado amarillo).
- Mostrar el nombre en inglés sobre cada tecla **solo cuando esté activa** o cuando `showKeyboardHelp` del nivel actual sea `true` (en niveles avanzados esta ayuda se retira, como especifica el PRD original).

### 6.2 Pentagrama dinámico (`StaffDisplay`, con VexFlow)

- Dibujar clave de sol y/o clave de fa según el nivel (algunos niveles solo mano derecha, otros ambas manos simultáneas).
- Traducir el estado de `ActiveNotesState` a objetos `StaveNote` de VexFlow en tiempo real.
- Manejar correctamente las líneas adicionales (ledger lines) para notas fuera del pentagrama.
- Mostrar accidentales (`#`, `b`) según la nota target lo requiera.

### 6.3 HUD de nivel (`LevelHUD`)

- Objetivo actual en texto grande (ej. "Play: F# Minor").
- Contador de aciertos / intentos del nivel.
- Botón "Skip" / "Repeat" para practicar libremente sin penalizar el progreso guardado.

---

## 7. Sistema de niveles (ampliado)

Se mantiene la filosofía de "niveles repetibles infinitamente para practicar", configurados en `data/levels.ts`, pero se detalla y amplía la progresión de acordes que pediste:

| Nivel | Nombre | Contenido |
|---|---|---|
| 0 | Sandbox | Toca cualquier tecla. Se muestra nombre en inglés + (opcional) equivalente en solfeo + ubicación en pentagrama. Sin objetivos. |
| 1 | Teclas blancas | Encontrar C, D, E, F, G, A, B en la octava central bajo demanda. Ayuda visual activa. |
| 2 | Teclas negras | Sostenidos y bemoles: enseñar explícitamente que C#=Db, D#=Eb, etc. (enarmonía). Se apaga el puente de solfeo. |
| 3 | Todo el rango | Ampliar ejercicios a las 5 octavas del PSR-E383, incluyendo notación de octava (C3 vs C4 vs C5). |
| 4 | Tríadas mayores | Fórmula 1-3-5. Se pide una tríada mayor por ejercicio, mostrando la fórmula de intervalos en pantalla. |
| 5 | Tríadas menores | Fórmula 1-b3-5, contraste directo con las mayores ya aprendidas. |
| 6 | Las 12 tonalidades | Mayores y menores con fundamentales alteradas (F# Major, Bb Minor, etc.) — cobertura completa de las 12 notas como fundamental, en ambas calidades. |
| 7 | Disminuidos y aumentados | Introducción a estas dos calidades adicionales como variantes de color armónico. |
| 8 | Separación de manos | Bajo en clave de fa (mano izquierda) + acorde en clave de sol (mano derecha) simultáneos. |
| 9 | Inversiones | Primera y segunda inversión de tríadas ya conocidas, se retira la ayuda visual del teclado. |
| 10 | Lectura pura | Solo se muestra el pentagrama (sin ayuda de teclado ni de texto), el usuario debe identificar y tocar el acorde/nota leyendo la partitura. Modo "examen". |
| 11+ (futuro) | Séptimas y progresiones | major7, minor7, dominant7, y progresiones comunes (I-IV-V-vi) como extensión post-v1. |

Cada `LevelTarget` se genera con una función helper (no se escriben a mano los cientos de combinaciones), ej.:

```typescript
function generateAllMajorTriads(): LevelTarget[] { /* itera 12 fundamentales */ }
```

---

## 8. Persistencia (Zustand + localStorage)

```typescript
interface ProgressState {
  completedLevels: number[];
  bestScores: Record<number, { correct: number; attempts: number }>;
  settings: {
    showSolfegeBridge: boolean;
    preferSharpsOverFlats: boolean;
  };
  markLevelComplete: (levelId: number, score: { correct: number; attempts: number }) => void;
  resetProgress: () => void;
}
```

Usar `zustand/middleware` → `persist` con `name: 'piano-trainer-progress'`. Incluir un botón de "Reset progress" visible en Settings, ya que no hay cuentas de usuario y el localStorage es la única fuente de verdad.

---

## 9. UI/UX — lineamientos

- Diseño **responsive**, probado especialmente en proporciones de tablet apoyada horizontalmente sobre el atril del piano (el caso de uso real del usuario).
- Contraste alto y tipografía grande para las notas objetivo (se leen de reojo mientras se toca).
- Feedback de color consistente en toda la app: verde = correcto, rojo = incorrecto, amarillo/ámbar = objetivo pendiente, azul = información neutra.
- Nada de scroll vertical necesario durante un ejercicio: teclado + pentagrama + HUD deben caber en una sola pantalla.
- Modo oscuro opcional (agradable para practicar de noche), pero no bloqueante para v1.

---

## 10. Plan de fases para el agente de IA (orden de ejecución sugerido)

**Fase 1 — Setup y conexión de hardware**
1. Inicializar proyecto Vite + React + TS + Tailwind.
2. Implementar `useMidi` y una pantalla de diagnóstico simple que solo muestre en texto crudo las notas MIDI que llegan del PSR-E383 (sin teclado visual todavía). Objetivo: confirmar que la conexión funciona antes de construir nada más.

**Fase 2 — Teclado virtual reactivo**
3. Construir `PianoKeyboard` que refleje visualmente `ActiveNotesState` en tiempo real, con nombres de nota en inglés.

**Fase 3 — Motor de lógica musical**
4. Implementar `noteUtils.ts`, `chordDictionary.ts`, `chordDetector.ts`, `enharmonics.ts` como funciones puras, con casos de prueba manuales para al menos: C Major, F# Minor, Bb Major, y una inversión.

**Fase 4 — Pentagrama dinámico**
5. Integrar VexFlow en `StaffDisplay`, alimentado por el mismo `ActiveNotesState`.

**Fase 5 — Sistema de niveles**
6. Definir `levels.ts` (empezando por Niveles 0-3, luego 4-10).
7. Implementar `useLevelEngine` que compare el estado activo contra el `LevelTarget` actual y dispare el feedback correcto/incorrecto/parcial.
8. Conectar `progressStore` (Zustand + persist) para guardar avance.

**Fase 6 — Pulido**
9. Responsive real en tablet, modo settings (toggle solfeo, preferencia sostenidos/bemoles), pantalla de "sin dispositivo MIDI conectado" con instrucciones claras.

**Fase 7 — Validación manual**
10. Checklist de prueba con el PSR-E383 físico conectado (ver sección 11).

---

## 11. Checklist de aceptación (QA manual con el teclado físico)

- [ ] Al conectar el PSR-E383 por USB y abrir la app en Chrome/Edge, el navegador pide permiso MIDI y luego `isConnected` pasa a `true`.
- [ ] Tocar una tecla individual la ilumina en el teclado virtual con el nombre correcto en inglés (ej. tocar la tecla física del Do central muestra "C4", no "Do").
- [ ] Tocar y soltar rápido no deja "notas fantasma" encendidas (verificar el manejo de `noteon` con velocity 0 como `noteoff`).
- [ ] Tocar una tríada de C Mayor (C-E-G simultáneas) la reconoce como correcta en el Nivel 4.
- [ ] Tocar las mismas tres notas pero con G como más grave (segunda inversión) es marcado como "acorde correcto, inversión distinta" en Nivel 9, pero como "correcto" en Nivel 4 (donde no importa la inversión).
- [ ] El pentagrama muestra correctamente sostenidos vs bemoles según lo pida el ejercicio (ej. Nivel 6 pidiendo "Bb Major" no debe mostrar "A#" en la partitura).
- [ ] El progreso persiste después de cerrar y volver a abrir el navegador (localStorage).
- [ ] La app es usable en una tablet en orientación horizontal sin scroll.

---

## 12. Fuera de alcance para v1 (explícito, para que el agente no se desvíe)

- Cuentas de usuario, sincronización en la nube, multi-dispositivo.
- Reconocimiento de audio/micrófono.
- Acompañamiento automático, metrónomo, grabación de sesiones.
- Progresiones armónicas complejas, escalas modales, ritmo/lectura rítmica — quedan para una v2 posterior a los niveles 0-10 aquí descritos.
