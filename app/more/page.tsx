"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, BookOpen, Star } from "lucide-react"
import Link from "next/link"

export default function MorePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-12">
        <Link href="/">
          <Button variant="ghost" size="icon" className="text-gray-900">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Еще</h1>
        <div className="w-10" />
      </div>

      {/* Additional Features */}
      <div className="px-6 space-y-4">
        <Link href="/horoscope">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">🌙</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Гороскоп дня</h3>
                <p className="text-gray-600 text-sm">Персональные прогнозы на каждый день</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/diary">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mr-4">
                <BookOpen className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Дневник</h3>
                <p className="text-gray-600 text-sm">Записывай свои мысли и наблюдения</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/premium">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Премиум</h3>
                <p className="text-gray-600 text-sm">Расширенные возможности и анализ</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
