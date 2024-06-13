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
import { useToast } from "@/components/ui/use-toast"

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
  const { toast } = useToast()

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
      toast({
        title: "Success!",
        description: "Your username has been updated successfully.",
      })
    }
  }

  return (
    <div className="text-sm flex flex-col">

      <div className="flex justify-between items-center">
        <div className="font-bold">Username</div>
        <EditButton isEditing={isEditing} setEditing={setEditing} />
      </div>

      {!isEditing &&
        <div  className="py-2">{value ? value : "Not set"}</div>
      }

      {isEditing &&
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(changeUsername)}
            className="flex flex-col md:flex-row gap-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field, fieldState }) => (
                <FormItem className="w-full md:w-80"> 
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
              className="w-full"
              text={"Save Changes"}
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
  )
}
export default UsernameField