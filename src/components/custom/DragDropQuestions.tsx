import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Question {
  id: string;
  content: string;
  type: 'multiple-choice' | 'drag-drop';
  options?: string[];
  correctAnswer?: string;
}

interface DragDropQuestionsProps {
  questions: Question[];
  onQuestionsChange: (questions: Question[]) => void;
}

export function DragDropQuestions({ questions, onQuestionsChange }: DragDropQuestionsProps) {
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null) return;

    const items = Array.from(questions);
    const draggedQuestion = items[draggedItem];
    items.splice(draggedItem, 1);
    items.splice(index, 0, draggedQuestion);

    onQuestionsChange(items);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div className="space-y-4">
      {questions.map((question, index) => (
        <Card
          key={question.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className="border shadow-sm cursor-move hover:shadow-md transition-shadow"
        >
          <CardHeader className="flex flex-row items-center gap-4 py-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
              {index + 1}
            </div>
            <CardTitle className="text-base font-medium">
              {question.content}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {question.type === 'multiple-choice' && question.options && (
              <div className="ml-4 space-y-2">
                {question.options.map((option, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2"
                  >
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-sm">{option}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}