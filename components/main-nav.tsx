"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Menu, Moon, Sun, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useTheme } from "next-themes"
import { useAuth } from "@/hooks/useAuth"
import { useLanguage } from "@/components/language-provider"
import { useAlerts } from "@/hooks/useAlerts"
import { MainSidebar } from "@/components/main-sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

export function MainNav() {
  const { user, logout } = useAuth()
  const { setTheme } = useTheme()
  const { language, changeLanguage, t } = useLanguage()
  const { pendingCount } = useAlerts()
  const pathname = usePathname()

  if (pathname === "/login") return null

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <MainSidebar />
            </SheetContent>
          </Sheet>

          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold">{t("app.title")}</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/alerts">
                  <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {pendingCount > 0 && (
                      <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                        {pendingCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>{t("alerts.title")}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                {language === "en" ? "EN" : "TH"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeLanguage("en")}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage("th")}>ไทย</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>{t("app.light")}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>{t("app.dark")}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>{t("app.system")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled>
                {user?.name} ({user?.role})
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>{t("app.logout")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
