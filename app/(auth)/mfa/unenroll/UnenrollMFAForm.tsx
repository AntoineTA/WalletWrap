"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ErrorAlert, type Error } from "@/components/ErrorAlert";

import { createClient } from "@/utils/supabase/client";

export function UnenrollMFAForm() {
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const unenrollMFA = async () => {
    setError(null);

    try {
      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      // Get the user's MFA factors
      const { data, error: factorError } =
        await supabase.auth.mfa.listFactors();
      if (factorError) throw factorError;

      // Unenroll the user from MFA
      const { error: unenrollError } = await supabase.auth.mfa.unenroll({
        factorId: data.totp[0].id,
      });
      if (unenrollError) throw unenrollError;

      // Update the user's MFA status in settings
      const { error: settingsError } = await supabase
        .from("settings")
        .update({ has_mfa: false })
        .eq("id", user.id);
      if (settingsError) throw settingsError;

      // If all went well, redirect to success page
      router.push("/mfa/unenroll/success");
    } catch (error) {
      setError({
        title: "An unexpected error occurred",
        message: "Please try again.",
      });
    }
  };

  return (
    <div className="flex justify-center gap-8">
      <Button
        onClick={() => router.push("/settings")}
        variant="secondary"
        className="w-32"
      >
        Cancel
      </Button>
      <Button onClick={unenrollMFA} variant="destructive" className="w-32">
        Remove 2FA
      </Button>
      {error && <ErrorAlert {...error} />}
    </div>
  );
}
export default UnenrollMFAForm;
