"use client"

import { useState, useEffect, useCallback } from "react"
import type { Station } from "@/types"
import { stations } from "@/mock/stations"
import { generateHistoricalData } from "@/mock/historical-data"

// Define the HistoricalData type
interface HistoricalData {
  timestamp: string
  et0: number
  rainfall: number
  waterLevel: number
  temperature: number
  humidity: number
  windSpeed: number
  solarRadiation: number
}

export function useSensorData() {
  const [allStations, setAllStations] = useState<Station[]>(stations)
  const [onlineCount, setOnlineCount] = useState(0)

  // เพิ่ม memoization สำหรับข้อมูลประวัติ
  const [historicalDataCache, setHistoricalDataCache] = useState<Record<string, Record<number, HistoricalData[]>>>({})

  useEffect(() => {
    // Count online stations
    const online = allStations.filter((station) => station.status === "online").length
    setOnlineCount(online)

    // Simulate real-time updates to sensor data
    const interval = setInterval(() => {
      setAllStations((prev) =>
        prev.map((station) => {
          if (station.status === "offline") return station

          // Small random changes to sensor values
          return {
            ...station,
            lastUpdated: new Date().toISOString(),
            sensors: {
              ...station.sensors,
              et0: Math.max(0, station.sensors.et0 + (Math.random() * 0.2 - 0.1)),
              rainfall: Math.max(0, station.sensors.rainfall + (Math.random() > 0.9 ? Math.random() * 0.5 : 0)),
              waterLevel: Math.max(0, station.sensors.waterLevel + (Math.random() * 0.1 - 0.05)),
              temperature: Math.max(0, station.sensors.temperature + (Math.random() * 0.4 - 0.2)),
              humidity: Math.min(100, Math.max(0, station.sensors.humidity + (Math.random() * 2 - 1))),
              windSpeed: Math.max(0, station.sensors.windSpeed + (Math.random() * 0.4 - 0.2)),
              solarRadiation: Math.max(0, station.sensors.solarRadiation + (Math.random() * 20 - 10)),
            },
          }
        }),
      )
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [allStations])

  const getStationById = (id: string): Station | undefined => {
    return allStations.find((station) => station.id === id)
  }

  const getHistoricalData = useCallback(
    (stationId: string, days = 30) => {
      // ตรวจสอบว่ามีข้อมูลในแคชหรือไม่
      if (historicalDataCache[stationId]?.[days]) {
        return historicalDataCache[stationId][days]
      }

      // ถ้าไม่มี ให้สร้างข้อมูลใหม่
      const data = generateHistoricalData(stationId, days)

      // เก็บข้อมูลลงในแคช
      setHistoricalDataCache((prev) => ({
        ...prev,
        [stationId]: {
          ...(prev[stationId] || {}),
          [days]: data,
        },
      }))

      return data
    },
    [historicalDataCache],
  )

  const getAverageEt0 = () => {
    const onlineStations = allStations.filter((station) => station.status === "online")
    if (onlineStations.length === 0) return 0

    const sum = onlineStations.reduce((acc, station) => acc + station.sensors.et0, 0)
    return sum / onlineStations.length
  }

  const getAverageRainfall = () => {
    const onlineStations = allStations.filter((station) => station.status === "online")
    if (onlineStations.length === 0) return 0

    const sum = onlineStations.reduce((acc, station) => acc + station.sensors.rainfall, 0)
    return sum / onlineStations.length
  }

  const getAverageWaterLevel = () => {
    const onlineStations = allStations.filter((station) => station.status === "online")
    if (onlineStations.length === 0) return 0

    const sum = onlineStations.reduce((acc, station) => acc + station.sensors.waterLevel, 0)
    return sum / onlineStations.length
  }

  return {
    stations: allStations,
    onlineCount,
    getStationById,
    getHistoricalData,
    getAverageEt0,
    getAverageRainfall,
    getAverageWaterLevel,
  }
}
