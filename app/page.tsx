import Link from "next/link"
import { Button } from "@/components/ui/button"

import Logo from "@/components/Logo"
import AuthWidget from "@/components/AuthWidget"

const Landing = () => {
  return (
    <>
    <header className="top-0 flex h-16 items-center justify-between gap-4 border-b px-6 md:px-12">
      <Logo />
      <AuthWidget />
    </header>
    <main className="text-center">
      <div className="mt-24">
        <h1 className="text-4xl font-bold my-4">Get Your Budget under Control</h1>
        <Button asChild>
          <Link href="/signup">Get Started</Link>
        </Button>
      </div>
    </main>
    </>
  )
}
export default Landing