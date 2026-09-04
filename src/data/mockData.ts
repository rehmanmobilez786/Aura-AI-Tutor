import { StudentProfile, LessonPlan, ForumThread, TeacherAssignment, ScheduleSession, AiRecommendation, GradeLevel } from '../types';

export const INITIAL_STUDENT_PROFILES: StudentProfile[] = [
  {
    id: 'student-kg-1',
    name: 'Leo (Kindergarten)',
    avatar: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=200&q=80',
    grade: 'KG',
    xp: 680,
    level: 3,
    streak: 5,
    stars: 28,
    completedLessons: 12,
    totalPracticeTimeMinutes: 180,
    subjectMastery: {
      'Math': 88,
      'Science': 92,
      'Reading & Language': 82,
      'Social Studies': 78,
      'Creative Arts': 95,
      'Coding & Tech': 70
    },
    weakTopics: ['Counting past 50', 'Phonics blending sh/ch'],
    strongTopics: ['Shape recognition', 'Animal habitats', 'Color mixing'],
    recentActivity: [
      { id: 'act-1', title: 'Interactive Animal Counting 🦁', date: 'Today, 9:30 AM', score: 100, type: 'lesson' },
      { id: 'act-2', title: 'Camera Snap: Apple & Orange Math 🍎', date: 'Yesterday', score: 95, type: 'camera' },
      { id: 'act-3', title: 'Phonics Fun Quiz 🔤', date: '2 days ago', score: 85, type: 'quiz' }
    ],
    badges: [
      { id: 'b-1', title: 'Super Star Counter', iconName: 'Star', description: 'Counted 50 items correctly!', unlocked: true, dateUnlocked: '2026-07-20', xpReward: 100 },
      { id: 'b-2', title: 'Camera Explorer', iconName: 'Camera', description: 'Used AI camera assistance 5 times', unlocked: true, dateUnlocked: '2026-07-22', xpReward: 150 },
      { id: 'b-3', title: 'Polyglot Buddy', iconName: 'Globe', description: 'Learned words in 2 languages', unlocked: true, dateUnlocked: '2026-07-25', xpReward: 200 },
      { id: 'b-4', title: '7-Day Streak Champ', iconName: 'Flame', description: 'Maintain a 7-day learning streak', unlocked: false, xpReward: 300 }
    ]
  },
  {
    id: 'student-g5-1',
    name: 'Maya Lin (Grade 5)',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    grade: 'Grade 4-8',
    xp: 2450,
    level: 8,
    streak: 12,
    stars: 84,
    completedLessons: 34,
    totalPracticeTimeMinutes: 620,
    subjectMastery: {
      'Math': 76,
      'Science': 90,
      'Reading & Language': 88,
      'Social Studies': 84,
      'Coding & Tech': 94,
      'Creative Arts': 80
    },
    weakTopics: ['Fractions multiplication', 'Long division remainder'],
    strongTopics: ['Photosynthesis', 'Python Turtle loops', 'Grammar analysis'],
    recentActivity: [
      { id: 'act-10', title: 'Fraction Visualizer Challenge', date: 'Today, 10:15 AM', score: 80, type: 'quiz' },
      { id: 'act-11', title: 'Camera Snap: Solar System Diagram', date: 'Yesterday', score: 98, type: 'camera' },
      { id: 'act-12', title: 'Scratch Coding Quest', date: '3 days ago', score: 100, type: 'lesson' }
    ],
    badges: [
      { id: 'b-10', title: 'Science Detective', iconName: 'Microscope', description: 'Aged 5 science visualizer snaps', unlocked: true, dateUnlocked: '2026-07-15', xpReward: 200 },
      { id: 'b-11', title: 'Coder Prodigy', iconName: 'Code', description: 'Built 3 interactive mini-apps', unlocked: true, dateUnlocked: '2026-07-21', xpReward: 250 },
      { id: 'b-12', title: 'Forum Mentor', iconName: 'Users', description: 'Helped 3 classmates in discussion forum', unlocked: true, dateUnlocked: '2026-07-24', xpReward: 300 }
    ]
  },
  {
    id: 'student-hs-1',
    name: 'Alexander Chen (Grade 11 AP)',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    grade: 'Grade 9-12',
    xp: 5820,
    level: 16,
    streak: 21,
    stars: 140,
    completedLessons: 68,
    totalPracticeTimeMinutes: 1450,
    subjectMastery: {
      'Math': 94,
      'Science': 91,
      'Reading & Language': 86,
      'Social Studies': 88,
      'Coding & Tech': 96,
      'Creative Arts': 75
    },
    weakTopics: ['Calculus Integration by parts', 'Rotational Kinematics'],
    strongTopics: ['Derivatives', 'Python Data Structures', 'AP US History DBQ'],
    recentActivity: [
      { id: 'act-20', title: 'Calculus Derivative Camera Breakdown', date: 'Today, 8:00 AM', score: 100, type: 'camera' },
      { id: 'act-21', title: 'Physics Vector Equilibrium Quiz', date: 'Yesterday', score: 92, type: 'quiz' }
    ],
    badges: [
      { id: 'b-20', title: 'Calculus Conqueror', iconName: 'Calculator', description: 'Solved 25 AP Calculus problems', unlocked: true, dateUnlocked: '2026-07-10', xpReward: 500 },
      { id: 'b-21', title: 'Multilingual Master', iconName: 'Languages', description: 'Completed AP Spanish AI practice', unlocked: true, dateUnlocked: '2026-07-18', xpReward: 400 }
    ]
  }
];

export const SAMPLE_LESSONS: LessonPlan[] = [
  {
    id: 'les-kg-1',
    title: 'Fun with Shapes & Friendly Animals',
    grade: 'KG',
    subject: 'Math',
    duration: '10 mins',
    difficulty: 'Beginner',
    summary: 'Discover circles, squares, and triangles with playful animal helpers and voice story guidance!',
    objectives: ['Identify circles, squares, and triangles in real objects', 'Count sides of geometric shapes', 'Match shapes to animal houses'],
    interactiveSteps: [
      {
        title: 'Circle Adventure 🔴',
        content: 'Look around! A ball, a full moon, and an orange are all CIRCLES! Circles have NO straight corners.',
        audioText: 'Hi little explorer! Can you find a circle in your room? It rolls smoothly like a shiny orange!',
        quizQuestion: {
          question: 'Which object is shaped like a Circle?',
          options: ['A square box 📦', 'A round shiny coin 🪙', 'A pointed roof 🏠'],
          answer: 1,
          hint: 'Think about what rolls like a wheel!'
        }
      },
      {
        title: 'Triangle Magic 🔺',
        content: 'Triangles have 3 straight sides and 3 pointy corners! Just like a slice of yummy pizza or a party hat!',
        audioText: 'One, two, three sides! Triangles make awesome party hats!',
        quizQuestion: {
          question: 'How many pointed corners does a Triangle have?',
          options: ['2 corners', '3 corners', '4 corners'],
          answer: 1,
          hint: 'Count with your finger: 1, 2, 3!'
        }
      }
    ]
  },
  {
    id: 'les-g5-1',
    title: 'Visualizing Fractions & Mixed Numbers',
    grade: 'Grade 4-8',
    subject: 'Math',
    duration: '15 mins',
    difficulty: 'Intermediate',
    summary: 'Master equivalent fractions, slice pizzas into equal denominators, and convert improper fractions.',
    objectives: ['Understand numerators and denominators intuitively', 'Find equivalent fractions visually', 'Add fractions with common denominators'],
    interactiveSteps: [
      {
        title: 'Anatomy of a Fraction 🍕',
        content: 'In 3/4, the bottom number (4) is the Denominator (total slices). The top number (3) is the Numerator (slices you have!).',
        audioText: 'Imagine a pizza cut into 4 equal slices. If you eat 3 slices, you ate three-fourths of the pizza!',
        quizQuestion: {
          question: 'In the fraction 5/8, what does the number 8 represent?',
          options: ['How many slices you ate', 'The Denominator (total equal parts)', 'The Numerator'],
          answer: 1,
          hint: 'The bottom number always tells us how many total pieces make a whole.'
        }
      },
      {
        title: 'Equivalent Fractions Trick ⚡',
        content: 'If you multiply both top and bottom by the same number, the fraction value stays identical! 1/2 = 2/4 = 4/8 = 5/10.',
        audioText: 'Multiply the top and bottom by 2! 1 half becomes 2 fourths!',
        quizQuestion: {
          question: 'Which fraction is equal to 1/3?',
          options: ['2/6', '2/3', '3/4'],
          answer: 0,
          hint: 'Multiply both 1 and 3 by 2!'
        }
      }
    ]
  },
  {
    id: 'les-hs-1',
    title: 'Newton\'s Laws & Vector Forces in Action',
    grade: 'Grade 9-12',
    subject: 'Science',
    duration: '20 mins',
    difficulty: 'Advanced',
    summary: 'Deconstruct force diagrams, balance free-body equations, and calculate acceleration with real AI simulation.',
    objectives: ['Apply F = m*a across multi-body systems', 'Deconstruct normal, frictional, and gravitational force vectors', 'Solve inclined plane physics problems'],
    interactiveSteps: [
      {
        title: 'First Law & Inertia 🌌',
        content: 'An object in motion stays in motion unless acted upon by a net external force. Acceleration occurs only when ∑F ≠ 0.',
        audioText: 'Remember: velocity does not change unless an unbalanced external force disrupts the system state.',
        quizQuestion: {
          question: 'A 10kg crate slides on ice at a constant velocity of 4 m/s. What is the NET horizontal force required to maintain this speed?',
          options: ['40 N', '0 N', '10 N'],
          answer: 1,
          hint: 'Constant velocity means zero acceleration, so net force must equal zero!'
        }
      }
    ]
  }
];

export const INITIAL_FORUM_THREADS: ForumThread[] = [
  {
    id: 'thread-1',
    title: 'How do I easily remember the difference between Photosynthesis & Respiration?',
    authorName: 'Maya Lin',
    authorRole: 'Student',
    authorGrade: 'Grade 4-8',
    subject: 'Science',
    content: 'In 5th grade science, I keep confusing what plants take in versus what they release during photosynthesis compared to humans. Is there an easy trick?',
    timestamp: '2 hours ago',
    upvotes: 14,
    isAnswered: true,
    tags: ['Biology', 'Plants', '5th Grade Science'],
    replies: [
      {
        id: 'rep-1',
        authorName: 'Aura AI Tutor',
        authorRole: 'AI Tutor',
        isAi: true,
        content: '💡 **Easy Memory Trick!** \nThink of plants as **Solar Factories** ☀️🌱:\n\n1. **Photosynthesis** (Plants cooking food):\n   - **Inputs:** Sun + CO₂ + Water\n   - **Outputs:** Sugar (food) + **Oxygen** 🌬️\n\n2. **Cellular Respiration** (Humans & plants eating/breathing):\n   - **Inputs:** Oxygen + Sugar\n   - **Outputs:** CO₂ + Water + Energy ⚡\n\nThey are exact opposite mirrors of each other!',
        timestamp: '1 hour ago',
        upvotes: 19
      },
      {
        id: 'rep-2',
        authorName: 'Mr. Davis (Biology Teacher)',
        authorRole: 'Teacher',
        isAi: false,
        content: 'Great answer by Aura AI! Remember Maya: Plants give us the oxygen we breathe, and we give plants the CO₂ they need!',
        timestamp: '45 mins ago',
        upvotes: 7
      }
    ]
  },
  {
    id: 'thread-2',
    title: 'Camera homework solver help on integration by parts in AP Calculus BC',
    authorName: 'Alexander Chen',
    authorRole: 'Student',
    authorGrade: 'Grade 9-12',
    subject: 'Math',
    content: 'When evaluating ∫ x * e^(2x) dx, how do I pick u and dv using the LIATE rule?',
    timestamp: '5 hours ago',
    upvotes: 22,
    isAnswered: true,
    tags: ['Calculus', 'AP Math', 'Integration'],
    replies: [
      {
        id: 'rep-10',
        authorName: 'Aura AI Tutor',
        authorRole: 'AI Tutor',
        isAi: true,
        content: '📐 **LIATE Rule Step-by-Step:**\n\nLIATE priority order for setting $u$:\n- **L**ogarithmic\n- **I**nverse Trig\n- **A**lgebraic ($x$)\n- **T**rigonometric\n- **E**xponential ($e^{2x}$)\n\nHere, $x$ is Algebraic and $e^{2x}$ is Exponential.\nSet $u = x \implies du = dx$\nSet $dv = e^{2x} dx \implies v = \\frac{1}{2} e^{2x}$\n\nApplying $\\int u\\,dv = uv - \\int v\\,du$:\n$$= x \\cdot \\left(\\frac{1}{2} e^{2x}\\right) - \\int \\frac{1}{2} e^{2x} dx = \\frac{1}{2}x e^{2x} - \\frac{1}{4} e^{2x} + C$$',
        timestamp: '4 hours ago',
        upvotes: 28
      }
    ]
  }
];

export const INITIAL_TEACHER_ASSIGNMENTS: TeacherAssignment[] = [
  {
    id: 'asg-1',
    title: 'Weekly Math Quest: Fraction Multiplication',
    grade: 'Grade 4-8',
    subject: 'Math',
    dueDate: '2026-07-30',
    assignedCount: 24,
    completedCount: 18,
    avgScore: 88,
    description: 'Complete 5 visual fraction practice problems using AI Camera or Quiz mode.'
  },
  {
    id: 'asg-2',
    title: 'KG Sight Words & Audio Reading',
    grade: 'KG',
    subject: 'Reading & Language',
    dueDate: '2026-07-28',
    assignedCount: 15,
    completedCount: 14,
    avgScore: 94,
    description: 'Listen to story narratives and identify 10 rhyming words using speech playback.'
  },
  {
    id: 'asg-3',
    title: 'AP Physics: Inclined Plane Vector Analysis',
    grade: 'Grade 9-12',
    subject: 'Science',
    dueDate: '2026-08-02',
    assignedCount: 28,
    completedCount: 20,
    avgScore: 82,
    description: 'Snap a photo of your hand-drawn free body diagram and get instant AI force validation.'
  }
];

export const INITIAL_SCHEDULE_SESSIONS: ScheduleSession[] = [
  {
    id: 'sch-1',
    title: 'Live AI Interactive Tutoring: Fractions & Remainders',
    studentName: 'Maya Lin',
    grade: 'Grade 4-8',
    date: '2026-07-28',
    time: '04:00 PM',
    status: 'Upcoming',
    topic: 'Math - Visual Fractions'
  },
  {
    id: 'sch-2',
    title: 'Parent Progress Check-in & AI Study Plan Review',
    studentName: 'Leo (Parent: Sarah Lin)',
    grade: 'KG',
    date: '2026-07-29',
    time: '10:30 AM',
    status: 'Scheduled',
    topic: 'KG Foundation & Reading Milestones'
  },
  {
    id: 'sch-3',
    title: 'AP Calculus BC Problem Solving Review',
    studentName: 'Alexander Chen',
    grade: 'Grade 9-12',
    date: '2026-07-27',
    time: '02:00 PM',
    status: 'Completed',
    topic: 'Integration Techniques & Series'
  }
];

export const INITIAL_AI_RECOMMENDATIONS: AiRecommendation[] = [
  {
    id: 'rec-1',
    title: 'Fraction Multiplication Visualizer',
    category: 'Targeted Practice',
    grade: 'Grade 4-8',
    reason: 'Student scored 76% in Math. Strengthening visual fraction models will boost overall test accuracy by ~15%.',
    difficulty: 'Intermediate',
    estimatedMinutes: 10,
    xpBonus: 150
  },
  {
    id: 'rec-2',
    title: 'Interactive Phonics Blending Game 🔤',
    category: 'Daily Boost',
    grade: 'KG',
    reason: 'Leo enjoys audio storybooks! Phonics audio games reinforce sh/ch sounds.',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    xpBonus: 100
  },
  {
    id: 'rec-3',
    title: 'Camera Snap: Mechanics Diagram Verification',
    category: 'Advanced Challenge',
    grade: 'Grade 9-12',
    reason: 'Alexander is performing at top 5% in Calculus; recommendation to attempt Rotational Torque challenges.',
    difficulty: 'Advanced',
    estimatedMinutes: 15,
    xpBonus: 250
  }
];
