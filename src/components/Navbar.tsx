import React from 'react';
import { GradeLevel, UserRole, Language, StudentProfile } from '../types';
import { 
  Sparkles, 
  Camera, 
  BookOpen, 
  Trophy, 
  Users, 
  BarChart3, 
  Briefcase, 
  Flame, 
  Star, 
  Globe, 
  Wifi, 
  WifiOff, 
  GraduationCap, 
  Download 
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  selectedGrade: GradeLevel;
  setSelectedGrade: (grade: GradeLevel) => void;
  selectedRole: UserRole;
  setSelectedRole: (role: UserRole) => void;
  selectedLanguage: Language;
  setSelectedLanguage: (lang: Language) => void;
  student: StudentProfile;
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  offlineCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  selectedGrade,
  setSelectedGrade,
  selectedRole,
  setSelectedRole,
  selectedLanguage,
  setSelectedLanguage,
  student,
  isOffline,
  setIsOffline,
  offlineCount
}) => {
  const grades: GradeLevel[] = ['KG', 'Grade 1-3', 'Grade 4-8', 'Grade 9-12', 'Higher Ed'];
  const languages: Language[] = ['English', 'Spanish', 'French', 'Hindi', 'Mandarin', 'Arabic', 'German', 'Japanese'];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 text-white shadow-xl">
      {/* Top Bar: Settings, Role Switcher, Grade Switcher, Language & Gamification Status */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm border-b border-slate-800/80">
        {/* Logo & Platform Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-400 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="font-bold text-base tracking-tight flex items-center gap-1.5">
              <span className="bg-gradient-to-r from-amber-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                Aura AI Tutor
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                KG – Higher Ed
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">Real-time Visual Assistant & Adaptive Learning</p>
          </div>
        </div>

        {/* Middle Selectors: Grade Level & Role Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
          {/* Grade Selector */}
          <div className="flex items-center bg-slate-800/90 rounded-lg p-1 border border-slate-700/60">
            <GraduationCap className="w-3.5 h-3.5 text-amber-400 ml-1.5 mr-1 hidden sm:block" />
            <span className="text-[11px] text-slate-400 font-medium mr-1.5 hidden md:inline">Grade:</span>
            <div className="flex gap-1">
              {grades.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    selectedGrade === g
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20 scale-105'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center bg-slate-800/90 rounded-lg p-1 border border-slate-700/60">
            <span className="text-[11px] text-slate-400 font-medium ml-1.5 mr-1 hidden lg:inline">Role:</span>
            <button
              onClick={() => setSelectedRole('student')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                selectedRole === 'student'
                  ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              👦 Student
            </button>
            <button
              onClick={() => setSelectedRole('parent')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                selectedRole === 'parent'
                  ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              👨‍👩‍👧 Parent
            </button>
            <button
              onClick={() => setSelectedRole('teacher')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                selectedRole === 'teacher'
                  ? 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-600/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              👩‍🏫 Tutor
            </button>
          </div>
        </div>

        {/* Right Section: Language Picker, Gamification Pills, Offline Mode */}
        <div className="flex items-center gap-2.5">
          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60 text-xs">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as Language)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer pr-1"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang} className="bg-slate-900 text-slate-100">
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Gamification Pills */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 px-2.5 py-1 rounded-lg font-bold text-xs">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
              <span>{student.streak}d Streak</span>
            </div>

            <div className="flex items-center gap-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 px-2.5 py-1 rounded-lg font-bold text-xs">
              <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>{student.stars} ⭐</span>
            </div>

            <div className="flex items-center gap-1 bg-purple-500/20 border border-purple-500/30 text-purple-200 px-2 py-1 rounded-lg font-bold text-xs">
              <span>Lvl {student.level}</span>
            </div>
          </div>

          {/* Offline Toggle Badge */}
          <button
            onClick={() => setIsOffline(!isOffline)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
              isOffline
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
            title="Toggle Simulated Offline Mode"
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isOffline ? 'Offline Mode' : 'Online'}</span>
            {offlineCount > 0 && (
              <span className="ml-1 bg-amber-400 text-slate-950 font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                {offlineCount} saved
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto py-1">
        <button
          onClick={() => setCurrentTab('camera')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            currentTab === 'camera'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Camera className="w-4 h-4 text-amber-300" />
          <span>Camera Vision Homework Help</span>
          {selectedGrade === 'KG' && <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-1.5 rounded">Kids Mode</span>}
        </button>

        <button
          onClick={() => setCurrentTab('lessons')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            currentTab === 'lessons'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <BookOpen className="w-4 h-4 text-indigo-300" />
          <span>Adaptive Lessons</span>
        </button>

        <button
          onClick={() => setCurrentTab('forum')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            currentTab === 'forum'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-300" />
          <span>Peer Forum</span>
        </button>

        <button
          onClick={() => setCurrentTab('rewards')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            currentTab === 'rewards'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Rewards & Badges</span>
        </button>

        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            currentTab === 'dashboard'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-cyan-300" />
          <span>Parent/Teacher Dashboard</span>
        </button>

        <button
          onClick={() => setCurrentTab('workspace')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            currentTab === 'workspace'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Briefcase className="w-4 h-4 text-purple-300" />
          <span>Premium Tutor Workspace</span>
        </button>

        <button
          onClick={() => setCurrentTab('offline')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ml-auto ${
            currentTab === 'offline'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Download className="w-4 h-4 text-amber-300" />
          <span>Downloads & Offline</span>
        </button>
      </div>
    </header>
  );
};
