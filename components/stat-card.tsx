import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { forwardRef } from "react"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  className?: string
  valueRef?: React.RefObject<HTMLDivElement>
}

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  ({ title, value, icon: Icon, description, className, valueRef }, ref) => {
    return (
      <Card className={className} ref={ref}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" ref={valueRef}>
            {value}
          </div>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </CardContent>
      </Card>
    )
  },
)

StatCard.displayName = "StatCard"
