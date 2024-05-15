import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import SettingsField from "./SettingsField"

const Settings = () => {
  return (
    <Card className="px-4">
      <CardHeader>
        <CardTitle className="text-lg">Profile</CardTitle>
        <CardDescription>Manage your profile settings.</CardDescription>
      </CardHeader>
      <CardContent>
      <Separator />
      <SettingsField
        label="Username"
        value="John Doe"
        editAction={<p>Hello</p>}
      />
      </CardContent>
    </Card>
  )
}
export default Settings