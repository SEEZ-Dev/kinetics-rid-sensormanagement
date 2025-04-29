import type { Station } from "@/types"

export function exportStationsToCSV(stations: Station[]): void {
  // Define the headers
  const headers = [
    "Station Name",
    "Status",
    "ET₀ (mm/day)",
    "Rainfall (mm)",
    "Water Level (m)",
    "Temperature (°C)",
    "Humidity (%)",
    "Wind Speed (m/s)",
    "Last Updated",
  ]

  // Map the data
  const rows = stations.map((station) => [
    station.name,
    station.status,
    station.sensors.et0.toFixed(2),
    station.sensors.rainfall.toFixed(2),
    station.sensors.waterLevel.toFixed(2),
    station.sensors.temperature.toFixed(2),
    station.sensors.humidity.toFixed(2),
    station.sensors.windSpeed.toFixed(2),
    new Date(station.lastUpdated).toLocaleString(),
  ])

  // Combine headers and rows
  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

  // Create a blob and download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)

  // Create a temporary link and trigger download
  const link = document.createElement("a")
  link.href = url
  link.download = `stations-export-${new Date().toISOString().split("T")[0]}.csv`
  document.body.appendChild(link)
  link.click()

  // Clean up
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
