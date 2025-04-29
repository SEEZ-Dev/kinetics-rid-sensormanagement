// Create a new component to display sensor information
"use client"

import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Thermometer, CloudRain, Wind, Gauge, Sun, Droplet } from "lucide-react"
import type { Station } from "@/types"

interface StationSensorInfoProps {
  station: Station
}

export function StationSensorInfo({ station }: StationSensorInfoProps) {
  const { t, language } = useLanguage()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="h-5 w-5" />
          {t("stations.sensors")}
        </CardTitle>
        <CardDescription>
          {language === "en" ? "Sensor models and current readings" : "รุ่นเซ็นเซอร์และค่าที่อ่านได้ปัจจุบัน"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="et0">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="et0">ISMMA2300</TabsTrigger>
            <TabsTrigger value="rain">DQA230.1</TabsTrigger>
          </TabsList>
          <TabsContent value="et0" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                <Thermometer className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-xs text-muted-foreground">{t("sensors.temperature")}</p>
                  <p className="font-medium">
                    {station.sensors.temperature.toFixed(1)} {t("units.temperature")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                <Wind className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">{t("sensors.humidity")}</p>
                  <p className="font-medium">
                    {station.sensors.humidity.toFixed(1)} {t("units.humidity")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                <Wind className="h-5 w-5 text-cyan-500" />
                <div>
                  <p className="text-xs text-muted-foreground">{t("sensors.wind")}</p>
                  <p className="font-medium">
                    {station.sensors.windSpeed.toFixed(1)} {t("units.wind")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                <Sun className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-xs text-muted-foreground">{t("sensors.solar")}</p>
                  <p className="font-medium">
                    {station.sensors.solarRadiation.toFixed(0)} {t("units.solar")}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-primary/10 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-primary" />
                  <p className="font-medium">{t("stations.et0")}</p>
                </div>
                <p className="font-bold text-lg">
                  {station.sensors.et0.toFixed(2)} {t("units.et0")}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {language === "en"
                  ? "Calculated from ISMMA2300 sensor readings"
                  : "คำนวณจากค่าที่อ่านได้จากเซ็นเซอร์ ISMMA2300"}
              </p>
            </div>
          </TabsContent>
          <TabsContent value="rain" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                <CloudRain className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">{t("stations.rainfall")}</p>
                  <p className="font-medium">
                    {station.sensors.rainfall.toFixed(2)} {t("units.rainfall")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                <Droplet className="h-5 w-5 text-blue-700" />
                <div>
                  <p className="text-xs text-muted-foreground">{t("stations.water.level")}</p>
                  <p className="font-medium">
                    {station.sensors.waterLevel.toFixed(2)} {t("units.water.level")}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-md">
              <div className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">{t("sensors.model")}: DQA230.1</p>
                  <p className="text-xs text-muted-foreground">
                    {language === "en"
                      ? "High-precision rain gauge and water level sensor"
                      : "เซ็นเซอร์วัดปริมาณน้ำฝนและระดับน้ำความแม่นยำสูง"}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
