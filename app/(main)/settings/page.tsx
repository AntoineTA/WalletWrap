"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { createClient } from "@/utils/supabase/client";

import UsernameField from "./UsernameField";
import EmaiField from "./EmailField";
import PasswordField from "./PasswordField";
import MFAField from "./MFAField";

import type { AuthError, User } from "@supabase/supabase-js";

const Settings = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    (async () => {
      console.log("Fetching user data...");
      const supabase = createClient();

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      error ? setError(error) : setUser(user);
    })();
  }, []);

  return (
    <Card className="px-4">
      <CardHeader>
        <CardTitle className="text-lg">Profile</CardTitle>
        <CardDescription>Manage your profile settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <Separator />
        {user && (
          <div className="mt-4 flex flex-col gap-6">
            <UsernameField username={user.user_metadata.username} />
            <EmaiField email={user.email} />
            <PasswordField />
            <MFAField hasMFA={user.user_metadata.hasMFA} />
          </div>
        )}
        {error && <div>{error.message}</div>}
      </CardContent>
    </Card>
  );
};
export default Settings;
