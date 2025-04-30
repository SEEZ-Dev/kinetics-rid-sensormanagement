"use client"
import { useLanguage } from "@/components/language-provider"
import { useAlerts } from "@/hooks/useAlerts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AlertType, AlertStatus } from "@/types"
import { CheckCircle2, AlertTriangle, CloudRain, AlertCircle, Bell } from "lucide-react"
import { motion } from "framer-motion"

export default function AlertsPage() {
  const { t } = useLanguage()
  const { allAlerts, resolveAlert } = useAlerts()

  const getAlertTypeIcon = (type: AlertType) => {
    switch (type) {
      case "offline":
        return <AlertCircle className="h-5 w-5" />
      case "weather":
        return <CloudRain className="h-5 w-5" />
      case "error":
        return <AlertTriangle className="h-5 w-5" />
      default:
        return null
    }
  }

  const getAlertTypeBadge = (type: AlertType) => {
    const variants = {
      offline: "bg-gray-500/20 text-gray-700 dark:text-gray-300",
      weather: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
      error: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
    }

    const labels = {
      offline: t("alerts.offline"),
      weather: t("alerts.weather"),
      error: t("alerts.error"),
    }

    return (
      <Badge className={variants[type]}>
        {getAlertTypeIcon(type)}
        <span className="ml-1">{labels[type]}</span>
      </Badge>
    )
  }

  const getAlertStatusBadge = (status: AlertStatus) => {
    const variants = {
      pending: "bg-red-500/20 text-red-700 dark:text-red-300",
      resolved: "bg-green-500/20 text-green-700 dark:text-green-300",
    }

    const labels = {
      pending: t("alerts.pending"),
      resolved: t("alerts.resolved"),
    }

    return (
      <Badge className={variants[status]}>
        {status === "resolved" && <CheckCircle2 className="mr-1 h-3 w-3" />}
        {labels[status]}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight gradient-text">{t("alerts.title")}</h1>
          <p className="text-muted-foreground">
            {t("alerts.description") || "Monitor and manage system alerts"}
          </p>
        </div>
        <div className="relative">
          <Bell className="h-6 w-6 text-primary animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
            {allAlerts.filter(a => a.status === "pending").length}
          </span>
        </div>
      </div>

      <div className="grid gap-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4"
        >
          {allAlerts.map((alert) => (
            <motion.div key={alert.id} variants={item}>
              <Card className="overflow-hidden card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getAlertTypeBadge(alert.type)}
                        {getAlertStatusBadge(alert.status)}
                      </div>
                      <h3 className="font-semibold">{alert.stationName}</h3>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(alert.timestamp)}</p>
                    </div>
                    {alert.status === "pending" && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => resolveAlert(alert.id)}
                        className="button-hover"
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        {t("alerts.resolved")}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
