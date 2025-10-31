import React from 'react';
import { useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { AddQuestionForm } from '@/components/custom/AddQuestionForm';
import { useState } from 'react';
import QuestionPlayer from '@/components/custom/QuestionPlayer';

export default function ViewAssessment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  
  const assessment = useLiveQuery(async () => {
    if (!id) return null;
    return await db.assessments.get(id);
  }, [id]);

  const job = useLiveQuery(async () => {
    if (!assessment) return null;
    return await db.jobs.get(assessment.jobId);
  }, [assessment]);

  const handleAddQuestion = async (data: any) => {
    if (!id) return;
    try {
      // Get the current assessment
      const assessment = await db.assessments.get(id);
      if (!assessment) return;

      // Add the new question to the first section (or create one if none exists)
      let sections = [...assessment.sections];
      if (sections.length === 0) {
        sections.push({
          id: Date.now().toString(),
          title: 'General Questions',
          questions: [],
          order: 0,
        });
      }

      // Map incoming form data to the AssessmentQuestion shape and add it to the first section
      const newQuestion = {
        id: Date.now().toString(),
        type: 'single-choice',
        question: data.questionText || data.question || 'New question',
        required: true,
        options: Array.isArray(data.options) ? data.options.filter(Boolean) : undefined,
        // keep correctAnswer if provided (not in strict DB type but useful for display)
        correctAnswer: data.correctAnswer,
        order: sections[0].questions.length,
      } as any;

      sections[0].questions.push(newQuestion);

      // Update the assessment
      await db.assessments.update(id, { sections });
      setIsAddingQuestion(false);
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  // simple HR check: either running in dev or url contains hr=1
  const isHR = typeof window !== 'undefined' && (import.meta.env.DEV || new URLSearchParams(window.location.search).get('hr') === '1');

  const [responses, setResponses] = useState<Record<string, any>>({});

  const handleChangeResponse = (questionId: string, value: any) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSaveResponse = async (questionId: string) => {
    if (!id) return;
    try {
      const answer = responses[questionId];
      const resp = {
        id: `resp-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
        assessmentId: id,
        candidateId: 'guest',
        answers: { [questionId]: answer },
        submittedAt: new Date(),
      } as any;
      await db.assessmentResponses.add(resp);
      // simple feedback: keep answer in state (could show toast)
      console.log('Saved response', resp);
    } catch (e) {
      console.error('Error saving response', e);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!id) return;
    if (!confirm('Delete this question? This action cannot be undone.')) return;
    try {
      const a = await db.assessments.get(id);
      if (!a) return;
      const sections = a.sections.map((s: any) => ({ ...s, questions: s.questions.filter((q: any) => q.id !== questionId) }));
      await db.assessments.update(id, { sections });
    } catch (e) {
      console.error('Error deleting question', e);
    }
  };

  if (!assessment || !job) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/assessments')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assessments
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{assessment.title}</h1>
          <p className="text-muted-foreground mt-1">
            {job.title}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isAddingQuestion} onOpenChange={setIsAddingQuestion}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <AddQuestionForm onSubmit={handleAddQuestion} />
            </DialogContent>
          </Dialog>

          {/* Ask random technical question */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Ask Random Technical Question</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <QuestionPlayer questions={assessment.sections.find(s => /technical/i.test(s.title))?.questions} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-6">
        {assessment.sections.map((section, sectionIndex) => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
              <CardDescription>
                {section.questions.length} Questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {section.questions.map((question: any, questionIndex: number) => (
                  <AccordionItem key={question.id} value={question.id}>
                    <AccordionTrigger className="text-left">
                      Question {sectionIndex + 1}.{questionIndex + 1}: {question.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 p-4">
                        {/* If the question has options, render interactive radio group so user can select and save. */}
                        {(question.options || []).length > 0 ? (
                          <div>
                            <RadioGroup value={responses[question.id] ?? undefined} onValueChange={(v) => handleChangeResponse(question.id, v)}>
                              {(question.options || []).map((option: string, optionIndex: number) => (
                                <div key={optionIndex} className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value={option}
                                    id={`${question.id}-option-${optionIndex}`}
                                    className={option === question.correctAnswer ? 'border-green-500 text-green-500' : ''}
                                  />
                                  <Label htmlFor={`${question.id}-option-${optionIndex}`} className={option === question.correctAnswer ? 'text-green-600' : ''}>
                                    {option}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                            <div className="flex items-center gap-2 mt-3">
                              <Button onClick={() => handleSaveResponse(question.id)} disabled={responses[question.id] === undefined}>
                                Save Answer
                              </Button>
                              {question.correctAnswer && (
                                <p className="text-sm text-green-600 mt-2">Correct Answer: {question.correctAnswer}</p>
                              )}
                            </div>
                          </div>
                        ) : (
                          /* No options: allow user to type an answer */
                          <div className="space-y-2">
                            <textarea
                              className="w-full p-2 border rounded"
                              rows={4}
                              value={responses[question.id] ?? ''}
                              onChange={(e) => handleChangeResponse(question.id, e.target.value)}
                              placeholder="Type your answer here"
                            />
                            <div className="flex items-center gap-2">
                              <Button onClick={() => handleSaveResponse(question.id)} disabled={!responses[question.id]}>
                                Save Answer
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Delete button visible to HR */}
                        {isHR && (
                          <div className="mt-4">
                            <Button variant="destructive" onClick={() => handleDeleteQuestion(question.id)}>
                              Delete Question
                            </Button>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}

        {assessment.sections.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                No questions added yet. Click "Add Question" to get started.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}