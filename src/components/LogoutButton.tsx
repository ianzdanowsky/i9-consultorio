"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { LogOut } from "lucide-react"
import React from "react"
import { signOut } from "next-auth/react"

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    await signOut()
    setIsLoading(false)
    console.log("User logged out")
  }

  return (
    <Button variant="outline" onClick={handleLogout} disabled={isLoading} className="flex items-center space-x-2">
      <LogOut className="h-4 w-4" />
      <span>{isLoading ? "Logging out..." : "Logout"}</span>
    </Button>
  )
}

