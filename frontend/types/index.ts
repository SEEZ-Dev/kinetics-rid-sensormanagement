export type StationStatus = "online" | "offline" | "warning" | "critical"

export interface Station {
  id: string
  name: string
  status: StationStatus
  location: {
    lat: number
    lng: number
  }
  lastUpdated: string
  sensors: {
    et0: number
    rainfall: number
    waterLevel: number
    temperature: number
    humidity: number
    windSpeed: number
    solarRadiation: number
  }
}

export type AlertType = "offline" | "weather" | "error"
export type AlertStatus = "pending" | "resolved"

export interface Alert {
  id: string
  type: AlertType
  status: AlertStatus
  timestamp: string
  stationId: string
  stationName: string
  message: string
}

export interface User {
  id: string
  username: string
  name: string
  role: "admin" | "viewer"
}

export interface HistoricalData {
  date: string
  et0: number
  rainfall: number
  waterLevel: number
  temperature: number
  humidity: number
  windSpeed: number
  solarRadiation: number
}

export interface SensorLog {
  timestamp: string
  sensorId: string
  sensorType: string
  value: number
  unit: string
  status: "normal" | "warning" | "error"
  message?: string
}

export interface MaintenanceLog {
  id: string
  date: string
  sensorId: string
  type: "calibration" | "repair" | "inspection" | "firmware" | "installation"
  technician: string
  description: string
}
