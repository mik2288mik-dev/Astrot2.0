"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Home, Star, Users, Calendar, Settings, Menu, LogOut, User } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { getTelegramWebAppData } from "@/lib/telegram/auth"
import type { TelegramWebAppUser } from "@/lib/telegram/types"

const navigation = [
  { name: "Главная", href: "/", icon: Home },
  { name: "Мои карты", href: "/dashboard", icon: Star },
  { name: "Совместимость", href: "/compatibility", icon: Users }, // enabled compatibility
  { name: "Гороскоп", href: "/horoscope", icon: Calendar }, // enabled horoscope navigation
]

export default function Navigation() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [telegramUser, setTelegramUser] = useState<TelegramWebAppUser | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Get Telegram user data
    const tgUser = getTelegramWebAppData()
    if (tgUser) {
      setTelegramUser(tgUser)
    }
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navigation.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              mobile ? "text-base" : "text-sm"
            } ${
              isActive
                ? "bg-indigo-100 text-indigo-700 font-medium"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
            onClick={() => mobile && setIsOpen(false)}
          >
            <Icon className="h-5 w-5" />
            {item.name}
          </Link>
        )
      })}
    </>
  )

  if (!user) {
    return null
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <Star className="h-8 w-8 text-indigo-600" />
                <span className="text-xl font-serif font-bold text-gray-900">Astrot</span>
              </Link>

              <div className="flex space-x-1">
                <NavItems />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={telegramUser?.photo_url || "/placeholder.svg"} alt="Profile" />
                      <AvatarFallback>
                        {telegramUser?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{telegramUser?.first_name || user?.email || "Пользователь"}</p>
                      {user?.email && <p className="w-[200px] truncate text-sm text-gray-600">{user.email}</p>}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Профиль
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Настройки
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Star className="h-7 w-7 text-indigo-600" />
            <span className="text-lg font-serif font-bold text-gray-900">Astrot</span>
          </Link>

          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={telegramUser?.photo_url || "/placeholder.svg"} alt="Profile" />
              <AvatarFallback className="text-xs">
                {telegramUser?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-3 pb-6 border-b">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={telegramUser?.photo_url || "/placeholder.svg"} alt="Profile" />
                      <AvatarFallback>
                        {telegramUser?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{telegramUser?.first_name || user?.email || "Пользователь"}</p>
                      {user?.email && <p className="text-sm text-gray-600 truncate">{user.email}</p>}
                    </div>
                  </div>

                  <div className="flex-1 py-6 space-y-2">
                    <NavItems mobile />

                    <div className="pt-4 border-t space-y-2">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-base text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="h-5 w-5" />
                        Профиль
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-base text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <Settings className="h-5 w-5" />
                        Настройки
                      </Link>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button
                      variant="ghost"
                      onClick={handleSignOut}
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="mr-2 h-5 w-5" />
                      Выйти
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navigation */}
      <div className="h-16" />
    </>
  )
}
