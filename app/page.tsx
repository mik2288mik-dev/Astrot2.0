"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Heart, Settings, MoreHorizontal } from "lucide-react"
import { getTelegramWebAppData } from "@/lib/telegram/auth"
import { createClient } from "@/lib/supabase/client"
import type { TelegramWebAppUser } from "@/lib/telegram/types"
import Link from "next/link"
import Image from "next/image"

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
      window.Telegram.WebApp.setBackgroundColor("#f8d7da")
      window.Telegram.WebApp.setHeaderColor("#f8d7da")

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
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 pb-20">
      {/* Header with Logo */}
      <div className="text-center pt-12 pb-8 px-6">
        <div className="flex items-center justify-center mb-8">
          <div className="relative w-32 h-32 bg-white/20 rounded-full p-4 backdrop-blur-sm shadow-lg">
            <Image src="/logo.png" alt="Astrot Logo" width={96} height={96} className="w-full h-full object-contain" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Твоя личная астрология</h1>
        <p className="text-gray-700 text-lg leading-relaxed max-w-md mx-auto font-medium">
          Премиальный доступ к натальной карте, точным прогнозам и ежедневным инсайтам. Космос — в одном касании.
        </p>
      </div>

      {/* Main Action Buttons */}
      <div className="px-6 space-y-4 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <Link href="/chart/create">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 h-28 hover:scale-105">
              <CardContent className="flex flex-col items-center justify-center h-full p-4">
                <Sparkles className="h-8 w-8 text-purple-600 mb-3" />
                <span className="text-base font-semibold text-gray-900 text-center">Натальная карта</span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/horoscope">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 h-28 hover:scale-105">
              <CardContent className="flex flex-col items-center justify-center h-full p-4">
                <div className="w-8 h-8 mb-3 flex items-center justify-center">
                  <span className="text-2xl">🌙</span>
                </div>
                <span className="text-base font-semibold text-gray-900 text-center">Гороскоп дня</span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/compatibility">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 h-28 hover:scale-105">
              <CardContent className="flex flex-col items-center justify-center h-full p-4">
                <Heart className="h-8 w-8 text-pink-500 mb-3" />
                <span className="text-base font-semibold text-gray-900 text-center">Совместимость</span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/diary">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 h-28 hover:scale-105">
              <CardContent className="flex flex-col items-center justify-center h-full p-4">
                <div className="w-8 h-8 mb-3 flex items-center justify-center">
                  <span className="text-2xl">📖</span>
                </div>
                <span className="text-base font-semibold text-gray-900 text-center">Дневник</span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Daily Advice Card */}
      <div className="px-6 mb-8">
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Совет дня</h3>
            <p className="text-gray-700 text-base leading-relaxed mb-4">
              Слушай интуицию и действуй мягко: сегодня звездная погода благоволит вдумчивым шагам и искренним
              намерениям.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Full Chart Button */}
      <div className="px-6 mb-8">
        <Link href="/dashboard">
          <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-5 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
            Открыть полную карту
          </Button>
        </Link>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200/50 shadow-lg">
        <div className="flex items-center justify-around py-3 px-4">
          <Link href="/chart/create" className="flex flex-col items-center py-2 px-4">
            <Sparkles className="h-7 w-7 text-purple-600" />
            <span className="text-xs text-gray-900 mt-1 font-medium">Карта</span>
          </Link>

          <Link href="/compatibility" className="flex flex-col items-center py-2 px-4">
            <Heart className="h-7 w-7 text-pink-500" />
            <span className="text-xs text-gray-600 mt-1 font-medium">Совместимость</span>
          </Link>

          <Link href="/more" className="flex flex-col items-center py-2 px-4">
            <MoreHorizontal className="h-7 w-7 text-gray-600" />
            <span className="text-xs text-gray-600 mt-1 font-medium">Еще</span>
          </Link>

          <Link href="/settings" className="flex flex-col items-center py-2 px-4">
            <Settings className="h-7 w-7 text-gray-600" />
            <span className="text-xs text-gray-600 mt-1 font-medium">Настройки</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
