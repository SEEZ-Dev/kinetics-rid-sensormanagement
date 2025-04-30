"use client"

import { useEffect, useState, useRef } from "react"
import { Activity, Cloud, Droplet, Thermometer, Wind, Sun, Gauge, Download, BarChart3 } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useSensorData } from "@/hooks/useSensorData"
import { useAlerts } from "@/hooks/useAlerts"
import { StatCard } from "@/components/stat-card"
import { TrendChart } from "@/components/trend-chart"
import { generateHistoricalData } from "@/mock/historical-data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { exportStationsToCSV } from "@/lib/csv-export"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function DashboardPage() {
  const { t, language } = useLanguage()
  const { stations, onlineCount, getAverageEt0, getAverageRainfall, getAverageWaterLevel } = useSensorData()
  const { pendingCount } = useAlerts()
  const [et0Data, setEt0Data] = useState<any[]>([])
  const [rainfallData, setRainfallData] = useState<any[]>([])
  const [waterLevelData, setWaterLevelData] = useState<any[]>([])
  const [temperatureData, setTemperatureData] = useState<any[]>([])
  const [humidityData, setHumidityData] = useState<any[]>([])
  const [windData, setWindData] = useState<any[]>([])
  const [solarData, setSolarData] = useState<any[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [animateValue, setAnimateValue] = useState(false)

  // Refs for animated values
  const et0Ref = useRef<HTMLDivElement>(null!)
  const rainfallRef = useRef<HTMLDivElement>(null!)
  const waterLevelRef = useRef<HTMLDivElement>(null!)
  const temperatureRef = useRef<HTMLDivElement>(null!)
  const humidityRef = useRef<HTMLDivElement>(null!)
  const windSpeedRef = useRef<HTMLDivElement>(null!)
  const solarRadiationRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    // Generate sample data for charts
    const historicalData = generateHistoricalData("station-1", 7)

    setEt0Data(
      historicalData.map((item) => ({
        date: item.date,
        value: item.et0,
      })),
    )

    setRainfallData(
      historicalData.map((item) => ({
        date: item.date,
        value: item.rainfall,
      })),
    )

    setWaterLevelData(
      historicalData.map((item) => ({
        date: item.date,
        value: item.waterLevel,
      })),
    )

    setTemperatureData(
      historicalData.map((item) => ({
        date: item.date,
        value: item.temperature,
      })),
    )

    setHumidityData(
      historicalData.map((item) => ({
        date: item.date,
        value: item.humidity,
      })),
    )

    setWindData(
      historicalData.map((item) => ({
        date: item.date,
        value: item.windSpeed,
      })),
    )

    setSolarData(
      historicalData.map((item) => ({
        date: item.date,
        value: item.solarRadiation,
      })),
    )

    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Animate values every 5 seconds
    const animateInterval = setInterval(() => {
      setAnimateValue(true)
      setTimeout(() => setAnimateValue(false), 1000)
    }, 5000)

    return () => {
      clearInterval(timeInterval)
      clearInterval(animateInterval)
    }
  }, [])

  const handleExport = () => {
    exportStationsToCSV(stations)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t("dashboard.title")}</h1>
        <Button onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          {t("app.export")}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("dashboard.sensors.online")}
          value={onlineCount}
          icon={Activity}
          description="ISMMA2300"
          className={`bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20 ${animateValue ? "animate-pulse" : ""}`}
          valueRef={et0Ref}
        />
        <StatCard
          title={t("dashboard.et0.today")}
          value={getAverageEt0().toFixed(2)}
          icon={Thermometer}
          description="ISMMA2300"
          className={`bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20 ${animateValue ? "animate-pulse" : ""}`}
          valueRef={et0Ref}
        />
        <StatCard
          title={t("dashboard.rainfall.today")}
          value={getAverageRainfall().toFixed(2)}
          icon={Cloud}
          description="DQA230.1"
          className={`bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20 ${animateValue ? "animate-pulse" : ""}`}
          valueRef={rainfallRef}
        />
        <StatCard
          title={t("dashboard.water.level")}
          value={getAverageWaterLevel().toFixed(2)}
          icon={Droplet}
          className={`bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border-indigo-500/20 ${animateValue ? "animate-pulse" : ""}`}
          valueRef={waterLevelRef}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>{t("dashboard.et0.trend")}</CardTitle>
            <CardDescription>
              {language === "en" ? "7-day ET₀ trend" : "แนวโน้ม ET₀ 7 วัน"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrendChart
              title={t("dashboard.et0.trend")}
              data={et0Data}
              yAxisLabel={t("units.et0")}
              color="#f97316"
              height={350}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.rainfall.trend")}</CardTitle>
            <CardDescription>
              {language === "en" ? "7-day rainfall trend" : "แนวโน้มปริมาณฝน 7 วัน"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrendChart
              title={t("dashboard.rainfall.trend")}
              data={rainfallData}
              yAxisLabel={t("units.rainfall")}
              color="#10b981"
              height={350}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.water.trend")}</CardTitle>
            <CardDescription>
              {language === "en" ? "7-day water level trend" : "แนวโน้มระดับน้ำ 7 วัน"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrendChart
              title={t("dashboard.water.trend")}
              data={waterLevelData}
              yAxisLabel={t("units.water.level")}
              color="#3b82f6"
              height={350}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("sensors.temperature")}</CardTitle>
            <CardDescription>
              {language === "en" ? "7-day temperature trend" : "แนวโน้มอุณหภูมิ 7 วัน"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrendChart
              title={t("sensors.temperature")}
              data={temperatureData}
              yAxisLabel={t("units.temperature")}
              color="#ef4444"
              height={350}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("sensors.humidity")}</CardTitle>
            <CardDescription>
              {language === "en" ? "7-day humidity trend" : "แนวโน้มความชื้น 7 วัน"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrendChart
              title={t("sensors.humidity")}
              data={humidityData}
              yAxisLabel={t("units.humidity")}
              color="#6366f1"
              height={350}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("sensors.wind")}</CardTitle>
            <CardDescription>
              {language === "en" ? "7-day wind speed trend" : "แนวโน้มความเร็วลม 7 วัน"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrendChart
              title={t("sensors.wind")}
              data={windData}
              yAxisLabel={t("units.wind")}
              color="#64748b"
              height={350}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("sensors.solar")}</CardTitle>
            <CardDescription>
              {language === "en" ? "7-day solar radiation trend" : "แนวโน้มรังสีดวงอาทิตย์ 7 วัน"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrendChart
              title={t("sensors.solar")}
              data={solarData}
              yAxisLabel={t("units.solar")}
              color="#eab308"
              height={350}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
