"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import { createClient } from '@/utils/supabase/client'

function ChallengeMFA() {
  const [verificationCode, setVerificationCode] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleInput = async (value: string) => {
    if (value.length === 6) {
      setError('')

      const factors = await supabase.auth.mfa.listFactors()

      if (factors.error) {
        console.error(factors.error)
        setError(factors.error.message)
      }

      if (!factors.error) {
        const totpFactor = factors.data.totp[0]

        const { data, error } = await supabase.auth.mfa.challengeAndVerify({
          factorId: totpFactor.id,
          code: value,
        })

        if (error) {
          setError(error.message)
        }

        if (!error) {
          router.push('/budget')
        }
      }


    }



  }

  return (
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
  )
}
export default ChallengeMFA
