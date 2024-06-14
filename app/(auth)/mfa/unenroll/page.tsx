"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export function UnenrollMFA() {
  const [factorId, setFactorId] = useState('')
  const [factors, setFactors] = useState<any>([])
  const [error, setError] = useState('') // holds an error message
  const supabase = createClient()

  useEffect(() => {
    ;(async () => {
      const { data, error } = await supabase.auth.mfa.listFactors()
      if (error) {
        throw error
      }

      setFactors(data.totp)
    })()
  }, [])

  return (
    <>
      {error && <div className="error">{error}</div>}
      {factors.map((f) => (
        <ul>
          <li key={f.id}>{f.id}, {f.friendly_name}, {f.type}, {f.status}</li>
        </ul>
      ))}
      <input type="text" value={factorId} onChange={(e) => setFactorId(e.target.value.trim())} />
      <button onClick={() => supabase.auth.mfa.unenroll({ factorId })}>Unenroll</button>
    </>
  )
}
export default UnenrollMFA
