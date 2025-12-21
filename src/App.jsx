import { useState } from 'react';
import './App.css';
import { QuestionForm } from '@/components/QuestionForm';
import { QuestionDisplay } from '@/components/QuestionDisplay';
import { generateQuestions } from '@/services/openai';

function App() {
  const [questionsData, setQuestionsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateQuestions = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateQuestions(formData);
      setQuestionsData(data);
    } catch (err) {
      setError(err.message || 'Failed to generate questions. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuestion = (updatedQuestion) => {
    setQuestionsData((prevData) => ({
      ...prevData,
      questions: prevData.questions.map((q) =>
        q.id === updatedQuestion.id ? updatedQuestion : q
      ),
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-ukraine-blue">
            Singapore Math Question Generator
          </h1>
          <p className="text-gray-600">
            Generate practice questions powered by AI
          </p>
        </header>

        <QuestionForm
          onGenerateQuestions={handleGenerateQuestions}
          isLoading={isLoading}
        />

        {error && (
          <div className="max-w-2xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {questionsData && (
          <QuestionDisplay
            questionsData={questionsData}
            onUpdateQuestion={handleUpdateQuestion}
          />
        )}
      </div>
    </div>
  );
}

export default App;
