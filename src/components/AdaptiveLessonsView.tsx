import React, { useState } from 'react';
import { GradeLevel, Subject, Language, LessonPlan, InteractiveStep } from '../types';
import { playTextToSpeech, stopTextToSpeech } from '../utils/speech';
import { SubjectSelect } from './SubjectSelect';
import { ALL_SUBJECTS } from '../utils/subjects';
import { 
  BookOpen, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  PlusCircle, 
  HelpCircle, 
  Zap, 
  Clock, 
  Award 
} from 'lucide-react';

interface AdaptiveLessonsViewProps {
  grade: GradeLevel;
  language: Language;
  lessons: LessonPlan[];
  onCompleteLesson: (lessonId: string, xp: number) => void;
  onSaveOfflineLesson: (lesson: LessonPlan) => void;
  onAddCustomLesson: (lesson: LessonPlan) => void;
}

export const AdaptiveLessonsView: React.FC<AdaptiveLessonsViewProps> = ({
  grade,
  language,
  lessons,
  onCompleteLesson,
  onSaveOfflineLesson,
  onAddCustomLesson
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [activeLesson, setActiveLesson] = useState<LessonPlan | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [userAnswerIndex, setUserAnswerIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Custom AI Lesson Generator Modal State
  const [isGeneratorOpen, setIsGeneratorOpen] = useState<boolean>(false);
  const [customTopic, setCustomTopic] = useState<string>('');
  const [customSubject, setCustomSubject] = useState<Subject>('Science');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const subjects = ['All', 'Math', 'Science', 'Reading & Language', 'Social Studies', 'Coding & Tech', 'Creative Arts'];

  const filteredLessons = lessons.filter((l) => {
    const matchesSubject = selectedSubject === 'All' || l.subject === selectedSubject;
    const matchesGrade = l.grade === grade;
    return matchesSubject && matchesGrade;
  });

  const handleSpeechReadStep = (step: InteractiveStep) => {
    if (isSpeaking) {
      stopTextToSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      playTextToSpeech(step.audioText || step.content, language, () => setIsSpeaking(false));
    }
  };

  // Generate Custom AI Lesson via API
  const handleGenerateCustomLesson = async () => {
    if (!customTopic) return;
    setIsGenerating(true);

    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Create a structured interactive lesson plan for topic "${customTopic}" in subject "${customSubject}". Grade level: ${grade}. Language: ${language}.
Provide valid JSON matching this schema:
{
  "id": "les-ai-${Date.now()}",
  "title": "${customTopic}",
  "grade": "${grade}",
  "subject": "${customSubject}",
  "duration": "12 mins",
  "difficulty": "Intermediate",
  "summary": "AI generated lesson for ${customTopic}",
  "objectives": ["Objective 1", "Objective 2"],
  "interactiveSteps": [
    {
      "title": "Step 1 Concept",
      "content": "Explanation text",
      "audioText": "Read aloud text",
      "quizQuestion": {
        "question": "Quick question",
        "options": ["Opt A", "Opt B", "Opt C"],
        "answer": 0,
        "hint": "Hint text"
      }
    }
  ]
}`,
          grade,
          subject: customSubject,
          language
        })
      });

      const data = await response.json();
      if (data.reply) {
        // Attempt to parse JSON from response
        const jsonMatch = data.reply.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const newLesson: LessonPlan = JSON.parse(jsonMatch[0]);
          onAddCustomLesson(newLesson);
          setActiveLesson(newLesson);
          setIsGeneratorOpen(false);
          setCustomTopic('');
        }
      }
    } catch (e) {
      console.error('Lesson Generation Error:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 border border-purple-800/40 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/30 text-purple-200 border border-purple-500/40">
              Adaptive Learning Hub
            </span>
            <span className="text-xs text-purple-200">Filtered for: {grade}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Interactive Lessons & Quests 📚
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Step-by-step interactive lessons with built-in voice read-aloud, instant practice questions, and offline download support.
          </p>
        </div>

        <button
          onClick={() => setIsGeneratorOpen(true)}
          className="bg-gradient-to-r from-amber-400 to-orange-500 hover:brightness-110 text-slate-950 font-extrabold px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm transition-transform scale-105"
        >
          <Sparkles className="w-4 h-4" />
          Generate AI Custom Lesson
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {subjects.map((subj) => (
          <button
            key={subj}
            onClick={() => setSelectedSubject(subj)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedSubject === subj
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {subj}
          </button>
        ))}
      </div>

      {/* ACTIVE LESSON RUNNER MODAL/VIEW */}
      {activeLesson ? (
        <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-6 text-white shadow-2xl space-y-6 animate-fade-in">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {activeLesson.subject} • {activeLesson.grade}
              </span>
              <h2 className="text-xl font-extrabold text-white mt-1">{activeLesson.title}</h2>
            </div>

            <button
              onClick={() => {
                setActiveLesson(null);
                stopTextToSpeech();
              }}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700"
            >
              ← Back to Lessons
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-indigo-300">
              Step {activeStepIndex + 1} of {activeLesson.interactiveSteps.length}
            </span>
            <div className="flex-1 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-amber-400 to-indigo-500 h-full transition-all duration-300"
                style={{
                  width: `${((activeStepIndex + 1) / activeLesson.interactiveSteps.length) * 100}%`
                }}
              />
            </div>
          </div>

          {/* Current Step Component */}
          {activeLesson.interactiveSteps[activeStepIndex] && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-amber-300">
                  {activeLesson.interactiveSteps[activeStepIndex].title}
                </h3>

                <button
                  onClick={() => handleSpeechReadStep(activeLesson.interactiveSteps[activeStepIndex])}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSpeaking
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                  }`}
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isSpeaking ? 'Stop Voice' : 'Read Step Aloud 🔊'}</span>
                </button>
              </div>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                {activeLesson.interactiveSteps[activeStepIndex].content}
              </p>

              {/* Step Quiz Question if present */}
              {activeLesson.interactiveSteps[activeStepIndex].quizQuestion && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 mt-4">
                  <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    Quick Understanding Check:
                  </p>
                  <p className="text-sm font-semibold text-white">
                    {activeLesson.interactiveSteps[activeStepIndex].quizQuestion?.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeLesson.interactiveSteps[activeStepIndex].quizQuestion?.options.map((opt, oIdx) => {
                      const isSelected = userAnswerIndex === oIdx;
                      const isCorrect =
                        activeLesson.interactiveSteps[activeStepIndex].quizQuestion?.answer === oIdx;

                      let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300';
                      if (isSelected && !isAnswerSubmitted) {
                        btnStyle = 'bg-indigo-600 border-indigo-500 text-white font-bold';
                      } else if (isAnswerSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold';
                        } else if (isSelected) {
                          btnStyle = 'bg-rose-950 border-rose-500 text-rose-200';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={isAnswerSubmitted}
                          onClick={() => setUserAnswerIndex(oIdx)}
                          className={`p-3 rounded-xl border text-xs text-left transition-all ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <HelpCircle className="w-3.5 h-3.5" /> {showHint ? 'Hide Hint' : 'Need a Hint?'}
                    </button>

                    {!isAnswerSubmitted && (
                      <button
                        onClick={() => setIsAnswerSubmitted(true)}
                        disabled={userAnswerIndex === null}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-1.5 rounded-lg text-xs"
                      >
                        Check Answer
                      </button>
                    )}
                  </div>

                  {showHint && (
                    <p className="text-xs text-amber-200 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                      💡 {activeLesson.interactiveSteps[activeStepIndex].quizQuestion?.hint}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Bottom Step Navigation */}
          <div className="flex items-center justify-between pt-2">
            <button
              disabled={activeStepIndex === 0}
              onClick={() => {
                setActiveStepIndex(activeStepIndex - 1);
                setUserAnswerIndex(null);
                setIsAnswerSubmitted(false);
                setShowHint(false);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 border border-slate-700 disabled:opacity-40"
            >
              Previous Step
            </button>

            {activeStepIndex < activeLesson.interactiveSteps.length - 1 ? (
              <button
                onClick={() => {
                  setActiveStepIndex(activeStepIndex + 1);
                  setUserAnswerIndex(null);
                  setIsAnswerSubmitted(false);
                  setShowHint(false);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-lg"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  onCompleteLesson(activeLesson.id, 150);
                  setActiveLesson(null);
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 shadow-lg scale-105"
              >
                <CheckCircle2 className="w-4 h-4" /> Complete Lesson (+150 XP)
              </button>
            )}
          </div>
        </div>
      ) : (
        /* LESSON CARDS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLessons.map((les) => (
            <div
              key={les.id}
              className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all hover:scale-[1.01]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                    {les.subject}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{les.duration}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white line-clamp-2">{les.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{les.summary}</p>

                <div className="space-y-1.5 pt-2">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Objectives:</p>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {les.objectives.slice(0, 2).map((obj, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span className="line-clamp-1">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-800/80 mt-4 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setActiveLesson(les);
                    setActiveStepIndex(0);
                    setUserAnswerIndex(null);
                    setIsAnswerSubmitted(false);
                  }}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl text-xs text-center shadow-md flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" /> Start Lesson
                </button>

                <button
                  onClick={() => onSaveOfflineLesson(les)}
                  className={`p-2 rounded-xl border text-xs transition-all ${
                    les.isDownloaded
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700'
                  }`}
                  title={les.isDownloaded ? 'Downloaded Offline' : 'Download for Offline Mode'}
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {filteredLessons.length === 0 && (
            <div className="col-span-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
              <p className="text-sm text-slate-300">No pre-loaded lessons found for subject "{selectedSubject}" in {grade}.</p>
              <button
                onClick={() => setIsGeneratorOpen(true)}
                className="bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs"
              >
                Generate Custom AI Lesson
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODAL: Generate Custom AI Lesson */}
      {isGeneratorOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-6 max-w-lg w-full text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Generate Custom AI Lesson
              </h3>
              <button
                onClick={() => setIsGeneratorOpen(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Enter any topic (e.g. "Space Black Holes", "KG Counting Fruits", "Python Loops") and Aura AI will build an interactive lesson adapted for <strong className="text-amber-300">{grade}</strong>!
            </p>

            <div className="space-y-3">
              <SubjectSelect
                value={customSubject}
                onChange={(s) => setCustomSubject(s)}
                language={language}
                label="Subject (Choose or Enter Custom Subject):"
              />

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Lesson Topic Prompt:</label>
                <input
                  type="text"
                  placeholder="e.g. Newton's Gravity or KG Rhyming Words"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateCustomLesson}
              disabled={!customTopic || isGenerating}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 font-extrabold text-slate-950 text-xs shadow-lg flex items-center justify-center gap-2"
            >
              {isGenerating ? 'Generating Lesson with AI...' : 'Build AI Lesson'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
