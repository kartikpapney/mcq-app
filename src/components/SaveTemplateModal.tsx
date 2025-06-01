import React, { useState } from 'react';
import { Template } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface SaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateData: {
    prompt: string;
    numberOfQuestions: number;
    difficulty: 'easy' | 'medium' | 'hard';
    subject?: string;
  };
  onSave: (template: Template) => void;
}

const SaveTemplateModal: React.FC<SaveTemplateModalProps> = ({
  isOpen,
  onClose,
  templateData,
  onSave
}) => {
  const [templateName, setTemplateName] = useState('');
  
  if (!isOpen) return null;

  const handleSave = () => {
    const newTemplate: Template = {
      id: uuidv4(),
      name: templateName.trim() || 'Untitled Template',
      prompt: templateData.prompt,
      numberOfQuestions: templateData.numberOfQuestions,
      difficulty: templateData.difficulty,
      subject: templateData.subject,
      createdAt: new Date().toISOString()
    };
    
    onSave(newTemplate);
    setTemplateName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Save as Template</h2>
        
        <div className="mb-4">
          <label htmlFor="templateName" className="block text-sm font-medium text-gray-700 mb-1">
            Template Name
          </label>
          <input
            type="text"
            id="templateName"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="E.g., History Quiz, JavaScript Basics..."
          />
        </div>
        
        <div className="space-y-2 mb-4">
          <p className="text-sm font-medium">Template will include:</p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>Prompt: <span className="italic">{templateData.prompt.substring(0, 50)}...</span></li>
            <li>Questions: {templateData.numberOfQuestions}</li>
            <li>Difficulty: {templateData.difficulty}</li>
            {templateData.subject && <li>Subject: {templateData.subject}</li>}
          </ul>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveTemplateModal;
