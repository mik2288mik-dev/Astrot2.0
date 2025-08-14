import type { ZodiacSign, Element, Modality, Planet } from "./types"

export const ZODIAC_SIGNS: Record<ZodiacSign, { name: string; element: Element; modality: Modality; symbol: string }> =
  {
    aries: { name: "Aries", element: "fire", modality: "cardinal", symbol: "♈" },
    taurus: { name: "Taurus", element: "earth", modality: "fixed", symbol: "♉" },
    gemini: { name: "Gemini", element: "air", modality: "mutable", symbol: "♊" },
    cancer: { name: "Cancer", element: "water", modality: "cardinal", symbol: "♋" },
    leo: { name: "Leo", element: "fire", modality: "fixed", symbol: "♌" },
    virgo: { name: "Virgo", element: "earth", modality: "mutable", symbol: "♍" },
    libra: { name: "Libra", element: "air", modality: "cardinal", symbol: "♎" },
    scorpio: { name: "Scorpio", element: "water", modality: "fixed", symbol: "♏" },
    sagittarius: { name: "Sagittarius", element: "fire", modality: "mutable", symbol: "♐" },
    capricorn: { name: "Capricorn", element: "earth", modality: "cardinal", symbol: "♑" },
    aquarius: { name: "Aquarius", element: "air", modality: "fixed", symbol: "♒" },
    pisces: { name: "Pisces", element: "water", modality: "mutable", symbol: "♓" },
  }

export const PLANETS: Record<Planet, { name: string; symbol: string; keywords: string[] }> = {
  sun: { name: "Sun", symbol: "☉", keywords: ["identity", "ego", "vitality", "purpose"] },
  moon: { name: "Moon", symbol: "☽", keywords: ["emotions", "intuition", "subconscious", "nurturing"] },
  mercury: { name: "Mercury", symbol: "☿", keywords: ["communication", "thinking", "learning", "travel"] },
  venus: { name: "Venus", symbol: "♀", keywords: ["love", "beauty", "harmony", "values"] },
  mars: { name: "Mars", symbol: "♂", keywords: ["action", "energy", "passion", "conflict"] },
  jupiter: { name: "Jupiter", symbol: "♃", keywords: ["expansion", "wisdom", "luck", "philosophy"] },
  saturn: { name: "Saturn", symbol: "♄", keywords: ["discipline", "responsibility", "limitations", "structure"] },
  uranus: { name: "Uranus", symbol: "♅", keywords: ["innovation", "rebellion", "freedom", "change"] },
  neptune: { name: "Neptune", symbol: "♆", keywords: ["dreams", "spirituality", "illusion", "compassion"] },
  pluto: { name: "Pluto", symbol: "♇", keywords: ["transformation", "power", "rebirth", "intensity"] },
  north_node: { name: "North Node", symbol: "☊", keywords: ["destiny", "growth", "future", "karma"] },
  south_node: { name: "South Node", symbol: "☋", keywords: ["past", "talents", "karma", "release"] },
  chiron: { name: "Chiron", symbol: "⚷", keywords: ["healing", "wounds", "wisdom", "teaching"] },
}

export const HOUSES: Record<number, { name: string; keywords: string[]; theme: string }> = {
  1: { name: "1st House", keywords: ["self", "appearance", "first impressions"], theme: "Identity" },
  2: { name: "2nd House", keywords: ["money", "possessions", "values"], theme: "Resources" },
  3: { name: "3rd House", keywords: ["communication", "siblings", "short trips"], theme: "Communication" },
  4: { name: "4th House", keywords: ["home", "family", "roots"], theme: "Foundation" },
  5: { name: "5th House", keywords: ["creativity", "romance", "children"], theme: "Expression" },
  6: { name: "6th House", keywords: ["work", "health", "service"], theme: "Service" },
  7: { name: "7th House", keywords: ["partnerships", "marriage", "others"], theme: "Relationships" },
  8: { name: "8th House", keywords: ["transformation", "shared resources", "mystery"], theme: "Transformation" },
  9: { name: "9th House", keywords: ["philosophy", "travel", "higher learning"], theme: "Expansion" },
  10: { name: "10th House", keywords: ["career", "reputation", "authority"], theme: "Achievement" },
  11: { name: "11th House", keywords: ["friends", "groups", "hopes"], theme: "Community" },
  12: { name: "12th House", keywords: ["spirituality", "subconscious", "sacrifice"], theme: "Transcendence" },
}

export const ASPECT_ORBS: Record<string, number> = {
  conjunction: 8,
  opposition: 8,
  trine: 8,
  square: 8,
  sextile: 6,
  quincunx: 3,
}

export const ASPECT_ANGLES: Record<string, number> = {
  conjunction: 0,
  opposition: 180,
  trine: 120,
  square: 90,
  sextile: 60,
  quincunx: 150,
}
