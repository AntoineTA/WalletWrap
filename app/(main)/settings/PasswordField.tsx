"use client"

import { useState } from "react"

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
import { PasswordInput } from "@/components/ui/password-input"
import { SubmitButton } from "@/components/ui/submit-button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import EditButton from './EditButton'

import { createClient } from "@/utils/supabase/client"

const formSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
})

const PasswordField = () => {
  const [isEditing, setEditing] = useState(false)
  const [isPending, setPending] = useState(false)
  const [error, setError] = useState<{title: string, message: string} | null>(null)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: ""
    },
    mode: "onTouched"
  })

  const changePassword = async (values: z.infer<typeof formSchema>) => {
    setPending(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({
      password: values.password
    })

    setPending(false)

    if (error) {
      setError({
        title: "An error occurred.",
        message: `${error.message} (code ${error.status})`
      })
    }
    if (!error) {
      setEditing(false)
    }
  }

  return (
    <div className="flex items-start justify-between text-sm">
      <div className="p-2 flex flex-col gap-2">

        <div className="font-bold">Password</div>

        {!isEditing &&
          <div className="py-2">********</div>
        }

        {isEditing &&
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(changePassword)}
              className="flex gap-4"
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <PasswordInput
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
                // disabled={!form.formState.isValid}
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
export default PasswordField