import React, { useState } from 'react';
import { useMidi } from './hooks/useMidi';
import { useLevelEngine } from './hooks/useLevelEngine';
import { useProgressStore } from './store/progressStore';
import { TRANSLATIONS } from './data/translations';
import { PianoKeyboard } from './components/PianoKeyboard/PianoKeyboard';
import { StaffDisplay } from './components/StaffDisplay/StaffDisplay';
import { LevelHUD } from './components/LevelHUD/LevelHUD';
import { MidiStatusBadge } from './components/MidiStatusBadge/MidiStatusBadge';
import { LevelSelector } from './components/LevelSelector/LevelSelector';
import { SettingsPanel } from './components/SettingsPanel/SettingsPanel';
import { DiagnosticView } from './components/DiagnosticView/DiagnosticView';
import { TheoryGuide } from './components/TheoryGuide/TheoryGuide';
import { Music, Settings, ListMusic, Trophy, RotateCcw, ArrowRight, BookOpen, Globe } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = useState<'practice' | 'guide'>('practice');
  const { settings, updateSettings } = useProgressStore();
  const language = settings.language || 'es';
  const t = TRANSLATIONS[language];

  const {
    activeNotes,
    isConnected,
    deviceName,
    error: midiError,
    triggerSimulatedNoteOn,
    triggerSimulatedNoteOff,
    rawLogs,
  } = useMidi();

  const {
    currentLevel,
    currentTarget,
    targetIndex,
    totalTargets,
    evaluation,
    score,
    isLevelCompleted,
    selectLevel,
    nextTarget,
    repeatTarget,
    restartLevel,
  } = useLevelEngine(activeNotes);

  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);

  if (currentView === 'guide') {
    return <TheoryGuide onBackToTrainer={() => setCurrentView('practice')} />;
  }

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans overflow-hidden selection:bg-blue-600">
      {/* Top Navbar */}
      <header className="w-full bg-slate-900/90 backdrop-blur border-b border-slate-800/80 px-4 md:px-8 py-2 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Music className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm md:text-base font-extrabold tracking-tight text-white leading-tight">
              {t.navbar.title}
            </h1>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              {t.navbar.subtitle}
            </p>
          </div>
        </div>

        {/* Status Badge & Control Buttons */}
        <div className="flex items-center gap-2">
          <MidiStatusBadge
            isConnected={isConnected}
            deviceName={deviceName}
            error={midiError}
            onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
          />

          {/* Quick Language Toggle Pill */}
          <button
            onClick={() => updateSettings({ language: language === 'es' ? 'en' : 'es' })}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700/80"
            title="Toggle Language (ES / EN)"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span className="uppercase">{language}</span>
          </button>

          <button
            onClick={() => setCurrentView('guide')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-bold transition-all border border-indigo-500/30"
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">{t.navbar.theoryHub}</span>
          </button>

          <button
            onClick={() => setIsLevelModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-bold transition-all border border-blue-500/30"
          >
            <ListMusic className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">{t.navbar.levels}</span>
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/80"
            title={t.navbar.settings}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Studio Workspace - 0 Scroll No Overflow Layout */}
      <main className="flex-1 w-full max-w-[1920px] mx-auto px-2 sm:px-4 py-1 flex flex-col justify-between items-center gap-1 overflow-hidden">
        {/* Top HUD Card */}
        <div className="w-full flex justify-center">
          <LevelHUD
            level={currentLevel}
            target={currentTarget}
            targetIndex={targetIndex}
            totalTargets={totalTargets}
            evaluation={evaluation}
            score={score}
            onNextTarget={nextTarget}
            onRepeatTarget={repeatTarget}
            onOpenLevelModal={() => setIsLevelModalOpen(true)}
          />
        </div>

        {/* Center Authentic Grand Staff Display */}
        <div className="w-full flex justify-center items-center py-1">
          <StaffDisplay
            activeNotes={activeNotes}
            target={currentTarget}
            clef="both"
          />
        </div>

        {/* Bottom Full-Width Piano Keyboard */}
        <div className="w-full px-1 sm:px-2">
          <PianoKeyboard
            activeNotes={activeNotes}
            target={currentTarget}
            showKeyboardHelp={currentLevel.showKeyboardHelp}
            showSolfegeBridge={currentLevel.showSolfegeBridge}
            onNoteOn={triggerSimulatedNoteOn}
            onNoteOff={triggerSimulatedNoteOff}
          />
        </div>
      </main>

      {/* Level Selector Modal */}
      <LevelSelector
        isOpen={isLevelModalOpen}
        onClose={() => setIsLevelModalOpen(false)}
        currentLevelId={currentLevel.id}
        onSelectLevel={selectLevel}
      />

      {/* Settings Drawer */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Hardware Diagnostic Modal */}
      <DiagnosticView
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
        isConnected={isConnected}
        deviceName={deviceName}
        error={midiError}
        rawLogs={rawLogs}
      />

      {/* Level Completed Celebration Modal */}
      {isLevelCompleted && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <Trophy className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">{t.celebration.title}</h3>
              <p className="text-slate-400 text-sm">
                {t.celebration.message} <span className="text-emerald-400 font-bold">{currentLevel.title[language]}</span> {t.celebration.correctAnswers}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={restartLevel}
                className="flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700/80"
              >
                <RotateCcw className="w-4 h-4" />
                {t.celebration.practiceAgain}
              </button>
              {currentLevel.id < 10 && (
                <button
                  onClick={() => selectLevel(currentLevel.id + 1)}
                  className="flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30"
                >
                  {t.celebration.nextLevel}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
