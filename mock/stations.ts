import type { Station } from "@/types"

export const stations: Station[] = [
  {
    id: "station-1",
    name: "Mukdahan City",
    status: "online",
    location: {
      lat: 16.5434,
      lng: 104.7235,
    },
    lastUpdated: new Date().toISOString(),
    sensors: {
      et0: 4.2,
      rainfall: 0,
      waterLevel: 138.5,
      temperature: 32.4,
      humidity: 65,
      windSpeed: 2.1,
      solarRadiation: 850,
    },
  },
  {
    id: "station-2",
    name: "Don Tan",
    status: "online",
    location: {
      lat: 16.3012,
      lng: 104.8765,
    },
    lastUpdated: new Date().toISOString(),
    sensors: {
      et0: 3.8,
      rainfall: 2.5,
      waterLevel: 142.3,
      temperature: 31.2,
      humidity: 72,
      windSpeed: 1.8,
      solarRadiation: 820,
    },
  },
  {
    id: "station-3",
    name: "Nong Sung",
    status: "warning",
    location: {
      lat: 16.6789,
      lng: 104.6543,
    },
    lastUpdated: new Date().toISOString(),
    sensors: {
      et0: 4.5,
      rainfall: 5.2,
      waterLevel: 145.7,
      temperature: 30.8,
      humidity: 78,
      windSpeed: 3.2,
      solarRadiation: 780,
    },
  },
  {
    id: "station-4",
    name: "Khamcha-i",
    status: "offline",
    location: {
      lat: 16.4567,
      lng: 104.5432,
    },
    lastUpdated: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    sensors: {
      et0: 0,
      rainfall: 0,
      waterLevel: 0,
      temperature: 0,
      humidity: 0,
      windSpeed: 0,
      solarRadiation: 0,
    },
  },
  {
    id: "station-5",
    name: "Dong Luang",
    status: "online",
    location: {
      lat: 16.7123,
      lng: 104.9876,
    },
    lastUpdated: new Date().toISOString(),
    sensors: {
      et0: 4.1,
      rainfall: 1.2,
      waterLevel: 140.2,
      temperature: 31.5,
      humidity: 68,
      windSpeed: 2.5,
      solarRadiation: 830,
    },
  },
]

export function getStationById(id: string): Station | undefined {
  return stations.find((station) => station.id === id)
}
