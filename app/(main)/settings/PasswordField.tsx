"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import  { createClient } from "@/utils/supabase/client"
import EditButton from "./EditButton"
import { PasswordInput } from "@/components/ui/password-input"

const PasswordField = () => {
  const [isEditing, setEditing] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const savePassword = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      setError("An error occurred. Please try again.")
    } else {
      setError(null)
      setEditing(false)
    }

  }

  return (
    <div className="settings-item">
      <div className="settings-field">
        <div className="font-bold">Password</div>
        {!isEditing && 
          <div className="py-1">
            ********
          </div>
        }
        {isEditing && 
          <div>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <PasswordInput 
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button onClick={savePassword}>Save</Button>
            </div>
              {error && <div className="text-red-500 font-bold mt-1">{error}</div>}
          </div>
        }
      </div>
      <EditButton isEditing={isEditing} setEditing={setEditing} />
    </div>
  )
}
export default PasswordField