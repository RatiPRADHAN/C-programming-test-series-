/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Trophy, 
  BookOpen, 
  Lightbulb, 
  CheckCircle2, 
  XCircle, 
  RefreshCcw,
  Zap,
  Info,
  Clock,
  LayoutGrid,
  Menu,
  Terminal
} from 'lucide-react';
import { LEVELS } from './data';
import { Level, Test, Question, UserAnswer, TestResult } from './types';

export default function App() {
  const [currentLevel, setCurrentLevel] = useState<Level>(LEVELS[0]);
  const [currentTest, setCurrentTest] = useState<Test | null>(null);
  const [view, setView] = useState<'home' | 'test-select' | 'session' | 'results' | 'summary'>('home');
  const [toolTab, setToolTab] = useState<'info' | 'notes'>('info');
  const [reviewMode, setReviewMode] = useState(false);
  
  // Test State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(900); // 15:00 minutes

  // Load results and notes from local storage
  useEffect(() => {
    const savedResults = localStorage.getItem('c_increment_results');
    const savedNotes = localStorage.getItem('c_increment_user_notes');
    if (savedResults) {
      try {
        setTestResults(JSON.parse(savedResults));
      } catch (e) { console.error(e); }
    }
    if (savedNotes) {
      try {
        setUserNotes(JSON.parse(savedNotes));
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    if (view === 'session' && !reviewMode && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [view, timeLeft, reviewMode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const saveResult = (testId: string, result: TestResult) => {
    const updated = { ...testResults, [testId]: result };
    setTestResults(updated);
    localStorage.setItem('c_increment_results', JSON.stringify(updated));
  };

  const saveUserNote = (levelId: string, note: string) => {
    const updated = { ...userNotes, [levelId]: note };
    setUserNotes(updated);
    localStorage.setItem('c_increment_user_notes', JSON.stringify(updated));
  };

  const startTest = (test: Test, review: boolean = false) => {
    setCurrentTest(test);
    setCurrentQuestionIndex(0);
    setReviewMode(review);
    if (!review) setSelectedAnswers({});
    setView('session');
    setToolTab('info');
    setTimeLeft(900);
  };

  const handleSelectAnswer = (questionId: string, optionId: string) => {
    if (reviewMode) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const evaluateTest = () => {
    if (!currentTest) return;
    const answers: UserAnswer[] = currentTest.questions.map(q => ({
      questionId: q.id,
      selectedOptionId: selectedAnswers[q.id] || '',
      isCorrect: selectedAnswers[q.id] === q.correctAnswer
    }));

    const score = answers.filter(a => a.isCorrect).length;
    const result: TestResult = {
      testId: currentTest.id,
      levelId: currentLevel.id,
      answers,
      score,
      total: currentTest.questions.length,
      timestamp: Date.now()
    };

    saveResult(currentTest.id, result);
    setView('results');
  };

  const getLevelSummary = (levelId: string) => {
    const results = Object.values(testResults).filter(r => (r as TestResult).levelId === levelId) as TestResult[];
    if (results.length === 0) return { score: 0, total: 0, completed: 0 };
    return {
      score: results.reduce<number>((acc, r) => acc + r.score, 0),
      total: results.reduce<number>((acc, r) => acc + r.total, 0),
      completed: results.length
    };
  };

  const renderHome = () => (
    <div className="flex flex-col h-screen bg-brand-bg overflow-hidden">
      <header className="h-16 bg-brand-sidebar border-b border-brand-line flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-2 font-extrabold text-xl text-brand-accent">
          <Terminal size={24} /> C-Increment Pro
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-sm font-medium text-brand-muted">
            <span>Global Mastery Score: {Object.values(testResults).reduce<number>((acc, r) => acc + (r as TestResult).score, 0)}</span>
            <div className="w-8 h-8 rounded-full bg-brand-accent-soft flex items-center justify-center text-brand-accent">
              <Trophy size={16} />
            </div>
          </div>
          <button 
            onClick={() => setView('summary')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-line rounded-lg text-sm font-bold text-brand-ink hover:border-brand-accent transition-all"
          >
            <LayoutGrid size={16} /> Dashboard
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black text-brand-ink mb-2 text-balance">Master the Unary Operator System</h1>
              <p className="text-brand-muted max-w-xl">Progress through 7 tiers of complexity. From simple increments to undefined system stress tests.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LEVELS.map((level, idx) => {
              const summary = getLevelSummary(level.id);
              const isLocked = idx > 0 && getLevelSummary(LEVELS[idx-1].id).completed < 3;
              return (
                <motion.div
                  key={level.id}
                  whileHover={!isLocked ? { y: -4 } : {}}
                  onClick={() => {
                    if (!isLocked) {
                      setCurrentLevel(level);
                      setView('test-select');
                    }
                  }}
                  className={`bg-brand-sidebar border border-brand-line rounded-2xl p-6 relative overflow-hidden group transition-all ${
                    isLocked ? 'opacity-60 grayscale cursor-not-allowed' : 'cursor-pointer hover:border-brand-accent hover:shadow-xl'
                  }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest bg-brand-bg px-2 py-1 rounded">
                      TIER {idx}
                    </span>
                    {summary.completed > 0 && (
                      <div className="flex items-center gap-1 text-xs font-bold text-brand-success">
                        <CheckCircle2 size={14} /> {summary.completed}/5 Tests
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-brand-ink mb-2 group-hover:text-brand-accent transition-colors">
                    {level.name.split('—')[1] || level.name}
                  </h3>
                  <p className="text-brand-muted text-xs leading-relaxed mb-6 line-clamp-2">
                    {level.description}
                  </p>
                  
                  {summary.completed > 0 && (
                    <div className="w-full bg-brand-bg h-1.5 rounded-full mb-6 overflow-hidden">
                      <div 
                        className="bg-brand-success h-full transition-all duration-1000" 
                        style={{ width: `${(summary.completed / 5) * 100}%` }}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-muted">{level.tests.length} Practice Sets</span>
                    {!isLocked && (
                      <div className="w-8 h-8 rounded-full bg-brand-accent-soft text-brand-accent flex items-center justify-center group-hover:bg-brand-accent group-hover:text-white transition-all">
                        <ChevronRight size={18} />
                      </div>
                    )}
                  </div>
                  {isLocked && (
                    <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-brand-muted italic">
                      <BookOpen size={12} /> Complete 3 tests in LVL {idx - 1} to unlock
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );

  const renderTestSelect = () => (
    <div className="flex flex-col h-screen bg-brand-bg">
      <header className="h-16 bg-brand-sidebar border-b border-brand-line flex items-center justify-between px-6 shrink-0">
        <button 
          onClick={() => setView('home')}
          className="flex items-center gap-2 text-brand-muted hover:text-brand-ink font-bold text-sm"
        >
          <ChevronLeft size={20} /> Back to Tiers
        </button>
        <div className="text-sm font-black text-brand-ink uppercase tracking-widest">
          {currentLevel.name}
        </div>
        <div className="w-20" /> {/* Spacer */}
      </header>

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-black text-brand-ink mb-3 italic">Available Practice Missions</h2>
            <p className="text-brand-muted">Each test evaluates different edge cases of the {currentLevel.id.replace('level-', '')} architecture.</p>
          </div>

          <div className="space-y-4">
            {currentLevel.tests.map((test) => {
              const result = testResults[test.id];
              return (
                <div 
                  key={test.id}
                  className="bg-brand-sidebar border border-brand-line rounded-xl p-6 flex items-center justify-between hover:border-brand-accent transition-all group shadow-sm"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-black ${result ? 'bg-brand-success/10 text-brand-success' : 'bg-brand-bg text-brand-muted'}`}>
                      {result ? <CheckCircle2 size={24} /> : <Zap size={24} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-ink group-hover:text-brand-accent transition-colors">{test.name}</h4>
                      <p className="text-xs text-brand-muted">Contains {test.questions.length} intensive logic problems</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    {result && (
                      <div className="text-right">
                        <div className="text-lg font-black text-brand-ink">{result.score}/{result.total}</div>
                        <div className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">Last Performance</div>
                      </div>
                    )}
                    <div className="flex gap-2">
                       {result && (
                        <button 
                          onClick={() => {
                            setSelectedAnswers(result.answers.reduce((acc, a) => ({ ...acc, [a.questionId]: a.selectedOptionId }), {}));
                            startTest(test, true);
                          }}
                          className="px-4 py-2 text-xs font-bold text-brand-accent hover:bg-brand-accent-soft rounded-lg transition-all"
                        >
                          Review Mistakes
                        </button>
                      )}
                      <button 
                        onClick={() => startTest(test)}
                        className="px-6 py-2 bg-brand-accent text-white font-bold rounded-lg text-sm hover:translate-x-1 transition-all"
                      >
                        {result ? 'Retake Mission' : 'Start Mission'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );

  const renderSession = () => {
    if (!currentTest) return null;
    const q = currentTest.questions[currentQuestionIndex];
    const isCompleted = (index: number) => !!selectedAnswers[currentTest.questions[index].id];
    const result = reviewMode ? testResults[currentTest.id] : null;
    const currentAnswer = result?.answers.find(a => a.questionId === q.id);

    return (
      <div className="flex flex-col h-screen bg-brand-bg overflow-hidden selection:bg-brand-accent-soft selection:text-brand-accent">
        <header className="h-16 bg-brand-sidebar border-b border-brand-line flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setView('test-select')}
              className="flex items-center gap-2 text-brand-muted hover:text-brand-ink"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2 font-extrabold text-lg text-brand-accent">
              <Terminal size={20} /> {currentTest.name}
            </div>
            {reviewMode && (
              <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black rounded uppercase tracking-widest">
                Review Mode
              </span>
            )}
          </div>
          <div className="flex items-center gap-6">
            {!reviewMode && (
              <div className="flex items-center gap-2 text-brand-muted text-sm font-medium">
                <Clock size={16} /> 
                Time: <span className="font-bold text-brand-ink">{formatTime(timeLeft)}</span>
              </div>
            )}
            {reviewMode && (
              <button 
                onClick={() => setView('test-select')}
                className="px-4 py-1.5 bg-brand-ink text-white text-[10px] font-bold rounded uppercase tracking-widest"
              >
                Exit Review
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 flex overflow-hidden">
          {/* Left Sidebar: Question List */}
          <aside className="w-64 bg-brand-sidebar border-r border-brand-line flex flex-col shrink-0">
            <div className="p-5 pb-2 text-[11px] font-black text-brand-muted uppercase tracking-[0.1em]">
              Question Progress
            </div>
            <div className="flex-1 overflow-y-auto">
              {currentTest.questions.map((question, i) => {
                const qResult = reviewMode ? result?.answers.find(a => a.questionId === question.id) : null;
                return (
                  <button
                    key={question.id}
                    onClick={() => setCurrentQuestionIndex(i)}
                    className={`w-full px-5 py-4 text-left flex items-center justify-between border-l-4 transition-all ${
                      currentQuestionIndex === i 
                        ? 'bg-brand-accent-soft border-brand-accent text-brand-accent font-bold' 
                        : 'border-transparent text-brand-muted hover:bg-brand-bg'
                    }`}
                  >
                    <span className="text-sm">Q{i + 1}</span>
                    {reviewMode ? (
                      qResult?.isCorrect ? <CheckCircle2 size={14} className="text-brand-success" /> : <XCircle size={14} className="text-red-500" />
                    ) : (
                      <div className={`w-2.5 h-2.5 rounded-full ${isCompleted(i) ? 'bg-brand-success' : 'bg-brand-line'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Center: Content Area */}
          <section className="flex-1 p-8 flex flex-col gap-6 overflow-y-auto">
            <div className="flex items-center justify-between shrink-0">
              <span className="text-xs font-bold text-brand-muted uppercase tracking-widest">
                Mission {currentQuestionIndex + 1} / {currentTest.questions.length}
              </span>
              <span className="text-xs font-medium text-brand-muted">
                Category: <span className="text-brand-ink uppercase font-black">{q.category}</span>
              </span>
            </div>

            <div className="bg-white border border-brand-line rounded-2xl p-8 shadow-md flex-1 flex flex-col">
              <h2 className="text-xl font-bold text-brand-ink mb-6">
                Determine the outcome:
              </h2>
              
              <div className="code-block mb-10 text-base leading-relaxed bg-[#0f1115] rounded-xl">
                {q.code.split('\n').map((line, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="w-6 text-slate-500 select-none text-right font-mono text-sm">{i+1}</span>
                    <span className="font-mono text-slate-200">{line}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-auto">
                {q.options.map((opt) => {
                  const isSelected = selectedAnswers[q.id] === opt.id;
                  const isCorrect = reviewMode && opt.id === q.correctAnswer;
                  const isWrong = reviewMode && isSelected && !isCorrect;
                  
                  return (
                    <button
                      key={opt.id}
                      disabled={reviewMode}
                      onClick={() => handleSelectAnswer(q.id, opt.id)}
                      className={`p-5 rounded-xl border text-left flex items-center transition-all group relative overflow-hidden ${
                        isCorrect ? 'bg-emerald-50 border-emerald-500' :
                        isWrong ? 'bg-red-50 border-red-500' :
                        isSelected ? 'bg-brand-accent-soft border-brand-accent' :
                        'bg-brand-bg border-brand-line hover:border-brand-muted hover:bg-white'
                      }`}
                    >
                      <span className={`w-10 h-10 rounded-lg flex items-center justify-center font-black mr-4 transition-all ${
                        isCorrect ? 'bg-emerald-500 text-white' :
                        isWrong ? 'bg-red-500 text-white' :
                        isSelected ? 'bg-brand-accent text-white' :
                        'bg-white border-2 border-brand-line text-brand-muted group-hover:border-brand-accent/30'
                      }`}>
                        {opt.id}
                      </span>
                      <span className={`font-mono text-xl font-bold ${
                        isCorrect ? 'text-emerald-700' :
                        isWrong ? 'text-red-700' :
                        isSelected ? 'text-brand-accent' : 'text-brand-ink'
                      }`}>
                        {opt.text}
                      </span>
                      {isCorrect && <CheckCircle2 className="absolute right-4 text-emerald-500" size={24} />}
                      {isWrong && <XCircle className="absolute right-4 text-red-500" size={24} />}
                    </button>
                  );
                })}
              </div>

              {reviewMode && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 bg-brand-bg border-l-4 border-brand-accent rounded-r-xl"
                >
                  <h4 className="text-xs font-black text-brand-ink uppercase mb-2 flex items-center gap-2">
                    <Info size={14} className="text-brand-accent" /> Logical Breakdown
                  </h4>
                  <p className="text-sm text-brand-muted leading-relaxed italic">{q.explanation}</p>
                </motion.div>
              )}
            </div>
          </section>

          {/* Right Sidebar: Tools */}
          <aside className="w-80 bg-brand-sidebar border-l border-brand-line flex flex-col shrink-0">
            <div className="flex border-b border-brand-line">
              <button 
                onClick={() => setToolTab('info')}
                className={`flex-1 py-5 text-[11px] font-black uppercase tracking-widest transition-all ${
                  toolTab === 'info' ? 'text-brand-accent border-b-2 border-brand-accent' : 'text-brand-muted hover:text-brand-ink'
                }`}
              >
                Intel & Field Guide
              </button>
              <button 
                onClick={() => setToolTab('notes')}
                className={`flex-1 py-5 text-[11px] font-black uppercase tracking-widest transition-all ${
                  toolTab === 'notes' ? 'text-brand-accent border-b-2 border-brand-accent' : 'text-brand-muted hover:text-brand-ink'
                }`}
              >
                Laboratory Notes
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              <AnimatePresence mode="wait">
                {toolTab === 'info' ? (
                  <motion.div 
                    key="info"
                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                    className="space-y-6"
                  >
                    <div className="bg-brand-accent shadow-lg shadow-brand-accent/20 p-5 rounded-xl text-white">
                      <div className="text-[10px] font-black text-brand-accent-soft uppercase mb-2 flex items-center gap-1">
                        <Zap size={14} fill="currentColor" /> Combat Trick
                      </div>
                      <p className="text-sm font-medium leading-relaxed italic">
                        "{currentLevel.tricks[0]}"
                      </p>
                    </div>
                    <div className="bg-white border border-brand-line p-5 rounded-xl shadow-sm">
                      <div className="text-[10px] font-black text-brand-muted uppercase mb-3 border-b border-brand-bg pb-2 italic">Theoretical Basis</div>
                      <p className="text-xs text-brand-ink leading-relaxed font-medium">
                        {currentLevel.theory}
                      </p>
                    </div>
                    <div className="p-4 border-2 border-dashed border-brand-line rounded-xl">
                      <h5 className="text-[10px] font-black text-brand-muted uppercase mb-2">Tier Intel</h5>
                      <ul className="space-y-2">
                        {currentLevel.tricks.slice(1).map((t, i) => (
                           <li key={i} className="text-[10px] text-brand-ink flex items-start gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-0.5 shrink-0" />
                             {t}
                           </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="notes"
                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                    className="flex flex-col h-full"
                  >
                    <div className="text-[10px] font-black text-brand-muted uppercase mb-4 tracking-tighter">Personal Study Protocol</div>
                    <textarea
                      placeholder="Start drafting your increment/decrement theorems..."
                      value={userNotes[currentLevel.id] || ''}
                      onChange={(e) => saveUserNote(currentLevel.id, e.target.value)}
                      className="flex-1 w-full bg-brand-bg border border-brand-line rounded-xl p-5 text-sm leading-relaxed resize-none focus:outline-none focus:border-brand-accent font-serif shadow-inner"
                    />
                    <div className="mt-4 text-[10px] font-bold text-brand-muted flex items-center gap-2 bg-brand-bg p-3 rounded-lg border border-brand-line">
                      <CheckCircle2 size={12} className="text-brand-success" /> Logic-Link Persistence Active
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </aside>
        </main>

        <footer className="h-20 bg-brand-sidebar border-t border-brand-line flex items-center justify-between px-8 shrink-0">
          <div className="flex gap-4">
            <button 
              onClick={() => setView('test-select')}
              className="px-6 py-2.5 rounded-xl bg-brand-bg border border-brand-line text-brand-ink font-bold text-sm hover:bg-white transition-all shadow-sm"
            >
              Abort Mission
            </button>
            {!reviewMode && (
               <button 
                onClick={() => evaluateTest()}
                className="px-6 py-2.5 rounded-xl bg-white border border-brand-line text-brand-accent font-bold text-sm hover:border-brand-accent transition-all"
              >
                Partial Commit & Exit
              </button>
            )}
          </div>
          
          <div className="flex gap-3">
            <button 
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-brand-bg border border-brand-line text-brand-ink hover:bg-white disabled:opacity-30 transition-all font-black text-xl"
            >
              &larr;
            </button>
            <button 
              onClick={() => {
                if (currentQuestionIndex < currentTest.questions.length - 1) {
                  setCurrentQuestionIndex(prev => prev + 1);
                } else if (!reviewMode) {
                  evaluateTest();
                } else {
                  setView('test-select');
                }
              }}
              className="px-8 h-12 rounded-xl bg-brand-accent text-white font-black text-sm hover:shadow-lg hover:shadow-brand-accent/30 transition-all uppercase tracking-widest"
            >
              {currentQuestionIndex === currentTest.questions.length - 1 ? 
                (reviewMode ? 'Done Reviewing' : 'Execute Final Submit') : 
                'Proceed \u2192'
              }
            </button>
          </div>
        </footer>
      </div>
    );
  };

  const renderResults = () => {
    if (!currentTest) return null;
    const result = testResults[currentTest.id];
    if (!result) return null;
    const percentage = Math.round((result.score / result.total) * 100);

    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-brand-sidebar border-2 border-brand-line rounded-[2.5rem] p-12 shadow-2xl relative overflow-hidden text-center"
        >
          <div className={`absolute top-0 left-0 right-0 h-3 ${percentage >= 80 ? 'bg-brand-success' : 'bg-brand-accent'}`} />
          <div className="w-24 h-24 bg-brand-accent-soft rounded-full flex items-center justify-center text-brand-accent mx-auto mb-8 shadow-inner">
            <Trophy size={48} />
          </div>
          <h2 className="text-4xl font-black text-brand-ink mb-2 italic uppercase tracking-tighter">Mission Accomplished</h2>
          <p className="text-brand-muted mb-10 font-bold">Set: {currentTest.name}</p>
          
          <div className="flex justify-center gap-10 mb-12">
            <div>
              <span className="block text-6xl font-black text-brand-ink tracking-tighter">{result.score}/{result.total}</span>
              <span className="text-[11px] font-black text-brand-muted uppercase tracking-[0.2em]">Logical Accuracy</span>
            </div>
            <div className="w-px bg-brand-line h-16 self-center" />
            <div>
              <span className={`block text-6xl font-black tracking-tighter ${percentage >= 80 ? 'text-brand-success' : 'text-brand-accent'}`}>{percentage}%</span>
              <span className="text-[11px] font-black text-brand-muted uppercase tracking-[0.2em]">Efficiency</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => {
                const updatedAnswers = result.answers.reduce((acc, a) => ({ ...acc, [a.questionId]: a.selectedOptionId }), {});
                setSelectedAnswers(updatedAnswers);
                startTest(currentTest, true);
              }}
              className="py-5 bg-white border-2 border-brand-line text-brand-ink font-black rounded-2xl hover:border-brand-accent transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
            >
              <Terminal size={16}/> Analyze Errors
            </button>
            <button 
              onClick={() => setView('test-select')}
              className="py-5 bg-brand-accent text-white font-black rounded-2xl hover:shadow-xl transition-all uppercase tracking-widest text-xs shadow-lg shadow-brand-accent/30"
            >
              Continue Career
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderSummary = () => {
    return (
      <div className="flex flex-col h-screen bg-brand-bg overflow-hidden">
        <header className="h-16 bg-brand-sidebar border-b border-brand-line flex items-center justify-between px-6 shrink-0 z-10">
          <button 
            onClick={() => setView('home')}
            className="flex items-center gap-2 text-brand-muted hover:text-brand-ink font-bold text-sm"
          >
            <ChevronLeft size={20} /> Back to Selection
          </button>
          <div className="font-extrabold text-brand-ink uppercase tracking-px">System Progress Dashboard</div>
          <div className="w-20" />
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
               {[
                 { label: 'Tiers Discovered', val: Object.keys(testResults).length > 0 ? LEVELS.filter(l => getLevelSummary(l.id).completed > 0).length : 0, icon: LayoutGrid, color: 'text-brand-accent' },
                 { label: 'Missions Passed', val: Object.values(testResults).length, icon: CheckCircle2, color: 'text-brand-success' },
                 { label: 'Logical Faults', val: Object.values(testResults).reduce<number>((acc, r) => acc + ((r as TestResult).total - (r as TestResult).score), 0), icon: XCircle, color: 'text-red-500' },
                 { label: 'Knowledge Points', val: Object.values(testResults).reduce<number>((acc, r) => acc + (r as TestResult).score, 0) * 10, icon: Zap, color: 'text-amber-500' }
               ].map((stat, i) => (
                 <div key={i} className="bg-brand-sidebar border border-brand-line p-6 rounded-2xl shadow-sm">
                   <div className={`${stat.color} mb-3`}><stat.icon size={24} /></div>
                   <div className="text-3xl font-black text-brand-ink tracking-tight">{stat.val}</div>
                   <div className="text-[10px] font-black text-brand-muted uppercase tracking-widest">{stat.label}</div>
                 </div>
               ))}
             </div>

             <div className="bg-brand-sidebar border border-brand-line rounded-[2rem] overflow-hidden shadow-xl">
               <div className="p-8 border-b border-brand-line bg-brand-bg/50">
                 <h3 className="text-xl font-black text-brand-ink italic">Tier Performance Analytics</h3>
               </div>
               <div className="divide-y divide-brand-line">
                 {LEVELS.map((level) => {
                   const summary = getLevelSummary(level.id);
                   const efficiency = summary.total > 0 ? Math.round((summary.score / summary.total) * 100) : 0;
                   return (
                     <div key={level.id} className="p-8 flex items-center justify-between hover:bg-brand-bg/30 transition-all">
                       <div className="flex items-center gap-6 flex-1">
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl ${summary.completed > 0 ? 'bg-brand-accent text-white' : 'bg-brand-bg text-brand-muted'}`}>
                           {level.id.split('-')[1].toUpperCase()}
                         </div>
                         <div className="flex-1">
                           <h4 className="text-lg font-black text-brand-ink">{level.name.split('—')[1] || level.name}</h4>
                           <div className="flex items-center gap-4 mt-2">
                             <div className="flex-1 max-w-xs bg-brand-bg h-2 rounded-full overflow-hidden">
                               <div className="bg-brand-accent h-full transition-all" style={{ width: `${efficiency}%` }} />
                             </div>
                             <span className="text-xs font-black text-brand-accent">{efficiency}% Efficiency</span>
                           </div>
                         </div>
                       </div>

                       <div className="flex gap-12 text-right px-12 border-x border-brand-line">
                         <div>
                            <div className="text-xl font-black text-brand-ink">{summary.completed}/5</div>
                            <div className="text-[9px] font-bold text-brand-muted uppercase tracking-[0.15em]">Missions</div>
                         </div>
                         <div>
                            <div className="text-xl font-black text-brand-ink">{summary.score}</div>
                            <div className="text-[9px] font-bold text-brand-muted uppercase tracking-[0.15em]">Core Logic Points</div>
                         </div>
                       </div>

                       <div className="pl-12 w-48">
                         <div className="text-xs font-black text-brand-ink mb-1">Status:</div>
                         <div className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${summary.completed === 5 ? 'text-brand-success' : 'text-brand-accent'}`}>
                            {summary.completed === 5 ? <CheckCircle2 size={12} /> : <Zap size={12} />}
                            {summary.completed === 5 ? 'Tier Mastered' : 
                             summary.completed > 0 ? 'Training Active' : 'Uninitialized'}
                         </div>
                       </div>
                     </div>
                   );
                 })}
               </div>
             </div>
          </div>
        </main>
      </div>
    );
  };

  return (
    <div className="font-sans antialiased text-brand-ink selection:bg-brand-accent/10">
      {view === 'home' && renderHome()}
      {view === 'test-select' && renderTestSelect()}
      {view === 'session' && renderSession()}
      {view === 'results' && renderResults()}
      {view === 'summary' && renderSummary()}
    </div>
  );
}
