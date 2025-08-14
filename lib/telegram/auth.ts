import crypto from "crypto"
import type { TelegramUser } from "./types"

export function validateTelegramAuth(authData: TelegramUser, botToken: string): boolean {
  const { hash, ...data } = authData

  const dataCheckString = Object.keys(data)
    .sort()
    .map((key) => `${key}=${data[key as keyof typeof data]}`)
    .join("\n")

  const secretKey = crypto.createHash("sha256").update(botToken).digest()
  const calculatedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex")

  return calculatedHash === hash
}

export function getTelegramWebAppData() {
  if (typeof window === "undefined") return null

  const initData = window.Telegram?.WebApp?.initData
  if (!initData) return null

  const urlParams = new URLSearchParams(initData)
  const user = urlParams.get("user")

  if (user) {
    return JSON.parse(decodeURIComponent(user))
  }

  return null
}
