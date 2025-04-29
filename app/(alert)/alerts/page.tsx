"use client"
import { useLanguage } from "@/components/language-provider"
import { useAlerts } from "@/hooks/useAlerts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { AlertType, AlertStatus } from "@/types"
import { CheckCircle2, AlertTriangle, CloudRain, AlertCircle } from "lucide-react"

export default function AlertsPage() {
  const { t } = useLanguage()
  const { allAlerts, resolveAlert } = useAlerts()

  const getAlertTypeIcon = (type: AlertType) => {
    switch (type) {
      case "offline":
        return <AlertCircle className="h-4 w-4" />
      case "weather":
        return <CloudRain className="h-4 w-4" />
      case "error":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return null
    }
  }

  const getAlertTypeBadge = (type: AlertType) => {
    const variants = {
      offline: "bg-gray-500 hover:bg-gray-500",
      weather: "bg-blue-500 hover:bg-blue-500",
      error: "bg-yellow-500 hover:bg-yellow-500",
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
      pending: "bg-red-500 hover:bg-red-500",
      resolved: "bg-green-500 hover:bg-green-500",
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t("alerts.title")}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("alerts.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("alerts.type")}</TableHead>
                <TableHead>{t("alerts.status")}</TableHead>
                <TableHead>{t("alerts.time")}</TableHead>
                <TableHead>{t("alerts.station")}</TableHead>
                <TableHead>{t("alerts.message")}</TableHead>
                <TableHead className="text-right">{t("app.details")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allAlerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>{getAlertTypeBadge(alert.type)}</TableCell>
                  <TableCell>{getAlertStatusBadge(alert.status)}</TableCell>
                  <TableCell>{formatDate(alert.timestamp)}</TableCell>
                  <TableCell>{alert.stationName}</TableCell>
                  <TableCell>{alert.message}</TableCell>
                  <TableCell className="text-right">
                    {alert.status === "pending" && (
                      <Button variant="outline" size="sm" onClick={() => resolveAlert(alert.id)}>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        {t("alerts.resolved")}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
