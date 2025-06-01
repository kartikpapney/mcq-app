export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string; // Explanation of why the correct answer is right
}

export interface QuestionGenerationRequest {
  prompt: string;
  numberOfQuestions?: number; // Optional parameter with default value
  difficulty?: 'easy' | 'medium' | 'hard'; // Optional difficulty setting
  subject?: string; // Optional subject matter
}

export interface Template {
  id: string;
  name: string;
  prompt: string;
  numberOfQuestions: number;
  difficulty: 'easy' | 'medium' | 'hard';
  subject?: string;
  createdAt: string;
}
