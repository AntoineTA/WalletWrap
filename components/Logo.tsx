import Link from "next/link"
import { Wallet } from "lucide-react"

const Logo = () => {
  return (
    <Link href="/" className="flex items-center">
      <Wallet className="h-6 w-6" />
      <span className="text-lg font-bold ml-2">WalletWrap</span>
    </Link>
  )
}
export default Logo