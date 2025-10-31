import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, CandidateStage } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Mail, Phone, Briefcase, Calendar, Clock } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const stages: CandidateStage[] = ['Applied', 'Screen', 'Tech', 'Offer', 'Hired', 'Rejected'];

export default function CandidateProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const candidate = useLiveQuery(() => 
    db.candidates.get(id!)
  );

  const job = useLiveQuery(() =>
    candidate ? db.jobs.get(candidate.jobId) : undefined,
    [candidate]
  );

  const timeline = useLiveQuery(() =>
    db.candidateTimeline.where('candidateId').equals(id!).reverse().sortBy('timestamp')
  );

  const handleStageChange = async (newStage: CandidateStage) => {
    if (!candidate) return;
    
    setSaving(true);
    try {
      await db.candidates.update(id!, { stage: newStage });
      await db.candidateTimeline.add({
        id: `timeline-${Date.now()}`,
        candidateId: id!,
        stage: newStage,
        timestamp: new Date(),
      });
      toast.success(`Stage updated to ${newStage}`);
    } catch (error) {
      toast.error('Failed to update stage');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!candidate || !notes.trim()) return;

    setSaving(true);
    try {
      await db.candidates.update(id!, { notes });
      await db.candidateTimeline.add({
        id: `timeline-${Date.now()}`,
        candidateId: id!,
        stage: candidate.stage,
        notes,
        timestamp: new Date(),
      });
      setNotes('');
      toast.success('Notes saved');
    } catch (error) {
      toast.error('Failed to save notes');
    } finally {
      setSaving(false);
    }
  };

  if (!candidate) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const getStageBadgeClass = (stage: CandidateStage) => {
    const classes: Record<CandidateStage, string> = {
      Applied: 'bg-status-applied/10 text-status-applied',
      Screen: 'bg-status-screen/10 text-status-screen',
      Tech: 'bg-status-tech/10 text-status-tech',
      Offer: 'bg-status-offer/10 text-status-offer',
      Hired: 'bg-success/10 text-success',
      Rejected: 'bg-destructive/10 text-destructive',
    };
    return classes[stage];
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate('/candidates')} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Candidates
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{candidate.name}</CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {candidate.email}
                    </div>
                    {candidate.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {candidate.phone}
                      </div>
                    )}
                  </div>
                </div>
                <Badge className={getStageBadgeClass(candidate.stage)}>
                  {candidate.stage}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{job?.title || 'Unknown Position'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Applied on {new Date(candidate.appliedAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeline?.map((entry) => (
                  <div key={entry.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${getStageBadgeClass(entry.stage).split(' ')[0]}`} />
                      <div className="w-px h-full bg-border mt-1" />
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {entry.stage}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(entry.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {entry.notes && (
                        <p className="text-sm mt-2 text-muted-foreground">{entry.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Update Stage</CardTitle>
            </CardHeader>
            <CardContent>
              <Select 
                value={candidate.stage} 
                onValueChange={(v: CandidateStage) => handleStageChange(v)}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stages.map(stage => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Add Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Add notes about this candidate... Use @ to mention team members"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={5}
              />
              <Button 
                onClick={handleSaveNotes} 
                disabled={!notes.trim() || saving}
                className="w-full"
              >
                {saving ? 'Saving...' : 'Save Notes'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
