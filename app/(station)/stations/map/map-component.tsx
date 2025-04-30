"use client"

import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { Station } from "@/types"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Thermometer, Droplet, Cloud, Wind, Sun, Info } from "lucide-react"
import Link from "next/link"

// Fix Leaflet icon issues
const getIcon = (status: string, sensorType: "water" | "weather") => {
  let iconUrl = "/placeholder.svg?height=32&width=32"

  // Base color by status
  let statusColor = ""
  if (status === "online") {
    statusColor = "green"
  } else if (status === "warning") {
    statusColor = "orange"
  } else if (status === "offline") {
    statusColor = "red"
  } else {
    statusColor = "blue"
  }

  // Different icon shapes for different sensor types
  if (sensorType === "water") {
    // Use blue markers for water sensors
    iconUrl = `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png`
  } else {
    // Use regular markers for weather sensors
    iconUrl = `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${statusColor}.png`
  }

  return new L.Icon({
    iconUrl,
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })
}

interface MapComponentProps {
  stations: Station[]
}

export default function MapComponent({ stations }: MapComponentProps) {
  const { t, language } = useLanguage()
  const [mapCenter, setMapCenter] = useState<[number, number]>([16.5434, 104.7235])
  const [weatherStations, setWeatherStations] = useState<Station[]>([])
  const [waterStations, setWaterStations] = useState<Station[]>([])

  useEffect(() => {
    // Separate stations into weather and water groups
    // For demo purposes, we'll just alternate them
    const weather: Station[] = []
    const water: Station[] = []

    stations.forEach((station, index) => {
      if (index % 2 === 0) {
        weather.push(station)
      } else {
        water.push(station)
      }
    })

    setWeatherStations(weather)
    setWaterStations(water)
  }, [stations])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "#22c55e"
      case "warning":
        return "#f59e0b"
      case "offline":
        return "#ef4444"
      default:
        return "#3b82f6"
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      online: "bg-green-500 text-white",
      warning: "bg-yellow-500 text-white",
      offline: "bg-red-500 text-white",
      critical: "bg-red-700 text-white",
    }

    return (
      <div
        className={`${colors[status as keyof typeof colors]} px-4 py-1 rounded-full text-center font-medium w-fit mx-auto`}
      >
        {status === "online"
          ? t("status.online")
          : status === "warning"
            ? t("status.warning")
            : status === "offline"
              ? t("status.offline")
              : t("status.critical")}
      </div>
    )
  }

  // Generate relationship lines between stations
  const generateRelationshipLines = () => {
    const lines = []

    // Connect weather stations
    for (let i = 0; i < weatherStations.length - 1; i++) {
      lines.push({
        positions: [
          [weatherStations[i].location.lat, weatherStations[i].location.lng],
          [weatherStations[i + 1].location.lat, weatherStations[i + 1].location.lng],
        ],
        color: "#f97316", // Orange for weather stations
        dashArray: "5, 5",
      })
    }

    // Connect water stations
    for (let i = 0; i < waterStations.length - 1; i++) {
      lines.push({
        positions: [
          [waterStations[i].location.lat, waterStations[i].location.lng],
          [waterStations[i + 1].location.lat, waterStations[i + 1].location.lng],
        ],
        color: "#3b82f6", // Blue for water stations
        dashArray: "5, 5",
      })
    }

    return lines
  }

  const relationshipLines = generateRelationshipLines()

  return (
    <MapContainer center={mapCenter} zoom={10} style={{ height: "600px", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Relationship lines */}
      {relationshipLines.map((line, index) => (
        <Polyline
          key={`line-${index}`}
          positions={line.positions as [number, number][]}
          pathOptions={{
            color: line.color,
            weight: 2,
            opacity: 0.7,
            dashArray: line.dashArray,
          }}
        />
      ))}

      {/* Weather Stations Group */}
      <div className="weather-stations-group">
        {weatherStations.map((station) => (
          <div key={`weather-${station.id}`}>
            {/* Pulse effect for active stations */}
            {station.status === "online" && (
              <CircleMarker
                center={[station.location.lat, station.location.lng]}
                radius={20}
                pathOptions={{
                  color: "#f97316", // Orange for weather
                  fillColor: "#f97316",
                  fillOpacity: 0.2,
                }}
                className="animate-pulse"
              />
            )}

            <Marker position={[station.location.lat, station.location.lng]} icon={getIcon(station.status, "weather")}>
              <Popup className="station-popup">
                <div className="p-2 min-w-[320px]">
                  <div className="bg-gradient-to-br from-orange-500 to-amber-500 text-white p-4 rounded-t-lg">
                    <h3 className="font-bold text-xl text-center mb-1">{station.name}</h3>
                    <p className="text-center text-sm opacity-90">ISMMA2300 Weather Station</p>
                  </div>

                  <div className="p-4 border-x border-b rounded-b-lg border-orange-200 dark:border-orange-800 bg-white dark:bg-gray-900">
                    {getStatusBadge(station.status)}

                    <div className="my-4 space-y-3">
                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-orange-600 dark:text-orange-400">ISMMA2300</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{t("sensors.temperature")}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="bg-orange-100 dark:bg-orange-900/50 p-2 rounded-full">
                            <Thermometer className="h-6 w-6 text-orange-500" />
                          </div>
                          <div>
                            <span className="text-2xl font-bold">{station.sensors.temperature.toFixed(1)} °C</span>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              ET₀: {station.sensors.et0.toFixed(2)} {t("units.et0")}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950/30 dark:to-slate-900/30 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-600 dark:text-slate-400">ISMMA2300</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{t("sensors.wind")}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="bg-slate-100 dark:bg-slate-900/50 p-2 rounded-full">
                            <Wind className="h-6 w-6 text-slate-500" />
                          </div>
                          <div>
                            <span className="text-2xl font-bold">
                              {station.sensors.windSpeed.toFixed(1)} {t("units.wind")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-yellow-600 dark:text-yellow-400">ISMMA2300</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{t("sensors.solar")}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="bg-yellow-100 dark:bg-yellow-900/50 p-2 rounded-full">
                            <Sun className="h-6 w-6 text-yellow-500" />
                          </div>
                          <div>
                            <span className="text-2xl font-bold">
                              {station.sensors.solarRadiation.toFixed(0)} {t("units.solar")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <Button asChild className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white border-none shadow-md">
                        <Link href={`/stations/details/${station.id}`}>
                          <Info className="mr-2 h-4 w-4" />
                          {t("stations.details")}
                        </Link>
                      </Button>
                      <Button asChild className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white border-none shadow-md">
                        <Link href={`/stations/sensor-logs/${station.id}`}>
                          <Thermometer className="mr-2 h-4 w-4" />
                          {language === "en" ? "Sensor Logs" : "บันทึกเซ็นเซอร์"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          </div>
        ))}
      </div>

      {/* Water Stations Group */}
      <div className="water-stations-group">
        {waterStations.map((station) => (
          <div key={`water-${station.id}`}>
            {/* Pulse effect for active stations */}
            {station.status === "online" && (
              <CircleMarker
                center={[station.location.lat, station.location.lng]}
                radius={20}
                pathOptions={{
                  color: "#3b82f6", // Blue for water
                  fillColor: "#3b82f6",
                  fillOpacity: 0.2,
                }}
                className="animate-pulse"
              />
            )}

            <Marker position={[station.location.lat, station.location.lng]} icon={getIcon(station.status, "water")}>
              <Popup className="station-popup">
                <div className="p-2 min-w-[300px]">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-t-lg">
                    <h3 className="font-bold text-xl text-center">{station.name}</h3>
                    <p className="text-center text-sm opacity-90">DQA230.1 Water Monitoring</p>
                  </div>

                  <div className="p-3 border-x border-b rounded-b-lg border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900">
                    {getStatusBadge(station.status)}

                    <div className="my-4 space-y-3">
                      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-white">DQA230.1</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{t("stations.rainfall")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Cloud className="h-5 w-5 text-blue-500" />
                          <span className="text-xl font-bold">
                            {station.sensors.rainfall.toFixed(2)} {t("units.rainfall")}
                          </span>
                        </div>
                      </div>

                      <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-lg p-3 border border-indigo-200 dark:border-indigo-800">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-white">DQA230.1</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{t("stations.water.level")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Droplet className="h-5 w-5 text-white" />
                          <span className="text-xl font-bold">
                            {station.sensors.waterLevel.toFixed(2)} {t("units.water.level")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <Button asChild className="bg-blue-600 text-white border-none">
                        <Link href={`/stations/details/${station.id}`}>
                          <Info className="mr-1 h-4 w-4" />
                          {t("stations.details")}
                        </Link>
                      </Button>
                      <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white border-none">
                        <Link href={`/stations/sensor-logs/${station.id}`}>
                          <Droplet className="mr-1 h-4 w-4" />
                          {language === "en" ? "Sensor Logs" : "บันทึกเซ็นเซอร์"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          </div>
        ))}
      </div>
    </MapContainer>
  )
}
