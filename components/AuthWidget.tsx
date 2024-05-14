import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/server"

const AuthWidget = async () => {
  const supabase = createClient()
  const { data } = await supabase.auth.getSession()

  if (data.session?.user) {
    return (
      <Button asChild>
        <Link href="/budget">My Budget</Link>
      </Button>
    )
  } else {
    return (
      <div className="flex gap-4">
        <Button variant="outline" asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Signup</Link>
        </Button>
      </div>
    )
  }
}
export default AuthWidget