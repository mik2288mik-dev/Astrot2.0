// Zodiac signs
export type ZodiacSign =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces"

// Planets
export type Planet =
  | "sun"
  | "moon"
  | "mercury"
  | "venus"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune"
  | "pluto"
  | "north_node"
  | "south_node"
  | "chiron"

// Houses
export type House = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

// Elements
export type Element = "fire" | "earth" | "air" | "water"

// Modalities
export type Modality = "cardinal" | "fixed" | "mutable"

// Aspects
export type AspectType = "conjunction" | "opposition" | "trine" | "square" | "sextile" | "quincunx"

export interface BirthData {
  date: string // YYYY-MM-DD
  time: string // HH:MM
  latitude: number
  longitude: number
  timezone: string
}

export interface PlanetPosition {
  planet: Planet
  sign: ZodiacSign
  degree: number
  house: House
  retrograde: boolean
}

export interface Aspect {
  planet1: Planet
  planet2: Planet
  type: AspectType
  orb: number
  exact: boolean
}

export interface BirthChart {
  id: string
  userId: string
  birthData: BirthData
  planets: PlanetPosition[]
  houses: HousePosition[]
  aspects: Aspect[]
  elements: ElementDistribution
  modalities: ModalityDistribution
  createdAt: string
  updatedAt: string
}

export interface HousePosition {
  house: House
  sign: ZodiacSign
  degree: number
}

export interface ElementDistribution {
  fire: number
  earth: number
  air: number
  water: number
}

export interface ModalityDistribution {
  cardinal: number
  fixed: number
  mutable: number
}

export interface ChartInterpretation {
  sunSign: string
  moonSign: string
  risingSign: string
  bigThree: string
  personality: string
  relationships: string
  career: string
  challenges: string
  strengths: string
  lifeTheme: string
}
