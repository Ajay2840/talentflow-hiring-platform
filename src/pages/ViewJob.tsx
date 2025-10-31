import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

export default function ViewJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const job = useLiveQuery(async () => {
    if (!id) return null;
    return await db.jobs.get(id);
  }, [id]);

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/jobs')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{job.title}</CardTitle>
          <CardDescription className="mt-2">{job.status === 'active' ? <span className="text-success">Active</span> : <span className="text-muted-foreground">Archived</span>}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            {job.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="mr-2">{tag}</Badge>
            ))}
          </div>

          <div className="prose max-w-none">
            <p>{job.description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
