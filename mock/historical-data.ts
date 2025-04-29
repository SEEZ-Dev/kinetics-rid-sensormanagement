import type { HistoricalData } from "@/types"

// Generate 30 days of historical data for a station
export function generateHistoricalData(stationId: string, days = 30): HistoricalData[] {
  const data: HistoricalData[] = []
  const now = new Date()

  // Base values that will be varied slightly
  const baseValues = {
    et0: 4.0,
    rainfall: 2.0,
    waterLevel: 140.0,
    temperature: 31.0,
    humidity: 70.0,
    windSpeed: 2.0,
    solarRadiation: 800,
  }

  // Generate data for each day
  for (let i = 0; i < days; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Add some random variation to make the data look realistic
    const randomFactor = () => Math.random() * 0.4 - 0.2 // -20% to +20%

    // Create a rainfall spike every 5-7 days
    const isRainyDay = i % (5 + Math.floor(Math.random() * 3)) === 0
    const rainfallValue = isRainyDay
      ? baseValues.rainfall * (3 + Math.random() * 2)
      : // 3-5x on rainy days
        baseValues.rainfall * (Math.random() * 0.8) // 0-80% on normal days

    data.push({
      date: date.toISOString().split("T")[0],
      et0: baseValues.et0 * (1 + randomFactor()),
      rainfall: rainfallValue,
      waterLevel: baseValues.waterLevel * (1 + randomFactor() * 0.1), // Less variation in water level
      temperature: baseValues.temperature * (1 + randomFactor() * 0.5),
      humidity: baseValues.humidity * (1 + randomFactor() * 0.3),
      windSpeed: baseValues.windSpeed * (1 + randomFactor()),
      solarRadiation: baseValues.solarRadiation * (1 + randomFactor() * 0.4),
    })
  }

  return data.reverse() // Return in chronological order
}
