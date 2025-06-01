import React, { useState } from 'react';

interface QuestionGeneratorFormProps {
  onSubmit: (prompt: string, number: number, difficulty: string, subject?: string) => void;
  isLoading: boolean;
  initialValues?: {
    prompt?: string;
    numberOfQuestions?: number;
    difficulty?: string;
    subject?: string;
  };
}

const QuestionGeneratorForm: React.FC<QuestionGeneratorFormProps> = ({ 
  onSubmit, 
  isLoading,
  initialValues
}) => {
  const [prompt, setPrompt] = useState(initialValues?.prompt || '');
  const [numberOfQuestions, setNumberOfQuestions] = useState(initialValues?.numberOfQuestions || 5);
  const [difficulty, setDifficulty] = useState(initialValues?.difficulty || 'medium');
  const [subject, setSubject] = useState(initialValues?.subject || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(prompt, numberOfQuestions, difficulty, subject);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="mb-4">
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
          Topic/Question Prompt *
        </label>
        <textarea
          id="prompt"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="E.g., World War II, JavaScript basics, Solar System..."
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          Enter a topic, concept, or specific instructions for the questions you want to generate.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="numberOfQuestions" className="block text-sm font-medium text-gray-700 mb-1">
            Number of Questions
          </label>
          <input
            type="number"
            id="numberOfQuestions"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={1}
            max={10}
            value={numberOfQuestions}
            onChange={(e) => setNumberOfQuestions(parseInt(e.target.value))}
          />
        </div>

        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty
          </label>
          <select
            id="difficulty"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject (Optional)
          </label>
          <input
            type="text"
            id="subject"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="E.g., History, Science, Math..."
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className={`px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? (
            <>
              <span className="inline-block animate-spin mr-2">⟳</span>
              Generating...
            </>
          ) : (
            'Generate Questions'
          )}
        </button>
      </div>
    </form>
  );
};

export default QuestionGeneratorForm;
