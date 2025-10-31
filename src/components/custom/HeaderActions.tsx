import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"
import { useUser } from "@/lib/user"
import { ProfileModal } from "./ProfileModal"

interface HeaderActionsProps {
  pageName?: string
  onEditProfile?: () => void
}

export function HeaderActions({ pageName, onEditProfile }: HeaderActionsProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { toast } = useToast()
  const { logout } = useAuth()
  const { profileData, updateProfile } = useUser()

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout()
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      })
    }
  }

  const handleProfileSave = (data: typeof profileData) => {
    updateProfile(data)
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    })
  }

  return (
    <>
      <div className="flex items-center gap-3">
        {pageName && <Badge variant="outline" className="px-3 py-1">{pageName}</Badge>}
        <Button size="sm" variant="outline" onClick={onEditProfile || (() => setIsProfileOpen(true))}>Edit Profile</Button>
        <Button size="sm" variant="ghost" onClick={handleLogout}>Log Out</Button>
      </div>

      {!onEditProfile && (
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          initialData={profileData}
          onSave={handleProfileSave}
        />
      )}
    </>
  )
}