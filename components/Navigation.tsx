"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { WalletCards, HandCoins, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/budget", label: "Budget", icon: WalletCards },
  { href: "/account", label: "Accounts", icon: HandCoins },
  { href: "/settings", label: "Settings", icon: Settings },
]

const SideNav = () => {
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navLinks.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            isActive(href) ? "bg-muted text-primary" : "text-muted-foreground",
            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
          )}
        >
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  )
}
export { SideNav }