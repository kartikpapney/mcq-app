import React from 'react';
import { Question } from '@/types';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: number | null;
  onSelectAnswer: (optionIndex: number) => void;
  showResult: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  selectedAnswer, 
  onSelectAnswer, 
  showResult 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <h3 className="text-xl font-semibold mb-4">{question.question}</h3>
      
      <div className="space-y-3">
        {question.options.map((option, index) => {
          // Logic for styling options based on selection and correctness
          let optionClassName = "block w-full text-left p-4 rounded-md border transition-colors";
          
          if (showResult) {
            if (index === question.correctAnswerIndex) {
              // Correct answer
              optionClassName += " bg-green-100 border-green-500";
            } else if (index === selectedAnswer) {
              // Wrong selected answer
              optionClassName += " bg-red-100 border-red-500";
            } else {
              // Unselected options
              optionClassName += " bg-gray-50 border-gray-200";
            }
          } else {
            // Before showing results
            if (index === selectedAnswer) {
              optionClassName += " bg-blue-100 border-blue-500";
            } else {
              optionClassName += " bg-gray-50 border-gray-200 hover:bg-gray-100";
            }
          }
          
          return (
            <button
              key={index}
              className={optionClassName}
              onClick={() => onSelectAnswer(index)}
              disabled={showResult}
            >
              <div className="flex items-start">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-gray-800 text-sm font-medium mr-3">
                  {String.fromCharCode(65 + index)} {/* Displays A, B, C, D */}
                </span>
                <span>{option}</span>
              </div>
            </button>
          );
        })}
      </div>
      
      {showResult && (
        <div className="mt-4 pt-3 border-t">
          <div className="mb-2">
            {selectedAnswer === question.correctAnswerIndex ? (
              <p className="text-green-600 font-medium">Correct!</p>
            ) : (
              <p className="text-red-600 font-medium">
                Incorrect. The correct answer is {String.fromCharCode(65 + question.correctAnswerIndex)}.
              </p>
            )}
          </div>
          
          {/* Explanation section */}
          {question.explanation && (
            <div className="bg-blue-50 p-4 rounded-md mt-3">
              <h4 className="text-sm font-semibold text-blue-800 mb-1">Explanation:</h4>
              <p className="text-sm text-blue-900">{question.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
