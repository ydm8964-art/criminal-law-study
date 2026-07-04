import { useState } from 'react';
import lawData from './data/law_data.json';
import { QuestionCard, type QuestionType } from './components/QuestionCard';

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

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      <header className="bg-blue-700 text-white py-6 shadow-md mb-8">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">刑法学习助手</h1>
          <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">
            {currentArticleIdx + 1} / {lawData.length} 条
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4">
        <section className="bg-white p-6 rounded-xl shadow-sm mb-8 border-l-4 border-blue-500">
          <h2 className="text-xl font-bold mb-2">{article.article} {article.title}</h2>
          <p className="text-gray-700 leading-relaxed text-lg italic">
            "{article.content}"
          </p>
        </section>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setCurrentType('multiple_choice')}
            className={`px-4 py-2 rounded-full transition ${
              currentType === 'multiple_choice' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'
            }`}
          >
            选择题
          </button>
          <button
            onClick={() => setCurrentType('fill_in_the_blank')}
            className={`px-4 py-2 rounded-full transition ${
              currentType === 'fill_in_the_blank' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'
            }`}
          >
            填空题
          </button>
          <button
            onClick={() => setCurrentType('error_correction')}
            className={`px-4 py-2 rounded-full transition ${
              currentType === 'error_correction' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'
            }`}
          >
            改错题
          </button>
        </div>

        <div className="min-h-[400px]">
          {article.questions[currentType] && article.questions[currentType].length > 0 ? (
            article.questions[currentType].map((q, i) => (
              <QuestionCard key={i} type={currentType} data={q as any} />
            ))
          ) : (
            <div className="text-center text-gray-500 mt-20">
              暂无此类题型
            </div>
          )}
        </div>

        <div className="flex justify-between mt-12">
          <button
            onClick={prevArticle}
            disabled={currentArticleIdx === 0}
            className="px-6 py-2 bg-white text-gray-700 rounded-lg shadow border disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一条
          </button>
          <button
            onClick={nextArticle}
            disabled={currentArticleIdx === lawData.length - 1}
            className="px-6 py-2 bg-white text-gray-700 rounded-lg shadow border disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一条
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;
