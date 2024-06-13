"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SubmitButton } from "./SubmitButton"
import { changeUsername } from "./actions"

const EditForm = () => {
  return (
    <form action={changeUsername}>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          name="username"
        />
        <SubmitButton />
      </div>
    </form>
  )
}
export default EditForm