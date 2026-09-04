import React, { useState } from 'react';
import { GradeLevel, Subject, TeacherAssignment, ScheduleSession, StudentProfile } from '../types';
import { SubjectSelect } from './SubjectSelect';
import { 
  Briefcase, 
  Calendar, 
  PlusCircle, 
  CheckCircle2, 
  Award, 
  Clock, 
  FileText, 
  Users, 
  Sparkles, 
  ChevronRight, 
  Star 
} from 'lucide-react';

interface TutorWorkspaceViewProps {
  grade: GradeLevel;
  assignments: TeacherAssignment[];
  sessions: ScheduleSession[];
  students: StudentProfile[];
  onAddAssignment: (assignment: TeacherAssignment) => void;
  onAddSession: (session: ScheduleSession) => void;
  onAwardBonusStars: (studentId: string, stars: number) => void;
}

export const TutorWorkspaceView: React.FC<TutorWorkspaceViewProps> = ({
  grade,
  assignments,
  sessions,
  students,
  onAddAssignment,
  onAddSession,
  onAwardBonusStars
}) => {
  const [activeTab, setActiveTab] = useState<'assignments' | 'schedule' | 'badges'>('assignments');
  
  // New Assignment Form State
  const [isAsgModalOpen, setIsAsgModalOpen] = useState<boolean>(false);
  const [asgTitle, setAsgTitle] = useState<string>('');
  const [asgSubject, setAsgSubject] = useState<Subject>('Math');
  const [asgDueDate, setAsgDueDate] = useState<string>('2026-08-01');
  const [asgDesc, setAsgDesc] = useState<string>('');

  // New Schedule Session Form State
  const [isSchModalOpen, setIsSchModalOpen] = useState<boolean>(false);
  const [schStudent, setSchStudent] = useState<string>(students[0]?.name || 'Maya Lin');
  const [schDate, setSchDate] = useState<string>('2026-07-31');
  const [schTime, setSchTime] = useState<string>('03:00 PM');
  const [schTopic, setSchTopic] = useState<string>('Math Homework Review');

  const handleCreateAssignment = () => {
    if (!asgTitle || !asgDesc) return;
    const newAsg: TeacherAssignment = {
      id: 'asg-' + Date.now(),
      title: asgTitle,
      grade,
      subject: asgSubject,
      dueDate: asgDueDate,
      assignedCount: 20,
      completedCount: 0,
      avgScore: 0,
      description: asgDesc
    };
    onAddAssignment(newAsg);
    setIsAsgModalOpen(false);
    setAsgTitle('');
    setAsgDesc('');
  };

  const handleCreateSession = () => {
    if (!schTopic) return;
    const newSch: ScheduleSession = {
      id: 'sch-' + Date.now(),
      title: `Live Tutoring: ${schTopic}`,
      studentName: schStudent,
      grade,
      date: schDate,
      time: schTime,
      status: 'Scheduled',
      topic: schTopic
    };
    onAddSession(newSch);
    setIsSchModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Premium Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-800/40 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/30 text-purple-200 border border-purple-500/40">
              Premium Tutor Workspace
            </span>
            <span className="text-xs text-purple-200">Teacher & Instructor Control Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Manage Class Assignments & Schedule 👩‍🏫
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Track student submissions, assign interactive homework, manage tutoring calendars, and reward top performing students with bonus stars!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAsgModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> Assign Homework
          </button>
          <button
            onClick={() => setIsSchModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4" /> Schedule Session
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-800 gap-2 pb-1">
        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'assignments'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" /> Class Assignments ({assignments.length})
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'schedule'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" /> Tutoring Schedule ({sessions.length})
        </button>
        <button
          onClick={() => setActiveTab('badges')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'badges'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4 text-amber-300" /> Award Student Bonus Stars
        </button>
      </div>

      {/* TAB 1: Class Homework Assignments */}
      {activeTab === 'assignments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {assignments.map((asg) => (
            <div
              key={asg.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {asg.subject} • {asg.grade}
                  </span>
                  <span className="text-[11px] text-amber-300 font-bold">Due: {asg.dueDate}</span>
                </div>

                <h3 className="text-base font-bold text-white">{asg.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{asg.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Submission Progress:</span>
                  <span>{asg.completedCount} / {asg.assignedCount} Submitted</span>
                </div>

                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-purple-500 h-full"
                    style={{ width: `${(asg.completedCount / asg.assignedCount) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Avg Class Score:</span>
                  <span className="font-bold text-emerald-400">{asg.avgScore > 0 ? `${asg.avgScore}%` : 'Pending'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Tutoring Schedule Calendar */}
      {activeTab === 'schedule' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 text-white">
          <h3 className="text-sm font-bold flex items-center gap-2 text-indigo-300">
            <Calendar className="w-4 h-4 text-indigo-400" />
            Upcoming Live Tutoring & Parent Consultations
          </h3>

          <div className="space-y-3">
            {sessions.map((sch) => (
              <div
                key={sch.id}
                className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{sch.title}</span>
                    <span className="text-xs text-amber-300 font-semibold">• {sch.studentName}</span>
                  </div>
                  <p className="text-xs text-slate-400">Topic: {sch.topic}</p>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <p className="text-xs font-bold text-slate-200">{sch.date}</p>
                    <p className="text-[11px] text-slate-400">{sch.time}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      sch.status === 'Completed'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : 'bg-indigo-950 text-indigo-300 border border-indigo-500/40'
                    }`}
                  >
                    {sch.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Award Student Bonus Stars */}
      {activeTab === 'badges' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 text-white">
          <h3 className="text-sm font-bold flex items-center gap-2 text-amber-300">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            Award Star Recognition directly to Students
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {students.map((st) => (
              <div key={st.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <img src={st.avatar} alt={st.name} className="w-12 h-12 rounded-xl object-cover border border-amber-400" />
                  <div>
                    <h4 className="font-bold text-sm text-white">{st.name}</h4>
                    <p className="text-xs text-amber-200">Current Stars: {st.stars} ⭐</p>
                  </div>
                </div>

                <button
                  onClick={() => onAwardBonusStars(st.id, 5)}
                  className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-xl shadow"
                >
                  +5 Bonus Stars ⭐
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Assign Homework */}
      {isAsgModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-500/40 rounded-2xl p-6 max-w-lg w-full text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Assign Class Homework</h3>
              <button onClick={() => setIsAsgModalOpen(false)} className="text-xs text-slate-400">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Homework Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Fraction Multiplication Visualizer"
                  value={asgTitle}
                  onChange={(e) => setAsgTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <SubjectSelect
                value={asgSubject}
                onChange={(s) => setAsgSubject(s)}
                label="Subject (Choose from List or Enter Custom):"
              />

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Due Date:</label>
                <input
                  type="date"
                  value={asgDueDate}
                  onChange={(e) => setAsgDueDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Instructions:</label>
                <textarea
                  rows={3}
                  placeholder="Task details..."
                  value={asgDesc}
                  onChange={(e) => setAsgDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
            </div>

            <button
              onClick={handleCreateAssignment}
              disabled={!asgTitle || !asgDesc}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-extrabold text-white text-xs shadow-lg"
            >
              Post Homework Assignment
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Schedule Session */}
      {isSchModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-6 max-w-lg w-full text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Schedule Tutoring Session</h3>
              <button onClick={() => setIsSchModalOpen(false)} className="text-xs text-slate-400">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Student / Parent Name:</label>
                <input
                  type="text"
                  value={schStudent}
                  onChange={(e) => setSchStudent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Topic:</label>
                <input
                  type="text"
                  placeholder="e.g. AP Calculus Derivation Review"
                  value={schTopic}
                  onChange={(e) => setSchTopic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Date:</label>
                  <input
                    type="date"
                    value={schDate}
                    onChange={(e) => setSchDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Time:</label>
                  <input
                    type="text"
                    value={schTime}
                    onChange={(e) => setSchTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleCreateSession}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-extrabold text-white text-xs shadow-lg"
            >
              Add Scheduled Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
