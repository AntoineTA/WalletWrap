"use server"

import { createClient } from "@/utils/supabase/server"

export const changeUsername = async (formData: FormData) => {
  const supabase = createClient()

  //TODO: validate input
  const username = formData.get('input')

  console.log(username)

  const { error } = await supabase.auth.updateUser({
    data: { username }
  })
}