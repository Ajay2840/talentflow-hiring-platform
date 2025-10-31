import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useUser } from "@/lib/user"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { UserIcon } from "lucide-react"

 type Profile = {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  department: string
  company: string
  bio: string
}

export default function Profile() {
  const { toast } = useToast()
  const { profileData: storeProfileData, updateProfile } = useUser()

  const defaultProfile: Profile = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    company: "",
    bio: ""
  }

  const [language, setLanguage] = useState("english")
  const [timezone, setTimezone] = useState("UTC")
  const profileData: Profile = (storeProfileData as Profile) || defaultProfile
  const [formData, setFormData] = useState<Profile>(profileData)

  const handleSaveChanges = () => {
    updateProfile(formData)
    toast({
      title: "Profile Saved",
      description: "Your profile has been updated successfully.",
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Update your personal information and preferences</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-blue-500" />
              Profile Settings
            </CardTitle>
            <CardDescription>Keep your information up to date</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{formData.firstName} {formData.lastName}</h3>
                <p className="text-sm text-gray-500">{formData.role} at {formData.company}</p>
                <Button size="sm" variant="outline">Change Avatar</Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label>First Name</Label>
                  <Input 
                    value={formData.firstName} 
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Last Name</Label>
                  <Input 
                    value={formData.lastName} 
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Phone</Label>
                  <Input 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label>Role</Label>
                  <Input 
                    value={formData.role} 
                    onChange={(e) => setFormData({...formData, role: e.target.value})} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Department</Label>
                  <Input 
                    value={formData.department} 
                    onChange={(e) => setFormData({...formData, department: e.target.value})} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Company</Label>
                  <Input 
                    value={formData.company} 
                    onChange={(e) => setFormData({...formData, company: e.target.value})} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Bio</Label>
                  <textarea 
                    className="w-full p-2 border rounded-md min-h-[100px]"
                    value={formData.bio} 
                    onChange={(e) => setFormData({...formData, bio: e.target.value})} 
                  />
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Language</Label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                  <option value="chinese">Chinese</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Timezone</Label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time (ET)</option>
                  <option value="CST">Central Time (CT)</option>
                  <option value="MST">Mountain Time (MT)</option>
                  <option value="PST">Pacific Time (PT)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleSaveChanges}>Save Changes</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-200">
          <CardHeader>
            <CardTitle>Tips</CardTitle>
            <CardDescription>Keep your profile complete</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-600">
                A complete profile helps personalize your experience and improves team collaboration.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
