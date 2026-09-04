import React from 'react';
import { CameraSolution, LessonPlan } from '../types';
import { Download, FileText, Camera, Trash2, Wifi, WifiOff, CheckCircle2 } from 'lucide-react';

interface OfflineStorageDrawerProps {
  savedSolutions: (CameraSolution & { id: string; image: string; date: string })[];
  savedLessons: LessonPlan[];
  isOffline: boolean;
  onClearSolutions: () => void;
}

export const OfflineStorageDrawer: React.FC<OfflineStorageDrawerProps> = ({
  savedSolutions,
  savedLessons,
  isOffline,
  onClearSolutions
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 border border-amber-500/40 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950">
              Offline Cache Engine
            </span>
            <span className="text-xs text-amber-200">
              {isOffline ? 'Offline Mode Active' : 'Online Sync Active'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Downloaded Worksheets & Saved Lessons 📥
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Access your saved camera solutions, step-by-step guides, and offline lesson plans anytime without an internet connection.
          </p>
        </div>

        {savedSolutions.length > 0 && (
          <button
            onClick={onClearSolutions}
            className="text-xs text-rose-300 hover:text-rose-200 bg-rose-950/60 border border-rose-800 px-3 py-2 rounded-xl flex items-center gap-1.5 font-bold"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Offline Cache
          </button>
        )}
      </div>

      {/* Grid: Saved Camera Solutions & Saved Offline Lessons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Saved Camera Solutions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl space-y-4">
          <h3 className="text-base font-bold flex items-center gap-2 text-amber-300">
            <Camera className="w-5 h-5 text-amber-400" />
            Saved Homework Solutions ({savedSolutions.length})
          </h3>

          {savedSolutions.length > 0 ? (
            <div className="space-y-3">
              {savedSolutions.map((sol) => (
                <div key={sol.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase">{sol.detectedTopic}</span>
                    <span className="text-[10px] text-slate-500">{sol.date}</span>
                  </div>

                  <h4 className="font-bold text-sm text-white line-clamp-1">{sol.problemText}</h4>
                  <p className="text-xs text-slate-300 line-clamp-2">{sol.explanation}</p>

                  <div className="pt-2 flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Ready Offline
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 bg-slate-950/50 rounded-xl">
              No homework solutions saved for offline view yet. Click "Save Offline" on any camera analysis!
            </div>
          )}
        </div>

        {/* Saved Offline Lessons */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl space-y-4">
          <h3 className="text-base font-bold flex items-center gap-2 text-indigo-300">
            <FileText className="w-5 h-5 text-indigo-400" />
            Downloaded Interactive Lessons ({savedLessons.length})
          </h3>

          {savedLessons.length > 0 ? (
            <div className="space-y-3">
              {savedLessons.map((les) => (
                <div key={les.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300 uppercase">{les.subject} • {les.grade}</span>
                    <span className="text-[10px] text-amber-300 font-bold">{les.duration}</span>
                  </div>

                  <h4 className="font-bold text-sm text-white">{les.title}</h4>
                  <p className="text-xs text-slate-300 line-clamp-2">{les.summary}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 bg-slate-950/50 rounded-xl">
              No offline lessons downloaded yet. Click the download icon on any adaptive lesson card!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
