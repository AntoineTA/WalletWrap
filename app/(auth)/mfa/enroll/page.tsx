"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

interface EnrollMFAProps {
  onEnrolled: () => void
  onCancelled: () => void
}

const EnrollMFA:React.FC<EnrollMFAProps> = ({onEnrolled, onCancelled}) => {
  const [factorId, setFactorId] = useState<string>('')
  const [qr, setQR] = useState<string>('') //QR code SVG
  const [verificationCode, setVerificationCode] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const onEnableClicked = async () => {
    console.log('Enabling MFA')
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
          console.log('MFA enabled')
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
    <div>
      <img src={qr} alt="QR code" />
      <input
        className='bg-gray-100'
        type="text"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value.trim())}
      />
      <input type="button" value="Enable" onClick={onEnableClicked} />
    </div>
  )
}
export default EnrollMFA