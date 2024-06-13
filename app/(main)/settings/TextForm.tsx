"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface TextFormProps {
  initialValue: string | undefined
  action: (formData: FormData) => Promise<void>
}

const TextForm:React.FC<TextFormProps> = ({initialValue, action}) => {
  const [value, setValue] = useState(initialValue)

  return (
    <div>
      <form 
        className="flex w-full max-w-sm items-center space-x-2"
        action={action}
      >
        <Input
          type="text"
          name='input'
          value={value || ""}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button>Save</Button>
      </form>
    </div>
  )
}
export default TextForm