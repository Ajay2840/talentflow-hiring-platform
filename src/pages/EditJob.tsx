import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, Job, JobStatus } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export default function EditJob() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const job = useLiveQuery(async () => {
    if (!id) return null
    return await db.jobs.get(id)
  }, [id]) as Job | null | undefined

  const [title, setTitle] = useState('')
  const [status, setStatus] = useState<JobStatus>('active')
  const [tags, setTags] = useState<string>('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (job) {
      setTitle(job.title)
      setStatus(job.status)
      setTags(job.tags.join(', '))
      setDescription(job.description || '')
    }
  }, [job])

  const canSave = useMemo(() => title.trim().length > 0, [title])

  const handleSave = async () => {
    if (!id || !job) return
    try {
      const tagList = tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
      await db.jobs.update(id, {
        title: title.trim(),
        status,
        tags: tagList,
        description: description.trim(),
        updatedAt: new Date(),
      })
      toast({ title: 'Job updated', description: 'Your changes have been saved.' })
      navigate(`/jobs/${id}`)
    } catch (e) {
      toast({ title: 'Failed to save', description: 'Please try again.', variant: 'destructive' as any })
    }
  }

  if (!job) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/jobs')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(`/jobs/${id}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Job
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Job</CardTitle>
          <CardDescription>Update job details below</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags</Label>
                <Input id="tags" placeholder="comma, separated, tags" value={tags} onChange={(e) => setTags(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={10} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => navigate(`/jobs/${id}`)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!canSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


