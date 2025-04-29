"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { useLanguage } from "@/components/language-provider"
import { useSensorData } from "@/hooks/useSensorData"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] items-center justify-center bg-muted">
      <p>Loading map...</p>
    </div>
  ),
})

export default function StationsMapPage() {
  const { t } = useLanguage()
  const { stations } = useSensorData()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t("stations.map")}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("stations.title")}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">{isClient && <MapComponent stations={stations} />}</CardContent>
      </Card>
    </div>
  )
}
