"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import  { createClient } from "@/utils/supabase/client"
import EditButton from "./EditButton"

interface EmailFieldProps {
  currentEmail: string
}

const EmailField:React.FC<EmailFieldProps> = ({currentEmail}) => {
  const [isEditing, setEditing] = useState(false)
  const [email, setEmail] = useState(currentEmail)
  const [error, setError] = useState<string | null>(null)

  const saveEmail = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({
      email: email
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
        <div className="font-bold">Email</div>
        {!isEditing && 
          <div className="py-1">
            {email}
          </div>
        }
        {isEditing && 
          <div>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={saveEmail}>Save</Button>
            </div>
              {error && <div className="text-red-500 font-bold mt-1">{error}</div>}
          </div>
        }
      </div>
      <EditButton isEditing={isEditing} setEditing={setEditing} />
    </div>
  )
}
export default EmailField