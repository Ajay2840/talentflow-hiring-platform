import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, CandidateStage } from '@/lib/db';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Eye, LayoutGrid } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRef } from 'react';

const stages: (CandidateStage | 'all')[] = ['all', 'Applied', 'Screen', 'Tech', 'Offer', 'Hired', 'Rejected'];

export default function Candidates() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<CandidateStage | 'all'>('all');
  const parentRef = useRef<HTMLDivElement>(null);

  const candidates = useLiveQuery(() => db.candidates.toArray());
  const jobs = useLiveQuery(() => db.jobs.toArray());

  const filteredCandidates = useMemo(() => {
    if (!candidates) return [];

    return candidates.filter(candidate => {
      const matchesStage = stageFilter === 'all' || candidate.stage === stageFilter;
      const matchesSearch = !searchQuery || 
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStage && matchesSearch;
    });
  }, [candidates, stageFilter, searchQuery]);

  // URL syncing removed to restore previous simple behavior

  const rowVirtualizer = useVirtualizer({
    count: filteredCandidates.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
    overscan: 10,
  });

  const getJobTitle = (jobId: string) => {
    return jobs?.find(j => j.id === jobId)?.title || 'Unknown';
  };

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
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Candidates</h1>
          <p className="text-muted-foreground mt-1">
            {filteredCandidates.length} candidates in your pipeline
          </p>
        </div>
        <Button onClick={() => navigate('/candidates/kanban')} variant="outline" className="gap-2">
          <LayoutGrid className="h-4 w-4" />
          Kanban View
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={stageFilter} onValueChange={(v: any) => setStageFilter(v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by stage" />
          </SelectTrigger>
          <SelectContent>
            {stages.map(stage => (
              <SelectItem key={stage} value={stage}>
                {stage === 'all' ? 'All Stages' : stage}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="flex-1 overflow-hidden">
        <CardContent className="p-0">
          <div ref={parentRef} className="h-[calc(100vh-280px)] overflow-auto">
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                const candidate = filteredCandidates[virtualItem.index];
                return (
                  <div
                    key={virtualItem.key}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualItem.size}px`,
                      transform: `translateY(${virtualItem.start}px)`,
                    }}
                    className="border-b"
                  >
                    <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{candidate.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{candidate.email}</p>
                      </div>
                      <div className="flex items-center gap-4 ml-4">
                        <div className="text-sm text-muted-foreground hidden md:block">
                          {getJobTitle(candidate.jobId)}
                        </div>
                        <Badge className={getStageBadgeClass(candidate.stage)}>
                          {candidate.stage}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/candidates/${candidate.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
