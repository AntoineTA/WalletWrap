import { redirect } from "next/navigation"

import { SideNav, BottomNav } from "@/components/Navigation"
import { createClient } from "@/utils/supabase/server"

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  } else {
    // check if user need to enter MFA code
    const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    
    if (error) {
      console.error(error)
    }

    if (!error) {
      if (data.nextLevel === 'aal2' && data.nextLevel !== data.currentLevel) {
        redirect("/mfa/challenge")
      }
    }

    return (
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
          <BottomNav />
        </div>
      </div>
    )
  }
}