import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  department: string
  company: string
  bio: string
}

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  initialData: ProfileData
  onSave: (data: ProfileData) => void
}

export function ProfileModal({ isOpen, onClose, initialData, onSave }: ProfileModalProps) {
  const [profileData, setProfileData] = useState(initialData)
  const { toast } = useToast()

  const handleSave = () => {
    onSave(profileData)
    toast({
      title: "Profile Updated",
      description: "Your profile changes have been saved successfully.",
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your profile information and preferences.</DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-3">
            <div className="grid gap-2">
              <Label>First Name</Label>
              <Input 
                value={profileData.firstName}
                onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label>Last Name</Label>
              <Input 
                value={profileData.lastName}
                onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input 
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label>Phone</Label>
              <Input 
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid gap-2">
              <Label>Role</Label>
              <Input 
                value={profileData.role}
                onChange={(e) => setProfileData({...profileData, role: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label>Department</Label>
              <Input 
                value={profileData.department}
                onChange={(e) => setProfileData({...profileData, department: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label>Company</Label>
              <Input 
                value={profileData.company}
                onChange={(e) => setProfileData({...profileData, company: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Label>Bio</Label>
          <textarea 
            className="w-full p-2 border rounded-md min-h-[100px]"
            value={profileData.bio}
            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
          />
        </div>

        <DialogFooter className="mt-4">
          <div className="flex w-full gap-3">
            <Button variant="outline" className="w-full" onClick={onClose}>Cancel</Button>
            <Button className="w-full" onClick={handleSave}>Save Changes</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}