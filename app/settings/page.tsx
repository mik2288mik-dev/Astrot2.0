"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { User, Bell, Palette, Shield, Trash2 } from "lucide-react"

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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Настройки</h1>
          <p className="text-gray-600">Управляйте своими предпочтениями и настройками приложения</p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
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
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user?.email || ""} disabled />
                <p className="text-sm text-gray-500">Email нельзя изменить</p>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
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
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Скоро
                  </Badge>
                  <Switch
                    checked={settings.dailyHoroscope}
                    onCheckedChange={(checked) => setSettings({ ...settings, dailyHoroscope: checked })}
                    disabled
                  />
                </div>
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

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Внешний вид
              </CardTitle>
              <CardDescription>Настройте внешний вид приложения</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Темная тема</Label>
                  <p className="text-sm text-gray-500">Использовать темную тему интерфейса</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Скоро
                  </Badge>
                  <Switch
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => setSettings({ ...settings, darkMode: checked })}
                    disabled
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Приватность и безопасность
              </CardTitle>
              <CardDescription>Управление данными и безопасностью аккаунта</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Данные аккаунта</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Ваши данные хранятся безопасно и используются только для предоставления астрологических услуг.
                </p>
                <Button variant="outline" size="sm">
                  Скачать мои данные
                </Button>
              </div>

              <Separator />

              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-medium text-red-900 mb-2 flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Опасная зона
                </h4>
                <p className="text-sm text-red-700 mb-3">
                  Удаление аккаунта необратимо. Все ваши данные будут удалены.
                </p>
                <Button variant="destructive" size="sm">
                  Удалить аккаунт
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
              {saving ? "Сохранение..." : "Сохранить настройки"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
