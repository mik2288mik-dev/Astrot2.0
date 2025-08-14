import type { BirthChart, PlanetPosition, ChartInterpretation } from "./types"
import { ZODIAC_SIGNS, HOUSES } from "./constants"

// Basic interpretation templates - these would be enhanced with AI in the next step
export function generateBasicInterpretation(chart: Partial<BirthChart>): ChartInterpretation {
  if (!chart.planets) {
    throw new Error("Chart planets data is required for interpretation")
  }

  const sun = chart.planets.find((p) => p.planet === "sun")!
  const moon = chart.planets.find((p) => p.planet === "moon")!
  const mercury = chart.planets.find((p) => p.planet === "mercury")

  // Get rising sign from 1st house or approximate
  const rising = chart.planets.find((p) => p.house === 1) || sun

  return {
    sunSign: interpretSunSign(sun),
    moonSign: interpretMoonSign(moon),
    risingSign: interpretRisingSign(rising),
    bigThree: interpretBigThree(sun, moon, rising),
    personality: interpretPersonality(chart.planets),
    relationships: interpretRelationships(chart.planets),
    career: interpretCareer(chart.planets),
    challenges: interpretChallenges(chart.planets),
    strengths: interpretStrengths(chart.planets),
    lifeTheme: interpretLifeTheme(chart.planets, chart.elements),
  }
}

function interpretSunSign(sun: PlanetPosition): string {
  const signInfo = ZODIAC_SIGNS[sun.sign]
  const houseInfo = HOUSES[sun.house]

  const templates = {
    aries:
      "You're a natural born leader with incredible energy and enthusiasm. Your pioneering spirit drives you to start new projects and take on challenges that others might shy away from.",
    taurus:
      "You have a steady, reliable nature that others find comforting. You appreciate the finer things in life and have a natural talent for creating beauty and stability.",
    gemini:
      "Your curious mind and gift for communication make you a natural connector of people and ideas. You thrive on variety and intellectual stimulation.",
    cancer:
      "You have a deeply nurturing soul with strong intuitive abilities. Family and emotional security are incredibly important to you.",
    leo: "You shine brightest when you can express your creativity and natural charisma. You have a generous heart and love to make others feel special.",
    virgo:
      "You have a keen eye for detail and a genuine desire to help others improve their lives. Your analytical mind helps you solve problems others can't see.",
    libra:
      "You're a natural diplomat with an innate sense of fairness and beauty. Harmony in relationships and your environment is essential to your wellbeing.",
    scorpio:
      "You possess incredible emotional depth and transformative power. You're not afraid to explore life's mysteries and help others through their darkest moments.",
    sagittarius:
      "You're an eternal optimist with a love for adventure and learning. Your philosophical nature helps you see the bigger picture in any situation.",
    capricorn:
      "You have natural leadership abilities and the determination to achieve your long-term goals. Others respect your wisdom and reliability.",
    aquarius:
      "You're a visionary with unique ideas about how to make the world a better place. Your independent spirit and humanitarian nature set you apart.",
    pisces:
      "You have a compassionate, intuitive nature that allows you to understand others on a deep emotional level. Your creativity and spirituality are your greatest gifts.",
  }

  return `${templates[sun.sign]} With your Sun in the ${houseInfo.name}, this energy is particularly focused on ${houseInfo.theme.toLowerCase()}.`
}

function interpretMoonSign(moon: PlanetPosition): string {
  const signInfo = ZODIAC_SIGNS[moon.sign]

  const templates = {
    aries:
      "Emotionally, you need excitement and new experiences to feel fulfilled. You process feelings quickly and directly.",
    taurus:
      "You find emotional security through stability, comfort, and sensual pleasures. You need time to process changes.",
    gemini:
      "Your emotions are closely tied to communication and mental stimulation. You need variety and intellectual connection.",
    cancer:
      "You have deep emotional needs for nurturing and being nurtured. Home and family provide your greatest comfort.",
    leo: "You need appreciation and recognition to feel emotionally satisfied. Creative expression feeds your soul.",
    virgo:
      "You find emotional peace through helping others and creating order. You may worry more than necessary about details.",
    libra:
      "Harmony and beautiful surroundings are essential for your emotional wellbeing. You dislike conflict and seek balance.",
    scorpio:
      "You experience emotions intensely and need deep, meaningful connections. You're naturally drawn to life's mysteries.",
    sagittarius:
      "You need freedom and adventure to feel emotionally satisfied. Optimism and learning fuel your spirit.",
    capricorn:
      "You find emotional security through achievement and structure. You may appear reserved but feel deeply.",
    aquarius:
      "You need intellectual freedom and unique experiences. You may seem detached but care deeply about humanity.",
    pisces:
      "You're highly empathetic and intuitive. You need creative outlets and spiritual connection to feel balanced.",
  }

  return templates[moon.sign]
}

function interpretRisingSign(rising: PlanetPosition): string {
  const signInfo = ZODIAC_SIGNS[rising.sign]

  return `Others see you as someone who embodies ${signInfo.name} qualities. You naturally project ${signInfo.element} energy and approach life with a ${signInfo.modality} attitude.`
}

function interpretBigThree(sun: PlanetPosition, moon: PlanetPosition, rising: PlanetPosition): string {
  return `Your core identity (${ZODIAC_SIGNS[sun.sign].name} Sun) is expressed through your ${ZODIAC_SIGNS[rising.sign].name} rising, while your emotional nature (${ZODIAC_SIGNS[moon.sign].name} Moon) provides the inner foundation. This creates a unique blend of ${ZODIAC_SIGNS[sun.sign].element}, ${ZODIAC_SIGNS[moon.sign].element}, and ${ZODIAC_SIGNS[rising.sign].element} energies.`
}

function interpretPersonality(planets: PlanetPosition[]): string {
  const mercury = planets.find((p) => p.planet === "mercury")
  const venus = planets.find((p) => p.planet === "venus")

  let personality = "Your personality is a unique blend of cosmic influences. "

  if (mercury) {
    personality += `You communicate and think in a ${ZODIAC_SIGNS[mercury.sign].name} way, which means you're naturally ${ZODIAC_SIGNS[mercury.sign].element === "fire" ? "direct and enthusiastic" : ZODIAC_SIGNS[mercury.sign].element === "earth" ? "practical and methodical" : ZODIAC_SIGNS[mercury.sign].element === "air" ? "intellectual and social" : "intuitive and emotional"} in your approach to ideas. `
  }

  if (venus) {
    personality += `In relationships and matters of the heart, your ${ZODIAC_SIGNS[venus.sign].name} Venus shows you value ${ZODIAC_SIGNS[venus.sign].element === "fire" ? "passion and excitement" : ZODIAC_SIGNS[venus.sign].element === "earth" ? "stability and loyalty" : ZODIAC_SIGNS[venus.sign].element === "air" ? "intellectual connection and communication" : "emotional depth and intuition"}.`
  }

  return personality
}

function interpretRelationships(planets: PlanetPosition[]): string {
  const venus = planets.find((p) => p.planet === "venus")
  const mars = planets.find((p) => p.planet === "mars")

  let relationships = "In relationships, "

  if (venus) {
    relationships += `you're attracted to ${ZODIAC_SIGNS[venus.sign].element === "fire" ? "confident, adventurous" : ZODIAC_SIGNS[venus.sign].element === "earth" ? "reliable, grounded" : ZODIAC_SIGNS[venus.sign].element === "air" ? "intelligent, communicative" : "sensitive, intuitive"} partners. `
  }

  if (mars) {
    relationships += `Your ${ZODIAC_SIGNS[mars.sign].name} Mars means you express passion and handle conflict in a ${ZODIAC_SIGNS[mars.sign].modality} way.`
  }

  return relationships
}

function interpretCareer(planets: PlanetPosition[]): string {
  const sun = planets.find((p) => p.planet === "sun")!
  const saturn = planets.find((p) => p.planet === "saturn")

  let career = `Your ${ZODIAC_SIGNS[sun.sign].name} Sun suggests you thrive in careers that allow you to express your natural ${ZODIAC_SIGNS[sun.sign].element} energy. `

  if (saturn) {
    career += `With Saturn in ${ZODIAC_SIGNS[saturn.sign].name}, you may find success through ${ZODIAC_SIGNS[saturn.sign].element === "earth" ? "practical, structured approaches" : ZODIAC_SIGNS[saturn.sign].element === "water" ? "emotional intelligence and intuition" : ZODIAC_SIGNS[saturn.sign].element === "air" ? "communication and networking" : "leadership and innovation"}.`
  }

  return career
}

function interpretChallenges(planets: PlanetPosition[]): string {
  // Look for challenging aspects or placements
  return "Every chart has its challenges, and yours are opportunities for growth. Focus on balancing your natural tendencies with conscious awareness."
}

function interpretStrengths(planets: PlanetPosition[]): string {
  const sun = planets.find((p) => p.planet === "sun")!
  const jupiter = planets.find((p) => p.planet === "jupiter")

  let strengths = `Your ${ZODIAC_SIGNS[sun.sign].name} Sun gives you natural ${ZODIAC_SIGNS[sun.sign].element} energy and ${ZODIAC_SIGNS[sun.sign].modality} approach to life. `

  if (jupiter) {
    strengths += `Jupiter in ${ZODIAC_SIGNS[jupiter.sign].name} expands your natural abilities in ${ZODIAC_SIGNS[jupiter.sign].element === "fire" ? "leadership and inspiration" : ZODIAC_SIGNS[jupiter.sign].element === "earth" ? "practical wisdom and growth" : ZODIAC_SIGNS[jupiter.sign].element === "air" ? "learning and communication" : "intuition and compassion"}.`
  }

  return strengths
}

function interpretLifeTheme(planets: PlanetPosition[], elements?: any): string {
  const sun = planets.find((p) => p.planet === "sun")!
  const northNode = planets.find((p) => p.planet === "north_node")

  let theme = `Your life theme revolves around expressing your ${ZODIAC_SIGNS[sun.sign].name} nature authentically. `

  if (northNode) {
    theme += `Your North Node in ${ZODIAC_SIGNS[northNode.sign].name} suggests your soul's growth comes through developing ${ZODIAC_SIGNS[northNode.sign].element} qualities and embracing ${ZODIAC_SIGNS[northNode.sign].modality} approaches to life.`
  }

  return theme
}
