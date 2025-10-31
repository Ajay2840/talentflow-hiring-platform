import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { 
  BookIcon, 
  CodeIcon, 
  FileIcon, 
  BookOpenIcon,
  LayersIcon,
  UsersIcon,
  ClipboardIcon,
  BarChartIcon
} from "lucide-react"

export default function Documentation() {
  const navigate = useNavigate()
  const [isLoggedOut, setIsLoggedOut] = useState(false)

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      // simulate logout but stay on page and show a notice
      setIsLoggedOut(true)
    }
  }

  return (
    <div className="container mx-auto py-8">
      {isLoggedOut && (
        <Alert className="mb-4 bg-yellow-50 border-yellow-200">
          <AlertDescription className="text-yellow-600">You have been logged out. Refresh the page or sign in again to continue.</AlertDescription>
        </Alert>
      )}
      <div className="flex items-center gap-3 mb-8">
        <BookIcon className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Documentation
          </h1>
          <p className="text-gray-500">Complete guide to using TalentFlow</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1">Docs</Badge>
          <Button size="sm" variant="outline" onClick={() => navigate('/settings')}>Edit Profile</Button>
          <Button size="sm" variant="ghost" onClick={handleLogout}>Log Out</Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LayersIcon className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <ClipboardIcon className="w-4 h-4" />
            Features
          </TabsTrigger>
          <TabsTrigger value="tutorials" className="flex items-center gap-2">
            <BookOpenIcon className="w-4 h-4" />
            Tutorials
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <CodeIcon className="w-4 h-4" />
            API
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileIcon className="w-5 h-5 text-blue-500" />
                  Introduction
                </CardTitle>
                <CardDescription>Welcome to TalentFlow</CardDescription>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  TalentFlow is a comprehensive talent management system designed to streamline your recruitment process.
                  From job posting to candidate assessment, our platform provides all the tools you need to make informed hiring decisions.
                </p>
                <h3 className="text-lg font-semibold mt-4">Key Features</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Automated candidate tracking</li>
                  <li>Customizable assessment creation</li>
                  <li>Interactive job postings</li>
                  <li>Real-time analytics</li>
                  <li>Team collaboration tools</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UsersIcon className="w-5 h-5 text-green-500" />
                  Getting Started
                </CardTitle>
                <CardDescription>First steps with TalentFlow</CardDescription>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-700">1. Setting Up Your Account</h4>
                    <p className="text-green-600">Configure your organization profile and user permissions.</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-700">2. Creating Your First Job Posting</h4>
                    <p className="text-blue-600">Learn how to create and manage job listings.</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-700">3. Managing Candidates</h4>
                    <p className="text-purple-600">Track and evaluate candidates through the hiring pipeline.</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-700">4. Creating Assessments</h4>
                    <p className="text-orange-600">Design custom assessments for different roles.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChartIcon className="w-5 h-5 text-purple-500" />
                  Best Practices
                </CardTitle>
                <CardDescription>Optimize your recruitment process</CardDescription>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Recruitment Strategy</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-700">Job Descriptions</h4>
                      <ul className="list-disc pl-6 text-gray-600">
                        <li>Be specific and clear</li>
                        <li>Include key responsibilities</li>
                        <li>List required skills</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-700">Assessment Design</h4>
                      <ul className="list-disc pl-6 text-gray-600">
                        <li>Focus on core competencies</li>
                        <li>Use varied question types</li>
                        <li>Keep it relevant</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features">
          <ScrollArea className="h-[600px]">
            <div className="space-y-6">
              <Card className="border-l-4 border-l-cyan-500">
                <CardHeader>
                  <CardTitle>Core Features</CardTitle>
                  <CardDescription>Discover TalentFlow's powerful capabilities</CardDescription>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <div className="space-y-6">
                    <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg">
                      <h3 className="text-lg font-semibold text-cyan-700">Job Management</h3>
                      <ul className="list-disc pl-6 space-y-2 text-cyan-600">
                        <li>Create and publish job postings</li>
                        <li>Track application status</li>
                        <li>Manage hiring pipeline</li>
                        <li>Collaborate with team members</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <h3 className="text-lg font-semibold text-purple-700">Assessment Tools</h3>
                      <ul className="list-disc pl-6 space-y-2 text-purple-600">
                        <li>Create custom assessments</li>
                        <li>Multiple question types</li>
                        <li>Automated scoring</li>
                        <li>Detailed analytics</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                      <h3 className="text-lg font-semibold text-green-700">Candidate Management</h3>
                      <ul className="list-disc pl-6 space-y-2 text-green-600">
                        <li>Candidate profiles</li>
                        <li>Application tracking</li>
                        <li>Interview scheduling</li>
                        <li>Communication history</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="tutorials">
          <ScrollArea className="h-[600px]">
            <div className="space-y-6">
              <Card className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <CardTitle>Video Tutorials</CardTitle>
                  <CardDescription>Step-by-step guides to master TalentFlow</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-orange-700">Getting Started with TalentFlow</h3>
                          <p className="text-orange-600">A complete introduction to the platform</p>
                        </div>
                        <Badge variant="secondary">Duration: 10 mins</Badge>
                      </div>
                      <div className="aspect-video bg-gray-100 rounded-lg mb-4"></div>
                      <div className="space-y-2">
                        <Progress value={33} className="h-2" />
                        <p className="text-sm text-gray-500">Continue watching from 3:45</p>
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-blue-700">Creating Custom Assessments</h3>
                          <p className="text-blue-600">Learn to design effective assessments</p>
                        </div>
                        <Badge variant="secondary">Duration: 15 mins</Badge>
                      </div>
                      <div className="aspect-video bg-gray-100 rounded-lg mb-4"></div>
                      <Button variant="outline" className="w-full">Start Tutorial</Button>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-purple-700">Advanced Candidate Management</h3>
                          <p className="text-purple-600">Master the candidate pipeline</p>
                        </div>
                        <Badge variant="secondary">Duration: 20 mins</Badge>
                      </div>
                      <div className="aspect-video bg-gray-100 rounded-lg mb-4"></div>
                      <Button variant="outline" className="w-full">Start Tutorial</Button>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-green-700">Analytics & Reporting</h3>
                          <p className="text-green-600">Data-driven recruitment insights</p>
                        </div>
                        <Badge variant="secondary">Duration: 12 mins</Badge>
                      </div>
                      <div className="aspect-video bg-gray-100 rounded-lg mb-4"></div>
                      <Button variant="outline" className="w-full">Start Tutorial</Button>
                    </div>

                    <Alert className="bg-blue-50 border-blue-200 mt-4">
                      <AlertDescription className="text-blue-700">
                        New tutorials are added regularly. Check back often for more content!
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="api">
          <ScrollArea className="h-[600px]">
            <div className="space-y-6">
              <Card className="border-l-4 border-l-indigo-500">
                <CardHeader>
                  <CardTitle>API Documentation</CardTitle>
                  <CardDescription>Integrate with TalentFlow's API</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-semibold">Authentication</h3>
                      <p>Learn how to authenticate your API requests</p>
                      {/* Add API documentation content */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
