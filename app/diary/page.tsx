"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Home, Grid3X3, Heart, Sparkles } from "lucide-react"
import Link from "next/link"

export default function DiaryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 pb-20">
      <div className="px-6 pt-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Дневник</h1>

        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Скоро здесь</h3>
            <p className="text-gray-600">Ведите астрологический дневник и отслеживайте влияние планет на вашу жизнь</p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200/50">
        <div className="flex items-center justify-around py-2 px-4">
          <Link href="/" className="flex flex-col items-center py-2 px-3">
            <Home className="h-6 w-6 text-gray-600" />
            <span className="text-xs text-gray-600 mt-1">Главная</span>
          </Link>

          <Link href="/chart/create" className="flex flex-col items-center py-2 px-3">
            <Grid3X3 className="h-6 w-6 text-gray-600" />
            <span className="text-xs text-gray-600 mt-1">Карта</span>
          </Link>

          <Link href="/premium" className="flex flex-col items-center py-2 px-3">
            <Sparkles className="h-6 w-6 text-gray-600" />
            <span className="text-xs text-gray-600 mt-1">Премиум</span>
          </Link>

          <Link href="/compatibility" className="flex flex-col items-center py-2 px-3">
            <Heart className="h-6 w-6 text-gray-600" />
            <span className="text-xs text-gray-600 mt-1">Совместимость</span>
          </Link>

          <Link href="/diary" className="flex flex-col items-center py-2 px-3">
            <BookOpen className="h-6 w-6 text-gray-900" />
            <span className="text-xs text-gray-900 mt-1">Дневник</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
