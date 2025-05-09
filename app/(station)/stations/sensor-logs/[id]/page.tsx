"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Download,
  Thermometer,
  Droplet,
  Cloud,
  Wind,
  Sun,
  Calendar,
  Info,
  Settings,
  AlertTriangle,
  CheckCircle2,
  History,
} from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useSensorData } from "@/hooks/useSensorData"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/status-badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"

// Mock sensor log data
interface SensorLog {
  timestamp: string
  value: number
  unit: string
  status: "normal" | "warning" | "error"
  message?: string
}

interface SensorInfo {
  id: string
  model: string
  serialNumber: string
  installDate: string
  lastCalibration: string
  nextCalibration: string
  manufacturer: string
  accuracy: string
  range: string
  location: string
  description: string
}

interface MaintenanceEvent {
  date: string
  type: string
  technician: string
  description: string
}

export default function SensorLogsPage() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const params = useParams()
  const { getStationById } = useSensorData()
  const [station, setStation] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("logs")
  const [sensorType, setSensorType] = useState<
    "et0" | "rainfall" | "waterLevel" | "temperature" | "humidity" | "windSpeed" | "solarRadiation"
  >("temperature")
  const [logs, setLogs] = useState<SensorLog[]>([])
  const [sensorInfo, setSensorInfo] = useState<SensorInfo | null>(null)
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceEvent[]>([])

  // Generate mock logs - moved outside useEffect and memoized with useCallback
  const generateMockLogs = useCallback((currentSensorType: string) => {
    const newLogs: SensorLog[] = []
    const now = new Date()

    // Generate 50 log entries going back in time
    for (let i = 0; i < 50; i++) {
      const logTime = new Date(now.getTime() - i * 30 * 60 * 1000) // 30 minutes intervals

      // Determine unit based on sensor type
      let unit = ""
      let baseValue = 0
      let variance = 0

      switch (currentSensorType) {
        case "temperature":
          unit = "°C"
          baseValue = 30
          variance = 5
          break
        case "humidity":
          unit = "%"
          baseValue = 70
          variance = 10
          break
        case "rainfall":
          unit = "mm"
          baseValue = 2
          variance = 3
          break
        case "waterLevel":
          unit = "m"
          baseValue = 140
          variance = 2
          break
        case "windSpeed":
          unit = "m/s"
          baseValue = 2
          variance = 1.5
          break
        case "solarRadiation":
          unit = "W/m²"
          baseValue = 800
          variance = 200
          break
        case "et0":
          unit = "mm/day"
          baseValue = 4
          variance = 1
          break
      }

      // Random value with some variance
      const value = baseValue + (Math.random() * variance * 2 - variance)

      // Determine status (mostly normal, occasionally warning or error)
      let status: "normal" | "warning" | "error" = "normal"
      let message = undefined

      const rand = Math.random()
      if (rand > 0.95) {
        status = "error"
        message = `Value outside expected range: ${value.toFixed(2)} ${unit}`
      } else if (rand > 0.85) {
        status = "warning"
        message = `Value approaching threshold: ${value.toFixed(2)} ${unit}`
      }

      newLogs.push({
        timestamp: logTime.toISOString(),
        value,
        unit,
        status,
        message,
      })
    }

    return newLogs
  }, [])

  // Generate mock maintenance logs - moved outside useEffect and memoized
  const generateMockMaintenanceLogs = useCallback(() => {
    return [
      {
        date: "2024-01-10",
        type: "calibration",
        technician: "Somchai K.",
        description: "Regular calibration performed. All sensors within expected parameters.",
      },
      {
        date: "2023-11-15",
        type: "repair",
        technician: "Prasert L.",
        description: "Replaced power supply unit due to voltage fluctuations.",
      },
      {
        date: "2023-09-22",
        type: "inspection",
        technician: "Nattapong S.",
        description: "Routine inspection. Cleaned solar panels and sensor housing.",
      },
      {
        date: "2023-08-05",
        type: "firmware",
        technician: "System",
        description: "Automatic firmware update to version 3.2.1",
      },
      {
        date: "2023-06-15",
        type: "installation",
        technician: "Installation Team",
        description: "Initial installation and configuration of sensor array.",
      },
    ]
  }, [])

  // Create a memoized function to generate sensor info
  const generateSensorInfo = useCallback((stationData: any, currentSensorType: string) => {
    const isSensorTypeWater = currentSensorType === "rainfall" || currentSensorType === "waterLevel"
    return {
      id: `SN-${Math.floor(Math.random() * 10000)}`,
      model: isSensorTypeWater ? "DQA230.1" : "ISMMA2300",
      serialNumber: `${isSensorTypeWater ? "DQA" : "ISMMA"}-${Math.floor(Math.random() * 100000)}`,
      installDate: "2023-06-15",
      lastCalibration: "2024-01-10",
      nextCalibration: "2024-07-10",
      manufacturer: "LSI LASTEM",
      accuracy: isSensorTypeWater ? "±0.2mm" : "±0.1°C",
      range: isSensorTypeWater ? "0-500mm" : "-40°C to +60°C",
      location: `${stationData.name}, Mukdahan Province`,
      description: isSensorTypeWater
        ? "High-precision rain gauge and water level sensor"
        : "Professional weather monitoring sensor for ET₀ calculation",
    }
  }, [])

  useEffect(() => {
    if (params.id) {
      const stationData = getStationById(params.id as string)
      if (stationData) {
        setStation(stationData)
      }
    }
  }, [params.id, getStationById])

  // Separate useEffect for sensor data to avoid infinite loops
  useEffect(() => {
    if (station && sensorType) {
      // Generate mock data
      setLogs(generateMockLogs(sensorType))
      setMaintenanceLogs(generateMockMaintenanceLogs())
      setSensorInfo(generateSensorInfo(station, sensorType))
    }
  }, [station, sensorType, generateMockLogs, generateMockMaintenanceLogs, generateSensorInfo])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString(language === "en" ? "en-US" : "th-TH")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "calibration":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "repair":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "inspection":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "firmware":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300"
      case "installation":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getSensorIcon = (type: string) => {
    switch (type) {
      case "temperature":
        return <Thermometer className="h-5 w-5 text-orange-500" />
      case "humidity":
        return <Droplet className="h-5 w-5 text-blue-500" />
      case "rainfall":
        return <Cloud className="h-5 w-5 text-blue-500" />
      case "waterLevel":
        return <Droplet className="h-5 w-5 text-indigo-600" />
      case "windSpeed":
        return <Wind className="h-5 w-5 text-slate-500" />
      case "solarRadiation":
        return <Sun className="h-5 w-5 text-yellow-500" />
      case "et0":
        return <Thermometer className="h-5 w-5 text-orange-500" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  const getMaintenanceIcon = (type: string) => {
    switch (type) {
      case "calibration":
        return <Settings className="h-5 w-5 text-blue-500" />
      case "repair":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case "inspection":
        return <CheckCircle2 className="h-5 w-5 text-purple-500" />
      case "firmware":
        return <Download className="h-5 w-5 text-cyan-500" />
      case "installation":
        return <Thermometer className="h-5 w-5 text-emerald-500" />
      default:
        return <Info className="h-5 w-5" />
    }
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
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{station.name}</h1>
            <p className="text-muted-foreground flex items-center gap-1">
              <History className="h-4 w-4" />
              {language === "en" ? "Sensor Logs & Maintenance History" : "บันทึกเซ็นเซอร์และประวัติการบำรุงรักษา"}
            </p>
          </div>
        </div>
        <StatusBadge status={station.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar with sensor selection */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>{language === "en" ? "Sensor Selection" : "เลือกเซ็นเซอร์"}</CardTitle>
            <CardDescription>
              {language === "en" ? "Select a sensor to view logs" : "เลือกเซ็นเซอร์เพื่อดูบันทึก"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1 px-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">ISMMA2300</h3>
              <Button
                variant={sensorType === "temperature" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSensorType("temperature")}
              >
                <Thermometer className="mr-2 h-4 w-4 text-orange-500" />
                {t("sensors.temperature")}
              </Button>
              <Button
                variant={sensorType === "humidity" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSensorType("humidity")}
              >
                <Droplet className="mr-2 h-4 w-4 text-blue-500" />
                {t("sensors.humidity")}
              </Button>
              <Button
                variant={sensorType === "windSpeed" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSensorType("windSpeed")}
              >
                <Wind className="mr-2 h-4 w-4 text-slate-500" />
                {t("sensors.wind")}
              </Button>
              <Button
                variant={sensorType === "solarRadiation" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSensorType("solarRadiation")}
              >
                <Sun className="mr-2 h-4 w-4 text-yellow-500" />
                {t("sensors.solar")}
              </Button>
              <Button
                variant={sensorType === "et0" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSensorType("et0")}
              >
                <Thermometer className="mr-2 h-4 w-4 text-orange-500" />
                {t("stations.et0")}
              </Button>

              <Separator className="my-2" />

              <h3 className="text-sm font-medium text-muted-foreground mb-2">DQA230.1</h3>
              <Button
                variant={sensorType === "rainfall" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSensorType("rainfall")}
              >
                <Cloud className="mr-2 h-4 w-4 text-blue-500" />
                {t("stations.rainfall")}
              </Button>
              <Button
                variant={sensorType === "waterLevel" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSensorType("waterLevel")}
              >
                <Droplet className="mr-2 h-4 w-4 text-indigo-600" />
                {t("stations.water.level")}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("app.back")}
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/stations/details/${station.id}`}>
                <Info className="mr-2 h-4 w-4" />
                {t("stations.details")}
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Main content area */}
        <div className="md:col-span-3 space-y-6">
          {/* Sensor info card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getSensorIcon(sensorType)}
                  {language === "en"
                    ? `${sensorInfo?.model} - ${getSensorLabel(sensorType)}`
                    : `${sensorInfo?.model} - ${getSensorLabel(sensorType)}`}
                </CardTitle>
                <Badge
                  variant="outline"
                  className={
                    sensorType === "rainfall" || sensorType === "waterLevel"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                      : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                  }
                >
                  {sensorType === "rainfall" || sensorType === "waterLevel" ? "DQA230.1" : "ISMMA2300"}
                </Badge>
              </div>
              <CardDescription>{sensorInfo?.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {language === "en" ? "Serial Number" : "หมายเลขซีเรียล"}
                  </p>
                  <p>{sensorInfo?.serialNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {language === "en" ? "Installation Date" : "วันที่ติดตั้ง"}
                  </p>
                  <p>{sensorInfo?.installDate}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {language === "en" ? "Last Calibration" : "การสอบเทียบล่าสุด"}
                  </p>
                  <p>{sensorInfo?.lastCalibration}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {language === "en" ? "Next Calibration" : "การสอบเทียบครั้งถัดไป"}
                  </p>
                  <p>{sensorInfo?.nextCalibration}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {language === "en" ? "Accuracy" : "ความแม่นยำ"}
                  </p>
                  <p>{sensorInfo?.accuracy}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {language === "en" ? "Measurement Range" : "ช่วงการวัด"}
                  </p>
                  <p>{sensorInfo?.range}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for logs and maintenance */}
          <Tabs defaultValue="logs" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="logs">
                <History className="mr-2 h-4 w-4" />
                {language === "en" ? "Sensor Logs" : "บันทึกเซ็นเซอร์"}
              </TabsTrigger>
              <TabsTrigger value="maintenance">
                <Settings className="mr-2 h-4 w-4" />
                {language === "en" ? "Maintenance History" : "ประวัติการบำรุงรักษา"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="logs" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>{language === "en" ? "Sensor Reading Logs" : "บันทึกการอ่านค่าเซ็นเซอร์"}</CardTitle>
                  <CardDescription>
                    {language === "en"
                      ? `Historical readings from ${getSensorLabel(sensorType)} sensor`
                      : `ค่าที่อ่านได้ในอดีตจากเซ็นเซอร์${getSensorLabel(sensorType)}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px] rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{language === "en" ? "Timestamp" : "เวลา"}</TableHead>
                          <TableHead>{language === "en" ? "Value" : "ค่า"}</TableHead>
                          <TableHead>{language === "en" ? "Status" : "สถานะ"}</TableHead>
                          <TableHead>{language === "en" ? "Message" : "ข้อความ"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {logs.map((log, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                {formatDate(log.timestamp)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">
                                {log.value.toFixed(2)} {log.unit}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(log.status)}>
                                {log.status === "normal"
                                  ? language === "en"
                                    ? "Normal"
                                    : "ปกติ"
                                  : log.status === "warning"
                                    ? language === "en"
                                      ? "Warning"
                                      : "เตือน"
                                    : language === "en"
                                      ? "Error"
                                      : "ผิดพลาด"}
                              </Badge>
                            </TableCell>
                            <TableCell>{log.message || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="flex justify-between pt-4">
                  <div className="text-sm text-muted-foreground">
                    {language === "en" ? `Showing ${logs.length} log entries` : `แสดง ${logs.length} รายการบันทึก`}
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    {language === "en" ? "Export Logs" : "ส่งออกบันทึก"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>{language === "en" ? "Maintenance History" : "ประวัติการบำรุงรักษา"}</CardTitle>
                  <CardDescription>
                    {language === "en"
                      ? "Record of all maintenance activities for this sensor"
                      : "บันทึกกิจกรรมการบำรุงรักษาทั้งหมดสำหรับเซ็นเซอร์นี้"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {maintenanceLogs.map((log, index) => (
                      <div key={index} className="relative pl-8 pb-8">
                        {/* Timeline connector */}
                        {index < maintenanceLogs.length - 1 && (
                          <div className="absolute left-3.5 top-3 h-full w-px bg-border" />
                        )}

                        {/* Event icon */}
                        <div className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full border bg-background">
                          {getMaintenanceIcon(log.type)}
                        </div>

                        {/* Event content */}
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(log.type)}>
                              {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{log.date}</span>
                          </div>
                          <h3 className="font-medium leading-none">
                            {language === "en" ? "Technician" : "ช่างเทคนิค"}: {log.technician}
                          </h3>
                          <p className="text-sm text-muted-foreground">{log.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end pt-0">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    {language === "en" ? "Export History" : "ส่งออกประวัติ"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

// Helper function to get sensor label
function getSensorLabel(type: string): string {
  switch (type) {
    case "temperature":
      return "Temperature"
    case "humidity":
      return "Humidity"
    case "rainfall":
      return "Rainfall"
    case "waterLevel":
      return "Water Level"
    case "windSpeed":
      return "Wind Speed"
    case "solarRadiation":
      return "Solar Radiation"
    case "et0":
      return "ET₀"
    default:
      return type
  }
}
