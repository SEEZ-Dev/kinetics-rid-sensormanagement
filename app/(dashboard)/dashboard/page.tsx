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
  const [waterLevel, setWaterLevel] = useState(50) // 0-100 percentage for water animation

  // Refs for animated values
  const et0Ref = useRef<HTMLDivElement>(null)
  const rainfallRef = useRef<HTMLDivElement>(null)
  const waterLevelRef = useRef<HTMLDivElement>(null)
  const temperatureRef = useRef<HTMLDivElement>(null)
  const humidityRef = useRef<HTMLDivElement>(null)
  const windSpeedRef = useRef<HTMLDivElement>(null)
  const solarRadiationRef = useRef<HTMLDivElement>(null)

  // Canvas refs for animations
  const waterCanvasRef = useRef<HTMLCanvasElement>(null)
  const tempCanvasRef = useRef<HTMLCanvasElement>(null)
  const windCanvasRef = useRef<HTMLCanvasElement>(null)
  const solarCanvasRef = useRef<HTMLCanvasElement>(null)

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

    // Update water level for animation
    const waterLevelInterval = setInterval(() => {
      setWaterLevel((prev) => {
        const newLevel = prev + (Math.random() * 4 - 2) // -2 to +2
        return Math.max(30, Math.min(70, newLevel)) // Keep between 30-70%
      })
    }, 2000)

    // Initialize water animation
    initWaterAnimation()

    // Initialize temperature animation
    initTemperatureAnimation()

    // Initialize wind animation
    initWindAnimation()

    // Initialize solar animation
    initSolarAnimation()

    return () => {
      clearInterval(timeInterval)
      clearInterval(animateInterval)
      clearInterval(waterLevelInterval)
    }
  }, [])

  const initWaterAnimation = () => {
    const canvas = waterCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    const render = () => {
      time += 0.05
      const width = canvas.width
      const height = canvas.height

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Calculate water height based on waterLevel state
      const waterHeight = height * (waterLevel / 100)

      // Draw water
      ctx.fillStyle = "#3b82f6"

      // Draw wavy water surface
      ctx.beginPath()
      ctx.moveTo(0, height - waterHeight)

      for (let x = 0; x < width; x++) {
        const y = Math.sin(x * 0.05 + time) * 5 + (height - waterHeight)
        ctx.lineTo(x, y)
      }

      ctx.lineTo(width, height)
      ctx.lineTo(0, height)
      ctx.closePath()
      ctx.fill()

      // Add some bubbles
      for (let i = 0; i < 5; i++) {
        const x = Math.random() * width
        const y = height - Math.random() * waterHeight
        const radius = Math.random() * 3 + 1

        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }

  const initTemperatureAnimation = () => {
    const canvas = tempCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    const particles: Array<{ x: number; y: number; radius: number; speed: number; color: string }> = []

    // Create particles
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        speed: Math.random() * 1 + 0.5,
        color: `rgba(239, 68, 68, ${Math.random() * 0.5 + 0.2})`,
      })
    }

    const render = () => {
      const width = canvas.width
      const height = canvas.height

      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, "rgba(239, 68, 68, 0.1)")
      gradient.addColorStop(1, "rgba(255, 237, 213, 0.1)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Update and draw particles (heat waves)
      particles.forEach((particle) => {
        particle.y -= particle.speed

        if (particle.y < -particle.radius) {
          particle.y = height + particle.radius
          particle.x = Math.random() * width
        }

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }

  const initWindAnimation = () => {
    const canvas = windCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let time = 0
    const windLines: Array<{ x: number; y: number; length: number; speed: number; opacity: number }> = []

    // Create wind lines
    for (let i = 0; i < 15; i++) {
      windLines.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 30 + 20,
        speed: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1,
      })
    }

    const render = () => {
      time += 0.01
      const width = canvas.width
      const height = canvas.height

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Update and draw wind lines
      windLines.forEach((line) => {
        line.x += line.speed

        if (line.x > width + line.length) {
          line.x = -line.length
          line.y = Math.random() * height
        }

        ctx.beginPath()
        ctx.moveTo(line.x, line.y)
        ctx.lineTo(line.x + line.length, line.y)
        ctx.strokeStyle = `rgba(100, 116, 139, ${line.opacity})`
        ctx.lineWidth = 2
        ctx.stroke()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }

  const initSolarAnimation = () => {
    const canvas = solarCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    const render = () => {
      time += 0.02
      const width = canvas.width
      const height = canvas.height
      const centerX = width / 2
      const centerY = height / 2

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Draw sun
      const sunRadius = 20 + Math.sin(time) * 2

      // Sun glow
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, sunRadius * 3)
      gradient.addColorStop(0, "rgba(234, 179, 8, 0.8)")
      gradient.addColorStop(0.5, "rgba(234, 179, 8, 0.2)")
      gradient.addColorStop(1, "rgba(234, 179, 8, 0)")

      ctx.beginPath()
      ctx.arc(centerX, centerY, sunRadius * 3, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      // Sun core
      ctx.beginPath()
      ctx.arc(centerX, centerY, sunRadius, 0, Math.PI * 2)
      ctx.fillStyle = "#eab308"
      ctx.fill()

      // Sun rays
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2
        const rayLength = 15 + Math.sin(time + i) * 5

        const startX = centerX + Math.cos(angle) * sunRadius
        const startY = centerY + Math.sin(angle) * sunRadius
        const endX = centerX + Math.cos(angle) * (sunRadius + rayLength)
        const endY = centerY + Math.sin(angle) * (sunRadius + rayLength)

        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.strokeStyle = "#eab308"
        ctx.lineWidth = 2
        ctx.stroke()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }

  const handleExport = () => {
    exportStationsToCSV(stations)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("dashboard.title")}</h1>
          <p className="text-muted-foreground">
            {currentTime.toLocaleDateString(language === "en" ? "en-US" : "th-TH", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          {t("app.export")}
        </Button>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("dashboard.sensors.online")}
          value={`${onlineCount}/5`}
          icon={Activity}
          className={`bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 ${animateValue ? "animate-pulse" : ""}`}
        />
        <StatCard
          title={t("dashboard.et0.today")}
          value={`${getAverageEt0().toFixed(2)} ${t("units.et0")}`}
          icon={Thermometer}
          description="ISMMA2300"
          className={`bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20 ${animateValue ? "animate-pulse" : ""}`}
          valueRef={et0Ref}
        />
        <StatCard
          title={t("dashboard.rainfall.today")}
          value={`${getAverageRainfall().toFixed(2)} ${t("units.rainfall")}`}
          icon={Cloud}
          description="DQA230.1"
          className={`bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20 ${animateValue ? "animate-pulse" : ""}`}
          valueRef={rainfallRef}
        />
        <StatCard
          title={t("dashboard.water.level")}
          value={`${getAverageWaterLevel().toFixed(2)} ${t("units.water.level")}`}
          icon={Droplet}
          className={`bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border-indigo-500/20 ${animateValue ? "animate-pulse" : ""}`}
          valueRef={waterLevelRef}
        />
      </div>

      {/* Sensor Data Visualization */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            {language === "en" ? "Sensor Data Visualization" : "การแสดงผลข้อมูลเซ็นเซอร์"}
          </CardTitle>
          <CardDescription>
            {language === "en" ? "Real-time data from all monitoring stations" : "ข้อมูลแบบเรียลไทม์จากสถานีตรวจวัดทั้งหมด"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="main" className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 w-full">
              <TabsTrigger value="main">{language === "en" ? "Main" : "หลัก"}</TabsTrigger>
              <TabsTrigger value="temperature">{t("sensors.temperature")}</TabsTrigger>
              <TabsTrigger value="humidity">{t("sensors.humidity")}</TabsTrigger>
              <TabsTrigger value="wind">{t("sensors.wind")}</TabsTrigger>
              <TabsTrigger value="solar">{t("sensors.solar")}</TabsTrigger>
              <TabsTrigger value="rainfall">{t("stations.rainfall")}</TabsTrigger>
              <TabsTrigger value="water">{t("stations.water.level")}</TabsTrigger>
            </TabsList>

            <TabsContent value="main" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <TrendChart
                  title={t("dashboard.et0.trend")}
                  data={et0Data}
                  yAxisLabel={t("units.et0")}
                  color="#f97316"
                  height={250}
                />
                <TrendChart
                  title={t("dashboard.rainfall.trend")}
                  data={rainfallData}
                  yAxisLabel={t("units.rainfall")}
                  color="#10b981"
                  height={250}
                />
                <TrendChart
                  title={t("dashboard.water.trend")}
                  data={waterLevelData}
                  yAxisLabel={t("units.water.level")}
                  color="#6366f1"
                  height={250}
                />
              </div>
            </TabsContent>

            <TabsContent value="temperature">
              <div className="grid gap-4 md:grid-cols-2">
                <TrendChart
                  title={t("sensors.temperature")}
                  data={temperatureData}
                  yAxisLabel={t("units.temperature")}
                  color="#ef4444"
                  height={350}
                />
                <div className="flex flex-col gap-4">
                  <Card className="border-orange-500/20 overflow-hidden h-[350px]">
                    <CardHeader className="pb-2 bg-gradient-to-r from-orange-500/10 to-transparent">
                      <CardTitle className="flex items-center gap-2">
                        <Thermometer className="h-5 w-5 text-orange-500" />
                        {t("sensors.temperature")} - {language === "en" ? "Live View" : "มุมมองสด"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 flex-1 flex flex-col">
                      <div className="relative flex-1 rounded-md overflow-hidden">
                        <canvas
                          ref={tempCanvasRef}
                          className="absolute inset-0 w-full h-full"
                          width={300}
                          height={200}
                        ></canvas>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-5xl font-bold text-orange-500">
                              {stations[0]?.sensors.temperature.toFixed(1)}°C
                            </div>
                            <div className="text-sm text-muted-foreground mt-2">ISMMA2300</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="humidity">
              <TrendChart
                title={t("sensors.humidity")}
                data={humidityData}
                yAxisLabel={t("units.humidity")}
                color="#3b82f6"
                height={350}
              />
            </TabsContent>

            <TabsContent value="wind">
              <div className="grid gap-4 md:grid-cols-2">
                <TrendChart
                  title={t("sensors.wind")}
                  data={windData}
                  yAxisLabel={t("units.wind")}
                  color="#64748b"
                  height={350}
                />
                <div className="flex flex-col gap-4">
                  <Card className="border-slate-500/20 overflow-hidden h-[350px]">
                    <CardHeader className="pb-2 bg-gradient-to-r from-slate-500/10 to-transparent">
                      <CardTitle className="flex items-center gap-2">
                        <Wind className="h-5 w-5 text-slate-500" />
                        {t("sensors.wind")} - {language === "en" ? "Live View" : "มุมมองสด"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 flex-1 flex flex-col">
                      <div className="relative flex-1 rounded-md overflow-hidden">
                        <canvas
                          ref={windCanvasRef}
                          className="absolute inset-0 w-full h-full"
                          width={300}
                          height={200}
                        ></canvas>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-5xl font-bold text-slate-500">
                              {stations[0]?.sensors.windSpeed.toFixed(1)}
                            </div>
                            <div className="text-xl font-medium text-slate-500">{t("units.wind")}</div>
                            <div className="text-sm text-muted-foreground mt-2">ISMMA2300</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="solar">
              <div className="grid gap-4 md:grid-cols-2">
                <TrendChart
                  title={t("sensors.solar")}
                  data={solarData}
                  yAxisLabel={t("units.solar")}
                  color="#eab308"
                  height={350}
                />
                <div className="flex flex-col gap-4">
                  <Card className="border-yellow-500/20 overflow-hidden h-[350px]">
                    <CardHeader className="pb-2 bg-gradient-to-r from-yellow-500/10 to-transparent">
                      <CardTitle className="flex items-center gap-2">
                        <Sun className="h-5 w-5 text-yellow-500" />
                        {t("sensors.solar")} - {language === "en" ? "Live View" : "มุมมองสด"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 flex-1 flex flex-col">
                      <div className="relative flex-1 rounded-md overflow-hidden">
                        <canvas
                          ref={solarCanvasRef}
                          className="absolute inset-0 w-full h-full"
                          width={300}
                          height={200}
                        ></canvas>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-5xl font-bold text-yellow-500">
                              {stations[0]?.sensors.solarRadiation.toFixed(0)}
                            </div>
                            <div className="text-xl font-medium text-yellow-500">{t("units.solar")}</div>
                            <div className="text-sm text-muted-foreground mt-2">ISMMA2300</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rainfall">
              <TrendChart
                title={t("stations.rainfall")}
                data={rainfallData}
                yAxisLabel={t("units.rainfall")}
                color="#10b981"
                height={350}
              />
            </TabsContent>

            <TabsContent value="water">
              <div className="grid gap-4 md:grid-cols-2">
                <TrendChart
                  title={t("stations.water.level")}
                  data={waterLevelData}
                  yAxisLabel={t("units.water.level")}
                  color="#6366f1"
                  height={350}
                />
                <div className="flex flex-col gap-4">
                  <Card className="border-blue-500/20 overflow-hidden h-[350px]">
                    <CardHeader className="pb-2 bg-gradient-to-r from-blue-500/10 to-transparent">
                      <CardTitle className="flex items-center gap-2">
                        <Droplet className="h-5 w-5 text-blue-500" />
                        {t("stations.water.level")} - {language === "en" ? "Live View" : "มุมมองสด"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 flex-1 flex flex-col">
                      <div className="relative flex-1 rounded-md overflow-hidden">
                        <canvas
                          ref={waterCanvasRef}
                          className="absolute inset-0 w-full h-full"
                          width={300}
                          height={200}
                        ></canvas>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-5xl font-bold text-blue-500">
                              {stations[0]?.sensors.waterLevel.toFixed(2)}
                            </div>
                            <div className="text-xl font-medium text-blue-500">{t("units.water.level")}</div>
                            <div className="text-sm text-muted-foreground mt-2">DQA230.1</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Sensor Information */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* ISMMA2300 Sensor Card */}
        <Card className="border-orange-500/20 overflow-hidden">
          <CardHeader className="pb-2 bg-gradient-to-r from-orange-500/10 to-transparent">
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-orange-500" />
              ISMMA2300
            </CardTitle>
            <CardDescription>
              {language === "en" ? "ET₀ Calculation Sensor Set" : "ชุดเซ็นเซอร์คำนวณค่า ET₀"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md relative overflow-hidden">
                <div
                  className={`absolute inset-0 bg-orange-500/5 transform transition-transform duration-1000 ${animateValue ? "scale-110" : "scale-100"}`}
                ></div>
                <Thermometer className="h-5 w-5 text-orange-500 relative z-10" />
                <div className="relative z-10">
                  <p className="text-xs text-muted-foreground">{t("sensors.temperature")}</p>
                  <p className="font-medium" ref={temperatureRef}>
                    {stations[0]?.sensors.temperature.toFixed(1)} {t("units.temperature")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md relative overflow-hidden">
                <div
                  className={`absolute inset-0 bg-blue-500/5 transform transition-transform duration-1000 ${animateValue ? "scale-110" : "scale-100"}`}
                ></div>
                <Wind className="h-5 w-5 text-blue-500 relative z-10" />
                <div className="relative z-10">
                  <p className="text-xs text-muted-foreground">{t("sensors.humidity")}</p>
                  <p className="font-medium" ref={humidityRef}>
                    {stations[0]?.sensors.humidity.toFixed(1)} {t("units.humidity")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md relative overflow-hidden">
                <div
                  className={`absolute inset-0 bg-cyan-500/5 transform transition-transform duration-1000 ${animateValue ? "scale-110" : "scale-100"}`}
                ></div>
                <Wind className="h-5 w-5 text-cyan-500 relative z-10" />
                <div className="relative z-10">
                  <p className="text-xs text-muted-foreground">{t("sensors.wind")}</p>
                  <p className="font-medium" ref={windSpeedRef}>
                    {stations[0]?.sensors.windSpeed.toFixed(1)} {t("units.wind")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md relative overflow-hidden">
                <div
                  className={`absolute inset-0 bg-yellow-500/5 transform transition-transform duration-1000 ${animateValue ? "scale-110" : "scale-100"}`}
                ></div>
                <Sun className="h-5 w-5 text-yellow-500 relative z-10" />
                <div className="relative z-10">
                  <p className="text-xs text-muted-foreground">{t("sensors.solar")}</p>
                  <p className="font-medium" ref={solarRadiationRef}>
                    {stations[0]?.sensors.solarRadiation.toFixed(0)} {t("units.solar")}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-3 p-3 bg-orange-500/10 rounded-md relative overflow-hidden">
              <div
                className={`absolute inset-0 bg-orange-500/5 transform transition-transform duration-1000 ${animateValue ? "scale-110" : "scale-100"}`}
              ></div>
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-orange-500" />
                  <p className="font-medium">{t("stations.et0")}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="bg-green-500/20 text-green-700 dark:text-green-400 animate-pulse">
                    {language === "en" ? "LIVE" : "สด"}
                  </Badge>
                  <p className="font-bold text-lg">
                    {stations[0]?.sensors.et0.toFixed(2)} {t("units.et0")}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1 relative z-10">
                {language === "en"
                  ? "Calculated from ISMMA2300 sensor readings"
                  : "คำนวณจากค่าที่อ่านได้จากเซ็นเซอร์ ISMMA2300"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* DQA230.1 Sensor Card */}
        <Card className="border-blue-500/20 overflow-hidden">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-500/10 to-transparent">
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-blue-500" />
              DQA230.1
            </CardTitle>
            <CardDescription>
              {language === "en" ? "Rainfall and Water Level Sensor" : "เซ็นเซอร์วัดปริมาณน้ำฝนและระดับน้ำ"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md relative overflow-hidden">
                <div
                  className={`absolute inset-0 bg-blue-500/5 transform transition-transform duration-1000 ${animateValue ? "scale-110" : "scale-100"}`}
                ></div>
                <Cloud className="h-5 w-5 text-blue-500 relative z-10" />
                <div className="relative z-10">
                  <p className="text-xs text-muted-foreground">{t("stations.rainfall")}</p>
                  <p className="font-medium" ref={rainfallRef}>
                    {stations[0]?.sensors.rainfall.toFixed(2)} {t("units.rainfall")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md relative overflow-hidden">
                <div
                  className={`absolute inset-0 bg-blue-500/5 transform transition-transform duration-1000 ${animateValue ? "scale-110" : "scale-100"}`}
                ></div>
                <Droplet className="h-5 w-5 text-blue-700 relative z-10" />
                <div className="relative z-10">
                  <p className="text-xs text-muted-foreground">{t("stations.water.level")}</p>
                  <p className="font-medium" ref={waterLevelRef}>
                    {stations[0]?.sensors.waterLevel.toFixed(2)} {t("units.water.level")}
                  </p>
                </div>
              </div>
              <div className="col-span-2">
                <div className="p-3 bg-blue-500/10 rounded-md relative overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-blue-500/5 transform transition-transform duration-1000 ${animateValue ? "scale-110" : "scale-100"}`}
                  ></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                      <Gauge className="h-5 w-5 text-blue-500" />
                      <p className="font-medium">{t("sensors.status")}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-500/20 text-green-700 dark:text-green-400 animate-pulse"
                    >
                      {t("status.online")}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 relative z-10">
                    {language === "en"
                      ? "Last reading: " + new Date().toLocaleTimeString()
                      : "อ่านค่าล่าสุด: " + new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Card */}
      <Card className="border-red-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-red-500" />
            {t("dashboard.alerts")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-medium">
                {pendingCount} {t("alerts.pending")}
              </p>
              <p className="text-sm text-muted-foreground">{t("alerts.new")}</p>
            </div>
            <Button asChild variant="outline" className="border-red-500/20 hover:bg-red-500/10 hover:text-red-500">
              <Link href="/alerts">{t("alerts.title")}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
