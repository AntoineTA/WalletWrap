import Logo from "@/components/Logo"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return(
    <>
      <header className="top-0 flex h-16 items-center border-b px-8 md:px-12">
        <Logo />
      </header>
      <main className="md:mt-12">
        {children}
      </main>
    </>
  )
}