import Link from "next/link"

import { Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"

import { createClient } from "@/utils/supabase/server"

const Header = async () => {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getSession()

  return (
    <header className="top-0 flex h-16 items-center justify-between gap-4 border-b bg-background px-8 md:px-12">
      <Link href="/" className="flex items-center">
        <Wallet className="h-6 w-6" />
        <span className="text-lg font-bold ml-2">WalletWrap</span>
      </Link>
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Signup</Link>
        </Button>
      </div>
    </header>
  )
}
export default Header