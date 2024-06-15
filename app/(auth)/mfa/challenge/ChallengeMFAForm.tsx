"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { createClient } from '@/utils/supabase/client'

function ChallengeMFA() {
  const [verificationCode, setVerificationCode] = useState('')
  const [error, setError] = useState<{title: string, message: string} | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleInput = async (value: string) => {
    if (value.length === 6) {
      setError(null)

      const factors = await supabase.auth.mfa.listFactors()

      if (factors.error) {
        console.error(factors.error)
        setError({
          title: "An error occurred.", 
          message: `${factors.error.message} (code ${factors.error.status})`
        })
      }

      if (!factors.error) {
        const { error } = await supabase.auth.mfa.challengeAndVerify({
          factorId: factors.data.totp[0].id,
          code: value,
        })

        if (error) {
          error.status === 422 ?
            setError({
              title: "Invalid verification code.",
              message: "Please check your 6-digit code and try again."
            }) :
            setError({
              title: "An error occurred.", 
              message: `${error.message} (code ${error.status})`
            })
        }

        if (!error) {
          router.push('/budget')
        }
      }
    }
  }

  return (
    <>
    <div className="flex justify-center">
    <InputOTP 
      maxLength={6}
      onChange={(value) => handleInput(value)}
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
    </div>
    {error && (
      <Alert variant="destructive" className="mt-4">
        <AlertTitle>{error.title}</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )}
    </>
  )
}
export default ChallengeMFA
