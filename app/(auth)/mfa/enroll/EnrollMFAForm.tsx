"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ErrorAlert, type Error } from "@/components/ErrorAlert";
import { Button } from "@/components/ui/button";

import { createClient } from "@/utils/supabase/client";

class invalidCodeError extends Error {}

const EnrollMFAForm = () => {
  const [factorId, setFactorId] = useState("");
  const [qr, setQR] = useState(""); //QR code SVG
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  const supabase = createClient();

  const enrollMFA = async () => {
    setError(null);

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      // Challenge and verify the MFA
      const { error: challengeError } =
        await supabase.auth.mfa.challengeAndVerify({
          factorId,
          code: verificationCode,
        });
      if (challengeError && challengeError.status === 422)
        throw new invalidCodeError(challengeError.message);
      if (challengeError) throw challengeError;

      // Update the user's MFA status in settings
      const { error: settingsError } = await supabase
        .from("settings")
        .update({ has_mfa: true })
        .eq("id", user.id);
      if (settingsError) throw settingsError;

      // If all went well, redirect to success page
      router.push("/mfa/enroll/success");
    } catch (error) {
      error instanceof invalidCodeError
        ? setError({
            title: "Invalid code",
            message: "Please check your 6 digits code and try again.",
          })
        : setError({
            title: "An unexpected error occurred.",
            message: "Please try again.",
          });
    }
  };

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
      });

      if (error) {
        setError({
          title: "An error occurred.",
          message: error.message,
          code: error.status,
        });
      }
      if (!error) {
        setFactorId(data.id);
        setQR(data.totp.qr_code);
      }
    })();
  }, [supabase]);

  return (
    <div>
      <div className="flex gap-4 justify-center">
        <img src={qr} alt="QR code" />
        <div className="flex flex-col justify-center gap-6">
          <InputOTP
            maxLength={6}
            value={verificationCode}
            onChange={(value) => setVerificationCode(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <div className="flex justify-center space-around gap-4">
            <Button
              onClick={() => router.push("/settings")}
              variant="secondary"
              className="w-1/2"
            >
              Cancel
            </Button>
            <Button
              onClick={enrollMFA}
              disabled={verificationCode.length !== 6}
              className="w-1/2"
            >
              Add 2FA
            </Button>
          </div>
        </div>
      </div>
      {error && <ErrorAlert {...error} />}
    </div>
  );
};
export default EnrollMFAForm;
