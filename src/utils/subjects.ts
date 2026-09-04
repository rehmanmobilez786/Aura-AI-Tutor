export interface SubjectCategory {
  category: string;
  subjects: string[];
}

export const SUBJECT_CATEGORIES: SubjectCategory[] = [
  {
    category: "Mathematics",
    subjects: [
      "Math (General)",
      "Algebra & Pre-Algebra",
      "Geometry & Measurement",
      "Calculus & Analysis",
      "Trigonometry",
      "Statistics & Probability",
      "Arithmetic & Word Problems"
    ]
  },
  {
    category: "Natural Sciences",
    subjects: [
      "Science (General)",
      "Biology & Life Sciences",
      "Chemistry & Organic Chem",
      "Physics & Mechanics",
      "Earth & Environmental Science",
      "Astronomy & Space"
    ]
  },
  {
    category: "Languages & Literature",
    subjects: [
      "Reading & Comprehension",
      "English Grammar & Spelling",
      "Creative Writing & Essays",
      "Foreign Languages (Spanish/French/etc.)",
      "ESL & Vocabulary"
    ]
  },
  {
    category: "Social Studies & Humanities",
    subjects: [
      "Social Studies (General)",
      "World & US History",
      "Geography & Cultures",
      "Civics & Government",
      "Economics & Business",
      "Psychology & Philosophy"
    ]
  },
  {
    category: "Computer Science & Tech",
    subjects: [
      "Coding & Computer Science",
      "Python & JavaScript",
      "Artificial Intelligence & Tech",
      "Web Development & Design",
      "Robotics & Engineering",
      "Cybersecurity"
    ]
  },
  {
    category: "Arts, Music & Culture",
    subjects: [
      "Creative Arts & Drawing",
      "Music Theory & Instruments",
      "Art History & Appreciation",
      "Drama & Performing Arts"
    ]
  },
  {
    category: "Life Skills, Health & Business",
    subjects: [
      "Financial Literacy & Money",
      "Health & Nutrition",
      "Physical Education",
      "Study Skills & Logic"
    ]
  }
];

export const ALL_SUBJECTS: string[] = SUBJECT_CATEGORIES.flatMap(c => c.subjects);

export const MANUAL_CUSTOM_OPTION = "Other / Manual Enter Custom Subject...";
