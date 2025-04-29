"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Droplet, Thermometer, Wind, Sun, Cloud, Download } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useSensorData } from "@/hooks/useSensorData"
import { TrendChart } from "@/components/trend-chart"
import { StatCard } from "@/components/stat-card"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { HistoricalData } from "@/types"

export default function StationDetailsPage() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const params = useParams()
  const { getStationById, getHistoricalData } = useSensorData()
  const [station, setStation] = useState<any>(null)
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([])
  const [period, setPeriod] = useState<"7" | "30">("7")

  useEffect(() => {
    if (params.id) {
      const stationData = getStationById(params.id as string)
      if (stationData) {
        setStation(stationData)
        setHistoricalData(getHistoricalData(params.id as string, Number.parseInt(period)))
      }
    }
  }, [params.id, period])

  const handlePeriodChange = useCallback((value: string) => {
    setPeriod(value as "7" | "30")
  }, [])

  const handleExportData = () => {
    // Create CSV content
    const headers = [
      "Date",
      "ET₀",
      "Rainfall",
      "Water Level",
      "Temperature",
      "Humidity",
      "Wind Speed",
      "Solar Radiation",
    ]
    const rows = historicalData.map((data) => [
      data.date,
      data.et0.toFixed(2),
      data.rainfall.toFixed(2),
      data.waterLevel.toFixed(2),
      data.temperature.toFixed(1),
      data.humidity.toFixed(1),
      data.windSpeed.toFixed(1),
      data.solarRadiation.toFixed(0),
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `station-${station.id}-data-${period}days.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!station) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <p>{t("app.loading")}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{station.name}</h1>
          <StatusBadge status={station.status} />
        </div>
        <Button variant="outline" onClick={handleExportData} className="gap-2">
          <Download className="h-4 w-4" />
          {t("app.export")}
        </Button>
      </div>

      {/* Station Info Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-transparent border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle>{language === "en" ? "Station Information" : "ข้อมูลสถานี"}</CardTitle>
          <CardDescription>
            {language === "en" ? "LSI LASTEM sensors deployed at this location" : "เซ็นเซอร์ LSI LASTEM ที่ติดตั้ง ณ ตำแหน่งนี้"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 bg-background/80 p-3 rounded-md">
              <div className="bg-primary/10 p-2 rounded-md">
                <Thermometer className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">ISMMA2300</h4>
                  <Badge variant="outline" className="text-xs">
                    ET₀ Set
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === "en"
                    ? "Temperature, Humidity, Wind Speed/Direction, Solar Radiation, Atmospheric Pressure"
                    : "อุณหภูมิ, ความชื้น, ความเร็ว/ทิศทางลม, รังสีดวงอาทิตย์, ความกดอากาศ"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background/80 p-3 rounded-md">
              <div className="bg-primary/10 p-2 rounded-md">
                <Cloud className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">DQA230.1</h4>
                  <Badge variant="outline" className="text-xs">
                    Rain Gauge
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === "en"
                    ? "Rainfall measurement and water level monitoring"
                    : "การวัดปริมาณน้ำฝนและการติดตามระดับน้ำ"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sensor Readings */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("stations.et0")}
          value={`${station.sensors.et0.toFixed(2)} ${t("units.et0")}`}
          icon={Thermometer}
          className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20"
        />
        <StatCard
          title={t("stations.rainfall")}
          value={`${station.sensors.rainfall.toFixed(2)} ${t("units.rainfall")}`}
          icon={Cloud}
          className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20"
        />
        <StatCard
          title={t("stations.water.level")}
          value={`${station.sensors.waterLevel.toFixed(2)} ${t("units.water.level")}`}
          icon={Droplet}
          className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20"
        />
        <StatCard
          title={t("sensors.temperature")}
          value={`${station.sensors.temperature.toFixed(1)} ${t("units.temperature")}`}
          icon={Thermometer}
          className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20"
        />
      </div>

      {/* Additional Sensor Readings */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title={t("sensors.humidity")}
          value={`${station.sensors.humidity.toFixed(1)} ${t("units.humidity")}`}
          icon={Droplet}
          className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20"
        />
        <StatCard
          title={t("sensors.wind")}
          value={`${station.sensors.windSpeed.toFixed(1)} ${t("units.wind")}`}
          icon={Wind}
          className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-cyan-500/20"
        />
        <StatCard
          title={t("sensors.solar")}
          value={`${station.sensors.solarRadiation.toFixed(0)} ${t("units.solar")}`}
          icon={Sun}
          className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20"
        />
      </div>

      {/* Historical Data */}
      <Card>
        <CardHeader>
          <CardTitle>{t("stations.history")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="7" onValueChange={handlePeriodChange}>
            <TabsList className="mb-4">
              <TabsTrigger value="7">{t("stations.period.7days")}</TabsTrigger>
              <TabsTrigger value="30">{t("stations.period.30days")}</TabsTrigger>
            </TabsList>
            <TabsContent value="7" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <TrendChart
                  title={t("stations.et0")}
                  data={historicalData.map((item) => ({
                    date: item.date,
                    value: item.et0,
                  }))}
                  yAxisLabel={t("units.et0")}
                  color="#f97316"
                  height={250}
                />
                <TrendChart
                  title={t("stations.rainfall")}
                  data={historicalData.map((item) => ({
                    date: item.date,
                    value: item.rainfall,
                  }))}
                  yAxisLabel={t("units.rainfall")}
                  color="#10b981"
                  height={250}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <TrendChart
                  title={t("stations.water.level")}
                  data={historicalData.map((item) => ({
                    date: item.date,
                    value: item.waterLevel,
                  }))}
                  yAxisLabel={t("units.water.level")}
                  color="#3b82f6"
                  height={250}
                />
                <TrendChart
                  title={t("sensors.temperature")}
                  data={historicalData.map((item) => ({
                    date: item.date,
                    value: item.temperature,
                  }))}
                  yAxisLabel={t("units.temperature")}
                  color="#ef4444"
                  height={250}
                />
              </div>
            </TabsContent>
            <TabsContent value="30" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <TrendChart
                  title={t("stations.et0")}
                  data={historicalData.map((item) => ({
                    date: item.date,
                    value: item.et0,
                  }))}
                  yAxisLabel={t("units.et0")}
                  color="#f97316"
                  height={250}
                />
                <TrendChart
                  title={t("stations.rainfall")}
                  data={historicalData.map((item) => ({
                    date: item.date,
                    value: item.rainfall,
                  }))}
                  yAxisLabel={t("units.rainfall")}
                  color="#10b981"
                  height={250}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <TrendChart
                  title={t("stations.water.level")}
                  data={historicalData.map((item) => ({
                    date: item.date,
                    value: item.waterLevel,
                  }))}
                  yAxisLabel={t("units.water.level")}
                  color="#3b82f6"
                  height={250}
                />
                <TrendChart
                  title={t("sensors.temperature")}
                  data={historicalData.map((item) => ({
                    date: item.date,
                    value: item.temperature,
                  }))}
                  yAxisLabel={t("units.temperature")}
                  color="#ef4444"
                  height={250}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <TrendChart
                  title={t("sensors.humidity")}
                  data={historicalData.map((item) => ({
                    date: item.date,
                    value: item.humidity,
                  }))}
                  yAxisLabel={t("units.humidity")}
                  color="#3b82f6"
                  height={250}
                />
                <TrendChart
                  title={t("sensors.wind")}
                  data={historicalData.map((item) => ({
                    date: item.date,
                    value: item.windSpeed,
                  }))}
                  yAxisLabel={t("units.wind")}
                  color="#64748b"
                  height={250}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
