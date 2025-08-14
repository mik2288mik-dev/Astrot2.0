"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Sparkles, Sun, Moon, Star, Loader2, RefreshCw, Bell } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import LoadingSpinner from "@/components/loading-spinner"

interface DailyHoroscope {
  id: string
  date: string
  content: string
  mood: string
  advice: string
  created_at: string
}

export default function HoroscopePage() {
  const [user, setUser] = useState<any>(null)
  const [todayHoroscope, setTodayHoroscope] = useState<DailyHoroscope | null>(null)
  const [recentHoroscopes, setRecentHoroscopes] = useState<DailyHoroscope[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const supabase = createClient()

    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        await loadHoroscopes(user.id)
      }
      setLoading(false)
    }

    loadData()
  }, [])

  const loadHoroscopes = async (userId: string) => {
    const supabase = createClient()
    const today = new Date().toISOString().split("T")[0]

    // Get today's horoscope
    const { data: todayData } = await supabase
      .from("daily_horoscopes")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .single()

    if (todayData) {
      setTodayHoroscope(todayData)
    }

    // Get recent horoscopes (last 7 days)
    const { data: recentData } = await supabase
      .from("daily_horoscopes")
      .select("*")
      .eq("user_id", userId)
      .neq("date", today)
      .order("date", { ascending: false })
      .limit(7)

    if (recentData) {
      setRecentHoroscopes(recentData)
    }
  }

  const generateTodayHoroscope = async () => {
    if (!user) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-daily-horoscope", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      })

      if (response.ok) {
        const data = await response.json()
        setTodayHoroscope(data.horoscope)
        toast({
          title: "Гороскоп готов!",
          description: "Ваш персональный гороскоп на сегодня создан",
        })
      } else {
        throw new Error("Failed to generate horoscope")
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать гороскоп. Попробуйте позже.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const getMoodEmoji = (mood: string) => {
    const moodEmojis: { [key: string]: string } = {
      energetic: "⚡",
      calm: "🌊",
      creative: "🎨",
      focused: "🎯",
      romantic: "💕",
      adventurous: "🌟",
      reflective: "🤔",
      optimistic: "☀️",
      mysterious: "🌙",
      balanced: "⚖️",
    }
    return moodEmojis[mood] || "✨"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ru-RU", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <LoadingSpinner size="lg" text="Загружаем ваши гороскопы..." />
        </div>
      </div>
    )
  }

  const today = new Date().toISOString().split("T")[0]
  const todayFormatted = formatDate(today)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Calendar className="h-12 w-12 text-amber-500" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Ежедневный гороскоп</h1>
          <p className="text-gray-600 text-lg">Персональные прогнозы на основе вашей натальной карты</p>
        </div>

        {/* Today's Horoscope */}
        <Card className="mb-8 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Sun className="h-6 w-6 text-amber-600" />
                  Сегодня
                </CardTitle>
                <CardDescription className="text-amber-700">{todayFormatted}</CardDescription>
              </div>
              {todayHoroscope && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  {getMoodEmoji(todayHoroscope.mood)} {todayHoroscope.mood}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {todayHoroscope ? (
              <div className="space-y-4">
                <div className="prose prose-amber max-w-none">
                  <p className="text-gray-800 leading-relaxed text-lg">{todayHoroscope.content}</p>
                </div>

                {todayHoroscope.advice && (
                  <div className="p-4 bg-amber-100 rounded-lg border-l-4 border-amber-500">
                    <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Совет дня
                    </h4>
                    <p className="text-amber-800">{todayHoroscope.advice}</p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-amber-200">
                  <span className="text-sm text-amber-600">
                    Создан{" "}
                    {new Date(todayHoroscope.created_at).toLocaleTimeString("ru-RU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <Button
                    onClick={generateTodayHoroscope}
                    disabled={isGenerating}
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-amber-300 text-amber-700 hover:bg-amber-100"
                  >
                    {isGenerating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="mr-2 h-4 w-4" />
                    )}
                    Обновить
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Sun className="h-16 w-16 text-amber-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Гороскоп на сегодня еще не готов</h3>
                <p className="text-gray-600 mb-6">Создайте персональный прогноз на основе вашей натальной карты</p>
                <Button
                  onClick={generateTodayHoroscope}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Создаем гороскоп...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Создать гороскоп на сегодня
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-indigo-600" />
              Уведомления
            </CardTitle>
            <CardDescription>Настройте получение ежедневных гороскопов</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Ежедневные уведомления</h4>
                <p className="text-sm text-gray-600">Получать персональный гороскоп каждое утро</p>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Скоро
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Recent Horoscopes */}
        {recentHoroscopes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-indigo-600" />
                Предыдущие гороскопы
              </CardTitle>
              <CardDescription>Ваши гороскопы за последние дни</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentHoroscopes.map((horoscope) => (
                  <div
                    key={horoscope.id}
                    className="p-4 bg-gray-50 rounded-lg border-l-4 border-indigo-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{formatDate(horoscope.date)}</h4>
                      <Badge variant="outline" className="text-xs">
                        {getMoodEmoji(horoscope.mood)} {horoscope.mood}
                      </Badge>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{horoscope.content}</p>
                    {horoscope.advice && (
                      <div className="mt-3 p-3 bg-indigo-50 rounded border-l-2 border-indigo-300">
                        <p className="text-indigo-800 text-sm">
                          <strong>Совет:</strong> {horoscope.advice}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State for Recent Horoscopes */}
        {recentHoroscopes.length === 0 && todayHoroscope && (
          <Card>
            <CardContent className="text-center py-8">
              <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Это ваш первый гороскоп!</h3>
              <p className="text-gray-600">Возвращайтесь завтра за новым персональным прогнозом</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
