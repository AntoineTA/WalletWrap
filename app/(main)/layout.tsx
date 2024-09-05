import { Logo } from "@/components/Logo";
import { SideNav, BottomNav } from "@/components/Navigation";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2 my-8">
          <div className=" mx-4 mb-2">
            <Logo />
          </div>
          <SideNav />
        </div>
      </div>
      <div className="flex flex-col">
        <main>{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
