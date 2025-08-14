"use client"

import { useState } from "react"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, MapPin, Clock, Calendar } from "lucide-react"

interface BirthDataFormProps {
  onSubmit: (formData: FormData) => Promise<any>
  initialData?: {
    birthDate?: string
    birthTime?: string
    birthLocation?: string
    latitude?: number
    longitude?: number
  }
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg font-medium rounded-lg h-[60px]"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Calculating your chart...
        </>
      ) : (
        "Create My Birth Chart"
      )}
    </Button>
  )
}

export default function BirthDataForm({ onSubmit, initialData }: BirthDataFormProps) {
  const [state, formAction] = useActionState(onSubmit, null)
  const [location, setLocation] = useState(initialData?.birthLocation || "")

  const handleLocationSearch = async () => {
    if (!location) return

    try {
      // Simple geocoding - in production, use a proper geocoding service
      const response = await fetch(
        `https://api.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`,
      )
      const data = await response.json()

      if (data.length > 0) {
        const result = data[0]
        // Update hidden fields with coordinates
        const latInput = document.getElementById("latitude") as HTMLInputElement
        const lonInput = document.getElementById("longitude") as HTMLInputElement
        if (latInput && lonInput) {
          latInput.value = result.lat
          lonInput.value = result.lon
        }
      }
    } catch (error) {
      console.error("Error geocoding location:", error)
    }
  }

  return (
    <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-white">Your Birth Information</CardTitle>
        <CardDescription className="text-purple-200">
          We need your exact birth details to create your personalized natal chart
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {state?.error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg">
              {state.error}
            </div>
          )}

          {state?.success && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-300 px-4 py-3 rounded-lg">
              {state.success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="birthDate" className="flex items-center text-purple-200">
                <Calendar className="h-4 w-4 mr-2" />
                Birth Date
              </Label>
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                required
                defaultValue={initialData?.birthDate}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthTime" className="flex items-center text-purple-200">
                <Clock className="h-4 w-4 mr-2" />
                Birth Time
              </Label>
              <Input
                id="birthTime"
                name="birthTime"
                type="time"
                required
                defaultValue={initialData?.birthTime}
                className="bg-white/10 border-white/20 text-white"
              />
              <p className="text-xs text-purple-300">Exact time is important for accurate rising sign</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthLocation" className="flex items-center text-purple-200">
              <MapPin className="h-4 w-4 mr-2" />
              Birth Location
            </Label>
            <div className="flex gap-2">
              <Input
                id="birthLocation"
                name="birthLocation"
                type="text"
                placeholder="City, Country (e.g., New York, USA)"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
              />
              <Button
                type="button"
                onClick={handleLocationSearch}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Hidden fields for coordinates */}
          <input type="hidden" id="latitude" name="latitude" defaultValue={initialData?.latitude} />
          <input type="hidden" id="longitude" name="longitude" defaultValue={initialData?.longitude} />

          <div className="space-y-2">
            <Label htmlFor="timezone" className="text-purple-200">
              Timezone (optional)
            </Label>
            <Input
              id="timezone"
              name="timezone"
              type="text"
              placeholder="e.g., America/New_York"
              className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
            />
            <p className="text-xs text-purple-300">Leave blank to auto-detect from location</p>
          </div>

          <SubmitButton />

          <div className="text-center text-sm text-purple-300">
            <p>Your birth information is kept private and secure</p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
