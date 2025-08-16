"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight, Home, Grid3X3, Heart, User } from "lucide-react"
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
      window.Telegram.WebApp.setBackgroundColor("#fce7f3")
      window.Telegram.WebApp.setHeaderColor("#fce7f3")

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
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-pink-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-pink-200 pb-20">
      <div className="text-center pt-12 pb-8 px-6">
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 bg-white rounded-full p-2 shadow-lg">
            <Image src="/logo.png" alt="Astrot Logo" width={64} height={64} className="w-full h-full object-contain" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Твоя личная астрология</h1>
        <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto">
          Премиальный доступ к натальной карте, точным прогнозам и ежедневным инсайтам. Космос — в одном касании.
        </p>
      </div>

      <div className="mx-4 space-y-3">
        <Link href="/chart/create">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                <Grid3X3 className="h-5 w-5 text-gray-600" />
              </div>
              <span className="text-lg font-medium text-gray-900">Натальная карта</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
        </Link>

        <Link href="/horoscope">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-lg">✨</span>
              </div>
              <span className="text-lg font-medium text-gray-900">Гороскоп дня</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
        </Link>

        <Link href="/compatibility">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                <Heart className="h-5 w-5 text-gray-600" />
              </div>
              <span className="text-lg font-medium text-gray-900">Совместимость</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
        </Link>

        <Link href="/diary">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-lg font-bold text-blue-600">?</span>
              </div>
              <span className="text-lg font-medium text-gray-900">Дневник</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
        </Link>
      </div>

      <div className="mx-4 mt-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-3">Совет дня</h3>
          <p className="text-gray-700 leading-relaxed">
            Слушай интуицию и действуй мягко: сегодня звездная погода благоволит вдумчивым шагам и искренним намерениям.
          </p>
        </div>
      </div>

      <div className="mx-4 mt-6">
        <Link href="/dashboard">
          <Button className="w-full bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white py-4 text-lg font-medium rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
            Открыть полную карту
          </Button>
        </Link>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200">
        <div className="flex items-center justify-around py-3">
          <Link href="/" className="flex flex-col items-center py-2 px-4">
            <Home className="h-6 w-6 text-gray-900 mb-1" />
            <span className="text-xs text-gray-900 font-medium">Главная</span>
          </Link>

          <Link href="/chart/create" className="flex flex-col items-center py-2 px-4">
            <Grid3X3 className="h-6 w-6 text-gray-500 mb-1" />
            <span className="text-xs text-gray-500">Карта</span>
          </Link>

          <Link href="/compatibility" className="flex flex-col items-center py-2 px-4">
            <Heart className="h-6 w-6 text-gray-500 mb-1" />
            <span className="text-xs text-gray-500">Премиум</span>
          </Link>

          <Link href="/settings" className="flex flex-col items-center py-2 px-4">
            <User className="h-6 w-6 text-gray-500 mb-1" />
            <span className="text-xs text-gray-500">Совместимость</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
