"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { saveBirthChart } from "@/lib/astrology/database"
import { revalidatePath } from "next/cache"

export async function createBirthChart(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to create a birth chart" }
  }

  const birthDate = formData.get("birthDate") as string
  const birthTime = formData.get("birthTime") as string
  const birthLocation = formData.get("birthLocation") as string
  const latitude = Number.parseFloat(formData.get("latitude") as string) || 0
  const longitude = Number.parseFloat(formData.get("longitude") as string) || 0
  const timezone = (formData.get("timezone") as string) || "UTC"

  if (!birthDate || !birthTime || !birthLocation) {
    return { error: "Please fill in all required fields" }
  }

  try {
    const birthData = {
      date: birthDate,
      time: birthTime,
      latitude,
      longitude,
      timezone,
    }

    await saveBirthChart(user.id, birthData)

    // Update user profile with birth info
    await supabase.from("profiles").upsert({
      id: user.id,
      birth_date: birthDate,
      birth_time: birthTime,
      birth_location: birthLocation,
      birth_latitude: latitude,
      birth_longitude: longitude,
      timezone,
      updated_at: new Date().toISOString(),
    })

    revalidatePath("/dashboard")
    redirect("/dashboard")
  } catch (error) {
    console.error("Error creating birth chart:", error)
    return { error: "Failed to create birth chart. Please try again." }
  }
}
