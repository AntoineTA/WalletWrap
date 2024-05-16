"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface SettingsFieldProps {
  label: string
  value: string | null
  editAction: React.ReactNode
}

const SettingsField: React.FC<SettingsFieldProps> = ({ label, value, editAction }) => {
  const [isEditing, setEditing] = useState(false)

  return (
    <div className="flex items-center justify-between py-5 text-sm">
      <div className="flex flex-col gap-1">
        <div className="font-bold">{label}</div>
        {!isEditing && <div>{value ? value : 'Not set'}</div>}
        {isEditing && 
          <div className="bg-muted">{editAction}</div>
        }
      </div>
      <Button
        variant="link"
        className="text-muted-foreground hover:no-underline hover:text-foreground"
        onClick={() => setEditing(!isEditing)}
      >
        Edit
      </Button>
    </div>
  )
}
export default SettingsField