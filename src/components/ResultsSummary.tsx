import React, { useState } from 'react';
import { Question } from '@/types';

interface ResultsSummaryProps {
  totalQuestions: number;
  correctAnswers: number;
  questions: Question[];
  userAnswers: (number | null)[];
  onReset: () => void;
  onGenerateNew: () => void;
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  totalQuestions,
  correctAnswers,
  questions,
  userAnswers,
  onReset,
  onGenerateNew,
}) => {
  const [showQuestions, setShowQuestions] = useState(false);
  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState<number | null>(null);
  
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  
  // Determine feedback message based on score
  let feedbackMessage = '';
  if (percentage >= 90) {
    feedbackMessage = 'Excellent! You have mastered this topic!';
  } else if (percentage >= 70) {
    feedbackMessage = 'Great job! You have a good understanding of this topic.';
  } else if (percentage >= 50) {
    feedbackMessage = `Good effort. You're making progress on this topic.`;
  } else {
    feedbackMessage = `Keep practicing. You'll improve with more study.`;
  }

  const toggleQuestionExpand = (index: number) => {
    if (expandedQuestionIndex === index) {
      setExpandedQuestionIndex(null);
    } else {
      setExpandedQuestionIndex(index);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
      
      <div className="flex justify-center mb-6">
        <div className="relative inline-flex items-center justify-center">
          <svg className="w-32 h-32">
            <circle
              className="text-gray-200"
              strokeWidth="12"
              stroke="currentColor"
              fill="transparent"
              r="56"
              cx="64"
              cy="64"
            />
            <circle
              className={`${
                percentage >= 70 ? 'text-green-500' : percentage >= 40 ? 'text-yellow-500' : 'text-red-500'
              }`}
              strokeWidth="12"
              strokeDasharray={360}
              strokeDashoffset={360 - (360 * percentage) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="56"
              cx="64"
              cy="64"
              transform="rotate(-90 64 64)"
            />
          </svg>
          <span className="absolute text-3xl font-bold">{percentage}%</span>
        </div>
      </div>
      
      <p className="text-lg mb-2">
        You answered <span className="font-bold text-green-600">{correctAnswers}</span> out of{' '}
        <span className="font-bold">{totalQuestions}</span> questions correctly.
      </p>
      
      <p className="text-gray-600 mb-6">{feedbackMessage}</p>
      
      <div className="flex justify-center space-x-4">
        <button
          onClick={onReset}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Try Again
        </button>
        <button
          onClick={onGenerateNew}
          className="px-6 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          New Questions
        </button>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => setShowQuestions(!showQuestions)}
          className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {showQuestions ? 'Hide Review Mode' : 'Review All Answers'}
        </button>
      </div>

      {showQuestions && (
        <div className="mt-6 space-y-6">
          <div className="bg-indigo-50 p-4 rounded-md mb-4">
            <h3 className="text-xl font-semibold mb-2">Question Review</h3>
            <p className="text-gray-700">
              Click on any question to see the correct answers and explanations. 
              <span className="inline-block mt-1">
                <span className="inline-flex items-center justify-center w-5 h-5 bg-green-500 text-white rounded-full mr-1">✓</span> shows correct answers.
                {correctAnswers !== totalQuestions && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 bg-red-500 text-white rounded-full mr-1">✗</span>
                )}
                {correctAnswers !== totalQuestions && " shows your incorrect answers."}
              </span>
            </p>
          </div>
          {questions.map((question, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === question.correctAnswerIndex;

            return (
              <div key={question.id} className="bg-white border rounded-lg p-4 mb-4 shadow-sm">
                <div 
                  className="flex justify-between items-start cursor-pointer" 
                  onClick={() => toggleQuestionExpand(index)}
                >
                  <div className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full mr-3 text-white bg-gray-700">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{question.question}</p>
                      <div className="flex items-center mt-1">
                        <span className={`px-2 py-1 text-xs rounded ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 text-gray-400 transition-transform ${expandedQuestionIndex === index ? 'transform rotate-180' : ''}`} 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>

                {expandedQuestionIndex === index && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="space-y-3">
                      {question.options.map((option, optIndex) => {
                        let optionClass = "p-2 rounded";
                        
                        if (optIndex === question.correctAnswerIndex) {
                          optionClass += " bg-green-50 border border-green-200";
                        } else if (optIndex === userAnswer) {
                          optionClass += " bg-red-50 border border-red-200";
                        }

                        return (
                          <div key={optIndex} className={optionClass}>
                            <div className="flex items-center">
                              {optIndex === question.correctAnswerIndex && (
                                <span className="inline-flex items-center justify-center w-6 h-6 bg-green-500 text-white rounded-full mr-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </span>
                              )}
                              {optIndex === userAnswer && optIndex !== question.correctAnswerIndex && (
                                <span className="inline-flex items-center justify-center w-6 h-6 bg-red-500 text-white rounded-full mr-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </span>
                              )}
                              {optIndex !== userAnswer && optIndex !== question.correctAnswerIndex && (
                                <span className="w-6 h-6 mr-2"></span>
                              )}
                              <span>{option}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {question.explanation && (
                      <div className="mt-4 bg-blue-50 p-3 rounded-md text-sm text-blue-800">
                        <p className="font-medium mb-1">Explanation:</p>
                        <p>{question.explanation}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ResultsSummary;
