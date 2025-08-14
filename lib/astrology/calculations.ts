import type {
  BirthData,
  PlanetPosition,
  Aspect,
  BirthChart,
  ElementDistribution,
  ModalityDistribution,
  ZodiacSign,
  Planet,
  AspectType,
} from "./types"
import { ZODIAC_SIGNS, ASPECT_ORBS, ASPECT_ANGLES } from "./constants"

// Swiss Ephemeris API endpoint (using a public astrology API)
const ASTRO_API_BASE = "https://api.astro-charts.com/v1"

export async function calculateBirthChart(birthData: BirthData): Promise<Partial<BirthChart>> {
  try {
    // For now, we'll use a mock calculation
    // In production, you would integrate with Swiss Ephemeris or a reliable astrology API
    const mockChart = await mockCalculateBirthChart(birthData)
    return mockChart
  } catch (error) {
    console.error("Error calculating birth chart:", error)
    throw new Error("Failed to calculate birth chart")
  }
}

// Mock calculation for development - replace with real API integration
async function mockCalculateBirthChart(birthData: BirthData): Promise<Partial<BirthChart>> {
  // This is a simplified mock - in production, use Swiss Ephemeris or similar
  const birthDate = new Date(`${birthData.date}T${birthData.time}`)
  const dayOfYear = Math.floor(
    (birthDate.getTime() - new Date(birthDate.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24),
  )

  // Mock planet positions based on birth date (very simplified)
  const planets: PlanetPosition[] = [
    {
      planet: "sun",
      sign: getZodiacSignFromDay(dayOfYear),
      degree: (dayOfYear % 30) + Math.random() * 30,
      house: (Math.floor(Math.random() * 12) + 1) as any,
      retrograde: false,
    },
    {
      planet: "moon",
      sign: getZodiacSignFromDay(dayOfYear + 90),
      degree: Math.random() * 30,
      house: (Math.floor(Math.random() * 12) + 1) as any,
      retrograde: false,
    },
    {
      planet: "mercury",
      sign: getZodiacSignFromDay(dayOfYear + 15),
      degree: Math.random() * 30,
      house: (Math.floor(Math.random() * 12) + 1) as any,
      retrograde: Math.random() > 0.8,
    },
    {
      planet: "venus",
      sign: getZodiacSignFromDay(dayOfYear + 45),
      degree: Math.random() * 30,
      house: (Math.floor(Math.random() * 12) + 1) as any,
      retrograde: Math.random() > 0.9,
    },
    {
      planet: "mars",
      sign: getZodiacSignFromDay(dayOfYear + 120),
      degree: Math.random() * 30,
      house: (Math.floor(Math.random() * 12) + 1) as any,
      retrograde: Math.random() > 0.85,
    },
  ]

  const elements = calculateElementDistribution(planets)
  const modalities = calculateModalityDistribution(planets)
  const aspects = calculateAspects(planets)

  return {
    birthData,
    planets,
    aspects,
    elements,
    modalities,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

function getZodiacSignFromDay(dayOfYear: number): ZodiacSign {
  const signs: ZodiacSign[] = [
    "capricorn",
    "aquarius",
    "pisces",
    "aries",
    "taurus",
    "gemini",
    "cancer",
    "leo",
    "virgo",
    "libra",
    "scorpio",
    "sagittarius",
  ]

  const signIndex = Math.floor((dayOfYear % 365) / 30.4) % 12
  return signs[signIndex]
}

export function calculateElementDistribution(planets: PlanetPosition[]): ElementDistribution {
  const distribution = { fire: 0, earth: 0, air: 0, water: 0 }

  planets.forEach((planet) => {
    const element = ZODIAC_SIGNS[planet.sign].element
    distribution[element]++
  })

  return distribution
}

export function calculateModalityDistribution(planets: PlanetPosition[]): ModalityDistribution {
  const distribution = { cardinal: 0, fixed: 0, mutable: 0 }

  planets.forEach((planet) => {
    const modality = ZODIAC_SIGNS[planet.sign].modality
    distribution[modality]++
  })

  return distribution
}

export function calculateAspects(planets: PlanetPosition[]): Aspect[] {
  const aspects: Aspect[] = []

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const planet1 = planets[i]
      const planet2 = planets[j]

      const angle = Math.abs(planet1.degree - planet2.degree)
      const normalizedAngle = angle > 180 ? 360 - angle : angle

      // Check for major aspects
      Object.entries(ASPECT_ANGLES).forEach(([aspectName, aspectAngle]) => {
        const orb = ASPECT_ORBS[aspectName]
        const difference = Math.abs(normalizedAngle - aspectAngle)

        if (difference <= orb) {
          aspects.push({
            planet1: planet1.planet,
            planet2: planet2.planet,
            type: aspectName as AspectType,
            orb: difference,
            exact: difference < 1,
          })
        }
      })
    }
  }

  return aspects
}

export function getBigThree(planets: PlanetPosition[]): {
  sun: PlanetPosition
  moon: PlanetPosition
  rising?: PlanetPosition
} {
  const sun = planets.find((p) => p.planet === "sun")!
  const moon = planets.find((p) => p.planet === "moon")!

  // Rising sign would be calculated from the 1st house cusp
  // For now, we'll use a mock rising sign
  const rising = planets.find((p) => p.house === 1)

  return { sun, moon, rising }
}

export function formatDegree(degree: number): string {
  const wholeDegrees = Math.floor(degree)
  const minutes = Math.floor((degree - wholeDegrees) * 60)
  return `${wholeDegrees}°${minutes.toString().padStart(2, "0")}'`
}

export function getSignEmoji(sign: ZodiacSign): string {
  return ZODIAC_SIGNS[sign].symbol
}

export function getPlanetEmoji(planet: Planet): string {
  const symbols: Record<Planet, string> = {
    sun: "☉",
    moon: "☽",
    mercury: "☿",
    venus: "♀",
    mars: "♂",
    jupiter: "♃",
    saturn: "♄",
    uranus: "♅",
    neptune: "♆",
    pluto: "♇",
    north_node: "☊",
    south_node: "☋",
    chiron: "⚷",
  }
  return symbols[planet]
}

export function generateBasicInterpretation(chart: Partial<BirthChart>): string {
  if (!chart.planets || chart.planets.length === 0) {
    return "Unable to generate interpretation without planet positions."
  }

  const bigThree = getBigThree(chart.planets)
  const sun = bigThree.sun
  const moon = bigThree.moon

  let interpretation = `Your Sun in ${sun.sign} reveals your core identity and life purpose. `
  interpretation += `Your Moon in ${moon.sign} shows your emotional nature and inner needs. `

  if (bigThree.rising) {
    interpretation += `Your rising sign in ${bigThree.rising.sign} influences how others perceive you. `
  }

  // Add element distribution insight
  if (chart.elements) {
    const dominantElement = Object.entries(chart.elements).reduce((a, b) =>
      chart.elements![a[0] as keyof ElementDistribution] > chart.elements![b[0] as keyof ElementDistribution] ? a : b,
    )[0]
    interpretation += `You have a strong ${dominantElement} influence in your chart. `
  }

  return interpretation
}
