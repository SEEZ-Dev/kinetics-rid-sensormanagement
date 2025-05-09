"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { AlertTriangle, BarChart3, Droplets, Home, Map, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"

export function MainSidebar() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const routes = [
    {
      href: "/dashboard",
      icon: Home,
      title: t("dashboard.title"),
    },
    {
      href: "/stations/map",
      icon: Map,
      title: t("stations.map"),
    },
    {
      href: "/stations/list",
      icon: BarChart3,
      title: t("stations.list"),
    },
    {
      href: "/alerts",
      icon: AlertTriangle,
      title: t("alerts.title"),
    },
    {
      href: "/settings",
      icon: Settings,
      title: t("app.settings"),
    },
  ]

  return (
    <div className="flex h-full w-[240px] flex-col border-r bg-muted/40 py-4">
      <div className="px-3 py-2">
        <div className="space-y-1">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={pathname === route.href ? "secondary" : "ghost"}
              className={cn("w-full justify-start", pathname === route.href ? "bg-secondary" : "")}
              asChild
            >
              <Link href={route.href}>
                <route.icon className="mr-2 h-5 w-5" />
                {route.title}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
