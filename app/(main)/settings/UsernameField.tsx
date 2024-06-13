"use client"

import { useState } from 'react'

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SubmitButton } from "@/components/ui/submit-button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import EditButton from './EditButton'

import { createClient } from "@/utils/supabase/client"

interface UsernameFieldProps {
  username: string | undefined
}

const formSchema = z.object({
  username: z.string()
    .max(15, {
      message: "Username must be at most 15 characters long."
    })
    .regex(/^[a-zA-Z0-9_]*$/, {
      message: "Username must contain only letters, numbers, and underscores."
    })
})

const UsernameField:React.FC<UsernameFieldProps> = ({username}) => {
  const [isEditing, setEditing] = useState(false)
  const [isPending, setPending] = useState(false)
  const [value, setValue] = useState<string | undefined>(username)
  const [error, setError] = useState<{title: string, message: string} | null>(null)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: value || ""
    },
    mode: "onChange"
  })

  const changeUsername = async (values: z.infer<typeof formSchema>) => {
    setPending(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({
      data: { username: values.username }
    })

    setPending(false)

    if (error) {
      console.error(error)
      setError({
        title: "An error occurred.",
        message: `${error.message} (code ${error.status})`
      })
    }
    if (!error) {
      setValue(values.username)
      setEditing(false)
    }
  }

  return (
    <div className="flex items-start justify-between text-sm">
      <div className="p-2 flex flex-col gap-2">

        <div className="font-bold">Username</div>

        {!isEditing &&
          <div className="py-2">{value ? value : "Not set"}</div>
        }

        {isEditing &&
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(changeUsername)}
              className="flex gap-4"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className={fieldState.error && "border-destructive focus-visible:ring-destructive"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SubmitButton
                text={"Save"}
                disabled={!form.formState.isValid}
                isPending={isPending}
              />
            </form>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>{error.title}</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}
          </Form>
        }

      </div>
      <EditButton isEditing={isEditing} setEditing={setEditing} />
    </div>
  )
}
export default UsernameField