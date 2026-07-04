import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export type QuestionType = 'multiple_choice' | 'fill_in_the_blank' | 'error_correction';

interface QuestionData {
  question: string;
  options?: string[];
  answer: string | number;
  analysis: string;
  correct_version?: string;
  error_part?: string;
  explanation?: string;
}

interface QuestionCardProps {
  type: QuestionType;
  data: QuestionData;
  onComplete?: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ type, data, onComplete }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleCheck = () => {
    // Simple check logic for demo
    let correct = false;
    if (type === 'multiple_choice') {
      correct = selectedOption === data.answer;
    } else if (type === 'fill_in_the_blank') {
      correct = inputValue.trim().toLowerCase() === (data.answer as string).toLowerCase();
    } else if (type === 'error_correction') {
      // For error correction, we assume if they type anything, we show the correct one
      // In a real app, this would be more complex
      correct = true; 
    }

    setIsCorrect(correct);
    setShowAnswer(true);
    if (correct) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const renderQuestion = () => {
    switch (type) {
      case 'multiple_choice':
        return (
          <div className="space-y-4">
            <p className="text-xl font-semibold text-slate-800 leading-relaxed">{data.question}</p>
            <div className="grid gap-3">
              {data.options?.map((opt, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => !showAnswer && setSelectedOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedOption === idx 
                      ? 'border-indigo-500 bg-indigo-50 ring-4 ring-indigo-100' 
                      : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                  } ${showAnswer && idx === data.answer ? 'border-green-500 bg-green-50' : ''}
                    ${showAnswer && selectedOption === idx && idx !== data.answer ? 'border-red-500 bg-red-50' : ''}`}
                  disabled={showAnswer}
                >
                  <div className="flex items-center">
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 text-sm mr-3">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-slate-700 font-medium">{opt}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );
      case 'fill_in_the_blank':
        return (
          <div className="space-y-6">
            <p className="text-xl font-semibold text-slate-800 leading-relaxed">{data.question}</p>
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className={`w-full p-4 text-lg border-2 rounded-xl outline-none transition-all ${
                  showAnswer 
                    ? (inputValue.trim().toLowerCase() === (data.answer as string).toLowerCase() ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50')
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
                }`}
                placeholder="输入你的答案..."
                disabled={showAnswer}
              />
            </div>
          </div>
        );
      case 'error_correction':
        return (
          <div className="space-y-6">
            <p className="text-xl font-semibold text-slate-800 leading-relaxed">{data.question}</p>
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className={`w-full p-4 text-lg border-2 rounded-xl outline-none transition-all ${
                  showAnswer 
                    ? 'border-green-500 bg-green-50'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
                }`}
                placeholder="请写出正确的句子..."
                disabled={showAnswer}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={type + JSON.stringify(data.question)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full"
      >
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/60 min-h-[450px] flex flex-col">
          {renderQuestion()}

          <div className="mt-auto pt-8">
            {!showAnswer ? (
              <button
                onClick={handleCheck}
                disabled={type === 'multiple_choice' && selectedOption === null}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                检查答案
              </button>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {isCorrect === true && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-green-600 font-bold text-center"
                    >
                      🎉 太棒了！回答正确
                    </motion.div>
                  )}
                  {isCorrect === false && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-red-500 font-bold text-center"
                    >
                      ❌ 哎呀，再试一次吧
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {setShowAnswer(false); setInputValue(''); setSelectedOption(null); setIsCorrect(null);}}
                    className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-semibold hover:bg-slate-200 transition-all"
                  >
                    再来一题
                  </button>
                  {onComplete && (
                    <button
                      onClick={onComplete}
                      className="px-6 py-4 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                    >
                      下一条
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {showAnswer && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100"
            >
              <h4 className="text-indigo-900 font-bold text-lg mb-2 flex items-center">
                <span className="w-2 h-6 bg-indigo-500 rounded-full mr-2" />
                知识解析
              </h4>
              <p className="text-slate-600 leading-relaxed">{data.analysis}</p>
              {type === 'error_correction' && data.correct_version && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">正确表述</p>
                  <p className="text-green-600 font-medium text-lg">{data.correct_version}</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
