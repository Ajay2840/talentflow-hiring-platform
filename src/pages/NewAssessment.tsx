import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, Assessment, AssessmentSection, Job } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export default function NewAssessment() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const jobs = useLiveQuery(() => db.jobs.where('status').equals('active').toArray()) as Job[] | undefined

  const [jobId, setJobId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (!jobId && jobs && jobs.length > 0) {
      setJobId(jobs[0].id)
    }
  }, [jobs])

  useEffect(() => {
    const job = jobs?.find(j => j.id === jobId)
    if (job) {
      setTitle(`${job.title} Assessment`)
      setDescription(`Assessment for ${job.title}`)
    }
  }, [jobId])

  const canSave = useMemo(() => jobId && title.trim().length > 0, [jobId, title])

  const handleCreate = async () => {
    if (!canSave) return
    const now = new Date()
    const section: AssessmentSection = {
      id: `section-${Date.now()}`,
      title: 'Technical Skills',
      description: 'Add questions specific to this role',
      questions: [],
      order: 0,
    }
    const newAssessment: Assessment = {
      id: `assessment-${Date.now()}`,
      jobId,
      title: title.trim(),
      description: description.trim(),
      sections: [section],
      createdAt: now,
      updatedAt: now,
    }

    await db.assessments.add(newAssessment)
    toast({ title: 'Assessment created', description: 'You can now add questions.' })
    navigate(`/assessments/${newAssessment.id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/assessments')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assessments
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Assessment</CardTitle>
          <CardDescription>Choose a job and basic details. You can add questions later.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>Job</Label>
              <Select value={jobId} onValueChange={(v: any) => setJobId(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a job" />
                </SelectTrigger>
                <SelectContent>
                  {(jobs || []).map(j => (
                    <SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" rows={6} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => navigate('/assessments')}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!canSave} className="gap-2">
              <Save className="h-4 w-4" />
              Create Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


