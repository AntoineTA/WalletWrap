import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { createClient } from "@/utils/supabase/server"

import SettingsField from "./SettingsField"
import UsernameField from "./UsernameField"
import EmailField from "./EmailField"
import PasswordField from "./PasswordField"
import EditButton from "./EditButton"
import EditForm from "./EditForm"

import { changeUsername } from "./actions"

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
        {user &&
        <div className="mt-4 flex flex-col gap-6">
          <SettingsField
            label="Username"
            value={user.user_metadata.username}
            editAction={changeUsername}
          />
        </div>
        }
        {error && <div>{error.message}</div>}
      </CardContent>
    </Card>
  )
}
export default Settings