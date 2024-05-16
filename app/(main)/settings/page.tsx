import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { createClient } from "@/utils/supabase/server"
import type { User } from "@supabase/supabase-js"
import UsernameField from "./UsernameField"

interface UserProfile extends User {
  username: string | null
}

interface ProfileResult {
  user:  UserProfile | null
  error: Error | null
}

const getUserProfile = async (): Promise<ProfileResult> => {
  const supabase = createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("Could not get user data")
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (!profile) {
      throw new Error("Could not get profile data")
    }

    const username = profile.username
    return {user: { ...user, username }, error: null}

  } catch (e) {
    console.error("Error fetching profile", e) // TODO: Handle error
    return {
      user: null,
      error: new Error("An error occurred while fetching your profile. Please try again later.")
    }
  }
}

const Settings = async () => {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  return (
    <Card className="px-4">
      <CardHeader>
        <CardTitle className="text-lg">Profile</CardTitle>
        <CardDescription>Manage your profile settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <Separator />
        {user && <UsernameField currentUsername={user.user_metadata.username} />}
        {error && <div>{error.message}</div>}
      </CardContent>
    </Card>
  )
}
export default Settings