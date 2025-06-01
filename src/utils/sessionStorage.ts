import { Question } from '@/types';

// Definition of a quiz session to be saved
export interface QuizSession {
  id: string;
  title: string;
  questions: Question[];
  userAnswers: (number | null)[];
  currentQuestionIndex: number;
  createdAt: string;
  lastUpdatedAt: string;
}

// Save current quiz session to localStorage
export const saveQuizSession = (
  session: Omit<QuizSession, 'lastUpdatedAt'> & { lastUpdatedAt?: string }
): void => {
  const savedSession: QuizSession = {
    ...session,
    lastUpdatedAt: new Date().toISOString()
  };
  
  // Get existing sessions
  const existingSessionsStr = localStorage.getItem('mcq-quiz-sessions');
  const existingSessions: QuizSession[] = existingSessionsStr 
    ? JSON.parse(existingSessionsStr) 
    : [];
  
  // Check if this session already exists (by ID)
  const sessionIndex = existingSessions.findIndex(s => s.id === savedSession.id);
  
  if (sessionIndex !== -1) {
    // Update existing session
    existingSessions[sessionIndex] = savedSession;
  } else {
    // Add new session
    existingSessions.push(savedSession);
  }
  
  // Save back to localStorage - keep only most recent 10 sessions
  const recentSessions = existingSessions
    .sort((a, b) => new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime())
    .slice(0, 10);
  
  localStorage.setItem('mcq-quiz-sessions', JSON.stringify(recentSessions));
};

// Get all saved quiz sessions
export const getQuizSessions = (): QuizSession[] => {
  const sessionsStr = localStorage.getItem('mcq-quiz-sessions');
  if (!sessionsStr) return [];
  
  try {
    return JSON.parse(sessionsStr) as QuizSession[];
  } catch (e) {
    console.error('Failed to parse saved quiz sessions', e);
    return [];
  }
};

// Delete a specific quiz session
export const deleteQuizSession = (id: string): void => {
  const sessionsStr = localStorage.getItem('mcq-quiz-sessions');
  if (!sessionsStr) return;
  
  try {
    const sessions = JSON.parse(sessionsStr) as QuizSession[];
    const updatedSessions = sessions.filter(s => s.id !== id);
    localStorage.setItem('mcq-quiz-sessions', JSON.stringify(updatedSessions));
  } catch (e) {
    console.error('Failed to delete quiz session', e);
  }
};
