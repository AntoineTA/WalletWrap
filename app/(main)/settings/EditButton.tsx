"use client"

import { Button } from "@/components/ui/button"

interface EditButtonProps {
  isEditing: boolean
  setEditing: (value: boolean) => void
  }

const EditButton:React.FC<EditButtonProps> = ({isEditing, setEditing}) => {
  return (
    <Button
      variant="link"
      className="text-muted-foreground hover:no-underline hover:text-foreground"
      onClick={() => setEditing(!isEditing)}
    >
      {!isEditing ? "Edit" : "Cancel"}
    </Button>
  )
}
export default EditButton