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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { createClient } from "@/utils/supabase/client";

import UsernameField from "./UsernameField";
import EmaiField from "./EmailField";
import PasswordField from "./PasswordField";
import MFAField from "./MFAField";
import SkeletonFields from "./SkeletonFields";

import type { User } from "@supabase/supabase-js";
import { ErrorAlert, Error } from "@/components/ui/error-alert";

const Settings = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<{
    title: string;
    message: string;
    code?: number;
  } | null>({ title: "Error", message: "An error occurred.", code: 500 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const supabase = createClient();

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      error
        ? setError({
            title: "Could not fetch settings.",
            message: `${error.message} (code ${error.status})`,
          })
        : setUser(user);
    })();
    setLoading(false);
  }, []);

  return (
    <Card className="px-4">
      <CardHeader>
        <CardTitle className="text-lg">Profile</CardTitle>
        <CardDescription>Manage your profile settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <Separator />
        {loading && <SkeletonFields />}
        {user && (
          <div className="mt-4 flex flex-col gap-6">
            <UsernameField username={user.user_metadata.username} />
            <EmaiField email={user.email} />
            <PasswordField />
            <MFAField hasMFA={user.user_metadata.hasMFA} />
          </div>
        )}
        {error && <ErrorAlert {...error} />}
      </CardContent>
    </Card>
  );
};
export default Settings;
