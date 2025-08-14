import { type NextRequest, NextResponse } from "next/server"
import { generatePersonalInterpretation } from "@/lib/ai/openai"
import type { BirthChart } from "@/lib/astrology/types"
import { ZODIAC_SIGNS } from "@/lib/astrology/constants"

export async function POST(request: NextRequest) {
  try {
    const { chart, userName }: { chart: BirthChart; userName: string } = await request.json()

    const sun = chart.planets.find((p) => p.planet === "sun")!
    const moon = chart.planets.find((p) => p.planet === "moon")!
    const rising = chart.planets.find((p) => p.house === 1) || sun

    const promptData = {
      name: userName,
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
      planets: chart.planets
        .filter((p) => !["sun", "moon"].includes(p.planet))
        .map((p) => ({
          name: p.planet,
          sign: ZODIAC_SIGNS[p.sign].name,
          house: p.house,
        })),
    }

    const interpretation = await generatePersonalInterpretation(promptData)

    return NextResponse.json({ interpretation })
  } catch (error) {
    console.error("Error generating interpretation:", error)
    return NextResponse.json({ error: "Failed to generate interpretation" }, { status: 500 })
  }
}
