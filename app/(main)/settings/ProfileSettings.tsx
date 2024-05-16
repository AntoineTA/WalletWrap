"use client"

import { useCallback, useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import type { User } from "@supabase/supabase-js"

import SettingsField from "./SettingsField"
import UsernameField from "./UsernameField"

const ProfileSettings = ({user}: {user: User}) => {
  const supabase = createClient()
  const [username, setUsername] = useState<string | null>(null)

  const getProfile = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single()

      if (error) {
        throw error
      }

      if (data) {
        setUsername(data.username)
      }

    } catch (error) {
      console.error("Error fetching profile", error)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  return (
    <>
      <UsernameField currentUsername={username} />
      <SettingsField
        label="Email"
        value={user.email || null}
        editAction={"Hello"}
      />
      <SettingsField
        label="Password"
        value="**********"
        editAction={"Hello"}
      />
    </>
  )
}
export default ProfileSettings