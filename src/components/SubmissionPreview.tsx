import React from 'react';
import { Question } from '@/types';

interface SubmissionPreviewProps {
  questions: Question[];
  userAnswers: (number | null)[];
  onEdit: () => void;
  onSubmit: () => void;
}

const SubmissionPreview: React.FC<SubmissionPreviewProps> = ({
  questions,
  userAnswers,
  onEdit,
  onSubmit,
}) => {
  // Calculate how many questions have been answered
  const answeredCount = userAnswers.filter(answer => answer !== null).length;
  const isComplete = answeredCount === questions.length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Submission Preview</h2>
        <span className="text-sm font-medium px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
          {answeredCount} of {questions.length} answered
        </span>
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => {
          const userAnswer = userAnswers[index];
          const hasAnswered = userAnswer !== null;
          
          return (
            <div key={question.id} className="border-b pb-4 last:border-b-0">
              <div className="flex items-start mb-2">
                <span className="font-semibold mr-2">{index + 1}.</span>
                <span>{question.question}</span>
              </div>
              
              <div className="pl-6 space-y-2 mt-3">
                {question.options.map((option, optIndex) => (
                  <div 
                    key={optIndex} 
                    className={`flex items-center p-2 rounded-md ${
                      userAnswer === optIndex ? 'bg-blue-50 border border-blue-300' : ''
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                      userAnswer === optIndex ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300'
                    }`}>
                      {userAnswer === optIndex && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className={userAnswer === optIndex ? 'text-blue-700' : ''}>{option}</span>
                  </div>
                ))}

                {!hasAnswered && (
                  <div className="text-sm text-red-500 mt-1">
                    {`You haven't answered this question yet.`}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onEdit}
          className="px-6 py-2 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          Edit Answers
        </button>
        <button
          onClick={onSubmit}
          disabled={!isComplete}
          className={`px-6 py-2 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isComplete 
              ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500' 
              : 'bg-blue-200 text-blue-700 cursor-not-allowed'
          }`}
        >
          {isComplete ? 'Submit' : 'Answer All Questions to Submit'}
        </button>
      </div>
    </div>
  );
};

export default SubmissionPreview;
