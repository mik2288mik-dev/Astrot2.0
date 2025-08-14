import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getUserBirthChart } from "@/lib/astrology/database"
import { generateBasicInterpretation } from "@/lib/astrology/interpretations"
import BirthChartDisplay from "@/components/birth-chart-display"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Stars, Plus } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user's birth chart
  const birthChart = await getUserBirthChart(user.id)

  if (!birthChart) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="bg-white/95 backdrop-blur-md border-gray-200">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Stars className="h-16 w-16 text-indigo-600" />
              </div>
              <CardTitle className="text-3xl font-serif font-bold text-gray-900">Добро пожаловать в Astrot</CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                Твой персональный астрологический помощник
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-700 leading-relaxed text-center">
                Готов открыть свой космический план? Создай персональную натальную карту, чтобы узнать больше о своей
                личности, отношениях и жизненном пути.
              </p>
              <Link href="/chart/create">
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-6 text-lg font-medium rounded-lg h-[60px]">
                  <Plus className="mr-2 h-5 w-5" />
                  Создать мою натальную карту
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Generate interpretation
  const interpretation = generateBasicInterpretation(birthChart)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Твоя натальная карта</h1>
          <p className="text-gray-600 text-lg">
            Рожден {new Date(birthChart.birthData.date).toLocaleDateString("ru-RU")} в {birthChart.birthData.time}
          </p>
        </div>

        <BirthChartDisplay chart={birthChart} userName={user.email?.split("@")[0] || "Друг"} />
      </div>
    </div>
  )
}
