import React, { useState } from 'react';
import { SUBJECT_CATEGORIES, MANUAL_CUSTOM_OPTION } from '../utils/subjects';
import { useSpeechRecognition } from '../utils/useSpeechRecognition';
import { BookOpen, Edit3, Mic, MicOff, Check, Sparkles } from 'lucide-react';

interface SubjectSelectProps {
  value: string;
  onChange: (subject: string) => void;
  language?: string;
  label?: string;
  className?: string;
  showQuickChips?: boolean;
}

export const SubjectSelect: React.FC<SubjectSelectProps> = ({
  value,
  onChange,
  language = 'English',
  label = 'Select or Enter Subject:',
  className = '',
  showQuickChips = true
}) => {
  const [isManualMode, setIsManualMode] = useState<boolean>(
    !SUBJECT_CATEGORIES.some(cat => cat.subjects.includes(value)) && value !== '' && value !== 'All'
  );
  const [customSubjectText, setCustomSubjectText] = useState<string>(isManualMode ? value : '');

  const { isListening, isSupported, startListening, stopListening } = useSpeechRecognition((text) => {
    setCustomSubjectText(text);
    onChange(text);
  });

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === MANUAL_CUSTOM_OPTION) {
      setIsManualMode(true);
      if (customSubjectText) {
        onChange(customSubjectText);
      }
    } else {
      setIsManualMode(false);
      onChange(val);
    }
  };

  const handleCustomTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setCustomSubjectText(text);
    onChange(text);
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      setIsManualMode(true);
      startListening(language);
    }
  };

  const topChips = ['Math (General)', 'Science (General)', 'Reading & Comprehension', 'Coding & Computer Science', 'World & US History'];

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            {label}
          </label>
          <button
            type="button"
            onClick={() => {
              const nextMode = !isManualMode;
              setIsManualMode(nextMode);
              if (nextMode && customSubjectText) {
                onChange(customSubjectText);
              }
            }}
            className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-lg"
          >
            <Edit3 className="w-3 h-3 text-amber-400" />
            {isManualMode ? 'Choose from List' : 'Enter Custom Subject'}
          </button>
        </div>
      )}

      {/* Quick Subject Chips if enabled */}
      {showQuickChips && !isManualMode && (
        <div className="flex flex-wrap items-center gap-1.5 pb-1">
          {topChips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => {
                setIsManualMode(false);
                onChange(chip);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                value === chip
                  ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Dropdown or Manual Enter Input Box */}
      {!isManualMode ? (
        <div className="relative">
          <select
            value={value}
            onChange={handleDropdownChange}
            className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white appearance-none cursor-pointer pr-8"
          >
            <option value="" disabled>-- Select a Subject from List --</option>
            {SUBJECT_CATEGORIES.map((cat) => (
              <optgroup key={cat.category} label={`📚 ${cat.category}`}>
                {cat.subjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </optgroup>
            ))}
            <option value={MANUAL_CUSTOM_OPTION} className="text-amber-400 font-bold bg-slate-900">
              ✍️ Enter Custom / Manual Subject...
            </option>
          </select>
          <div className="pointer-events-none absolute right-3 top-2.5 text-slate-400 text-xs">
            ▼
          </div>
        </div>
      ) : (
        /* MANUAL ENTER BOX */
        <div className="space-y-1.5 bg-slate-950 p-2.5 rounded-xl border border-amber-400/50 shadow-lg animate-fade-in">
          <div className="flex items-center justify-between text-[11px] text-amber-300 font-semibold mb-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Manual Custom Subject Input Box
            </span>
            <span className="text-[10px] text-slate-400">Type any subject name</span>
          </div>

          <div className="relative flex items-center">
            <input
              type="text"
              placeholder={isListening ? '🎙️ Speak subject name...' : 'e.g. Organic Chemistry, Quantum Physics, Spanish Grammar...'}
              value={customSubjectText}
              onChange={handleCustomTextChange}
              autoFocus
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 pr-16"
            />

            <div className="absolute right-1.5 flex items-center gap-1">
              {isSupported && (
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  title={isListening ? 'Stop Voice Input' : 'Speak Custom Subject'}
                  className={`p-1.5 rounded-md transition-all ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              )}

              {customSubjectText && (
                <span className="p-1 text-emerald-400 font-bold text-xs" title="Subject set!">
                  <Check className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
