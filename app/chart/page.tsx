"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { getTelegramWebAppData } from "@/lib/telegram/auth"
import Link from "next/link"
import { Star, Heart, TrendingUp, Calendar, Home, User } from "lucide-react"

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
}

export default function ChartPage() {
  const [user, setUser] = useState<any>(null)
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null)
  const [hasChart, setHasChart] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Проверяем есть ли у пользователя натальная карта
        const { data: charts } = await supabase.from("birth_charts").select("id").eq("user_id", user.id).limit(1)

        setHasChart(charts && charts.length > 0)
      }
    }

    const telegramData = getTelegramWebAppData()
    if (telegramData?.user) {
      setTelegramUser(telegramData.user)
    }

    getUser()
  }, [])

  const userName = telegramUser?.first_name || user?.user_metadata?.first_name || "Пользователь"

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-gray-700">
        <Link href="/" className="text-gray-600">
          ✕ Закрыть
        </Link>
        <div className="text-blue-600 font-medium">TELEGRAM</div>
        <button className="text-gray-600">⋯</button>
      </div>

      <div className="px-6 pb-20">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Добро пожаловать, {userName}</h1>

          <p className="text-gray-600 leading-relaxed">
            Мини-превью натальной карты. Нажми, чтобы открыть полную версию.
          </p>
        </div>

        {/* Chart Preview */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-8">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
              <Star className="w-16 h-16 text-purple-600" />
            </div>

            <h3 className="text-lg font-medium text-gray-600 mb-6">Превью вашей карты</h3>

            <Link href="/chart/create">
              <Button className="px-8 py-3 bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-500 hover:to-blue-500 text-white font-medium rounded-2xl shadow-lg">
                Подробнее
              </Button>
            </Link>
          </div>
        </Card>

        {/* What You'll Learn */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Что узнаешь</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-start p-4 bg-gray-50/50 rounded-xl">
              <User className="w-8 h-8 text-purple-600 mb-3" />
              <span className="font-medium text-gray-800">Личностные черты</span>
            </div>

            <div className="flex flex-col items-start p-4 bg-gray-50/50 rounded-xl">
              <TrendingUp className="w-8 h-8 text-blue-600 mb-3" />
              <span className="font-medium text-gray-800">Сильные стороны</span>
            </div>

            <div className="flex flex-col items-start p-4 bg-gray-50/50 rounded-xl">
              <Heart className="w-8 h-8 text-pink-600 mb-3" />
              <span className="font-medium text-gray-800">Совместимость</span>
            </div>

            <div className="flex flex-col items-start p-4 bg-gray-50/50 rounded-xl">
              <Calendar className="w-8 h-8 text-green-600 mb-3" />
              <span className="font-medium text-gray-800">Транзиты</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200">
        <div className="flex justify-around py-3">
          <Link href="/" className="flex flex-col items-center py-2 px-4">
            <Home className="w-6 h-6 text-gray-600 mb-1" />
            <span className="text-xs text-gray-600">Главная</span>
          </Link>

          <Link href="/chart" className="flex flex-col items-center py-2 px-4">
            <div className="w-6 h-6 bg-gray-800 rounded mb-1 flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
            <span className="text-xs text-gray-800 font-medium">Карта</span>
          </Link>

          <Link href="/premium" className="flex flex-col items-center py-2 px-4">
            <Heart className="w-6 h-6 text-gray-600 mb-1" />
            <span className="text-xs text-gray-600">Премиум</span>
          </Link>

          <Link href="/profile" className="flex flex-col items-center py-2 px-4">
            <User className="w-6 h-6 text-gray-600 mb-1" />
            <span className="text-xs text-gray-600">Профиль</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
