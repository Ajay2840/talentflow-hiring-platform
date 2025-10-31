import { useLiveQuery } from 'dexie-react-hooks';
import { db, CandidateStage } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';

const stages: CandidateStage[] = ['Applied', 'Screen', 'Tech', 'Offer', 'Hired', 'Rejected'];

export default function CandidatesKanban() {
  const navigate = useNavigate();
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const candidates = useLiveQuery(() => db.candidates.toArray());
  const jobs = useLiveQuery(() => db.jobs.toArray());

  const handleDragStart = (e: React.DragEvent, candidateId: string) => {
    e.dataTransfer.setData('text/plain', candidateId);
    setDraggingId(candidateId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  const handleDropOnStage = async (e: React.DragEvent, newStage: CandidateStage) => {
    e.preventDefault();
    const candidateId = e.dataTransfer.getData('text/plain');
    if (!candidateId) return;
    try {
      await db.candidates.update(candidateId, { stage: newStage });
      await db.candidateTimeline.add({
        id: `timeline-${Date.now()}`,
        candidateId,
        stage: newStage,
        timestamp: new Date(),
      });
      toast.success(`Candidate moved to ${newStage}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update candidate');
    }
    setDraggingId(null);
  };

  const getJobTitle = (jobId: string) => {
    return jobs?.find(j => j.id === jobId)?.title || 'Unknown';
  };

  // activeCandidate no longer used with native drag-drop

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => navigate('/candidates')} className="gap-2 mb-2">
            <ArrowLeft className="h-4 w-4" />
            Back to List View
          </Button>
          <h1 className="text-3xl font-bold">Candidate Pipeline</h1>
          <p className="text-muted-foreground mt-1">
            Drag and drop candidates to update their stage
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stages.map(stage => {
          const stageCandidates = candidates?.filter(c => c.stage === stage) || [];

          return (
            <Card
              key={stage}
              className={`min-h-[500px] shadow-card ${draggingId ? 'opacity-95' : ''}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDropOnStage(e, stage)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span>{stage}</span>
                  <Badge variant="secondary">{stageCandidates.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {stageCandidates.map(candidate => (
                  <div
                    key={candidate.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, candidate.id)}
                    onDragEnd={handleDragEnd}
                    className="p-3 bg-card border rounded-lg cursor-move hover:border-primary transition-colors"
                    onClick={() => navigate(`/candidates/${candidate.id}`)}
                  >
                    <p className="font-medium text-sm truncate">{candidate.name}</p>
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {candidate.email}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {getJobTitle(candidate.jobId)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
