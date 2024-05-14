"use client"

import { Button } from "@/components/ui/button"
import logout from "./actions"

const LogoutButton = () => {
  return (
    <Button onClick={() => {logout()}}>Logout</Button>
  )
}
export default LogoutButton