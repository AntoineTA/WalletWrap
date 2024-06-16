"use client"

import { useState } from 'react'
import Link from 'next/link'

import { buttonVariants } from "@/components/ui/button"
import EditButton from './EditButton'

interface MFAFieldProps {
  hasMFA: boolean | undefined
}

const MFAField:React.FC<MFAFieldProps> = ({hasMFA}) => {
  const [isEditing, setEditing] = useState(false)

  return (
    <div className="text-sm flex flex-col">

      <div className="flex justify-between items-center">
        <div className="font-bold">Two-Factor Authentication</div>
        <EditButton isEditing={isEditing} setEditing={setEditing} />
      </div>

      <div className="py-2">
      {!isEditing &&
        <div>{hasMFA ? 'Active' : 'Inactive'}</div>
      }

      {isEditing && !hasMFA &&
        <Link 
          href="/mfa/enroll"
          className={buttonVariants({ variant: "default" })}
        >
          Add 2FA
        </Link>
      }
      {isEditing && hasMFA &&
        <Link 
          href="/mfa/unenroll"
          className={buttonVariants({ variant: "default" })}
        >
          Remove 2FA  
        </Link>
      }
      </div>

    </div>
  )
}
export default MFAField