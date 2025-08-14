"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Heart, Users, Sparkles, Loader2 } from "lucide-react"
import { calculateBirthChart } from "@/lib/astrology/calculations"
import type { BirthChart } from "@/lib/astrology/types"

interface CompatibilityData {
  person1: {
    name: string
    chart: BirthChart | null
  }
  person2: {
    name: string
    chart: BirthChart | null
  }
  report: string | null
}

export default function CompatibilityPage() {
  const [activeTab, setActiveTab] = useState("input")
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const [person1Data, setPerson1Data] = useState({
    name: "",
    birthDate: "",
    birthTime: "",
    birthLocation: "",
    latitude: "",
    longitude: "",
  })

  const [person2Data, setPerson2Data] = useState({
    name: "",
    birthDate: "",
    birthTime: "",
    birthLocation: "",
    latitude: "",
    longitude: "",
  })

  const [compatibility, setCompatibility] = useState<CompatibilityData>({
    person1: { name: "", chart: null },
    person2: { name: "", chart: null },
    report: null,
  })

  const handleGenerateCompatibility = async () => {
    if (!person1Data.name || !person1Data.birthDate || !person2Data.name || !person2Data.birthDate) {
      toast({
        title: "Заполните все поля",
        description: "Необходимо указать имена и даты рождения для обеих персон",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      // Calculate birth charts
      const chart1 = await calculateBirthChart({
        date: person1Data.birthDate,
        time: person1Data.birthTime || "12:00",
        latitude: Number.parseFloat(person1Data.latitude) || 55.7558,
        longitude: Number.parseFloat(person1Data.longitude) || 37.6176,
        timezone: "Europe/Moscow",
      })

      const chart2 = await calculateBirthChart({
        date: person2Data.birthDate,
        time: person2Data.birthTime || "12:00",
        latitude: Number.parseFloat(person2Data.latitude) || 55.7558,
        longitude: Number.parseFloat(person2Data.longitude) || 37.6176,
        timezone: "Europe/Moscow",
      })

      // Generate compatibility report
      const response = await fetch("/api/generate-compatibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          person1: {
            name: person1Data.name,
            chart: chart1,
          },
          person2: {
            name: person2Data.name,
            chart: chart2,
          },
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setCompatibility({
          person1: { name: person1Data.name, chart: chart1 },
          person2: { name: person2Data.name, chart: chart2 },
          report: data.report,
        })
        setActiveTab("results")
      } else {
        throw new Error("Failed to generate compatibility report")
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать анализ совместимости",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const getCompatibilityScore = () => {
    // Simple compatibility score based on elements
    if (!compatibility.person1.chart || !compatibility.person2.chart) return 0

    const chart1 = compatibility.person1.chart
    const chart2 = compatibility.person2.chart

    let score = 0
    const maxScore = 100

    // Sun sign compatibility
    const sun1 = chart1.planets.find((p) => p.planet === "sun")
    const sun2 = chart2.planets.find((p) => p.planet === "sun")
    if (sun1 && sun2) {
      const element1 = ["fire", "earth", "air", "water"][Math.floor(sun1.sign / 3)]
      const element2 = ["fire", "earth", "air", "water"][Math.floor(sun2.sign / 3)]
      if (element1 === element2) score += 25
      else if ((element1 === "fire" && element2 === "air") || (element1 === "air" && element2 === "fire")) score += 20
      else if ((element1 === "earth" && element2 === "water") || (element1 === "water" && element2 === "earth"))
        score += 20
      else score += 10
    }

    // Moon sign compatibility
    const moon1 = chart1.planets.find((p) => p.planet === "moon")
    const moon2 = chart2.planets.find((p) => p.planet === "moon")
    if (moon1 && moon2) {
      const element1 = ["fire", "earth", "air", "water"][Math.floor(moon1.sign / 3)]
      const element2 = ["fire", "earth", "air", "water"][Math.floor(moon2.sign / 3)]
      if (element1 === element2) score += 25
      else score += 15
    }

    // Venus compatibility (love and relationships)
    score += Math.floor(Math.random() * 30) + 20 // Random component for demo

    return Math.min(score, maxScore)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-12 w-12 text-pink-500" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Совместимость по звездам</h1>
          <p className="text-gray-600 text-lg">Узнайте, как ваши натальные карты дополняют друг друга</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Ввод данных</TabsTrigger>
            <TabsTrigger value="results" disabled={!compatibility.report}>
              Результаты
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Person 1 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-600" />
                    Первая персона
                  </CardTitle>
                  <CardDescription>Введите данные рождения первого человека</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="person1-name">Имя</Label>
                    <Input
                      id="person1-name"
                      value={person1Data.name}
                      onChange={(e) => setPerson1Data({ ...person1Data, name: e.target.value })}
                      placeholder="Введите имя"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="person1-date">Дата рождения</Label>
                    <Input
                      id="person1-date"
                      type="date"
                      value={person1Data.birthDate}
                      onChange={(e) => setPerson1Data({ ...person1Data, birthDate: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="person1-time">Время рождения (опционально)</Label>
                    <Input
                      id="person1-time"
                      type="time"
                      value={person1Data.birthTime}
                      onChange={(e) => setPerson1Data({ ...person1Data, birthTime: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="person1-location">Место рождения (опционально)</Label>
                    <Input
                      id="person1-location"
                      value={person1Data.birthLocation}
                      onChange={(e) => setPerson1Data({ ...person1Data, birthLocation: e.target.value })}
                      placeholder="Город, страна"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Person 2 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    Вторая персона
                  </CardTitle>
                  <CardDescription>Введите данные рождения второго человека</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="person2-name">Имя</Label>
                    <Input
                      id="person2-name"
                      value={person2Data.name}
                      onChange={(e) => setPerson2Data({ ...person2Data, name: e.target.value })}
                      placeholder="Введите имя"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="person2-date">Дата рождения</Label>
                    <Input
                      id="person2-date"
                      type="date"
                      value={person2Data.birthDate}
                      onChange={(e) => setPerson2Data({ ...person2Data, birthDate: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="person2-time">Время рождения (опционально)</Label>
                    <Input
                      id="person2-time"
                      type="time"
                      value={person2Data.birthTime}
                      onChange={(e) => setPerson2Data({ ...person2Data, birthTime: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="person2-location">Место рождения (опционально)</Label>
                    <Input
                      id="person2-location"
                      value={person2Data.birthLocation}
                      onChange={(e) => setPerson2Data({ ...person2Data, birthLocation: e.target.value })}
                      placeholder="Город, страна"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button
                onClick={handleGenerateCompatibility}
                disabled={isGenerating}
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Анализируем совместимость...
                  </>
                ) : (
                  <>
                    <Heart className="mr-2 h-5 w-5" />
                    Проанализировать совместимость
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {compatibility.report && (
              <>
                {/* Compatibility Score */}
                <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-4">
                        <div className="text-6xl font-bold">{getCompatibilityScore()}%</div>
                      </div>
                      <h3 className="text-2xl font-semibold mb-2">
                        {compatibility.person1.name} & {compatibility.person2.name}
                      </h3>
                      <p className="text-pink-100">
                        {getCompatibilityScore() >= 80
                          ? "Отличная совместимость!"
                          : getCompatibilityScore() >= 60
                            ? "Хорошая совместимость"
                            : getCompatibilityScore() >= 40
                              ? "Средняя совместимость"
                              : "Сложная, но интересная пара"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Report */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-indigo-600" />
                      Анализ совместимости
                    </CardTitle>
                    <CardDescription>Персональный отчет от ИИ-астролога</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray max-w-none">
                      <div className="whitespace-pre-line text-gray-800 leading-relaxed">{compatibility.report}</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{compatibility.person1.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {compatibility.person1.chart && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Солнце</span>
                            <Badge variant="outline">
                              {
                                [
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
                                ][compatibility.person1.chart.planets.find((p) => p.planet === "sun")?.sign || 0]
                              }
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Луна</span>
                            <Badge variant="outline">
                              {
                                [
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
                                ][compatibility.person1.chart.planets.find((p) => p.planet === "moon")?.sign || 0]
                              }
                            </Badge>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{compatibility.person2.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {compatibility.person2.chart && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Солнце</span>
                            <Badge variant="outline">
                              {
                                [
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
                                ][compatibility.person2.chart.planets.find((p) => p.planet === "sun")?.sign || 0]
                              }
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Луна</span>
                            <Badge variant="outline">
                              {
                                [
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
                                ][compatibility.person2.chart.planets.find((p) => p.planet === "moon")?.sign || 0]
                              }
                            </Badge>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="text-center">
                  <Button
                    onClick={() => {
                      setActiveTab("input")
                      setCompatibility({
                        person1: { name: "", chart: null },
                        person2: { name: "", chart: null },
                        report: null,
                      })
                      setPerson1Data({
                        name: "",
                        birthDate: "",
                        birthTime: "",
                        birthLocation: "",
                        latitude: "",
                        longitude: "",
                      })
                      setPerson2Data({
                        name: "",
                        birthDate: "",
                        birthTime: "",
                        birthLocation: "",
                        latitude: "",
                        longitude: "",
                      })
                    }}
                    variant="outline"
                  >
                    Создать новый анализ
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
