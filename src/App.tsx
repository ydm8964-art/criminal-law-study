import { useState } from 'react';
import lawData from './data/law_data.json';
import { QuestionCard, type QuestionType } from './components/QuestionCard';
import { BookOpen, CheckCircle2, Edit3, ListChecks, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const [currentArticleIdx, setCurrentArticleIdx] = useState(0);
  const [currentType, setCurrentType] = useState<QuestionType>('multiple_choice');

  const article = lawData[currentArticleIdx];

  const nextArticle = () => {
    if (currentArticleIdx < lawData.length - 1) {
      setCurrentArticleIdx(currentArticleIdx + 1);
    }
  };

  const prevArticle = () => {
    if (currentArticleIdx > 0) {
      setCurrentArticleIdx(currentArticleIdx - 1);
    }
  };

  const getProgress = () => ((currentArticleIdx + 1) / lawData.length) * 100;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-50/50 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-50/50 blur-[120px]" />
      </div>

      <div className="relative z-10">
        <header className="max-w-4xl mx-auto px-4 pt-8 pb-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <BookOpen className="text-white" size={22} />
              </div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">刑法学习助手</h1>
            </div>
            <div className="text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
              进度: <span className="text-indigo-600">{currentArticleIdx + 1} / {lawData.length}</span>
            </div>
          </div>
          
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-indigo-600" 
              initial={{ width: 0 }}
              animate={{ width: `${getProgress()}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.section 
              key={currentArticleIdx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="mb-10"
            >
              <div className="bg-indigo-900/5 text-indigo-800/80 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest mb-3 inline-block">
                {article.article} {article.title}
              </div>
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white shadow-sm">
                <p className="text-lg text-slate-700 leading-relaxed italic">
                  "{article.content}"
                </p>
              </div>
            </motion.section>
          </AnimatePresence>

          <div className="flex p-1 bg-slate-200/50 rounded-2xl mb-8">
            {[
              { id: 'multiple_choice', label: '选择题', icon: ListChecks },
              { id: 'fill_in_the_blank', label: '填空题', icon: Edit3 },
              { id: 'error_correction', label: '改错题', icon: CheckCircle2 },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setCurrentType(mode.id as QuestionType)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  currentType === mode.id 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <mode.icon size={16} />
                <span className="hidden sm:inline">{mode.label}</span>
              </button>
            ))}
          </div>

          <div className="min-h-[480px]">
            {article.questions[currentType] && article.questions[currentType].length > 0 ? (
              article.questions[currentType].map((q, i) => (
                <QuestionCard 
                  key={i} 
                  type={currentType} 
                  data={q as any} 
                  onComplete={nextArticle}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <ListChecks size={32} />
                </div>
                <p>暂无此类题型</p>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-8 items-center">
             <button
              onClick={prevArticle}
              disabled={currentArticleIdx === 0}
              className="flex items-center gap-2 px-5 py-2.5 text-slate-500 font-medium hover:text-indigo-600 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={20} />
              上一条
            </button>
            <button
              onClick={nextArticle}
              disabled={currentArticleIdx === lawData.length - 1}
              className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 rounded-2xl shadow-sm border border-slate-200 font-bold hover:shadow-md transition-all disabled:opacity-30"
            >
              下一条
              <ChevronRight size={20} />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
