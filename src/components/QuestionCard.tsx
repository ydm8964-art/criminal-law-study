import React, { useState } from 'react';

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
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ type, data }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleCheck = () => setShowAnswer(true);

  const renderQuestion = () => {
    switch (type) {
      case 'multiple_choice':
        return (
          <div className="space-y-3">
            <p className="text-lg font-medium mb-4">{data.question}</p>
            {data.options?.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedOption(idx)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedOption === idx 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                {idx + 1}. {opt}
              </button>
            ))}
          </div>
        );
      case 'fill_in_the_blank':
        return (
          <div className="space-y-3">
            <p className="text-lg font-medium mb-4">{data.question}</p>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="输入答案..."
            />
          </div>
        );
      case 'error_correction':
        return (
          <div className="space-y-3">
            <p className="text-lg font-medium mb-4">{data.question}</p>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="输入修正后的句子..."
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto">
      {renderQuestion()}

      <div className="mt-6 flex gap-4">
        {!showAnswer ? (
          <button
            onClick={handleCheck}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            提交答案
          </button>
        ) : (
          <button
            onClick={() => {setShowAnswer(false); setInputValue(''); setSelectedOption(null);}}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            下一题
          </button>
        )}
      </div>

      {showAnswer && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
          <h4 className="font-bold text-blue-700">解析：</h4>
          <p className="mt-1">{data.analysis}</p>
          {type === 'error_correction' && data.correct_version && (
            <div className="mt-2">
              <p className="font-bold">正确表述：</p>
              <p className="text-green-700">{data.correct_version}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
