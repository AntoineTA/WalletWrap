"use client";

import { useState } from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ErrorAlert, Error } from "@/components/ui/error-alert";

import { createClient } from "@/utils/supabase/client";

function ChallengeMFA() {
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  const handleInput = async (value: string) => {
    if (value.length === 6) {
      setError(null);

      const factors = await supabase.auth.mfa.listFactors();

      if (factors.error) {
        setError({
          title: "An error occurred.",
          message: factors.error.message,
          code: factors.error.status,
        });
      }

      if (!factors.error) {
        const challenge = await supabase.auth.mfa.challengeAndVerify({
          factorId: factors.data.totp[0].id,
          code: value,
        });

        if (challenge.error) {
          challenge.error.status === 422
            ? setError({
                title: "Invalid verification code.",
                message: "Please check your 6-digit code and try again.",
              })
            : setError({
                title: "An error occurred.",
                message: challenge.error.message,
                code: challenge.error.status,
              });
        }

        if (!challenge.error) {
          window.location.href = "/budget";
        }
      }
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <InputOTP maxLength={6} onChange={(value) => handleInput(value)}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      {error && <ErrorAlert {...error} />}
    </>
  );
}
export default ChallengeMFA;
