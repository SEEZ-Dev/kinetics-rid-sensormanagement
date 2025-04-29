"use client"

import { useState, useEffect } from "react"
import type { Alert } from "@/types"
import { alerts } from "@/mock/alerts"
import { useToast } from "@/components/ui/use-toast"

export function useAlerts() {
  const [allAlerts, setAllAlerts] = useState<Alert[]>(alerts)
  const [pendingAlerts, setPendingAlerts] = useState<Alert[]>([])
  const { toast } = useToast()

  useEffect(() => {
    // Filter pending alerts
    const pending = allAlerts.filter((alert) => alert.status === "pending")
    setPendingAlerts(pending)

    // Simulate new alerts coming in
    const interval = setInterval(() => {
      const shouldCreateAlert = Math.random() > 0.8 // 20% chance of new alert

      if (shouldCreateAlert) {
        const newAlert: Alert = {
          id: `alert-${Date.now()}`,
          type: Math.random() > 0.5 ? "weather" : Math.random() > 0.5 ? "error" : "offline",
          status: "pending",
          timestamp: new Date().toISOString(),
          stationId: `station-${Math.floor(Math.random() * 5) + 1}`,
          stationName: ["Mukdahan City", "Don Tan", "Nong Sung", "Khamcha-i", "Dong Luang"][
            Math.floor(Math.random() * 5)
          ],
          message: "New alert detected",
        }

        setAllAlerts((prev) => [newAlert, ...prev])

        // Show toast notification
        toast({
          title: "New Alert",
          description: `${newAlert.stationName}: ${newAlert.message}`,
          variant: "destructive",
        })
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [allAlerts, toast])

  const resolveAlert = (alertId: string) => {
    setAllAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, status: "resolved" } : alert)))
  }

  return {
    allAlerts,
    pendingAlerts,
    pendingCount: pendingAlerts.length,
    resolveAlert,
  }
}
