/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { CameraHomeworkHelper } from './components/CameraHomeworkHelper';
import { AdaptiveLessonsView } from './components/AdaptiveLessonsView';
import { GamificationHub } from './components/GamificationHub';
import { PeerForumView } from './components/PeerForumView';
import { ParentTeacherDashboard } from './components/ParentTeacherDashboard';
import { TutorWorkspaceView } from './components/TutorWorkspaceView';
import { OfflineStorageDrawer } from './components/OfflineStorageDrawer';

import { 
  GradeLevel, 
  UserRole, 
  Language, 
  StudentProfile, 
  LessonPlan, 
  ForumThread, 
  ForumReply, 
  TeacherAssignment, 
  ScheduleSession, 
  CameraSolution 
} from './types';

import { 
  INITIAL_STUDENT_PROFILES, 
  SAMPLE_LESSONS, 
  INITIAL_FORUM_THREADS, 
  INITIAL_TEACHER_ASSIGNMENTS, 
  INITIAL_SCHEDULE_SESSIONS, 
  INITIAL_AI_RECOMMENDATIONS 
} from './data/mockData';

import { Sparkles, Trophy, X } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('camera');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('Grade 4-8');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('English');
  const [isOffline, setIsOffline] = useState<boolean>(false);

  // App Data States
  const [students, setStudents] = useState<StudentProfile[]>(INITIAL_STUDENT_PROFILES);
  const [currentStudentId, setCurrentStudentId] = useState<string>('student-g5-1');
  const [lessons, setLessons] = useState<LessonPlan[]>(SAMPLE_LESSONS);
  const [forumThreads, setForumThreads] = useState<ForumThread[]>(INITIAL_FORUM_THREADS);
  const [assignments, setAssignments] = useState<TeacherAssignment[]>(INITIAL_TEACHER_ASSIGNMENTS);
  const [sessions, setSessions] = useState<ScheduleSession[]>(INITIAL_SCHEDULE_SESSIONS);
  const [savedSolutions, setSavedSolutions] = useState<(CameraSolution & { id: string; image: string; date: string })[]>([]);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active student object
  const activeStudent = students.find((s) => s.id === currentStudentId) || students[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Gamification Handlers
  const handleAwardXp = (amount: number, reason: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === activeStudent.id) {
          const newXp = s.xp + amount;
          const nextLevelXp = s.level * 500;
          let newLevel = s.level;
          if (newXp >= nextLevelXp) {
            newLevel += 1;
            showToast(`🎉 LEVEL UP! You reached Level ${newLevel}!`);
          } else {
            showToast(`⭐ +${amount} XP for ${reason}!`);
          }
          return {
            ...s,
            xp: newXp,
            level: newLevel,
            stars: s.stars + Math.floor(amount / 20)
          };
        }
        return s;
      })
    );
  };

  const handleUpdateAvatar = (avatarUrl: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === activeStudent.id ? { ...s, avatar: avatarUrl } : s))
    );
    showToast('✨ Avatar updated!');
  };

  const handleClaimBadgeReward = (badgeId: string, xpReward: number) => {
    handleAwardXp(xpReward, 'Badge Claim');
  };

  const handleCompleteLesson = (lessonId: string, xp: number) => {
    handleAwardXp(xp, 'Completed Lesson');
    setStudents((prev) =>
      prev.map((s) =>
        s.id === activeStudent.id
          ? { ...s, completedLessons: s.completedLessons + 1, totalPracticeTimeMinutes: s.totalPracticeTimeMinutes + 15 }
          : s
      )
    );
  };

  const handleSaveOfflineLesson = (lesson: LessonPlan) => {
    setLessons((prev) =>
      prev.map((l) => (l.id === lesson.id ? { ...l, isDownloaded: !l.isDownloaded } : l))
    );
    showToast('📥 Saved lesson for offline access!');
  };

  const handleAddCustomLesson = (newLesson: LessonPlan) => {
    setLessons((prev) => [newLesson, ...prev]);
    showToast('🚀 AI Custom Lesson Created!');
  };

  const handleAddForumThread = (newThread: ForumThread) => {
    setForumThreads((prev) => [newThread, ...prev]);
  };

  const handleAddForumReply = (threadId: string, reply: ForumReply) => {
    setForumThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, replies: [...t.replies, reply] } : t))
    );
  };

  const handleUpvoteThread = (threadId: string) => {
    setForumThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, upvotes: t.upvotes + 1 } : t))
    );
  };

  const handleSaveOfflineSolution = (solution: CameraSolution & { id: string; image: string; date: string }) => {
    setSavedSolutions((prev) => [solution, ...prev]);
    showToast('💾 Homework Solution Saved Offline!');
  };

  const handleAddAssignment = (asg: TeacherAssignment) => {
    setAssignments((prev) => [asg, ...prev]);
    showToast('📋 New Class Assignment Posted!');
  };

  const handleAddSession = (sch: ScheduleSession) => {
    setSessions((prev) => [sch, ...prev]);
    showToast('📅 Tutoring Session Scheduled!');
  };

  const handleAwardBonusStars = (studentId: string, bonusStars: number) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, stars: s.stars + bonusStars } : s))
    );
    showToast(`⭐ Awarded +${bonusStars} Stars to student!`);
  };

  // Sync current student profile grade with Grade selector
  const handleGradeChange = (newGrade: GradeLevel) => {
    setSelectedGrade(newGrade);
    // Find matching student profile if available
    const matching = students.find((s) => s.grade === newGrade);
    if (matching) {
      setCurrentStudentId(matching.id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-amber-400 selection:text-slate-950 flex flex-col justify-between">
      <div>
        {/* Navigation Header */}
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          selectedGrade={selectedGrade}
          setSelectedGrade={handleGradeChange}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          student={activeStudent}
          isOffline={isOffline}
          setIsOffline={setIsOffline}
          offlineCount={savedSolutions.length + lessons.filter((l) => l.isDownloaded).length}
        />

        {/* Global Toast Banner */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 px-5 py-3 rounded-2xl font-extrabold text-sm shadow-2xl flex items-center gap-3 animate-bounce border-2 border-slate-900">
            <Sparkles className="w-5 h-5 text-slate-950" />
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-950 font-bold">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main View Content Switcher */}
        <main>
          {currentTab === 'camera' && (
            <CameraHomeworkHelper
              grade={selectedGrade}
              language={selectedLanguage}
              onAwardXp={handleAwardXp}
              onSaveOffline={handleSaveOfflineSolution}
            />
          )}

          {currentTab === 'lessons' && (
            <AdaptiveLessonsView
              grade={selectedGrade}
              language={selectedLanguage}
              lessons={lessons}
              onCompleteLesson={handleCompleteLesson}
              onSaveOfflineLesson={handleSaveOfflineLesson}
              onAddCustomLesson={handleAddCustomLesson}
            />
          )}

          {currentTab === 'rewards' && (
            <GamificationHub
              student={activeStudent}
              onUpdateAvatar={handleUpdateAvatar}
              onClaimBadgeReward={handleClaimBadgeReward}
            />
          )}

          {currentTab === 'forum' && (
            <PeerForumView
              grade={selectedGrade}
              language={selectedLanguage}
              threads={forumThreads}
              onAddThread={handleAddForumThread}
              onAddReply={handleAddForumReply}
              onUpvoteThread={handleUpvoteThread}
              onAwardXp={handleAwardXp}
            />
          )}

          {currentTab === 'dashboard' && (
            <ParentTeacherDashboard
              students={students}
              selectedGrade={selectedGrade}
              recommendations={INITIAL_AI_RECOMMENDATIONS}
            />
          )}

          {currentTab === 'workspace' && (
            <TutorWorkspaceView
              grade={selectedGrade}
              assignments={assignments}
              sessions={sessions}
              students={students}
              onAddAssignment={handleAddAssignment}
              onAddSession={handleAddSession}
              onAwardBonusStars={handleAwardBonusStars}
            />
          )}

          {currentTab === 'offline' && (
            <OfflineStorageDrawer
              savedSolutions={savedSolutions}
              savedLessons={lessons.filter((l) => l.isDownloaded)}
              isOffline={isOffline}
              onClearSolutions={() => setSavedSolutions([])}
            />
          )}
        </main>
      </div>

      {/* Global Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Aura AI Tutor — Multi-Grade Real-Time Visual Assistance & Adaptive Learning Platform</span>
          </p>
          <p className="text-slate-600">KG to Higher Education • Gemini Vision & Audio Enabled</p>
        </div>
      </footer>
    </div>
  );
}
