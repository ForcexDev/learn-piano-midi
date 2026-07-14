import React from 'react';
import { Terminal, X, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react';
import { useProgressStore } from '../../store/progressStore';
import { TRANSLATIONS } from '../../data/translations';

interface DiagnosticViewProps {
  isOpen: boolean;
  onClose: () => void;
  isConnected: boolean;
  deviceName: string | null;
  error: string | null;
  rawLogs: string[];
}

export const DiagnosticView: React.FC<DiagnosticViewProps> = ({
  isOpen,
  onClose,
  isConnected,
  deviceName,
  error,
  rawLogs,
}) => {
  const language = useProgressStore((state) => state.settings.language) || 'es';
  const t = TRANSLATIONS[language].diagnostic;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5 text-white font-bold text-lg">
            <Terminal className="w-5 h-5 text-emerald-400" />
            {t.title}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Hardware Connection Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300">{t.device}</span>
              {isConnected ? (
                <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t.active}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {t.disconnected}
                </span>
              )}
            </div>
            <p className="text-slate-400 text-xs">
              Device Name: <span className="text-white font-mono">{deviceName || t.none}</span>
            </p>
            {error && (
              <p className="text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/30 font-mono text-[11px]">
                {error}
              </p>
            )}
          </div>

          {/* Yamaha Setup Guide */}
          <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-900/50 space-y-2">
            <div className="font-bold text-blue-300 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              {t.guideTitle}
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>{t.guide1}</li>
              <li>{t.guide2}</li>
              <li>{t.guide3}</li>
              <li>{t.guide4}</li>
            </ul>
          </div>

          {/* Event Console Stream */}
          <div className="space-y-1.5">
            <div className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
              {t.logsTitle}
            </div>
            <div className="bg-slate-950 font-mono text-emerald-400 p-3 rounded-xl border border-slate-800 h-40 overflow-y-auto space-y-1">
              {rawLogs.length === 0 ? (
                <span className="text-slate-600 italic">{t.noLogs}</span>
              ) : (
                rawLogs.map((log, index) => (
                  <div key={index} className="leading-tight">
                    &gt; {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
