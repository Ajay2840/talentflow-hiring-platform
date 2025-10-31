import { http, HttpResponse, delay } from 'msw';
import { db, Job, Candidate } from './db';

const API_DELAY_MIN = 200;
const API_DELAY_MAX = 1200;
const ERROR_RATE = 0.08;

async function simulateRequest() {
  const delayTime = Math.random() * (API_DELAY_MAX - API_DELAY_MIN) + API_DELAY_MIN;
  await delay(delayTime);
  
  if (Math.random() < ERROR_RATE) {
    throw new Error('Simulated API error');
  }
}

export const handlers = [
  // Jobs endpoints
  http.get('/api/jobs', async () => {
    try {
      await simulateRequest();
      const jobs = await db.jobs.orderBy('order').toArray();
      return HttpResponse.json(jobs);
    } catch (error) {
      return HttpResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
    }
  }),

  http.get('/api/jobs/:id', async ({ params }) => {
    try {
      await simulateRequest();
      const job = await db.jobs.get(params.id as string);
      if (!job) {
        return HttpResponse.json({ error: 'Job not found' }, { status: 404 });
      }
      return HttpResponse.json(job);
    } catch (error) {
      return HttpResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
    }
  }),

  http.post('/api/jobs', async ({ request }) => {
    try {
      await simulateRequest();
      const data = await request.json() as Partial<Job>;
      
      // Check for duplicate slug
      const existing = await db.jobs.where('slug').equals(data.slug!).first();
      if (existing) {
        return HttpResponse.json({ error: 'Slug already exists' }, { status: 400 });
      }

      const maxOrder = await db.jobs.orderBy('order').last();
      const newJob: Job = {
        id: `job-${Date.now()}`,
        title: data.title!,
        slug: data.slug!,
        status: data.status || 'active',
        tags: data.tags || [],
        description: data.description,
        order: maxOrder ? maxOrder.order + 1 : 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.jobs.add(newJob);
      return HttpResponse.json(newJob, { status: 201 });
    } catch (error) {
      return HttpResponse.json({ error: 'Failed to create job' }, { status: 500 });
    }
  }),

  http.put('/api/jobs/:id', async ({ params, request }) => {
    try {
      await simulateRequest();
      const data = await request.json() as Partial<Job>;
      const id = params.id as string;

      // Check slug uniqueness if it's being changed
      if (data.slug) {
        const existing = await db.jobs.where('slug').equals(data.slug).first();
        if (existing && existing.id !== id) {
          return HttpResponse.json({ error: 'Slug already exists' }, { status: 400 });
        }
      }

      await db.jobs.update(id, {
        ...data,
        updatedAt: new Date(),
      });

      const updated = await db.jobs.get(id);
      return HttpResponse.json(updated);
    } catch (error) {
      return HttpResponse.json({ error: 'Failed to update job' }, { status: 500 });
    }
  }),

  http.delete('/api/jobs/:id', async ({ params }) => {
    try {
      await simulateRequest();
      await db.jobs.delete(params.id as string);
      return HttpResponse.json({ success: true });
    } catch (error) {
      return HttpResponse.json({ error: 'Failed to delete job' }, { status: 500 });
    }
  }),

  http.post('/api/jobs/reorder', async ({ request }) => {
    try {
      await simulateRequest();
      const { jobIds } = await request.json() as { jobIds: string[] };
      
      // Simulate 10% failure rate for reorder
      if (Math.random() < 0.1) {
        return HttpResponse.json({ error: 'Failed to reorder' }, { status: 500 });
      }

      await db.transaction('rw', db.jobs, async () => {
        for (let i = 0; i < jobIds.length; i++) {
          await db.jobs.update(jobIds[i], { order: i });
        }
      });

      return HttpResponse.json({ success: true });
    } catch (error) {
      return HttpResponse.json({ error: 'Failed to reorder jobs' }, { status: 500 });
    }
  }),

  // Candidates endpoints
  http.get('/api/candidates', async ({ request }) => {
    try {
      await simulateRequest();
      const url = new URL(request.url);
      const stage = url.searchParams.get('stage');
      const search = url.searchParams.get('search');

      let query = db.candidates.toCollection();

      if (stage && stage !== 'all') {
        query = db.candidates.where('stage').equals(stage);
      }

      let candidates = await query.toArray();

      if (search) {
        const searchLower = search.toLowerCase();
        candidates = candidates.filter(c =>
          c.name.toLowerCase().includes(searchLower) ||
          c.email.toLowerCase().includes(searchLower)
        );
      }

      return HttpResponse.json(candidates);
    } catch (error) {
      return HttpResponse.json({ error: 'Failed to fetch candidates' }, { status: 500 });
    }
  }),

  http.get('/api/candidates/:id', async ({ params }) => {
    try {
      await simulateRequest();
      const candidate = await db.candidates.get(params.id as string);
      if (!candidate) {
        return HttpResponse.json({ error: 'Candidate not found' }, { status: 404 });
      }
      return HttpResponse.json(candidate);
    } catch (error) {
      return HttpResponse.json({ error: 'Failed to fetch candidate' }, { status: 500 });
    }
  }),

  http.put('/api/candidates/:id', async ({ params, request }) => {
    try {
      await simulateRequest();
      const data = await request.json() as Partial<Candidate>;
      const id = params.id as string;

      await db.candidates.update(id, data);
      
      // Add timeline entry if stage changed
      if (data.stage) {
        await db.candidateTimeline.add({
          id: `timeline-${Date.now()}`,
          candidateId: id,
          stage: data.stage,
          notes: data.notes,
          timestamp: new Date(),
        });
      }

      const updated = await db.candidates.get(id);
      return HttpResponse.json(updated);
    } catch (error) {
      return HttpResponse.json({ error: 'Failed to update candidate' }, { status: 500 });
    }
  }),

  http.get('/api/candidates/:id/timeline', async ({ params }) => {
    try {
      await simulateRequest();
      const timeline = await db.candidateTimeline
        .where('candidateId')
        .equals(params.id as string)
        .reverse()
        .sortBy('timestamp');
      return HttpResponse.json(timeline);
    } catch (error) {
      return HttpResponse.json({ error: 'Failed to fetch timeline' }, { status: 500 });
    }
  }),

  // Assessments endpoints
  http.get('/api/assessments', async ({ request }) => {
    try {
      await simulateRequest();
      const url = new URL(request.url);
      const jobId = url.searchParams.get('jobId');

      let query = db.assessments.toCollection();
      if (jobId) {
        query = db.assessments.where('jobId').equals(jobId);
      }

      const assessments = await query.toArray();
      return HttpResponse.json(assessments);
    } catch (error) {
      return HttpResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 });
    }
  }),

  http.get('/api/assessments/:id', async ({ params }) => {
    try {
      await simulateRequest();
      const assessment = await db.assessments.get(params.id as string);
      if (!assessment) {
        return HttpResponse.json({ error: 'Assessment not found' }, { status: 404 });
      }
      return HttpResponse.json(assessment);
    } catch (error) {
      return HttpResponse.json({ error: 'Failed to fetch assessment' }, { status: 500 });
    }
  }),
];
