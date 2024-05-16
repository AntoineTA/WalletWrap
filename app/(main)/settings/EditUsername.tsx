"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const EditUsername: React.FC<{ currentUsername: string }> = ({currentUsername}) => {
  const [username, setUsername] = useState(currentUsername)

  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button type="submit">Save Changes</Button>
  </div>
  )
}
export default EditUsername