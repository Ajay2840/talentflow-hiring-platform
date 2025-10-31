import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
  BookOpenIcon, 
  HelpCircleIcon, 
  SearchIcon, 
  MessageCircleIcon, 
  PhoneIcon, 
  GlobeIcon,
  MailIcon,
  VideoIcon,
  BookmarkIcon,
  StarIcon
} from "lucide-react"

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [supportMessage, setSupportMessage] = useState("")
  const navigate = useNavigate()
  const [isLoggedOut, setIsLoggedOut] = useState(false)

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      setIsLoggedOut(true)
    }
  }
  
  const supportTeam = [
    {
      name: "Sarah Johnson",
      role: "Technical Support Lead",
      avatar: "/avatars/sarah.jpg",
      available: true
    },
    {
      name: "Mike Chen",
      role: "Product Specialist",
      avatar: "/avatars/mike.jpg",
      available: true
    },
    {
      name: "Emily Rodriguez",
      role: "Customer Success Manager",
      avatar: "/avatars/emily.jpg",
      available: false
    }
  ]

  const categories = [
    "All",
    "Getting Started",
    "Account & Settings",
    "Assessments",
    "Candidates",
    "Jobs",
    "Technical Issues",
    "Billing"
  ]

  const popularArticles = [
    {
      title: "How to Create Your First Assessment",
      category: "Getting Started",
      views: 1234,
      lastUpdated: "2023-10-25"
    },
    {
      title: "Managing Candidate Pipeline",
      category: "Candidates",
      views: 987,
      lastUpdated: "2023-10-26"
    },
    {
      title: "Setting Up Two-Factor Authentication",
      category: "Account & Settings",
      views: 856,
      lastUpdated: "2023-10-27"
    }
  ]
  return (
    <div className="container mx-auto py-8">
      {isLoggedOut && (
        <Alert className="mb-4 bg-yellow-50 border-yellow-200">
          <AlertDescription className="text-yellow-600">You have been logged out. Refresh the page or sign in again to continue.</AlertDescription>
        </Alert>
      )}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent flex items-center gap-3">
          <HelpCircleIcon className="w-8 h-8 text-indigo-600" />
          Help Center
        </h1>
        <div className="relative w-1/3">
          <Input
            placeholder="Search help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <SearchIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
        </div>
        <div className="ml-4 flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1">Help</Badge>
          <Button size="sm" variant="outline" onClick={() => navigate('/settings')}>Edit Profile</Button>
          <Button size="sm" variant="ghost" onClick={handleLogout}>Log Out</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <BookOpenIcon className="w-5 h-5" />
              Getting Started
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-600">New to TalentFlow? Start here for the basics.</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <VideoIcon className="w-5 h-5" />
              Video Tutorials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-purple-600">Learn through step-by-step video guides.</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <MessageCircleIcon className="w-5 h-5" />
              Live Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-600">Connect with our support team instantly.</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6">
        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <StarIcon className="w-5 h-5 text-indigo-500" />
              Quick Start Guide
            </CardTitle>
            <CardDescription>Learn how to use TalentFlow effectively</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] rounded-md p-4 bg-gradient-to-b from-white to-gray-50">
            <div className="space-y-8">
              {/* Popular Articles Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-blue-700 mb-4">Popular Articles</h3>
                <div className="grid gap-4">
                  {popularArticles.map((article, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{article.title}</h4>
                          <Badge variant="secondary" className="mt-2">{article.category}</Badge>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <p>{article.views} views</p>
                          <p>Updated: {article.lastUpdated}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Navigation */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-purple-700 mb-4">Browse by Category</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category, index) => (
                    <Button
                      key={index}
                      variant={selectedCategory === category.toLowerCase() ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category.toLowerCase())}
                      className="rounded-full"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Support Team Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-green-700 mb-4">Our Support Team</h3>
                <div className="grid gap-4">
                  {supportTeam.map((member, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-gray-500">{member.role}</p>
                      </div>
                      <Badge 
                        variant={member.available ? "default" : "secondary"}
                        className="ml-auto"
                      >
                        {member.available ? 'Available' : 'Away'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Support Form */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-700 mb-4">Contact Support</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="issue-type">Type of Issue</Label>
                    <select 
                      id="issue-type"
                      className="w-full p-2 border rounded-md mt-1"
                    >
                      <option>Technical Problem</option>
                      <option>Account Issue</option>
                      <option>Billing Question</option>
                      <option>Feature Request</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Describe your issue..."
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <div className="flex gap-2 mt-1">
                      <Button variant="outline" className="flex-1">Low</Button>
                      <Button variant="outline" className="flex-1">Medium</Button>
                      <Button variant="outline" className="flex-1">High</Button>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    Submit Support Ticket
                  </Button>
                </div>
              </div>
            </div>
              <Accordion type="single" collapsible>
                <AccordionItem value="getting-started">
                  <AccordionTrigger>Getting Started</AccordionTrigger>
                  <AccordionContent>
                    Welcome to TalentFlow! This guide will help you get started with managing your recruitment process.
                    Begin by creating job postings, setting up assessments, and tracking candidates through the pipeline.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="jobs">
                  <AccordionTrigger>Managing Jobs</AccordionTrigger>
                  <AccordionContent>
                    Create and manage job postings easily. Add job descriptions, requirements, and set up custom assessments
                    for each position. Track applications and manage the hiring pipeline efficiently.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="assessments">
                  <AccordionTrigger>Creating Assessments</AccordionTrigger>
                  <AccordionContent>
                    Design custom assessments for your job positions. Add multiple sections, create various types of
                    questions, and set scoring criteria. Monitor candidate performance and generate reports.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="candidates">
                  <AccordionTrigger>Candidate Management</AccordionTrigger>
                  <AccordionContent>
                    Track candidates through your recruitment pipeline using the Kanban board. Move candidates between
                    stages, add notes, and schedule interviews all in one place.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="settings">
                  <AccordionTrigger>Account Settings</AccordionTrigger>
                  <AccordionContent>
                    Customize your TalentFlow experience through the Settings page. Manage notifications, update security
                    preferences, and configure your account. Don't forget to log out when you're done!
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="support">
                  <AccordionTrigger>Support & Contact</AccordionTrigger>
                  <AccordionContent>
                    Need help? Contact our support team at support@talentflow.com
                    Available Monday-Friday, 9 AM - 5 PM EST.
                    For urgent issues, call our support hotline: 1-800-TALENT
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>FAQ</CardTitle>
            <CardDescription>Frequently asked questions about TalentFlow</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="faq-1">
                <AccordionTrigger>How do I reset my password?</AccordionTrigger>
                <AccordionContent>
                  Go to Settings → Security → Change Password. Follow the prompts to set a new password.
                  Make sure to use a strong password with a mix of letters, numbers, and symbols.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-2">
                <AccordionTrigger>Can I export candidate data?</AccordionTrigger>
                <AccordionContent>
                  Yes! You can export candidate data in various formats including CSV and PDF.
                  Look for the export button in the Candidates page or individual candidate profiles.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-3">
                <AccordionTrigger>How do I log out?</AccordionTrigger>
                <AccordionContent>
                  You can log out by going to Settings and clicking the "Log Out" button at the bottom
                  of the page. Always remember to log out when using shared devices!
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
