"use client"

import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { Station } from "@/types"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Thermometer, Droplet, Cloud, Wind, Sun, Info, Clock, Calendar, ArrowUpRight } from "lucide-react"
import Link from "next/link"

// Fix Leaflet icon issues
const getIcon = (status: string, sensorType: "water" | "weather") => {
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
  let iconUrl = ""
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

    // Add custom CSS for the Leaflet popup
    const style = document.createElement('style')
    style.textContent = `
      .leaflet-popup-content-wrapper {
        border-radius: 12px;
        padding: 0;
        overflow: hidden;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      }
      .leaflet-popup-content {
        margin: 0;
        width: 100% !important;
        max-width: 360px;
      }
      .leaflet-popup-close-button {
        color: white !important;
        font-size: 20px !important;
        z-index: 10;
        top: 10px !important;
        right: 10px !important;
      }
      .leaflet-popup-tip {
        background: white;
      }
      .dark .leaflet-popup-tip {
        background: #1e293b;
      }
      @media (max-width: 500px) {
        .leaflet-popup-content {
          width: 280px !important;
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [stations])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "#22c55e" // green-500
      case "warning":
        return "#f59e0b" // amber-500
      case "offline":
        return "#ef4444" // red-500
      default:
        return "#3b82f6" // blue-500
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      online: "bg-green-500 text-white",
      warning: "bg-amber-500 text-white",
      offline: "bg-red-500 text-white",
      critical: "bg-red-700 text-white",
    }

    return (
      <div className={`${colors[status as keyof typeof colors]} px-3 py-1 rounded-full text-center font-medium text-xs inline-flex items-center gap-1.5 shadow-sm`}>
        <span className={`w-2 h-2 rounded-full ${status === 'online' ? 'animate-pulse' : ''} bg-white`}></span>
        <span>
          {status === "online"
            ? t("status.online")
            : status === "warning"
              ? t("status.warning")
              : status === "offline"
                ? t("status.offline")
                : t("status.critical")}
        </span>
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'th-TH', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <MapContainer center={mapCenter} zoom={8} style={{ height: "600px", width: "100%" }}>
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
                <div className="w-full">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-lg">{station.name}</h3>
                      {getStatusBadge(station.status)}
                    </div>
                    <div className="flex justify-between items-center text-xs text-white/80">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 
                        {formatDate(station.lastUpdated)}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-full">
                        ISMMA2300
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 border-x border-b bg-white dark:bg-gray-900">
                    <div className="grid grid-cols-2 gap-3">
                      {/* Temperature */}
                      <div className="col-span-2 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-900/40 rounded-xl p-3 border border-orange-100 dark:border-orange-800/50 shadow-sm transition-all duration-200 hover:shadow-md">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-orange-700 dark:text-orange-400 text-sm">
                            {t("sensors.temperature")}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-br from-orange-400 to-amber-500 p-2.5 rounded-lg shadow-sm">
                            <Thermometer className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{station.sensors.temperature.toFixed(1)} °C</span>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                              ET₀: {station.sensors.et0.toFixed(2)} {t("units.et0")}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Wind */}
                      <div className="bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-950/40 dark:to-slate-900/40 rounded-xl p-3 border border-blue-100 dark:border-blue-800/50 shadow-sm transition-all duration-200 hover:shadow-md">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-blue-700 dark:text-blue-400 text-sm">
                            {t("sensors.wind")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-gradient-to-br from-blue-400 to-blue-500 p-2 rounded-lg shadow-sm">
                            <Wind className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                              {station.sensors.windSpeed.toFixed(1)}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {t("units.wind")}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Solar */}
                      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/40 dark:to-amber-900/40 rounded-xl p-3 border border-yellow-100 dark:border-yellow-800/50 shadow-sm transition-all duration-200 hover:shadow-md">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-yellow-700 dark:text-yellow-400 text-sm">
                            {t("sensors.solar")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-gradient-to-br from-yellow-400 to-amber-500 p-2 rounded-lg shadow-sm">
                            <Sun className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                              {station.sensors.solarRadiation.toFixed(0)}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {t("units.solar")}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex items-center gap-2">
                      <Button asChild className="bg-gradient-to-r from-orange-500 to-amber-500 text-white border-none shadow-sm flex-1 h-9">
                        <Link href={`/stations/details/${station.id}`}>
                          <Info className="mr-1.5 h-3.5 w-3.5" />
                          {t("stations.details")}
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="shadow-sm flex-1 h-9 hover:bg-orange-50 dark:hover:bg-orange-950/30">
                        <Link href={`/stations/sensor-logs/${station.id}`}>
                          <ArrowUpRight className="mr-1.5 h-3.5 w-3.5" />
                          {language === "en" ? "Logs" : "บันทึก"}
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
                <div className="w-full">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-lg">{station.name}</h3>
                      {getStatusBadge(station.status)}
                    </div>
                    <div className="flex justify-between items-center text-xs text-white/80">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 
                        {formatDate(station.lastUpdated)}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-full">
                        DQA230.1
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 border-x border-b bg-white dark:bg-gray-900">
                    <div className="grid grid-cols-2 gap-3">
                      {/* Rainfall */}
                      <div className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/40 dark:to-blue-900/40 rounded-xl p-3 border border-sky-100 dark:border-sky-800/50 shadow-sm transition-all duration-200 hover:shadow-md">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sky-700 dark:text-sky-400 text-sm">
                            {t("stations.rainfall")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-gradient-to-br from-sky-400 to-blue-500 p-2 rounded-lg shadow-sm">
                            <Cloud className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                              {station.sensors.rainfall.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {t("units.rainfall")}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Water Level */}
                      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-900/40 rounded-xl p-3 border border-indigo-100 dark:border-indigo-800/50 shadow-sm transition-all duration-200 hover:shadow-md">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-indigo-700 dark:text-indigo-400 text-sm">
                            {t("stations.water.level")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-gradient-to-br from-indigo-400 to-blue-500 p-2 rounded-lg shadow-sm">
                            <Droplet className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                              {station.sensors.waterLevel.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {t("units.water.level")}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex items-center gap-2">
                      <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-none shadow-sm flex-1 h-9">
                        <Link href={`/stations/details/${station.id}`}>
                          <Info className="mr-1.5 h-3.5 w-3.5" />
                          {t("stations.details")}
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="shadow-sm flex-1 h-9 hover:bg-blue-50 dark:hover:bg-blue-950/30">
                        <Link href={`/stations/sensor-logs/${station.id}`}>
                          <ArrowUpRight className="mr-1.5 h-3.5 w-3.5" />
                          {language === "en" ? "Logs" : "บันทึก"}
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
