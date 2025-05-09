"use client"

import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface TrendChartProps {
  title: string
  data: Array<{ date: string; value: number }>
  dataKey?: string
  yAxisLabel?: string
  color?: string
  height?: number
}

export function TrendChart({
  title,
  data,
  dataKey = "value",
  yAxisLabel,
  color = "#3b82f6",
  height = 200,
}: TrendChartProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  const textColor = isDark ? "#f8fafc" : "#334155"
  const gridColor = isDark ? "#334155" : "#e2e8f0"
  const backgroundColor = isDark ? "#1e293b" : "#ffffff"

  return (
    <Card className="border-primary/20 overflow-hidden card-hover">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>{title}</span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              Latest: {data[data.length - 1]?.value.toFixed(2)}
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary/30" />
              Avg: {(data.reduce((acc, curr) => acc + curr.value, 0) / data.length).toFixed(2)}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div style={{ height }} className="relative group">
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id={`color-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
                <filter id="shadow">
                  <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.2" />
                </filter>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={gridColor} 
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: textColor }}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return `${date.getDate()}/${date.getMonth() + 1}`
                }}
                stroke={textColor}
                axisLine={{ stroke: gridColor }}
                tickLine={{ stroke: gridColor }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: textColor }}
                stroke={textColor}
                axisLine={{ stroke: gridColor }}
                tickLine={{ stroke: gridColor }}
                label={
                  yAxisLabel
                    ? {
                        value: yAxisLabel,
                        angle: -90,
                        position: "insideLeft",
                        style: { textAnchor: "middle", fill: textColor, fontSize: 12 },
                      }
                    : undefined
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: backgroundColor,
                  borderColor: isDark ? "#334155" : "#e2e8f0",
                  color: textColor,
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
                formatter={(value: number) => [value.toFixed(2), ""]}
                labelFormatter={(label) => {
                  const date = new Date(label)
                  return date.toLocaleDateString()
                }}
                cursor={{ stroke: color, strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#color-${title})`}
                animationDuration={1000}
                animationEasing="ease-in-out"
                filter="url(#shadow)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
