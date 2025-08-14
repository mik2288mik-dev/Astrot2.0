"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles } from "lucide-react"
import type { BirthChart } from "@/lib/astrology/types"
import { ZODIAC_SIGNS, PLANETS } from "@/lib/astrology/constants"
import { formatDegree, getSignEmoji, getPlanetEmoji } from "@/lib/astrology/calculations"

interface BirthChartDisplayProps {
  chart: BirthChart
  userName?: string
}

export default function BirthChartDisplay({ chart, userName = "Друг" }: BirthChartDisplayProps) {
  const [interpretation, setInterpretation] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const sun = chart.planets.find((p) => p.planet === "sun")!
  const moon = chart.planets.find((p) => p.planet === "moon")!
  const rising = chart.planets.find((p) => p.house === 1) || sun

  const generateInterpretation = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-interpretation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chart,
          userName,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setInterpretation(data.interpretation)
      }
    } catch (error) {
      console.error("Error generating interpretation:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Big Three */}
      <Card className="bg-gradient-to-br from-indigo-600/90 to-purple-600/90 border-white/20 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            Твоя Большая Тройка
          </CardTitle>
          <CardDescription className="text-indigo-100">Основа твоей астрологической личности</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl mb-2">{getSignEmoji(sun.sign)}</div>
              <h3 className="text-lg font-semibold">Солнце</h3>
              <p className="text-indigo-100">{ZODIAC_SIGNS[sun.sign].name}</p>
              <p className="text-sm text-indigo-200">Твоя суть</p>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl mb-2">{getSignEmoji(moon.sign)}</div>
              <h3 className="text-lg font-semibold">Луна</h3>
              <p className="text-indigo-100">{ZODIAC_SIGNS[moon.sign].name}</p>
              <p className="text-sm text-indigo-200">Твои эмоции</p>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl mb-2">{getSignEmoji(rising.sign)}</div>
              <h3 className="text-lg font-semibold">Асцендент</h3>
              <p className="text-indigo-100">{ZODIAC_SIGNS[rising.sign].name}</p>
              <p className="text-sm text-indigo-200">Как тебя видят</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Interpretation */}
      <Card className="bg-white/95 backdrop-blur-md border-indigo-200">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            Твоя космическая история
          </CardTitle>
          <CardDescription>Персональная интерпретация от ИИ-астролога</CardDescription>
        </CardHeader>
        <CardContent>
          {!interpretation && !isGenerating && (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Готов узнать, что говорят о тебе звезды?</p>
              <Button onClick={generateInterpretation} className="bg-indigo-600 hover:bg-indigo-700">
                <Sparkles className="mr-2 h-4 w-4" />
                Создать интерпретацию
              </Button>
            </div>
          )}

          {isGenerating && (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
              <p className="text-gray-600">ИИ-астролог изучает твою карту...</p>
            </div>
          )}

          {interpretation && (
            <div className="prose prose-gray max-w-none">
              <div className="whitespace-pre-line text-gray-800 leading-relaxed">{interpretation}</div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={generateInterpretation}
                  disabled={isGenerating}
                  className="w-full bg-transparent"
                >
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Создать новую интерпретацию
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Planet Positions */}
      <Card className="bg-white/95 backdrop-blur-md border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Положения планет</CardTitle>
          <CardDescription>Где находились планеты в момент твоего рождения</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chart.planets.map((planet) => (
              <div key={planet.planet} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getPlanetEmoji(planet.planet)}</span>
                  <div>
                    <h4 className="font-medium text-gray-900">{PLANETS[planet.planet].name}</h4>
                    <p className="text-sm text-gray-600">
                      {ZODIAC_SIGNS[planet.sign].name} {formatDegree(planet.degree)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="text-gray-700">
                    {planet.house} дом
                  </Badge>
                  {planet.retrograde && <p className="text-xs text-orange-600 mt-1">Ретроград ℞</p>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Element Distribution */}
      <Card className="bg-white/95 backdrop-blur-md border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Баланс стихий</CardTitle>
          <CardDescription>Распределение твоей космической энергии</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(chart.elements).map(([element, count]) => {
              const percentage = (count / chart.planets.length) * 100
              const elementEmojis = {
                fire: "🔥",
                earth: "🌍",
                air: "💨",
                water: "🌊",
              }
              const elementNames = {
                fire: "Огонь",
                earth: "Земля",
                air: "Воздух",
                water: "Вода",
              }
              const elementColors = {
                fire: "from-red-500 to-orange-500",
                earth: "from-green-600 to-yellow-600",
                air: "from-blue-400 to-cyan-400",
                water: "from-blue-600 to-purple-600",
              }

              return (
                <div key={element} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 flex items-center gap-2">
                      {elementEmojis[element as keyof typeof elementEmojis]}
                      {elementNames[element as keyof typeof elementNames]}
                    </span>
                    <span className="text-gray-600">{count} планет</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${elementColors[element as keyof typeof elementColors]}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
