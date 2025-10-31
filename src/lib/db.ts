import Dexie, { Table } from 'dexie';

export type JobStatus = 'active' | 'archived';

export interface Job {
  id: string;
  title: string;
  slug: string;
  status: JobStatus;
  tags: string[];
  description?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CandidateStage = 'Applied' | 'Screen' | 'Tech' | 'Offer' | 'Hired' | 'Rejected';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  jobId: string;
  stage: CandidateStage;
  appliedAt: Date;
  notes?: string;
  resume?: string;
}

export interface CandidateTimeline {
  id: string;
  candidateId: string;
  stage: CandidateStage;
  notes?: string;
  timestamp: Date;
  userId?: string;
}

export interface Assessment {
  id: string;
  jobId: string;
  title: string;
  description?: string;
  sections: AssessmentSection[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AssessmentSection {
  id: string;
  title: string;
  description?: string;
  questions: AssessmentQuestion[];
  order: number;
}

export type QuestionType = 'single-choice' | 'multi-choice' | 'short-text' | 'long-text' | 'numeric' | 'file-upload';

export interface AssessmentQuestion {
  id: string;
  type: QuestionType;
  question: string;
  required: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
  conditionalLogic?: {
    dependsOn: string;
    showWhen: string | string[];
  };
  order: number;
}

export interface AssessmentResponse {
  id: string;
  assessmentId: string;
  candidateId: string;
  answers: Record<string, any>;
  submittedAt: Date;
}

export class TalentFlowDB extends Dexie {
  jobs!: Table<Job>;
  candidates!: Table<Candidate>;
  candidateTimeline!: Table<CandidateTimeline>;
  assessments!: Table<Assessment>;
  assessmentResponses!: Table<AssessmentResponse>;

  constructor() {
    super('TalentFlowDB');
    this.version(1).stores({
      jobs: 'id, slug, status, order',
      candidates: 'id, jobId, stage, email, name',
      candidateTimeline: 'id, candidateId, timestamp',
      assessments: 'id, jobId',
      assessmentResponses: 'id, assessmentId, candidateId',
    });
  }
}

export const db = new TalentFlowDB();

export async function clearDatabase() {
  try {
    await db.transaction('rw', [
      db.jobs, 
      db.candidates, 
      db.candidateTimeline, 
      db.assessments, 
      db.assessmentResponses
    ], async () => {
        await Promise.all([
          db.jobs.clear(),
          db.candidates.clear(),
          db.candidateTimeline.clear(),
          db.assessments.clear(),
          db.assessmentResponses.clear(),
        ]);
    });
    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
  }
}
