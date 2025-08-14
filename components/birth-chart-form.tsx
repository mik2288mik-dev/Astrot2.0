"use client"

import { useState } from "react"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Plus } from "lucide-react"

interface BirthChartFormProps {
  onSubmit: (formData: FormData) => Promise<any>
  userName: string
}

function SubmitButton({ isBasic }: { isBasic: boolean }) {
  const { pending } = useFormStatus()

  return (
    <div className="space-y-3">
      <Button
        type="submit"
        name="chartType"
        value="basic"
        disabled={pending}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 text-lg font-medium rounded-xl h-[56px]"
      >
        {pending && isBasic ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Создаем карту...
          </>
        ) : (
          "Базовая карта"
        )}
      </Button>

      <Button
        type="submit"
        name="chartType"
        value="premium"
        disabled={pending}
        variant="outline"
        className="w-full bg-purple-200/50 hover:bg-purple-200/70 text-gray-900 border-purple-300 py-4 text-lg font-medium rounded-xl h-[56px]"
      >
        {pending && !isBasic ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Создаем анализ...
          </>
        ) : (
          "Полный анализ (Premium)"
        )}
      </Button>
    </div>
  )
}

export default function BirthChartForm({ onSubmit, userName }: BirthChartFormProps) {
  const [state, formAction] = useActionState(onSubmit, null)
  const [name, setName] = useState(userName)
  const [birthDate, setBirthDate] = useState("")
  const [hours, setHours] = useState("")
  const [minutes, setMinutes] = useState("")
  const [location, setLocation] = useState("")

  return (
    <div className="max-w-md mx-auto">
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">Натальная карта</CardTitle>
          <p className="text-gray-600 text-sm leading-relaxed">
            Бесплатно — базовые расчёты.
            <br />
            Премиум — дневной гороскоп и расшифровка ИИ.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form action={formAction} className="space-y-6">
            {state?.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-600 text-sm">
                Имя
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-50 border-0 rounded-xl py-4 text-lg font-medium text-gray-900 placeholder:text-gray-400"
                placeholder="Ваше имя"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-3 space-y-2">
                <Label htmlFor="birthDate" className="text-gray-600 text-sm">
                  Дата рождения
                </Label>
                <Input
                  id="birthDate"
                  name="birthDate"
                  type="text"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="bg-gray-50 border-0 rounded-xl py-4 text-lg font-medium text-gray-900 placeholder:text-gray-400"
                  placeholder="12345464787"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hours" className="text-gray-600 text-sm">
                  Часы
                </Label>
                <Input
                  id="hours"
                  name="hours"
                  type="text"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="bg-gray-50 border-0 rounded-xl py-4 text-lg font-medium text-gray-900 placeholder:text-gray-400"
                  placeholder="17272"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minutes" className="text-gray-600 text-sm">
                  Минуты
                </Label>
                <Input
                  id="minutes"
                  name="minutes"
                  type="text"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  className="bg-gray-50 border-0 rounded-xl py-4 text-lg font-medium text-gray-900 placeholder:text-gray-400"
                  placeholder="3737"
                />
              </div>

              <div className="flex items-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-[56px] w-[56px] rounded-xl bg-gray-50 hover:bg-gray-100"
                >
                  <Plus className="h-5 w-5 text-gray-600" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-600 text-sm">
                Место рождения
              </Label>
              <Input
                id="location"
                name="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-gray-50 border-0 rounded-xl py-4 text-lg font-medium text-gray-900 placeholder:text-gray-400"
                placeholder="Город, страна"
              />
            </div>

            <SubmitButton isBasic={true} />
          </form>
        </CardContent>
      </Card>

      {/* Нижняя навигация */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200/50 px-4 py-2">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button className="flex flex-col items-center py-2 px-3">
            <div className="w-6 h-6 mb-1">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-gray-600">
                <path
                  d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>

          <button className="flex flex-col items-center py-2 px-3">
            <div className="w-6 h-6 mb-1">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-gray-900">
                <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          </button>

          <button className="flex flex-col items-center py-2 px-3">
            <div className="w-6 h-6 mb-1">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-gray-600">
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>

          <button className="flex flex-col items-center py-2 px-3">
            <div className="w-6 h-6 mb-1">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-gray-600">
                <path
                  d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          </button>
        </div>

        {/* Индикатор домашней кнопки */}
        <div className="flex justify-center mt-1">
          <div className="w-32 h-1 bg-gray-900 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
