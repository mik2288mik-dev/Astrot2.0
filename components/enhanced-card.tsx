"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface EnhancedCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
  gradient?: boolean
}

export default function EnhancedCard({
  children,
  className,
  hover = false,
  glow = false,
  gradient = false,
}: EnhancedCardProps) {
  return (
    <Card
      className={cn(
        "transition-all duration-300 animate-fade-in",
        hover && "hover:shadow-lg hover:-translate-y-1 cursor-pointer",
        glow && "astro-shadow",
        gradient && "cosmic-gradient text-white border-0",
        className,
      )}
    >
      {children}
    </Card>
  )
}
