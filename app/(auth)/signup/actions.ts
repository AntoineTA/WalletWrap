"use server"

import { revalidatePath } from "next/cache"
import { redirect } from 'next/navigation'

import { createClient } from "@/utils/supabase/server"

import formSchema from "./schemas"

// TODO: refactor using useActionState when it's available
const signup = async (formData: FormData) => {
  const validation = formSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  })

  if (!validation.success) {
    console.error('Validation error:', validation.error)
    redirect("/error")
  }

  const supabase = createClient()
  const { error } = await supabase.auth.signUp(validation.data)

  if (error) {
    console.error('Error creating user:', error)
    redirect("/error")
  }

  revalidatePath("/", "layout")
  redirect("/verify")
}
export default signup