import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getUserBirthChart } from "@/lib/astrology/database"
import { generateDailyHoroscope } from "@/lib/ai/openai"
import { ZODIAC_SIGNS } from "@/lib/astrology/constants"

export async function POST(request: NextRequest) {
  try {
    const { userId }: { userId: string } = await request.json()

    const supabase = createClient()
    const today = new Date().toISOString().split("T")[0]

    // Check if horoscope already exists for today
    const { data: existingHoroscope } = await supabase
      .from("daily_horoscopes")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .single()

    if (existingHoroscope) {
      return NextResponse.json({ horoscope: existingHoroscope })
    }

    // Get user's birth chart
    const birthChart = await getUserBirthChart(userId)
    if (!birthChart) {
      return NextResponse.json({ error: "Birth chart not found" }, { status: 404 })
    }

    // Get user profile for name
    const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", userId).single()

    const sun = birthChart.planets.find((p) => p.planet === "sun")!
    const moon = birthChart.planets.find((p) => p.planet === "moon")!
    const rising = birthChart.planets.find((p) => p.house === 1) || sun

    const promptData = {
      name: profile?.full_name || "Друг",
      sun: {
        sign: ZODIAC_SIGNS[sun.sign].name,
        house: sun.house,
      },
      moon: {
        sign: ZODIAC_SIGNS[moon.sign].name,
        house: moon.house,
      },
      ascendant: {
        sign: ZODIAC_SIGNS[rising.sign].name,
      },
      planets: birthChart.planets
        .filter((p) => !["sun", "moon"].includes(p.planet))
        .map((p) => ({
          name: p.planet,
          sign: ZODIAC_SIGNS[p.sign].name,
          house: p.house,
        })),
    }

    // Generate horoscope content
    const content = await generateDailyHoroscope(promptData)

    // Determine mood based on content analysis (simplified)
    const moods = ["energetic", "calm", "creative", "focused", "romantic", "adventurous", "reflective", "optimistic"]
    const mood = moods[Math.floor(Math.random() * moods.length)]

    // Extract advice (last sentence or create one)
    const sentences = content.split(". ")
    const advice = sentences.length > 1 ? sentences[sentences.length - 1] : "Доверяйте своей интуиции сегодня!"

    // Save to database
    const { data: horoscope, error } = await supabase
      .from("daily_horoscopes")
      .insert({
        user_id: userId,
        date: today,
        content: content,
        mood: mood,
        advice: advice,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ horoscope })
  } catch (error) {
    console.error("Error generating daily horoscope:", error)
    return NextResponse.json({ error: "Failed to generate daily horoscope" }, { status: 500 })
  }
}
