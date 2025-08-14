// Swiss Ephemeris integration
// Предполагается, что папка ephe будет добавлена в public/ephe

export interface SwissEphemerisData {
  julianDay: number
  planets: {
    [key: string]: {
      longitude: number
      latitude: number
      distance: number
      speed: number
    }
  }
  houses: number[]
  ascendant: number
  midheaven: number
}

export async function calculateSwissEphemeris(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  latitude: number,
  longitude: number,
  timezone: number,
): Promise<SwissEphemerisData> {
  // Здесь будет интеграция с Swiss Ephemeris
  // Пока возвращаем mock данные, которые будут заменены на реальные расчеты

  const julianDay = calculateJulianDay(year, month, day, hour, minute)

  // Mock данные - заменить на реальные расчеты Swiss Ephemeris
  const mockData: SwissEphemerisData = {
    julianDay,
    planets: {
      sun: { longitude: 120.5, latitude: 0, distance: 1.0, speed: 1.0 },
      moon: { longitude: 45.2, latitude: 2.1, distance: 0.002, speed: 13.2 },
      mercury: { longitude: 95.8, latitude: 1.2, distance: 0.8, speed: 1.5 },
      venus: { longitude: 150.3, latitude: -1.8, distance: 0.7, speed: 1.2 },
      mars: { longitude: 200.7, latitude: 0.9, distance: 1.5, speed: 0.5 },
      jupiter: { longitude: 75.4, latitude: -0.3, distance: 5.2, speed: 0.08 },
      saturn: { longitude: 310.1, latitude: 1.1, distance: 9.5, speed: 0.03 },
      uranus: { longitude: 25.9, latitude: -0.8, distance: 19.2, speed: 0.01 },
      neptune: { longitude: 355.6, latitude: 0.4, distance: 30.1, speed: 0.006 },
      pluto: { longitude: 275.2, latitude: 2.3, distance: 39.5, speed: 0.004 },
    },
    houses: [120.5, 150.2, 180.8, 210.5, 240.2, 270.8, 300.5, 330.2, 0.8, 30.5, 60.2, 90.8],
    ascendant: 120.5,
    midheaven: 210.5,
  }

  return mockData
}

function calculateJulianDay(year: number, month: number, day: number, hour: number, minute: number): number {
  // Упрощенный расчет юлианского дня
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3

  const jdn =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  const jd = jdn + (hour - 12) / 24 + minute / 1440

  return jd
}

export function longitudeToZodiacSign(longitude: number): { sign: string; degree: number } {
  const signs = [
    "Овен",
    "Телец",
    "Близнецы",
    "Рак",
    "Лев",
    "Дева",
    "Весы",
    "Скорпион",
    "Стрелец",
    "Козерог",
    "Водолей",
    "Рыбы",
  ]

  const normalizedLongitude = ((longitude % 360) + 360) % 360
  const signIndex = Math.floor(normalizedLongitude / 30)
  const degree = normalizedLongitude % 30

  return {
    sign: signs[signIndex],
    degree: Math.round(degree * 100) / 100,
  }
}

export function calculateHousePosition(planetLongitude: number, houses: number[]): number {
  const normalizedLongitude = ((planetLongitude % 360) + 360) % 360

  for (let i = 0; i < 12; i++) {
    const currentHouse = houses[i]
    const nextHouse = houses[(i + 1) % 12]

    if (nextHouse > currentHouse) {
      if (normalizedLongitude >= currentHouse && normalizedLongitude < nextHouse) {
        return i + 1
      }
    } else {
      if (normalizedLongitude >= currentHouse || normalizedLongitude < nextHouse) {
        return i + 1
      }
    }
  }

  return 1
}
