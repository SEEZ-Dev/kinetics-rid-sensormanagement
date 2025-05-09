"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { AuthProvider } from "@/hooks/useAuth"
import { MainNav } from "@/components/main-nav"
import { MainSidebar } from "@/components/main-sidebar"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <AuthProvider>
      {!isLoginPage && (
        <div className="flex min-h-screen flex-col">
          <MainNav />
          <div className="flex flex-1">
            <MainSidebar />
            <main className="flex-1 p-4 md:p-6">{children}</main>
          </div>
        </div>
      )}

      {isLoginPage && children}
    </AuthProvider>
  )
}
