import React, { useState, useEffect } from 'react';
import { QuizSession, getQuizSessions, deleteQuizSession } from '@/utils/sessionStorage';

interface QuizSessionsProps {
  onLoadSession: (session: QuizSession) => void;
}

const QuizSessions: React.FC<QuizSessionsProps> = ({ onLoadSession }) => {
  const [sessions, setSessions] = useState<QuizSession[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setSessions(getQuizSessions());
    }
  }, [isOpen]);
  
  const handleDelete = (id: string) => {
    deleteQuizSession(id);
    setSessions(sessions.filter(s => s.id !== id));
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium', 
      timeStyle: 'short'
    }).format(date);
  };
  
  if (sessions.length === 0 && isOpen) {
    return (
      <div className="mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-blue-600 hover:text-blue-800 flex items-center mb-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          {isOpen ? 'Hide Saved Quizzes' : 'Continue Saved Quiz'}
        </button>
        
        {isOpen && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <p className="text-gray-500 italic">No saved quizzes found.</p>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-blue-600 hover:text-blue-800 flex items-center mb-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        {isOpen ? 'Hide Saved Quizzes' : 'Continue Saved Quiz'}
      </button>
      
      {isOpen && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h3 className="font-medium mb-3">Your Saved Quizzes</h3>
          
          <ul className="divide-y divide-gray-200">
            {sessions.map(session => {
              const completedQuestions = session.userAnswers.filter(a => a !== null).length;
              const progressPercent = Math.round((completedQuestions / session.questions.length) * 100);
              
              return (
                <li key={session.id} className="py-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{session.title}</h4>
                      <p className="text-sm text-gray-600">
                        {completedQuestions} of {session.questions.length} questions answered 
                        ({progressPercent}% complete)
                      </p>
                      <p className="text-xs text-gray-500">
                        Last updated: {formatDate(session.lastUpdatedAt)}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => onLoadSession(session)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Continue
                      </button>
                      <button 
                        onClick={() => handleDelete(session.id)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuizSessions;
