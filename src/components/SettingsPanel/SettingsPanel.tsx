import React from 'react';
import { useProgressStore } from '../../store/progressStore';
import { TRANSLATIONS } from '../../data/translations';
import { Settings, Trash2, Globe, Hash, Languages } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, resetProgress } = useProgressStore();
  const language = settings.language || 'es';
  const t = TRANSLATIONS[language].settings;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <Settings className="w-5 h-5 text-blue-400" />
            {t.title}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-bold text-sm bg-slate-800 px-3 py-1 rounded-lg"
          >
            {t.done}
          </button>
        </div>

        <div className="space-y-4">
          {/* Language Selector Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-3 pr-2">
              <Languages className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-slate-200">{t.languageTitle}</div>
                <div className="text-xs text-slate-400 leading-tight">{t.languageDesc}</div>
              </div>
            </div>

            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
              <button
                onClick={() => updateSettings({ language: 'es' })}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  language === 'es' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                ES
              </button>
              <button
                onClick={() => updateSettings({ language: 'en' })}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  language === 'en' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Solfège Bridge Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-3 pr-2">
              <Globe className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-slate-200">{t.solfegeTitle}</div>
                <div className="text-xs text-slate-400 leading-tight">{t.solfegeDesc}</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.showSolfegeBridge}
              onChange={(e) => updateSettings({ showSolfegeBridge: e.target.checked })}
              className="w-5 h-5 rounded accent-blue-600 cursor-pointer shrink-0"
            />
          </div>

          {/* Accidental Notation Preference */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-3 pr-2">
              <Hash className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-slate-200">{t.sharpsTitle}</div>
                <div className="text-xs text-slate-400 leading-tight">{t.sharpsDesc}</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.preferSharpsOverFlats}
              onChange={(e) => updateSettings({ preferSharpsOverFlats: e.target.checked })}
              className="w-5 h-5 rounded accent-blue-600 cursor-pointer shrink-0"
            />
          </div>
        </div>

        {/* Danger Zone: Reset Progress */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={() => {
              if (window.confirm(t.resetConfirm)) {
                resetProgress();
                onClose();
              }
            }}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            {t.resetTitle}
          </button>
        </div>
      </div>
    </div>
  );
};
