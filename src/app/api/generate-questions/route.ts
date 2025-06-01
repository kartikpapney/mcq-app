import { OpenAI } from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { Question, QuestionGenerationRequest } from '@/types';
import { NextResponse } from 'next/server';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json() as QuestionGenerationRequest;
    
    const {
      prompt,
      numberOfQuestions = parseInt(process.env.NEXT_PUBLIC_DEFAULT_NUM_QUESTIONS || '5'),
      difficulty = 'medium',
      subject
    } = body;

    // Validate the prompt
    if (!prompt || prompt.trim() === '') {
      return NextResponse.json(
        { error: 'A prompt is required to generate questions' },
        { status: 400 }
      );
    }

    // Cap the max number of questions
    const maxQuestions = parseInt(process.env.NEXT_PUBLIC_MAX_QUESTIONS || '10');
    const numQuestions = Math.min(numberOfQuestions, maxQuestions);

    // Generate system message based on parameters
    let systemMessage = `Generate ${numQuestions} multiple choice questions with 4 options each about the following topic: ${prompt}. `;
    
    if (difficulty) {
      systemMessage += `The questions should be of ${difficulty} difficulty. `;
    }
    
    if (subject) {
      systemMessage += `The questions should be related to the subject: ${subject}. `;
    }
    
    systemMessage += `Format your response as a valid JSON object with a "questions" array where each question object has:
     - "question": The question text
     - "options": An array of 4 possible answers
     - "correctAnswerIndex": The index of the correct answer (0-3)
     - "explanation": A brief explanation (1-2 sentences) of why the correct answer is right
    Just provide the formatted JSON.`;

    // Make the API call to OpenAI
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt }
      ],
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      response_format: { type: "json_object" }
    });

    // Parse the response and format as our Question type
    const jsonContent = JSON.parse(completion.choices[0].message.content || '{"questions":[]}');
    
    // Map to our Question format and add IDs
    const questions = jsonContent.questions.map((q: any) => ({
      id: uuidv4(),
      question: q.question,
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex,
      explanation: q.explanation || 'No explanation available.'
    })) as Question[];

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}
