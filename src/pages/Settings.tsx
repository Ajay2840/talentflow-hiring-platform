import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
// Removed unused inputs/labels as profile editing moved out
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { HeaderActions } from "@/components/custom/HeaderActions"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"
// profile dialog removed
import { 
  BellIcon, 
  ShieldIcon, 
  BellRingIcon,
  KeyIcon
} from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

type TabValue = "notifications" | "security"

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

export default function Settings() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [emailUpdates, setEmailUpdates] = useState(true)
  const { toast } = useToast()
  const { logout } = useAuth()
  // profile state moved to Profile page
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState(30)
  const [dataRetention, setDataRetention] = useState(90)
  const [activeTab, setActiveTab] = useState<TabValue>("notifications")
  
  // removed unused userStats

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out? Any unsaved changes will be lost.")) {
      logout()
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      })
    }
  }

  const handleSaveChanges = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your account preferences and profile</p>
        </div>
        <HeaderActions pageName="Settings" onEditProfile={() => navigate('/profile')} />
      </div>
      
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <div className="p-6 bg-white rounded-lg shadow md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
          <p className="text-gray-600 mb-4">Common account actions you might need frequently.</p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigate('/profile')}>Edit Profile</Button>
            <Button variant="outline" onClick={handleSaveChanges}>Save Settings</Button>
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Sign Out</h2>
          <p className="text-gray-600">Sign out of your account securely. Make sure to save any changes before logging out. Signing out will end your current session and require you to log in again to access your account.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Account Security</h2>
          <p className="text-gray-600">Manage your password and enable two-factor authentication for enhanced security. Protect your account from unauthorized access.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Notification Preferences</h2>
          <p className="text-gray-600">Choose how you receive updates and alerts. Customize email, SMS, and in-app notifications to stay informed about important activity.</p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Data & Privacy</h2>
          <p className="text-gray-600">Download your data, review privacy settings, and manage data retention policies. Your privacy and control over your information are important to us.</p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Connected Devices</h2>
          <p className="text-gray-600">See where your account is signed in and remotely sign out from other devices to keep your account secure.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Manage Team</h2>
          <p className="text-gray-600">Invite members, assign roles, and control access to assessments and analytics. Available to admins.</p>
        </div>
        
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <BellIcon className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <ShieldIcon className="w-4 h-4" />
            Security
          </TabsTrigger>
        </TabsList>
        

        <TabsContent value="notifications">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BellRingIcon className="w-5 h-5 text-green-500" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive email updates about your account</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
                <div>
                  <p className="font-medium">Weekly Digest</p>
                  <p className="text-sm text-gray-500">Get a summary of weekly activities</p>
                </div>
                <Switch checked={emailUpdates} onCheckedChange={setEmailUpdates} />
              </div>
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription className="text-blue-600">
                  You can customize your notification preferences at any time. Changes are saved automatically.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        

        <TabsContent value="security">
          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldIcon className="w-5 h-5 text-red-500" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="grid gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
                    <h3 className="text-lg font-semibold mb-4">Password & Authentication</h3>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                        <KeyIcon className="w-4 h-4" />
                        Change Password
                      </Button>
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                        <div>
                          <p className="font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-500">Add an extra layer of security</p>
                        </div>
                        <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
                    <h3 className="text-lg font-semibold mb-4">Session Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                        <div>
                          <p className="font-medium">Session Timeout</p>
                          <p className="text-sm text-gray-500">Auto logout after inactivity</p>
                        </div>
                        <select 
                          className="p-2 border rounded-md"
                          value={sessionTimeout}
                          onChange={(e) => setSessionTimeout(Number(e.target.value))}
                        >
                          <option value={15}>15 minutes</option>
                          <option value={30}>30 minutes</option>
                          <option value={60}>1 hour</option>
                          <option value={120}>2 hours</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
                    <h3 className="text-lg font-semibold mb-4">Data & Privacy</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                        <div>
                          <p className="font-medium">Data Retention</p>
                          <p className="text-sm text-gray-500">Keep activity history for</p>
                        </div>
                        <select 
                          className="p-2 border rounded-md"
                          value={dataRetention}
                          onChange={(e) => setDataRetention(Number(e.target.value))}
                        >
                          <option value={30}>30 days</option>
                          <option value={60}>60 days</option>
                          <option value={90}>90 days</option>
                          <option value={180}>180 days</option>
                        </select>
                      </div>
                      <Button variant="outline" className="w-full">
                        Download My Data
                      </Button>
                    </div>
                  </div>
                </div>

                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertDescription className="text-yellow-600">
                    Two-factor authentication significantly enhances your account security. We strongly recommend enabling it.
                  </AlertDescription>
                </Alert>

                <div className="pt-4">
                  <Button 
                    variant="destructive"
                    size="sm"
                    onClick={handleLogout}
                  >
                    Log Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      
    </div>
  )
}
