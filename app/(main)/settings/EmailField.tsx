"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

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

interface EmailFieldProps {
  email: string | undefined
}

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

const EmailField:React.FC<EmailFieldProps> = ({email}) => {
  const [isEditing, setEditing] = useState(false)
  const [isPending, setPending] = useState(false)
  const [error, setError] = useState<{title: string, message: string} | null>(null)
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email || ""
    },
    mode: "onTouched"
  })

  const changeEmail = async (values: z.infer<typeof formSchema>) => {
    setPending(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({
      email: values.email
    })

    setPending(false)

    if (error) {
      console.error(error)
      error.status === 422 ?
        setError({
          title: "Email already registered",
          message: "An account with this email already exists."
        }) :
        setError({
          title: "An error occurred.",
          message: `${error.message} (code ${error.status})`
        })
    }
    if (!error) {
      router.push("/settings/verify-email")
    }
  }

  return (
    <div className="flex items-start justify-between text-sm">
      <div className="p-2 flex flex-col gap-2">

        <div className="font-bold">Email</div>

        {!isEditing &&
          <div className="py-2">{email ? email : "Not set"}</div>
        }

        {isEditing &&
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(changeEmail)}
              className="flex gap-4"
            >
              <FormField
                control={form.control}
                name="email"
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
export default EmailField