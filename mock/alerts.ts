import type { Alert } from "@/types"

export const alerts: Alert[] = [
  {
    id: "alert-1",
    type: "offline",
    status: "pending",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    stationId: "station-4",
    stationName: "Khamcha-i",
    message: "Station offline for more than 24 hours",
  },
  {
    id: "alert-2",
    type: "weather",
    status: "pending",
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    stationId: "station-3",
    stationName: "Nong Sung",
    message: "Heavy rainfall detected (5.2mm/hr)",
  },
  {
    id: "alert-3",
    type: "error",
    status: "resolved",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    stationId: "station-2",
    stationName: "Don Tan",
    message: "Temperature sensor reading error",
  },
  {
    id: "alert-4",
    type: "weather",
    status: "resolved",
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    stationId: "station-1",
    stationName: "Mukdahan City",
    message: "High wind speed detected (8.5m/s)",
  },
  {
    id: "alert-5",
    type: "error",
    status: "pending",
    timestamp: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
    stationId: "station-5",
    stationName: "Dong Luang",
    message: "Solar radiation sensor calibration required",
  },
]

export function getAlertsByStationId(stationId: string): Alert[] {
  return alerts.filter((alert) => alert.stationId === stationId)
}

export function getPendingAlertsCount(): number {
  return alerts.filter((alert) => alert.status === "pending").length
}
