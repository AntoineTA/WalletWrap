"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from '@/components/ui/button'

import { createClient } from '@/utils/supabase/client'

export function UnenrollMFAForm() {
  const [factorId, setFactorId] = useState('')
  const [error, setError] = useState<{title: string, message: string} | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const unenrollMFA = async () => {
    setError(null)
    const { data, error } = await supabase.auth.mfa.listFactors()

    if (error) {
      setError({
        title: "An error occurred.", 
        message: `${error.message} (code ${error.status})`
      })
    }

    if (!error) {
      const unenroll = await supabase.auth.mfa.unenroll({ 
        factorId: data.totp[0].id
       })

       if (unenroll.error) {
        setError({
          title: "An error occurred.", 
          message: `${unenroll.error.message} (code ${unenroll.error.status})`
        })
      } else {
        const user = await supabase.auth.updateUser({
          data: { hasMFA: false }
        })

        user.error ?
          setError({
            title: "An error occurred.", 
            message: `${user.error.message} (code ${user.error.status})`
          }) :
          router.push('/settings')
      }
    }
  }

  return (
    <div className="flex justify-center gap-8">
      <Button 
        onClick={() => router.push('/settings')}
        variant="secondary"
        className="w-32"
      >
        Cancel
      </Button>
      <Button 
        onClick={unenrollMFA}
        variant="destructive"
        className="w-32"
      >
        Remove 2FA
      </Button>
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
