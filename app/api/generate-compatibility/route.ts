import { type NextRequest, NextResponse } from "next/server"
import { generateCompatibilityReport } from "@/lib/ai/openai"
import type { BirthChart } from "@/lib/astrology/types"
import { ZODIAC_SIGNS } from "@/lib/astrology/constants"

export async function POST(request: NextRequest) {
  try {
    const {
      person1,
      person2,
    }: { person1: { name: string; chart: BirthChart }; person2: { name: string; chart: BirthChart } } =
      await request.json()

    const sun1 = person1.chart.planets.find((p) => p.planet === "sun")!
    const moon1 = person1.chart.planets.find((p) => p.planet === "moon")!
    const rising1 = person1.chart.planets.find((p) => p.house === 1) || sun1

    const sun2 = person2.chart.planets.find((p) => p.planet === "sun")!
    const moon2 = person2.chart.planets.find((p) => p.planet === "moon")!
    const rising2 = person2.chart.planets.find((p) => p.house === 1) || sun2

    const promptData1 = {
      name: person1.name,
      sun: {
        sign: ZODIAC_SIGNS[sun1.sign].name,
        house: sun1.house,
      },
      moon: {
        sign: ZODIAC_SIGNS[moon1.sign].name,
        house: moon1.house,
      },
      ascendant: {
        sign: ZODIAC_SIGNS[rising1.sign].name,
      },
      planets: person1.chart.planets
        .filter((p) => !["sun", "moon"].includes(p.planet))
        .map((p) => ({
          name: p.planet,
          sign: ZODIAC_SIGNS[p.sign].name,
          house: p.house,
        })),
    }

    const promptData2 = {
      name: person2.name,
      sun: {
        sign: ZODIAC_SIGNS[sun2.sign].name,
        house: sun2.house,
      },
      moon: {
        sign: ZODIAC_SIGNS[moon2.sign].name,
        house: moon2.house,
      },
      ascendant: {
        sign: ZODIAC_SIGNS[rising2.sign].name,
      },
      planets: person2.chart.planets
        .filter((p) => !["sun", "moon"].includes(p.planet))
        .map((p) => ({
          name: p.planet,
          sign: ZODIAC_SIGNS[p.sign].name,
          house: p.house,
        })),
    }

    const report = await generateCompatibilityReport(promptData1, promptData2)

    return NextResponse.json({ report })
  } catch (error) {
    console.error("Error generating compatibility report:", error)
    return NextResponse.json({ error: "Failed to generate compatibility report" }, { status: 500 })
  }
}
