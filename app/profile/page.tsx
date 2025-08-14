import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Calendar, MapPin, Clock, Edit } from "lucide-react"
import Link from "next/link"

export default async function ProfilePage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Мой профиль</h1>
          <p className="text-gray-600">Управляйте своей астрологической информацией</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg" alt="Profile" />
                  <AvatarFallback className="text-2xl">
                    {profile?.full_name?.[0] || user.email?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl">{profile?.full_name || "Пользователь"}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Статус</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Активен
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Дата регистрации</span>
                <span className="text-sm">{new Date(user.created_at).toLocaleDateString("ru-RU")}</span>
              </div>
              <Link href="/settings">
                <Button variant="outline" className="w-full bg-transparent">
                  <Edit className="mr-2 h-4 w-4" />
                  Редактировать профиль
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Birth Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Информация о рождении
              </CardTitle>
              <CardDescription>Данные для расчета вашей натальной карты</CardDescription>
            </CardHeader>
            <CardContent>
              {profile?.birth_date ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Дата рождения</p>
                        <p className="font-medium">{new Date(profile.birth_date).toLocaleDateString("ru-RU")}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Время рождения</p>
                        <p className="font-medium">{profile.birth_time || "Не указано"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Место рождения</p>
                        <p className="font-medium">{profile.birth_location || "Не указано"}</p>
                      </div>
                    </div>

                    {profile.birth_latitude && profile.birth_longitude && (
                      <div className="flex items-center gap-3">
                        <div className="h-5 w-5" />
                        <div>
                          <p className="text-sm text-gray-600">Координаты</p>
                          <p className="font-medium text-xs">
                            {profile.birth_latitude.toFixed(4)}, {profile.birth_longitude.toFixed(4)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Информация о рождении не заполнена</h3>
                  <p className="text-gray-600 mb-4">Добавьте данные о рождении, чтобы создать натальную карту</p>
                  <Link href="/chart/create">
                    <Button>
                      <Calendar className="mr-2 h-4 w-4" />
                      Создать натальную карту
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Статистика</CardTitle>
            <CardDescription>Ваша активность в приложении</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">1</div>
                <div className="text-sm text-gray-600">Натальная карта</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-sm text-gray-600">Совместимости</div>
              </div>
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <div className="text-2xl font-bold text-pink-600">0</div>
                <div className="text-sm text-gray-600">Гороскопы</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">
                  {Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-sm text-gray-600">Дней с нами</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
