"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

import { createClient } from '@/utils/supabase/client'

const EnrollMFAForm = () => {
  const [factorId, setFactorId] = useState('')
  const [qr, setQR] = useState('') //QR code SVG
  const [verificationCode, setVerificationCode] = useState('')
  const [error, setError] = useState<{title: string, message: string} | null>(null)
  const router = useRouter()

  const supabase = createClient()

  const enrollMFA = async () => {
    setError(null)

    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code: verificationCode,
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
      const user = await supabase.auth.updateUser({
        data: { hasMFA: true }
      })

      user.error ?
        setError({
          title: "An error occurred.", 
          message: `${user.error.message} (code ${user.error.status})`
        }) :
        router.push('/settings')
    }
  }

  useEffect(() => {
    ;(async () => {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
      })

      if (error) {
        setError({
          title: "An error occurred.", 
          message: `${error.message} (code ${error.status})`
        })
      }
      if (!error) {
        setFactorId(data.id)
        setQR(data.totp.qr_code)
      }
    })()
  }, [supabase])

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
          onClick={() => router.push('/settings')}
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
    {error && (
      <Alert variant="destructive" className="mt-4">
        <AlertTitle>{error.title}</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )}
    </div>
  )
}
export default EnrollMFAForm