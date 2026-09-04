import React, { useState } from 'react';
import { GradeLevel, Subject, Language, ForumThread, ForumReply } from '../types';
import { useSpeechRecognition } from '../utils/useSpeechRecognition';
import { SubjectSelect } from './SubjectSelect';
import { 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  Sparkles, 
  PlusCircle, 
  CheckCircle2, 
  Search, 
  Tag, 
  Send, 
  Bot, 
  ShieldCheck,
  Mic,
  MicOff
} from 'lucide-react';

interface PeerForumViewProps {
  grade: GradeLevel;
  language: Language;
  threads: ForumThread[];
  onAddThread: (thread: ForumThread) => void;
  onAddReply: (threadId: string, reply: ForumReply) => void;
  onUpvoteThread: (threadId: string) => void;
  onAwardXp: (amount: number, reason: string) => void;
}

export const PeerForumView: React.FC<PeerForumViewProps> = ({
  grade,
  language,
  threads,
  onAddThread,
  onAddReply,
  onUpvoteThread,
  onAwardXp
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeThread, setActiveThread] = useState<ForumThread | null>(null);
  const [newReplyText, setNewReplyText] = useState<string>('');
  
  // New Question Form Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newSubject, setNewSubject] = useState<Subject>('Science');
  const [isAiGeneratingReply, setIsAiGeneratingReply] = useState<boolean>(false);

  // Active voice field tracker: 'search' | 'title' | 'content' | 'reply' | null
  const [activeVoiceField, setActiveVoiceField] = useState<'search' | 'title' | 'content' | 'reply' | null>(null);

  const { isListening, isSupported, startListening, stopListening } = useSpeechRecognition((text) => {
    if (activeVoiceField === 'search') {
      setSearchQuery(text);
    } else if (activeVoiceField === 'title') {
      setNewTitle(text);
    } else if (activeVoiceField === 'content') {
      setNewContent(text);
    } else if (activeVoiceField === 'reply') {
      setNewReplyText(text);
    }
  });

  const toggleVoiceInput = (field: 'search' | 'title' | 'content' | 'reply') => {
    if (isListening && activeVoiceField === field) {
      stopListening();
      setActiveVoiceField(null);
    } else {
      if (isListening) stopListening();
      setActiveVoiceField(field);
      startListening(language);
    }
  };

  const filteredThreads = threads.filter((t) => {
    const matchesSubject = selectedSubject === 'All' || t.subject === selectedSubject;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const handlePostQuestion = async () => {
    if (!newTitle || !newContent) return;

    const threadId = 'thread-' + Date.now();
    const createdThread: ForumThread = {
      id: threadId,
      title: newTitle,
      authorName: 'Student Explorer',
      authorRole: 'Student',
      authorGrade: grade,
      subject: newSubject,
      content: newContent,
      timestamp: 'Just now',
      upvotes: 1,
      isAnswered: true,
      tags: [newSubject, grade, 'Student Q&A'],
      replies: []
    };

    onAddThread(createdThread);
    onAwardXp(50, 'Posted Question in Peer Forum');
    setIsModalOpen(false);
    setNewTitle('');
    setNewContent('');

    // Trigger AI Tutor Automatic Helpful Response
    setIsAiGeneratingReply(true);
    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Respond helpfully to this student peer forum question: "${newTitle}" - "${newContent}". Grade: ${grade}, Subject: ${newSubject}, Language: ${language}. Provide clear explanation and encouragement!`,
          grade,
          subject: newSubject,
          language
        })
      });

      const resData = await response.json();
      if (resData.reply) {
        const aiReply: ForumReply = {
          id: 'rep-ai-' + Date.now(),
          authorName: 'Aura AI Tutor',
          authorRole: 'AI Tutor',
          isAi: true,
          content: resData.reply,
          timestamp: '1 min ago',
          upvotes: 5
        };
        onAddReply(threadId, aiReply);
      }
    } catch (e) {
      console.error('AI Forum reply error:', e);
    } finally {
      setIsAiGeneratingReply(false);
    }
  };

  const handlePostReply = () => {
    if (!activeThread || !newReplyText) return;

    const userReply: ForumReply = {
      id: 'rep-' + Date.now(),
      authorName: 'You (Student)',
      authorRole: 'Student',
      isAi: false,
      content: newReplyText,
      timestamp: 'Just now',
      upvotes: 1
    };

    onAddReply(activeThread.id, userReply);
    onAwardXp(30, 'Answered Classmate in Forum');
    setNewReplyText('');
    setActiveThread({
      ...activeThread,
      replies: [...activeThread.replies, userReply]
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-800/40 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-500/40">
              Peer Discussion Forum
            </span>
            <span className="text-xs text-slate-300">Community Learning for {grade}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ask Questions & Learn Together 💬
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Get answers from classmates, tutors, and instant AI moderation support. Earn XP by answering peer questions!
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm transition-transform scale-105"
        >
          <PlusCircle className="w-4 h-4" />
          Ask Forum Question
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {['All', 'Math', 'Science', 'Reading & Language', 'Coding & Tech'].map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedSubject === subj
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80 flex items-center">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search threads or speak query..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-10 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          {isSupported && (
            <button
              onClick={() => toggleVoiceInput('search')}
              title={isListening && activeVoiceField === 'search' ? 'Stop Voice Input' : 'Speak Search Query'}
              className={`absolute right-2 p-1.5 rounded-lg transition-all ${
                isListening && activeVoiceField === 'search'
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800'
              }`}
            >
              {isListening && activeVoiceField === 'search' ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* ACTIVE THREAD VIEW or THREADS LIST */}
      {activeThread ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl space-y-6">
          <button
            onClick={() => setActiveThread(null)}
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700"
          >
            ← Back to Discussions
          </button>

          {/* Original Post */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                  {activeThread.subject}
                </span>
                <span className="text-xs text-slate-400">• Posted by {activeThread.authorName} ({activeThread.authorGrade})</span>
              </div>
              <span className="text-xs text-slate-500">{activeThread.timestamp}</span>
            </div>

            <h2 className="text-lg font-bold text-white">{activeThread.title}</h2>
            <p className="text-sm text-slate-200 leading-relaxed">{activeThread.content}</p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => onUpvoteThread(activeThread.id)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-amber-300 hover:bg-slate-800"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{activeThread.upvotes} Upvotes</span>
              </button>
            </div>
          </div>

          {/* Replies Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Replies & AI Guidance ({activeThread.replies.length})
            </h3>

            {activeThread.replies.map((reply) => (
              <div
                key={reply.id}
                className={`p-4 rounded-xl border space-y-2 ${
                  reply.isAi
                    ? 'bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border-indigo-500/40 text-indigo-100'
                    : 'bg-slate-950 border-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {reply.isAi ? (
                      <span className="flex items-center gap-1 bg-amber-400 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                        <Sparkles className="w-3 h-3" /> Aura AI Tutor
                      </span>
                    ) : (
                      <span className="font-bold text-xs text-white">{reply.authorName}</span>
                    )}
                    <span className="text-[11px] text-slate-400">({reply.authorRole})</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{reply.timestamp}</span>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">{reply.content}</p>
              </div>
            ))}
          </div>

          {/* Add Reply Input */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex gap-2 items-center">
            <input
              type="text"
              placeholder={isListening && activeVoiceField === 'reply' ? '🎙️ Listening to your spoken reply...' : 'Write a helpful reply or speak your answer...'}
              value={newReplyText}
              onChange={(e) => setNewReplyText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePostReply()}
              className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            {isSupported && (
              <button
                onClick={() => toggleVoiceInput('reply')}
                title={isListening && activeVoiceField === 'reply' ? 'Stop Voice Input' : 'Speak Reply'}
                className={`p-2 rounded-lg transition-all ${
                  isListening && activeVoiceField === 'reply'
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {isListening && activeVoiceField === 'reply' ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-400" />}
              </button>
            )}
            <button
              onClick={handlePostReply}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1 shrink-0"
            >
              <Send className="w-3.5 h-3.5" /> Reply (+30 XP)
            </button>
          </div>
        </div>
      ) : (
        /* THREADS LIST GRID */
        <div className="space-y-3">
          {filteredThreads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => setActiveThread(thread)}
              className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 shadow-xl transition-all cursor-pointer hover:bg-slate-800/40 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {thread.subject}
                  </span>
                  <span className="text-xs text-slate-400">• {thread.authorName} ({thread.authorGrade})</span>
                </div>
                <span className="text-xs text-slate-500">{thread.timestamp}</span>
              </div>

              <h3 className="text-base font-bold text-white hover:text-emerald-300 transition-colors">
                {thread.title}
              </h3>
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{thread.content}</p>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-amber-300 font-bold">
                    <ThumbsUp className="w-3.5 h-3.5" /> {thread.upvotes}
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <MessageSquare className="w-3.5 h-3.5" /> {thread.replies.length} replies
                  </span>
                </div>

                {thread.isAnswered && (
                  <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> AI Answered
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: Post New Forum Question */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 max-w-lg w-full text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2 text-emerald-300">
                <PlusCircle className="w-5 h-5" />
                Ask a Peer Forum Question
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-xs text-slate-400">✕</button>
            </div>

            <div className="space-y-3">
              <SubjectSelect
                value={newSubject}
                onChange={(s) => setNewSubject(s)}
                language={language}
                label="Subject (Choose from List or Enter Custom):"
              />

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-300">Question Title:</label>
                  {isSupported && (
                    <button
                      type="button"
                      onClick={() => toggleVoiceInput('title')}
                      className={`text-[11px] font-bold flex items-center gap-1 px-2 py-0.5 rounded ${
                        isListening && activeVoiceField === 'title'
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
                      }`}
                    >
                      {isListening && activeVoiceField === 'title' ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                      <span>{isListening && activeVoiceField === 'title' ? 'Stop Listening' : 'Voice Title'}</span>
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder={isListening && activeVoiceField === 'title' ? '🎙️ Speak your question title...' : 'e.g. How do I solve long division with remainders?'}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-300">Question Details:</label>
                  {isSupported && (
                    <button
                      type="button"
                      onClick={() => toggleVoiceInput('content')}
                      className={`text-[11px] font-bold flex items-center gap-1 px-2 py-0.5 rounded ${
                        isListening && activeVoiceField === 'content'
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
                      }`}
                    >
                      {isListening && activeVoiceField === 'content' ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                      <span>{isListening && activeVoiceField === 'content' ? 'Stop Listening' : 'Voice Details'}</span>
                    </button>
                  )}
                </div>
                <textarea
                  rows={3}
                  placeholder={isListening && activeVoiceField === 'content' ? '🎙️ Speak details of your problem...' : 'Describe where you get stuck...'}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <button
              onClick={handlePostQuestion}
              disabled={!newTitle || !newContent}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-extrabold text-slate-950 text-xs shadow-lg"
            >
              Post Question (+50 XP)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
