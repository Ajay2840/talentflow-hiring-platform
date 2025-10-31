import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Job } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Archive, Edit, Eye, GripVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SortableJobCard } from '@/components/custom/SortableJobCard';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { 
  SortableContext, 
  sortableKeyboardCoordinates, 
  useSortable,
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function Jobs() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'active' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const allJobs = useLiveQuery(() => db.jobs.orderBy('order').toArray());

  const filteredJobs = allJobs?.filter(job => {
    const matchesFilter = filter === 'all' || job.status === filter;
    const matchesSearch = !searchQuery || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // URL syncing removed to restore previous simple behavior

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id || !allJobs) {
      return;
    }

    const oldIndex = allJobs.findIndex((job) => job.id === active.id);
    const newIndex = allJobs.findIndex((job) => job.id === over.id);
    
    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const newOrder = arrayMove(allJobs, oldIndex, newIndex);
    
    // Update the order of all affected jobs
    try {
      await Promise.all(
        newOrder.map((job, index) => 
          db.jobs.update(job.id, { order: index })
        )
      );
    } catch (error) {
      console.error('Failed to update job orders:', error);
    }
  };

  const handleArchiveToggle = async (job: Job) => {
    try {
      await db.jobs.update(job.id, {
        status: job.status === 'active' ? 'archived' : 'active',
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Failed to update job status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Jobs</h1>
          <p className="text-muted-foreground mt-1">
            Manage your job postings and track applications
          </p>
        </div>
        <Button onClick={() => navigate('/jobs/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Job
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search jobs by title or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Jobs</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <SortableContext
            items={filteredJobs?.map(job => job.id) || []}
            strategy={verticalListSortingStrategy}
          >
            {filteredJobs?.map((job) => (
              <SortableJobCard
                key={job.id}
                job={job}
                onArchiveToggle={handleArchiveToggle}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>

      {filteredJobs?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No jobs found</p>
        </div>
      )}
    </div>
  );
}
