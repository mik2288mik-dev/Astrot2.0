"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { User, Bell, Shield, Trash2, ArrowLeft, Sparkles, Heart, Settings, MoreHorizontal } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const [settings, setSettings] = useState({
    fullName: "",
    notifications: true,
    dailyHoroscope: true,
    emailUpdates: false,
    darkMode: false,
  })

  useEffect(() => {
    const supabase = createClient()

    const loadUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser(user)

        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (profile) {
          setProfile(profile)
          setSettings({
            fullName: profile.full_name || "",
            notifications: profile.notifications ?? true,
            dailyHoroscope: profile.daily_horoscope ?? true,
            emailUpdates: profile.email_updates ?? false,
            darkMode: profile.dark_mode ?? false,
          })
        }
      }
      setLoading(false)
    }

    loadUserData()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: settings.fullName,
        notifications: settings.notifications,
        daily_horoscope: settings.dailyHoroscope,
        email_updates: settings.emailUpdates,
        dark_mode: settings.darkMode,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      toast({
        title: "Настройки сохранены",
        description: "Ваши настройки успешно обновлены",
      })
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить настройки",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 pb-20">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-12">
        <Link href="/">
          <Button variant="ghost" size="icon" className="text-gray-900">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Настройки</h1>
        <div className="w-10" />
      </div>

      <div className="px-6 space-y-4">
        {/* Profile Settings */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-purple-600" />
              Профиль
            </CardTitle>
            <CardDescription>Основная информация о вашем профиле</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Полное имя</Label>
              <Input
                id="fullName"
                value={settings.fullName}
                onChange={(e) => setSettings({ ...settings, fullName: e.target.value })}
                placeholder="Введите ваше имя"
                className="bg-white/50"
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ""} disabled className="bg-gray-100" />
              <p className="text-sm text-gray-500">Email нельзя изменить</p>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="h-5 w-5 text-pink-500" />
              Уведомления
            </CardTitle>
            <CardDescription>Настройте, какие уведомления вы хотите получать</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push-уведомления</Label>
                <p className="text-sm text-gray-500">Получать уведомления в приложении</p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Ежедневный гороскоп</Label>
                <p className="text-sm text-gray-500">Получать персональный гороскоп каждый день</p>
              </div>
              <Switch
                checked={settings.dailyHoroscope}
                onCheckedChange={(checked) => setSettings({ ...settings, dailyHoroscope: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email-рассылка</Label>
                <p className="text-sm text-gray-500">Получать новости и обновления на email</p>
              </div>
              <Switch
                checked={settings.emailUpdates}
                onCheckedChange={(checked) => setSettings({ ...settings, emailUpdates: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-green-600" />
              Приватность и безопасность
            </CardTitle>
            <CardDescription>Управление данными и безопасностью аккаунта</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Данные аккаунта</h4>
              <p className="text-sm text-gray-600 mb-3">
                Ваши данные хранятся безопасно и используются только для предоставления астрологических услуг.
              </p>
              <Button variant="outline" size="sm" className="bg-white">
                Скачать мои данные
              </Button>
            </div>

            <Separator />

            <div className="p-4 bg-red-50 rounded-lg">
              <h4 className="font-medium text-red-900 mb-2 flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Опасная зона
              </h4>
              <p className="text-sm text-red-700 mb-3">Удаление аккаунта необратимо. Все ваши данные будут удалены.</p>
              <Button variant="destructive" size="sm">
                Удалить аккаунт
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="pt-4 pb-8">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 text-lg font-semibold rounded-2xl shadow-xl"
          >
            {saving ? "Сохранение..." : "Сохранить настройки"}
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200/50 shadow-lg">
        <div className="flex items-center justify-around py-3 px-4">
          <Link href="/chart/create" className="flex flex-col items-center py-2 px-4">
            <Sparkles className="h-7 w-7 text-gray-600" />
            <span className="text-xs text-gray-600 mt-1 font-medium">Карта</span>
          </Link>

          <Link href="/compatibility" className="flex flex-col items-center py-2 px-4">
            <Heart className="h-7 w-7 text-gray-600" />
            <span className="text-xs text-gray-600 mt-1 font-medium">Совместимость</span>
          </Link>

          <Link href="/more" className="flex flex-col items-center py-2 px-4">
            <MoreHorizontal className="h-7 w-7 text-gray-600" />
            <span className="text-xs text-gray-600 mt-1 font-medium">Еще</span>
          </Link>

          <Link href="/settings" className="flex flex-col items-center py-2 px-4">
            <Settings className="h-7 w-7 text-purple-600" />
            <span className="text-xs text-gray-900 mt-1 font-medium">Настройки</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
