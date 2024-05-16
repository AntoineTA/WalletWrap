"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import  { createClient } from "@/utils/supabase/client"
import EditButton from "./EditButton"

interface UsernameFieldProps {
  currentUsername: string | null
}

const UsernameField:React.FC<UsernameFieldProps> = ({currentUsername}) => {
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
    <div className="settings-item">
      <div className="settings-field">
        <div className="font-bold">Username</div>
        {!isEditing && 
          <div className="py-1">
            {username ? username : 'Not set'}
          </div>
        }
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
      <EditButton isEditing={isEditing} setEditing={setEditing} />
    </div>
  )
}
export default UsernameField