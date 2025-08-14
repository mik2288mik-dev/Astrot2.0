"use client"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { createBirthChart } from "@/lib/actions/chart-actions"
import { getTelegramWebAppData } from "@/lib/telegram/auth"
import BirthChartForm from "@/components/birth-chart-form"

export default async function CreateChartPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Получаем данные из Telegram
  const telegramData = getTelegramWebAppData()

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-pink-300 px-4 py-6">
      <BirthChartForm
        onSubmit={createBirthChart}
        userName={telegramData?.first_name || user.user_metadata?.name || "Пользователь"}
      />
    </div>
  )
}
