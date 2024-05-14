import Link from "next/link"

import { SideNav } from "@/components/Navigation";

export default function BudgetLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return(
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div>Side Panel Header</div>
          <SideNav />
        </div>
      </div>
      <div className="flex flex-col">
        <main>
          Main
          {children}
        </main>
        <div className="fixed bottom-0 w-full h-12 border-t bg-muted/40 flex items-center space-around md:hidden">Nav mobile</div>
      </div>
    </div>
  )
}