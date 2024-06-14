"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"

interface EnrollMFAFormProps {
  onEnrolled: () => void
  onCancelled: () => void
}

const EnrollMFAForm = () => {
  const [factorId, setFactorId] = useState('')
  const [qr, setQR] = useState<string>('') //QR code SVG
  const [verificationCode, setVerificationCode] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const enrollMFA = async () => {
    setError(null)

    ;(async () => {
      const challenge = await supabase.auth.mfa.challenge({ factorId })
  
      if (challenge.error) {
        console.error(challenge.error)
        setError(challenge.error.message)
      }
  
      if (!challenge.error) {
        const challengeId = challenge.data.id
  
        const verify = await supabase.auth.mfa.verify({
          factorId,
          challengeId,
          code: verificationCode,
        })
  
        if (verify.error) {
          console.error(verify.error)
          setError(verify.error.message)
        }
        
        if (!verify.error) {

          const user = await supabase.auth.updateUser({
            data: { hasMFA: true }
          })

          if (user.error) {
            console.error(user.error)
            setError(user.error.message)
          }
        }
  
        // onEnrolled()
      }
    })()
  }

  useEffect(() => {
    ;(async () => {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
      })

      if (error) {
        console.error(error)
        setError(error.message)
      }
      if (!error) {
        setFactorId(data.id)
        setQR(data.totp.qr_code)
      }
    })()
  }, [])

  return (
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
      <Button onClick={enrollMFA}>Verify</Button>
      </div>
    </div>
  )
}
export default EnrollMFAForm