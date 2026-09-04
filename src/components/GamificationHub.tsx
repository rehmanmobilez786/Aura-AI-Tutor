import React, { useState } from 'react';
import { StudentProfile, Badge } from '../types';
import { 
  Trophy, 
  Award, 
  Star, 
  Flame, 
  Zap, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  UserCheck, 
  ShieldCheck, 
  Smile, 
  Bot, 
  Compass, 
  Rocket 
} from 'lucide-react';

interface GamificationHubProps {
  student: StudentProfile;
  onUpdateAvatar: (avatarUrl: string) => void;
  onClaimBadgeReward: (badgeId: string, xpReward: number) => void;
}

export const GamificationHub: React.FC<GamificationHubProps> = ({
  student,
  onUpdateAvatar,
  onClaimBadgeReward
}) => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const avatars = [
    { title: 'Friendly Dino 🦕', url: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=200&q=80' },
    { title: 'Astronaut Kid 🚀', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80' },
    { title: 'Tech Explorer 🤖', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80' },
    { title: 'Clever Fox 🦊', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' }
  ];

  const dailyQuests = [
    { id: 'q1', title: 'Snap & Analyze 1 Homework Photo', xp: 50, completed: true },
    { id: 'q2', title: 'Complete 1 Adaptive Lesson Step', xp: 80, completed: true },
    { id: 'q3', title: 'Post or Answer in Peer Forum', xp: 100, completed: false }
  ];

  const nextLevelXp = student.level * 500;
  const currentLevelProgress = Math.min(100, Math.floor((student.xp / nextLevelXp) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 border border-amber-500/40 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-xl"
            />
            <span className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-950 font-extrabold text-xs px-2 py-0.5 rounded-full border border-slate-900 shadow">
              Lvl {student.level}
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              {student.name}
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </h1>
            <p className="text-xs text-amber-200 mt-0.5 font-medium">Grade: {student.grade} • Explorer Status</p>

            {/* Level XP Bar */}
            <div className="mt-3 w-64 sm:w-80">
              <div className="flex justify-between text-[11px] font-bold text-amber-200 mb-1">
                <span>XP Progress</span>
                <span>{student.xp} / {nextLevelXp} XP</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-amber-500/30">
                <div
                  className="bg-gradient-to-r from-amber-400 via-amber-300 to-indigo-400 h-full transition-all duration-500"
                  style={{ width: `${currentLevelProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Gamification Stats Counter Bar */}
        <div className="grid grid-cols-3 gap-3 text-center bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
          <div className="px-3">
            <div className="flex items-center justify-center gap-1 text-amber-400 font-extrabold text-lg">
              <Flame className="w-5 h-5 animate-bounce fill-amber-400" /> {student.streak}
            </div>
            <p className="text-[11px] text-slate-400 font-semibold">Day Streak</p>
          </div>

          <div className="px-3 border-x border-slate-800">
            <div className="flex items-center justify-center gap-1 text-amber-300 font-extrabold text-lg">
              <Star className="w-5 h-5 fill-amber-300" /> {student.stars}
            </div>
            <p className="text-[11px] text-slate-400 font-semibold">Stars Earned</p>
          </div>

          <div className="px-3">
            <div className="flex items-center justify-center gap-1 text-indigo-300 font-extrabold text-lg">
              <Trophy className="w-5 h-5" /> {student.badges.filter((b) => b.unlocked).length}
            </div>
            <p className="text-[11px] text-slate-400 font-semibold">Badges</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Avatar Customizer & Daily Quests (Left) / Badges Wall (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Avatar Selection & Daily Quests */}
        <div className="lg:col-span-5 space-y-5">
          {/* Daily Learning Quests */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2 text-amber-300 uppercase tracking-wider">
              <Zap className="w-4 h-4 text-amber-400" />
              Daily Learning Quests
            </h3>

            <div className="space-y-2.5">
              {dailyQuests.map((q) => (
                <div
                  key={q.id}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    q.completed
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2
                      className={`w-5 h-5 ${q.completed ? 'text-emerald-400' : 'text-slate-600'}`}
                    />
                    <span className="text-xs font-semibold">{q.title}</span>
                  </div>
                  <span className="text-xs font-extrabold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    +{q.xp} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Avatar Switcher */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Smile className="w-4 h-4 text-amber-400" />
              Customize Student Avatar
            </h3>
            <div className="grid grid-cols-2 gap-3 pt-1">
              {avatars.map((av, idx) => (
                <button
                  key={idx}
                  onClick={() => onUpdateAvatar(av.url)}
                  className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                    student.avatar === av.url
                      ? 'bg-amber-400/20 border-amber-400 text-amber-200 font-bold scale-105'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <img src={av.url} alt={av.title} className="w-10 h-10 rounded-lg object-cover" />
                  <span className="text-xs line-clamp-1">{av.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Badges Showcase Wall */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold flex items-center gap-2 text-white">
                <Trophy className="w-5 h-5 text-amber-400" />
                Achievement Badges Showcase
              </h3>
              <p className="text-xs text-slate-400">Earn badges by completing camera analyses, quizzes, and helping peers!</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {student.badges.map((badge) => (
              <div
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex items-start gap-3.5 ${
                  badge.unlocked
                    ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border-amber-400/50 hover:border-amber-400'
                    : 'bg-slate-950/60 border-slate-800/80 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                    badge.unlocked
                      ? 'bg-amber-400/20 border-amber-400/50 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-600'
                  }`}
                >
                  {badge.unlocked ? <Award className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{badge.title}</h4>
                    <span className="text-[10px] font-extrabold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded">
                      +{badge.xpReward} XP
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">{badge.description}</p>

                  <div className="mt-2 text-[10px] font-bold">
                    {badge.unlocked ? (
                      <span className="text-emerald-400">✓ Unlocked {badge.dateUnlocked || 'Recently'}</span>
                    ) : (
                      <span className="text-slate-500">🔒 Locked Badge</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
