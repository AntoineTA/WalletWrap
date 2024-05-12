"use server"

import { revalidatePath } from "next/cache"
import { redirect } from 'next/navigation'

import { z } from "zod"

import { createClient } from "@/utils/supabase/server"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

const signup = async (formData: FormData) => {
  const validation = formSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  })

  // Return early if the form data is invalid
  if (!validation.success) {
    return {
      errors: validation.error.flatten().fieldErrors
    }
  }

  const supabase = createClient()
  const { error } = await supabase.auth.signUp(validation.data)

  if (error) {
    console.error(error)
    return {
      error: error.message
    }
  }

  revalidatePath("/", "layout")
  redirect("/")

}
export default signup