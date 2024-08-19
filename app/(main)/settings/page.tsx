import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ErrorAlert, Error } from "@/components/ui/error-alert";

import { createClient } from "@/utils/supabase/server";

import UsernameField from "./UsernameField";
import EmaiField from "./EmailField";
import PasswordField from "./PasswordField";
import MFAField from "./MFAField";

type Settings = {
  username: string | null;
  email?: string;
  hasMFA: boolean;
};

const getData = async (): Promise<{ data?: Settings; error?: Error }> => {
  const supabase = createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: {
        title: "User not found",
        message: "Please log in to view this page.",
      },
    };
  }

  // get the user's settings
  const { data, error } = await supabase
    .from("Settings")
    .select("username, has_mfa")
    .eq("id", user.id)
    .single();

  if (error) {
    return {
      error: {
        title: "Something went wrong",
        message: "We could not find your settings.",
      },
    };
  }

  const settings = {
    username: data.username,
    email: user.email,
    hasMFA: data.has_mfa,
  };

  return { data: settings };
};

const Settings = async () => {
  const { data, error } = await getData();

  return (
    <Card className="px-4">
      <CardHeader>
        <CardTitle className="text-lg">Profile</CardTitle>
        <CardDescription>Manage your profile settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <Separator />
        {data && (
          <div className="mt-4 flex flex-col gap-6">
            <UsernameField username={data.username} />
            <EmaiField email={data.email} />
            <PasswordField />
            <MFAField hasMFA={data.hasMFA} />
          </div>
        )}
        {error && <ErrorAlert {...error} />}
      </CardContent>
    </Card>
  );
};
export default Settings;
