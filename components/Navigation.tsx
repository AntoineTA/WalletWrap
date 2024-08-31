"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletCards, HandCoins, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/2", label: "Budget", icon: WalletCards },
  { href: "/2/accounts", label: "Accounts", icon: HandCoins },
  { href: "/settings", label: "Settings", icon: Settings },
];

const SideNav = () => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="grid items-start px-2 font-medium lg:px-4">
      {navLinks.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            isActive(href) ? "bg-muted text-primary" : "text-muted-foreground",
            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
          )}
        >
          <Icon className="w-5 h-5" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
};

const BottomNav = () => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 w-full h-16 px-4 py-1 border-t bg-muted/40 flex items-center space-around md:hidden">
      {navLinks.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            isActive(href) ? "bg-muted text-primary" : "text-muted-foreground",
            "flex flex-col items-center justify-center gap-1 w-full h-full transition-all rounded-lg",
          )}
        >
          <Icon className="w-6 h-6" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
};
export { SideNav, BottomNav };
