import React, { useState } from 'react';
import { StudentProfile, AiRecommendation, GradeLevel } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  AlertCircle, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  Users, 
  Download, 
  Award 
} from 'lucide-react';

interface ParentTeacherDashboardProps {
  students: StudentProfile[];
  selectedGrade: GradeLevel;
  recommendations: AiRecommendation[];
}

export const ParentTeacherDashboard: React.FC<ParentTeacherDashboardProps> = ({
  students,
  selectedGrade,
  recommendations
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');

  const activeStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  // Prepare Recharts Data
  const masteryData = activeStudent
    ? Object.entries(activeStudent.subjectMastery).map(([subject, score]) => ({
        subject,
        score
      }))
    : [];

  const weeklyPracticeData = [
    { day: 'Mon', minutes: 25, score: 88 },
    { day: 'Tue', minutes: 35, score: 92 },
    { day: 'Wed', minutes: 40, score: 85 },
    { day: 'Thu', minutes: 30, score: 94 },
    { day: 'Fri', minutes: 50, score: 96 },
    { day: 'Sat', minutes: 20, score: 90 },
    { day: 'Sun', minutes: 45, score: 98 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border border-cyan-800/40 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/30 text-cyan-200 border border-cyan-500/40">
              Parent & Teacher Progress Dashboard
            </span>
            <span className="text-xs text-cyan-200">Real-time Student Metrics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Student Analytics & AI Insights 📊
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Track subject mastery, weekly study minutes, weak concept alerts, and AI-driven practice recommendations for each student.
          </p>
        </div>

        {/* Student Selector Switcher */}
        <div className="bg-slate-900 border border-slate-800 p-2 rounded-xl flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400 ml-1" />
          <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Select Student:</span>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="bg-slate-950 text-xs font-bold text-white px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none"
          >
            {students.map((st) => (
              <option key={st.id} value={st.id}>
                {st.name} ({st.grade})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Top Metric Cards */}
      {activeStudent && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-white shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-1">
              <span>Overall Average Mastery</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-extrabold text-emerald-400">
              {Math.round(
                (Object.values(activeStudent.subjectMastery) as number[]).reduce((a: number, b: number) => a + b, 0) /
                  (Object.values(activeStudent.subjectMastery) as number[]).length
              )}
              %
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Based on quiz & camera accuracy</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-white shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-1">
              <span>Total Practice Time</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-extrabold text-amber-300">
              {Math.floor(activeStudent.totalPracticeTimeMinutes / 60)}h {activeStudent.totalPracticeTimeMinutes % 60}m
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Cumulative study duration</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-white shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-1">
              <span>Completed Lessons</span>
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-extrabold text-indigo-300">
              {activeStudent.completedLessons} Lessons
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Adaptive modules finished</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-white shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-1">
              <span>Learning Streak</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-extrabold text-amber-400">
              {activeStudent.streak} Days 🔥
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Consistent daily learning</p>
          </div>
        </div>
      )}

      {/* Main Charts & Weak Concept Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recharts Subject Mastery Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-base font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              Subject Mastery Score (%)
            </h3>
            <span className="text-xs text-slate-400">Student: {activeStudent.name}</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={masteryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  itemStyle={{ color: '#38bdf8', fontWeight: 'bold' }}
                />
                <Bar dataKey="score" fill="#38bdf8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Weak Area Alerts & Strengths (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl space-y-5">
          <h3 className="text-base font-bold flex items-center gap-2 text-amber-300">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            Weak Area Alerts & Strengths
          </h3>

          {/* Weak Topics */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Needs Practice Attention:
            </p>
            <div className="space-y-1.5">
              {activeStudent.weakTopics.map((topic, i) => (
                <div key={i} className="bg-rose-950/40 border border-rose-800/40 rounded-xl p-2.5 text-xs text-rose-200 font-medium">
                  ⚠️ {topic}
                </div>
              ))}
            </div>
          </div>

          {/* Strong Topics */}
          <div className="space-y-2 pt-2">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Excelling Mastered Topics:
            </p>
            <div className="space-y-1.5">
              {activeStudent.strongTopics.map((topic, i) => (
                <div key={i} className="bg-emerald-950/40 border border-emerald-800/40 rounded-xl p-2.5 text-xs text-emerald-200 font-medium">
                  🌟 {topic}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-base font-bold flex items-center gap-2 text-indigo-300">
            <Sparkles className="w-5 h-5 text-amber-400" />
            AI-Driven Study Recommendations
          </h3>
          <span className="text-xs text-slate-400">Adaptive algorithm output</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {rec.category}
                </span>
                <span className="text-[10px] font-extrabold text-indigo-300">+{rec.xpBonus} XP Bonus</span>
              </div>

              <h4 className="text-sm font-bold text-white">{rec.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{rec.reason}</p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <span>⏱️ {rec.estimatedMinutes} mins</span>
                <span className="font-bold text-amber-400">{rec.difficulty}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
