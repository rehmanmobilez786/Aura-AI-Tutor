export type GradeLevel = 'KG' | 'Grade 1-3' | 'Grade 4-8' | 'Grade 9-12' | 'Higher Ed';

export type UserRole = 'student' | 'parent' | 'teacher';

export type Subject = 'Math' | 'Science' | 'Reading & Language' | 'Social Studies' | 'Coding & Tech' | 'Creative Arts' | string;

export type Language = 'English' | 'Spanish' | 'French' | 'Hindi' | 'Mandarin' | 'Arabic' | 'German' | 'Japanese';

export interface PracticeQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface CameraSolution {
  problemText: string;
  detectedTopic: string;
  difficulty: string;
  explanation: string;
  stepByStep: string[];
  keyConcepts: string[];
  hints: string[];
  practiceQuestions: PracticeQuestion[];
  audioNarrative: string;
  kgVisualMetaphor?: string;
}

export interface Badge {
  id: string;
  title: string;
  iconName: string;
  description: string;
  unlocked: boolean;
  dateUnlocked?: string;
  xpReward: number;
}

export interface RecentActivity {
  id: string;
  title: string;
  date: string;
  score: number;
  type: 'camera' | 'quiz' | 'lesson' | 'forum';
}

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  grade: GradeLevel;
  xp: number;
  level: number;
  streak: number;
  stars: number;
  completedLessons: number;
  totalPracticeTimeMinutes: number;
  subjectMastery: Record<string, number>;
  weakTopics: string[];
  strongTopics: string[];
  recentActivity: RecentActivity[];
  badges: Badge[];
}

export interface InteractiveStep {
  title: string;
  content: string;
  audioText: string;
  quizQuestion?: {
    question: string;
    options: string[];
    answer: number;
    hint: string;
  };
}

export interface LessonPlan {
  id: string;
  title: string;
  grade: GradeLevel;
  subject: Subject;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  objectives: string[];
  interactiveSteps: InteractiveStep[];
  isDownloaded?: boolean;
}

export interface ForumReply {
  id: string;
  authorName: string;
  authorRole: 'Student' | 'Teacher' | 'AI Tutor' | 'Parent';
  isAi: boolean;
  content: string;
  timestamp: string;
  upvotes: number;
}

export interface ForumThread {
  id: string;
  title: string;
  authorName: string;
  authorRole: 'Student' | 'Teacher' | 'Parent';
  authorGrade: GradeLevel;
  subject: Subject;
  content: string;
  timestamp: string;
  upvotes: number;
  isAnswered: boolean;
  replies: ForumReply[];
  tags: string[];
}

export interface TeacherAssignment {
  id: string;
  title: string;
  grade: GradeLevel;
  subject: Subject;
  dueDate: string;
  assignedCount: number;
  completedCount: number;
  avgScore: number;
  description: string;
}

export interface ScheduleSession {
  id: string;
  title: string;
  studentName: string;
  grade: GradeLevel;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Upcoming';
  topic: string;
}

export interface AiRecommendation {
  id: string;
  title: string;
  category: string;
  grade: GradeLevel;
  reason: string;
  difficulty: string;
  estimatedMinutes: number;
  xpBonus: number;
}
