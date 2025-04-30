import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  className?: string
  valueRef?: React.RefObject<HTMLDivElement>
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
}

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  ({ title, value, icon: Icon, description, className, valueRef, trend }, ref) => {
    return (
      <Card 
        className={cn(
          "overflow-hidden card-hover relative",
          "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:z-0",
          className
        )} 
        ref={ref}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
          <CardTitle className="text-sm font-medium">
            {title}
          </CardTitle>
          <div className="rounded-full p-2 bg-background/80 backdrop-blur-sm border border-border/50">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="space-y-1">
            <div className="text-2xl font-bold tracking-tight" ref={valueRef}>
              {value}
            </div>
            {trend && (
              <div className="flex items-center gap-1 text-xs">
                <span className={cn(
                  "inline-flex items-center px-1.5 py-0.5 rounded-full font-medium",
                  trend.isPositive 
                    ? "text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-400/10"
                    : "text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-400/10"
                )}>
                  {trend.value}%
                </span>
                <span className="text-muted-foreground">{trend.label}</span>
              </div>
            )}
            {description && (
              <p className="text-xs text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }
)

StatCard.displayName = "StatCard"
