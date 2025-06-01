'use client';

import { useState } from 'react';
import { Question, Template } from '@/types';
import QuestionGeneratorForm from '@/components/QuestionGeneratorForm';
import QuestionCard from '@/components/QuestionCard';
import ResultsSummary from '@/components/ResultsSummary';
import TemplateManager from '@/components/TemplateManager';
import SaveTemplateModal from '@/components/SaveTemplateModal';
import SubmissionPreview from '@/components/SubmissionPreview';

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatorVisible, setGeneratorVisible] = useState(true);
  
  // Template related state
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [currentNumberOfQuestions, setCurrentNumberOfQuestions] = useState<number>(5);
  const [currentDifficulty, setCurrentDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [currentSubject, setCurrentSubject] = useState<string | undefined>(undefined);
  const [isSaveTemplateModalOpen, setSaveTemplateModalOpen] = useState<boolean>(false);

  const generateQuestions = async (
    prompt: string, 
    numberOfQuestions: number, 
    difficulty: string,
    subject?: string
  ) => {
    // Save current parameters for potential template saving
    setCurrentPrompt(prompt);
    setCurrentNumberOfQuestions(numberOfQuestions);
    setCurrentDifficulty(difficulty as 'easy' | 'medium' | 'hard');
    setCurrentSubject(subject);
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          numberOfQuestions,
          difficulty,
          subject
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate questions');
      }
      
      const data = await response.json();
      setQuestions(data.questions);
      setCurrentQuestionIndex(0);
      setUserAnswers(Array(data.questions.length).fill(null));
      setHasSubmitted(false);
      setGeneratorVisible(false);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAnswer = (optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handlePreviewSubmission = () => {
    setIsPreviewMode(true);
  };
  
  const handleReturnToQuiz = () => {
    setIsPreviewMode(false);
  };

  const handleSubmit = () => {
    setHasSubmitted(true);
    setIsPreviewMode(false);
  };

  const handleReset = () => {
    setUserAnswers(Array(questions.length).fill(null));
    setCurrentQuestionIndex(0);
    setHasSubmitted(false);
    setIsPreviewMode(false);
  };

  const handleGenerateNew = () => {
    setQuestions([]);
    setUserAnswers([]);
    setGeneratorVisible(true);
  };
  
  // Template management functions
  const handleOpenSaveTemplateModal = () => {
    if (currentPrompt) {
      setSaveTemplateModalOpen(true);
    } else {
      setError('No current quiz to save as template.');
    }
  };
  
  const handleSaveTemplate = (template: Template) => {
    // Get existing templates from localStorage
    const existingTemplatesStr = localStorage.getItem('mcq-templates');
    const existingTemplates: Template[] = existingTemplatesStr 
      ? JSON.parse(existingTemplatesStr) 
      : [];
    
    // Add new template to the array
    const updatedTemplates = [...existingTemplates, template];
    
    // Save back to localStorage
    localStorage.setItem('mcq-templates', JSON.stringify(updatedTemplates));
  };
  
  const handleLoadTemplate = (template: Template) => {
    // Load the template and generate questions
    generateQuestions(
      template.prompt,
      template.numberOfQuestions,
      template.difficulty,
      template.subject
    );
  };

  const totalAnswered = userAnswers.filter(answer => answer !== null).length;
  const correctAnswers = hasSubmitted
    ? userAnswers.reduce(
        (count, answer, index) =>
          answer === questions[index].correctAnswerIndex ? (count ?? 0) + 1 : count,
        0
      ) ?? 0
    : 0;

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">MCQ Generator</h1>
          <p className="text-lg text-gray-600">
            Generate custom multiple-choice questions on any topic
          </p>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Template Modal */}
        <SaveTemplateModal 
          isOpen={isSaveTemplateModalOpen}
          onClose={() => setSaveTemplateModalOpen(false)}
          templateData={{
            prompt: currentPrompt,
            numberOfQuestions: currentNumberOfQuestions,
            difficulty: currentDifficulty,
            subject: currentSubject
          }}
          onSave={handleSaveTemplate}
        />

        {generatorVisible ? (
          <>
            <TemplateManager 
              onLoadTemplate={handleLoadTemplate}
              onSaveCurrentTemplate={handleOpenSaveTemplateModal}
            />
            <QuestionGeneratorForm 
              onSubmit={generateQuestions} 
              isLoading={isLoading}
              initialValues={{
                prompt: currentPrompt,
                numberOfQuestions: currentNumberOfQuestions,
                difficulty: currentDifficulty,
                subject: currentSubject
              }} 
            />
          </>
        ) : hasSubmitted ? (
          <ResultsSummary
            totalQuestions={questions.length}
            correctAnswers={correctAnswers}
            questions={questions}
            userAnswers={userAnswers}
            onReset={handleReset}
            onGenerateNew={handleGenerateNew}
          />
        ) : isPreviewMode ? (
          <SubmissionPreview
            questions={questions}
            userAnswers={userAnswers}
            onEdit={handleReturnToQuiz}
            onSubmit={handleSubmit}
          />
        ) : (
          <>
            {questions.length > 0 && (
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </h2>
                <div className="text-sm font-medium text-gray-500">
                  {totalAnswered} of {questions.length} answered
                </div>
              </div>
            )}

            {questions.length > 0 && (
              <QuestionCard
                question={questions[currentQuestionIndex]}
                selectedAnswer={userAnswers[currentQuestionIndex]}
                onSelectAnswer={handleSelectAnswer}
                showResult={hasSubmitted}
              />
            )}

            <div className="flex justify-between mt-6">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>

              <div className="flex gap-3">
                <button
                  onClick={handlePreviewSubmission}
                  disabled={totalAnswered < 1}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  Preview All
                </button>

                {currentQuestionIndex === questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={totalAnswered !== questions.length}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-center mt-8 space-x-4">
              <button
                onClick={handleGenerateNew}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Generate new questions
              </button>
              <button
                onClick={handleOpenSaveTemplateModal}
                className="text-green-600 hover:text-green-800 underline"
              >
                Save as template
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
