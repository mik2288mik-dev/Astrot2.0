"use client"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import BirthDataForm from "@/components/birth-data-form"
import { createBirthChart } from "@/lib/actions/chart-actions"

export default async function CreateChartPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10">
        <BirthDataForm onSubmit={createBirthChart} />
      </div>
    </div>
  )
}
