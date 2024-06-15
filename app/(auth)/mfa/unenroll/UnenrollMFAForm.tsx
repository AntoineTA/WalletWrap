"use client"

import { useEffect, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createClient } from '@/utils/supabase/client'

export function UnenrollMFAForm() {
  const [factorId, setFactorId] = useState('')
  const [error, setError] = useState<{title: string, message: string} | null>(null)
  const supabase = createClient()

  useEffect(() => {
    ;(async () => {
      const { data, error } = await supabase.auth.mfa.listFactors()

      if (error) {
        setError({
          title: "An error occurred.", 
          message: `${error.message} (code ${error.status})`
        })
      }

      if (!error) {
        setFactorId(data.totp[0].id)
      }

      
    })()
  }, [])

  return (
    <div>
    {error && (
      <Alert variant="destructive" className="mt-4">
        <AlertTitle>{error.title}</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )}
    </div>
  )
}
export default UnenrollMFAForm
