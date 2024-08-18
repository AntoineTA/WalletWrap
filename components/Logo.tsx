import Link from "next/link";
import { Wallet } from "lucide-react";

const Branding = () => {
  return (
    <Link href="/" className="flex items-center">
      <Wallet className="h-8 w-8" />
      <span className="hidden text-xl font-bold ml-2 md:block">WalletWrap</span>
    </Link>
  );
};
export default Branding;
