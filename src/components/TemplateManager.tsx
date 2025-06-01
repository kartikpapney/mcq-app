import React, { useState, useEffect } from 'react';
import { Template } from '@/types';

interface TemplateManagerProps {
  onLoadTemplate: (template: Template) => void;
  onSaveCurrentTemplate: () => void;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({ 
  onLoadTemplate, 
  onSaveCurrentTemplate 
}) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [sortOrder, setSortOrder] = useState<'date-new' | 'date-old' | 'name-asc' | 'name-desc'>('date-new');

  // Load templates from localStorage on component mount
  useEffect(() => {
    const storedTemplates = localStorage.getItem('mcq-templates');
    if (storedTemplates) {
      try {
        const parsedTemplates = JSON.parse(storedTemplates);
        setTemplates(parsedTemplates);
        setFilteredTemplates(parsedTemplates);
      } catch (e) {
        console.error('Error parsing stored templates:', e);
      }
    }
  }, []);
  
  // Filter and sort templates when search query or sort order changes
  useEffect(() => {
    // First filter by search query
    let result = [...templates];
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = templates.filter(template => 
        template.name.toLowerCase().includes(query) ||
        template.prompt.toLowerCase().includes(query) ||
        (template.subject && template.subject.toLowerCase().includes(query))
      );
    }
    
    // Then sort according to sort order
    result.sort((a, b) => {
      switch (sortOrder) {
        case 'date-new':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'date-old':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
    
    setFilteredTemplates(result);
  }, [searchQuery, templates, sortOrder]);

  const handleLoadTemplate = (template: Template) => {
    onLoadTemplate(template);
    setIsOpen(false);
  };

  const handleDeleteTemplate = (id: string) => {
    const updatedTemplates = templates.filter(template => template.id !== id);
    setTemplates(updatedTemplates);
    localStorage.setItem('mcq-templates', JSON.stringify(updatedTemplates));
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          {isOpen ? 'Hide Templates' : 'Show Saved Templates'}
        </button>
        <button 
          onClick={onSaveCurrentTemplate}
          className="text-green-600 hover:text-green-800 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Save Current as Template
        </button>
      </div>
      
      {isOpen && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h3 className="font-medium mb-3">Saved Templates</h3>
          
          {/* Search and sort controls */}
          <div className="mb-4 space-y-2">
            <input
              type="text"
              placeholder="Search templates..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <div className="flex items-center">
              <label className="text-sm text-gray-600 mr-2">Sort by:</label>
              <select
                className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
              >
                <option value="date-new">Newest first</option>
                <option value="date-old">Oldest first</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </select>
            </div>
          </div>
          
          {templates.length === 0 ? (
            <p className="text-gray-500 italic">No templates saved yet.</p>
          ) : filteredTemplates.length === 0 ? (
            <p className="text-gray-500 italic">No results found for &quot;{searchQuery}&quot;.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredTemplates.map(template => (
                <li key={template.id} className="py-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-gray-600">
                        {template.subject && <span className="mr-2">Subject: {template.subject}</span>}
                        <span className="mr-2">Difficulty: {template.difficulty}</span>
                        <span>Questions: {template.numberOfQuestions}</span>
                      </p>
                      <p className="text-sm text-gray-500 truncate max-w-md">{template.prompt}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleLoadTemplate(template)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Load
                      </button>
                      <button 
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default TemplateManager;
