"use client"

import { useState } from "react"
import { useRouter } from "next/navigation";

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { SubmitButton } from "@/components/ui/submit-button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { createClient } from "@/utils/supabase/client"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
})

const SignupForm = () => {
  const [isPending, setPending] = useState(false)
  const [error, setError] = useState<{title: string, message: string} | null>(null)
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched"
  })

  // TODO: refactor to use server action once useActionState is available
  const signup = async (values: z.infer<typeof formSchema>) => {
    setPending(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp(values)

    setPending(false)

    if (error) {
      console.error(error)
      error.status === 422 ?
        setError({
          title: "Email already registered",
          message: "Please use a different email to create an account."
        }) :
        setError({
          title: "An error occurred.",
          message: `${error.message} (code ${error.status})`
        })
    }
    if (!error) {
      router.push("/verify-email")
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(signup)}
        className="grid gap-4"
        aria-label="signup form"
      >
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem >
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    className={fieldState.error && "border-destructive focus-visible:ring-destructive"}
                    placeholder="name@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
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
        </div>
        <SubmitButton 
          className="w-full"
          text={"Create an account"}
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
  )
}
export default SignupForm