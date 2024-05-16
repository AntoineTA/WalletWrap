"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import  { createClient } from "@/utils/supabase/client"

const UsernameField:React.FC<{ currentUsername: string | null }> = ({currentUsername}) => {
  const [isEditing, setEditing] = useState(false)
  const [username, setUsername] = useState(currentUsername)
  const [error, setError] = useState<string | null>(null)

  const saveUsername = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({
      data: { username: username }
    })

    if (error) {
      setError("An error occurred. Please try again.")
    }

    setEditing(false)
  }

  return (
    <div className="flex items-center justify-between py-5 text-sm">
      <div className="flex flex-col gap-2">
        <div className="font-bold">Username</div>
        {!isEditing && <div>{username ? username : 'Not set'}</div>}
        {isEditing && 
        <div>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              value={username || ""}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button onClick={saveUsername}>Save</Button>
          </div>
            {error && <div className="text-red-500 font-bold mt-1">{error}</div>}
        </div>
        }
      </div>
      <Button
        variant="link"
        className="text-muted-foreground hover:no-underline hover:text-foreground"
        onClick={() => setEditing(!isEditing)}
      >
        {!isEditing ? "Edit" : "Cancel"}
      </Button>
    </div>
  )
}
export default UsernameField