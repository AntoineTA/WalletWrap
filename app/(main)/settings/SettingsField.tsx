"use client"

import { useState } from 'react'
import EditButton from './EditButton'
import TextForm from './TextForm'

interface SettingsFieldProps {
  label: string
  value: string | undefined
  editAction: (formData: FormData) => Promise<void>
}

const SettingsField:React.FC<SettingsFieldProps> = ({label, value, editAction}) => {
  const [isEditing, setEditing] = useState(false)

  return (
    <div className="flex items-start justify-between text-sm">
      <div className="p-2 flex flex-col gap-2">
        <div className="font-bold">{label}</div>
        {!isEditing &&
          <div className="py-1">{value ? value : "Not set"}</div>
        }
        {isEditing &&
          <TextForm initialValue={value} action={editAction} />
        }
      </div>
      <EditButton isEditing={isEditing} setEditing={setEditing} />
    </div>
  )
}
export default SettingsField