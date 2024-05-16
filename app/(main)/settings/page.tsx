import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { createClient } from "@/utils/supabase/server"

import ProfileSettings from "./ProfileSettings"

const Settings = async () => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return (
    <Card className="px-4">
      <CardHeader>
        <CardTitle className="text-lg">Profile</CardTitle>
        <CardDescription>Manage your profile settings.</CardDescription>
      </CardHeader>
      <CardContent>
      <Separator />
      {user && <ProfileSettings user={user} />}
      </CardContent>
    </Card>
  )
}
export default Settings