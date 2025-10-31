import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Eye, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AddQuestionForm } from '@/components/custom/AddQuestionForm';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export default function Assessments() {
  const navigate = useNavigate();
  const assessments = useLiveQuery(() => db.assessments.toArray());
  const jobs = useLiveQuery(() => db.jobs.toArray());
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);

  const handleDelete = async (assessmentId: string) => {
    if (!confirm('Delete this assessment? This cannot be undone.')) return;
    try {
      await db.transaction('rw', [db.assessments, db.assessmentResponses], async () => {
        await db.assessmentResponses.where('assessmentId').equals(assessmentId).delete();
        await db.assessments.delete(assessmentId);
      });
    } catch (e) {
      console.error('Failed to delete assessment', e);
      alert('Failed to delete. Please try again.');
    }
  };

  const getJobTitle = (jobId: string) => {
    return jobs?.find(j => j.id === jobId)?.title || 'Unknown Job';
  };

  const handleAddQuestion = async (data: any) => {
    try {
      // Here you would typically save the question to your database
      console.log('New question:', data);
      // Close the dialog after successful submission
      setIsAddingQuestion(false);
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Assessments</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage candidate assessments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate('/assessments/new')} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Assessment
          </Button>
          {import.meta.env.DEV && (
            <Button
              variant="ghost"
              onClick={async () => {
                if (!confirm('Clear local DB and reseed with sample data? This will remove existing in-browser data.')) return;
                try {
                  await new Promise((res, rej) => {
                    const req = indexedDB.deleteDatabase('TalentFlowDB');
                    req.onsuccess = () => res(true);
                    req.onerror = () => rej(req.error);
                    req.onblocked = () => console.warn('deleteDatabase blocked');
                  });
                } catch (e) {
                  console.error('Error deleting IndexedDB', e);
                }
                location.reload();
              }}
            >
              Clear & Reseed
            </Button>
          )}
        </div>
      </div>

      <Dialog open={isAddingQuestion} onOpenChange={setIsAddingQuestion}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full mb-6">
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <AddQuestionForm onSubmit={handleAddQuestion} />
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {assessments?.map((assessment) => (
          <Card key={assessment.id} className="shadow-card hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{assessment.title}</CardTitle>
              <CardDescription>{getJobTitle(assessment.jobId)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                {assessment.sections.length} sections •{' '}
                {assessment.sections.reduce((acc, s) => acc + s.questions.length, 0)} questions
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => navigate(`/assessments/${assessment.id}`)}
                >
                  <Eye className="h-4 w-4" />
                  View
                </Button>
                <Button
                  variant="destructive"
                  className="gap-2"
                  onClick={() => handleDelete(assessment.id)}
                >
                  <Trash className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {assessments?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No assessments created yet. Create your first assessment to get started.
          </p>
        </div>
      )}
    </div>
  );
}
