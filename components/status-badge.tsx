"use client"

import type { StationStatus } from "@/types"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"

interface StatusBadgeProps {
  status: StationStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useLanguage()

  const variants = {
    online: "bg-green-500 hover:bg-green-500",
    offline: "bg-gray-500 hover:bg-gray-500",
    warning: "bg-yellow-500 hover:bg-yellow-500",
    critical: "bg-red-500 hover:bg-red-500",
  }

  const labels = {
    online: t("status.online"),
    offline: t("status.offline"),
    warning: t("status.warning"),
    critical: t("status.critical"),
  }

  return <Badge className={variants[status]}>{labels[status]}</Badge>
}
