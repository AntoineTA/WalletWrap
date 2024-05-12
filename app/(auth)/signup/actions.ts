"use server"

import { revalidatePath } from "next/cache"
import { redirect } from 'next/navigation'

import { z } from "zod"

import { createClient } from "@/utils/supabase/server"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

// TODO: refactor using useActionState when it's available
const signup = async (formData: FormData) => {
  const validation = formSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  })

  if (!validation.success) {
    redirect("/error")
  }

  const supabase = createClient()
  const { error } = await supabase.auth.signUp(validation.data)

  if (error) {
    redirect("/error")
  }

  revalidatePath("/", "layout")
  redirect("/verify")
}
export default signup