import React from 'react';
import { Cable, WifiOff, Terminal } from 'lucide-react';
import { useProgressStore } from '../../store/progressStore';
import { TRANSLATIONS } from '../../data/translations';

interface MidiStatusBadgeProps {
  isConnected: boolean;
  deviceName: string | null;
  error: string | null;
  onOpenDiagnostic: () => void;
}

export const MidiStatusBadge: React.FC<MidiStatusBadgeProps> = ({
  isConnected,
  deviceName,
  error,
  onOpenDiagnostic,
}) => {
  const language = useProgressStore((state) => state.settings.language) || 'es';
  const t = TRANSLATIONS[language].status;

  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
          isConnected
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            : error
            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
        }`}
      >
        <span className="relative flex h-2 w-2">
          {isConnected && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isConnected ? 'bg-emerald-500' : error ? 'bg-rose-500' : 'bg-amber-500'
            }`}
          />
        </span>

        {isConnected ? (
          <div className="flex items-center gap-1.5">
            <Cable className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate max-w-[140px] sm:max-w-xs">{deviceName || t.connected}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.virtual}</span>
          </div>
        )}
      </div>

      {/* Hardware Diagnostic Trigger */}
      <button
        onClick={onOpenDiagnostic}
        className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700/60"
        title={t.diagnostic}
      >
        <Terminal className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
