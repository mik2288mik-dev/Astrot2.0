"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Star, Moon, Sun, Users, Calendar, Zap, Brain, Heart } from "lucide-react"
import { getTelegramWebAppData } from "@/lib/telegram/auth"
import { createClient } from "@/lib/supabase/client"
import type { TelegramWebAppUser } from "@/lib/telegram/types"
import Link from "next/link"

export default function HomePage() {
  const [telegramUser, setTelegramUser] = useState<TelegramWebAppUser | null>(null)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Initialize Telegram Web App
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready()
      window.Telegram.WebApp.expand()

      const tgUser = getTelegramWebAppData()
      if (tgUser) {
        setTelegramUser(tgUser)
      }
    }

    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setIsLoading(false)
    })
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  // If user is logged in, show dashboard-style home
  if (user) {
    return (
      <div className="min-h-screen p-4 pb-20">
        {/* Header */}
        <div className="text-center mb-8 pt-4">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Sparkles className="h-12 w-12 text-indigo-600" />
              <Star className="h-6 w-6 text-purple-500 absolute -top-1 -right-1" />
            </div>
          </div>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Astrot</h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Твоя персональная натальная карта с ИИ-интерпретацией
          </p>
        </div>

        {/* User Welcome */}
        {telegramUser && (
          <Card className="mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                {telegramUser.photo_url && (
                  <img
                    src={telegramUser.photo_url || "/placeholder.svg"}
                    alt="Profile"
                    className="w-12 h-12 rounded-full border-2 border-white/20"
                  />
                )}
                <div>
                  <h2 className="text-xl font-semibold">Привет, {telegramUser.first_name}! 👋</h2>
                  <p className="text-indigo-100">Готов узнать, что говорят о тебе звезды?</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Features */}
        <div className="space-y-4 mb-8">
          <Link href="/dashboard">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-indigo-200">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Sun className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Мои натальные карты</CardTitle>
                    <CardDescription>Персональный анализ с ИИ-интерпретацией</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/chart/create">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-purple-200">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Sparkles className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Создать новую карту</CardTitle>
                    <CardDescription>Рассчитать натальную карту для себя или друзей</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/compatibility">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-emerald-200">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Users className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Совместимость</CardTitle>
                    <CardDescription>Анализ отношений по звездам</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/horoscope">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-amber-200">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Ежедневный гороскоп</CardTitle>
                    <CardDescription>Персональные прогнозы каждый день</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="text-center p-4">
            <div className="text-2xl mb-2">
              <Brain className="h-8 w-8 mx-auto text-indigo-600" />
            </div>
            <h3 className="font-semibold text-sm mb-1">ИИ-анализ</h3>
            <p className="text-xs text-gray-600">Персональные интерпретации</p>
          </Card>

          <Card className="text-center p-4">
            <div className="text-2xl mb-2">
              <Zap className="h-8 w-8 mx-auto text-purple-600" />
            </div>
            <h3 className="font-semibold text-sm mb-1">Точные расчеты</h3>
            <p className="text-xs text-gray-600">Swiss Ephemeris</p>
          </Card>

          <Card className="text-center p-4">
            <div className="text-2xl mb-2">
              <Heart className="h-8 w-8 mx-auto text-pink-600" />
            </div>
            <h3 className="font-semibold text-sm mb-1">Дружелюбно</h3>
            <p className="text-xs text-gray-600">Понятный язык</p>
          </Card>

          <Card className="text-center p-4">
            <div className="text-2xl mb-2">
              <Moon className="h-8 w-8 mx-auto text-indigo-600" />
            </div>
            <h3 className="font-semibold text-sm mb-1">Современно</h3>
            <p className="text-xs text-gray-600">Красивый интерфейс</p>
          </Card>
        </div>
      </div>
    )
  }

  // Landing page for non-authenticated users
  return (
    <div className="min-h-screen p-4 pb-20">
      {/* Hero Section */}
      <div className="text-center mb-12 pt-8">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <Sparkles className="h-16 w-16 text-indigo-600" />
            <Star className="h-8 w-8 text-purple-500 absolute -top-2 -right-2" />
          </div>
        </div>
        <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">Astrot</h1>
        <p className="text-xl text-gray-600 max-w-lg mx-auto mb-8">
          Современное приложение для создания персональных натальных карт с ИИ-интерпретацией
        </p>

        <div className="space-y-4">
          <Link href="/auth/sign-up">
            <Button
              size="lg"
              className="w-full max-w-md bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 text-lg"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Начать путешествие
            </Button>
          </Link>

          <Link href="/auth/login">
            <Button variant="outline" size="lg" className="w-full max-w-md bg-transparent">
              Уже есть аккаунт? Войти
            </Button>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card className="text-center p-6">
          <Brain className="h-12 w-12 mx-auto text-indigo-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">ИИ-интерпретации</h3>
          <p className="text-gray-600">Персональные объяснения твоей натальной карты понятным языком</p>
        </Card>

        <Card className="text-center p-6">
          <Zap className="h-12 w-12 mx-auto text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Точные расчеты</h3>
          <p className="text-gray-600">Используем Swiss Ephemeris для максимальной точности</p>
        </Card>

        <Card className="text-center p-6">
          <Heart className="h-12 w-12 mx-auto text-pink-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Дружелюбный подход</h3>
          <p className="text-gray-600">Никакого сложного жаргона - только понятные объяснения</p>
        </Card>

        <Card className="text-center p-6">
          <Users className="h-12 w-12 mx-auto text-emerald-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Совместимость</h3>
          <p className="text-gray-600">Анализ отношений и совместимости с друзьями</p>
        </Card>
      </div>
    </div>
  )
}
