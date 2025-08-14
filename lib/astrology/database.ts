import { createClient } from "@/lib/supabase/server"
import type { BirthChart, BirthData } from "./types"
import { calculateBirthChart, generateBasicInterpretation } from "./calculations"

export async function saveBirthChart(userId: string, birthData: BirthData): Promise<BirthChart> {
  const supabase = createClient()

  // Calculate the birth chart
  const chartData = await calculateBirthChart(birthData)

  // Generate basic interpretation
  const interpretation = generateBasicInterpretation(chartData)

  // Save to database
  const { data, error } = await supabase
    .from("birth_charts")
    .insert({
      user_id: userId,
      chart_data: chartData,
      interpretation: JSON.stringify(interpretation),
      sun_sign: chartData.planets?.find((p) => p.planet === "sun")?.sign,
      moon_sign: chartData.planets?.find((p) => p.planet === "moon")?.sign,
      rising_sign: chartData.planets?.find((p) => p.house === 1)?.sign,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to save birth chart: ${error.message}`)
  }

  return {
    id: data.id,
    userId: data.user_id,
    birthData,
    planets: chartData.planets || [],
    houses: chartData.houses || [],
    aspects: chartData.aspects || [],
    elements: chartData.elements || { fire: 0, earth: 0, air: 0, water: 0 },
    modalities: chartData.modalities || { cardinal: 0, fixed: 0, mutable: 0 },
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function getUserBirthChart(userId: string): Promise<BirthChart | null> {
  const supabase = createClient()

  const { data, error } = await supabase.from("birth_charts").select("*").eq("user_id", userId).single()

  if (error || !data) {
    return null
  }

  return {
    id: data.id,
    userId: data.user_id,
    birthData: data.chart_data.birthData,
    planets: data.chart_data.planets || [],
    houses: data.chart_data.houses || [],
    aspects: data.chart_data.aspects || [],
    elements: data.chart_data.elements || { fire: 0, earth: 0, air: 0, water: 0 },
    modalities: data.chart_data.modalities || { cardinal: 0, fixed: 0, mutable: 0 },
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function updateBirthChart(chartId: string, birthData: BirthData): Promise<BirthChart> {
  const supabase = createClient()

  // Recalculate the birth chart
  const chartData = await calculateBirthChart(birthData)

  // Generate new interpretation
  const interpretation = generateBasicInterpretation(chartData)

  // Update in database
  const { data, error } = await supabase
    .from("birth_charts")
    .update({
      chart_data: chartData,
      interpretation: JSON.stringify(interpretation),
      sun_sign: chartData.planets?.find((p) => p.planet === "sun")?.sign,
      moon_sign: chartData.planets?.find((p) => p.planet === "moon")?.sign,
      rising_sign: chartData.planets?.find((p) => p.house === 1)?.sign,
      updated_at: new Date().toISOString(),
    })
    .eq("id", chartId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update birth chart: ${error.message}`)
  }

  return {
    id: data.id,
    userId: data.user_id,
    birthData,
    planets: chartData.planets || [],
    houses: chartData.houses || [],
    aspects: chartData.aspects || [],
    elements: chartData.elements || { fire: 0, earth: 0, air: 0, water: 0 },
    modalities: chartData.modalities || { cardinal: 0, fixed: 0, mutable: 0 },
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}
