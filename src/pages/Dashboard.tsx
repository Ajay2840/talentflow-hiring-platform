import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LifeBuoy } from 'lucide-react';
import { Briefcase, Users, FileCheck, TrendingUp } from 'lucide-react';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

export default function Dashboard() {
  const jobs = useLiveQuery(() => db.jobs.toArray());
  const candidates = useLiveQuery(() => db.candidates.toArray());
  const assessments = useLiveQuery(() => db.assessments.toArray());

  const activeJobs = jobs?.filter(j => j.status === 'active').length || 0;
  const totalCandidates = candidates?.length || 0;
  const activeCandidates = candidates?.filter(c => 
    !['Rejected', 'Hired'].includes(c.stage)
  ).length || 0;
  const totalAssessments = assessments?.length || 0;

  const stats = [
    {
      title: 'Active Jobs',
      value: activeJobs,
      total: jobs?.length || 0,
      icon: Briefcase,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Active Candidates',
      value: activeCandidates,
      total: totalCandidates,
      icon: Users,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Assessments',
      value: totalAssessments,
      icon: FileCheck,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Placement Rate',
      value: '24%',
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  const recentCandidates = candidates
    ?.sort((a, b) => b.appliedAt.getTime() - a.appliedAt.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's an overview of your hiring pipeline.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="shadow-card hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {stat.value}
                  {stat.total !== undefined && (
                    <span className="text-lg text-muted-foreground ml-2">
                      / {stat.total}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCandidates?.map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-medium">{candidate.name}</p>
                    <p className="text-sm text-muted-foreground">{candidate.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                      ${candidate.stage === 'Applied' ? 'bg-status-applied/10 text-status-applied' :
                        candidate.stage === 'Screen' ? 'bg-status-screen/10 text-status-screen' :
                        candidate.stage === 'Tech' ? 'bg-status-tech/10 text-status-tech' :
                        candidate.stage === 'Offer' ? 'bg-status-offer/10 text-status-offer' :
                        candidate.stage === 'Hired' ? 'bg-success/10 text-success' :
                        'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {candidate.stage}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(candidate.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Candidate Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Applied', 'Screen', 'Tech', 'Offer', 'Hired'].map((stage) => {
                const count = candidates?.filter(c => c.stage === stage).length || 0;
                const percentage = totalCandidates > 0 ? (count / totalCandidates) * 100 : 0;
                
                return (
                  <div key={stage}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{stage}</span>
                      <span className="text-sm text-muted-foreground">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all
                          ${stage === 'Applied' ? 'bg-status-applied' :
                            stage === 'Screen' ? 'bg-status-screen' :
                            stage === 'Tech' ? 'bg-status-tech' :
                            stage === 'Offer' ? 'bg-status-offer' :
                            'bg-success'
                          }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Help & Support section removed per request */}
    </div>
  );
}
