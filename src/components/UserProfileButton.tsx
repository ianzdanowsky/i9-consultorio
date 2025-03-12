"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { LogOut, User, ChevronDown } from "lucide-react"
import { type Session } from "next-auth"
import { signOut } from "next-auth/react"

interface UserProfileProps {
    session: Session | null
  }
  
  export default function UserProfileButton({ session }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Placeholder user data
  const user = {
    name: session?.user.nomecompleto,
    email: session?.user.email,
    avatar: "",
    role: session?.user.role,
  }

  const handleLogout = async () => {
    // Implement your logout logic here
    await signOut()
    console.log("Logging out...")
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-10 px-3 py-2">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="mr-2">{user.name}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Usuário</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 opacity-70" />
              <span className="text-sm font-medium">Cargo:</span>
              <span className="text-sm text-muted-foreground">{user.role}</span>
            </div>
          </div>
        </div>
        <Button onClick={handleLogout} variant="destructive" className="w-full">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </DialogContent>
    </Dialog>
  )
}

