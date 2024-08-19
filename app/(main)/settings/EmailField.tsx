"use client";

import { useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { ErrorAlert, Error } from "@/components/ui/error-alert";
import { useToast } from "@/components/ui/use-toast";
import EditButton from "./EditButton";

import { createClient } from "@/utils/supabase/client";

interface EmailFieldProps {
  email: string | undefined;
}

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const EmailField: React.FC<EmailFieldProps> = ({ email }) => {
  const [isEditing, setEditing] = useState(false);
  const [isPending, setPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email || "",
    },
    mode: "onTouched",
  });

  const changeEmail = async (values: z.infer<typeof formSchema>) => {
    setPending(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      email: values.email,
    });

    setPending(false);

    if (error) {
      console.error(error);
      error.status === 422
        ? setError({
            title: "Email already registered",
            message: "An account with this email already exists.",
          })
        : setError({
            title: "An error occurred.",
            message: error.message,
            code: error.status,
          });
    }
    if (!error) {
      setEditing(false);
      toast({
        title: "Confirmation needed",
        description: "Please check your new email to confirm the change.",
      });
    }
  };

  return (
    <div className="text-sm flex flex-col">
      <div className="flex justify-between items-center">
        <div className="font-bold">Email</div>
        <EditButton isEditing={isEditing} setEditing={setEditing} />
      </div>

      {!isEditing && <div className="py-2">{email ? email : "Not set"}</div>}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(changeEmail)}
            className="flex flex-col md:flex-row gap-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem className="w-full md:w-80">
                  <FormControl>
                    <Input
                      data-testid="email-field"
                      className={
                        fieldState.error &&
                        "border-destructive focus-visible:ring-destructive"
                      }
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
          {error && <ErrorAlert {...error} />}
        </Form>
      )}
    </div>
  );
};
export default EmailField;
