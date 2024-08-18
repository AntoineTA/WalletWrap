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
import { PasswordInput } from "@/components/ui/password-input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

import EditButton from "./EditButton";

import { createClient } from "@/utils/supabase/client";

const formSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
});

const PasswordField = () => {
  const [isEditing, setEditing] = useState(false);
  const [isPending, setPending] = useState(false);
  const [error, setError] = useState<{ title: string; message: string } | null>(
    null,
  );
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
    mode: "onTouched",
  });

  const changePassword = async (values: z.infer<typeof formSchema>) => {
    setPending(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });

    setPending(false);

    if (error) {
      setError({
        title: "An error occurred.",
        message: `${error.message} (code ${error.status})`,
      });
    }
    if (!error) {
      setEditing(false);
      toast({
        title: "Success!",
        description: "Your password has been updated successfully.",
      });
    }
  };

  return (
    <div className="text-sm flex flex-col">
      <div className="flex justify-between items-center">
        <div className="font-bold">Password</div>
        <EditButton isEditing={isEditing} setEditing={setEditing} />
      </div>

      {!isEditing && <div className="py-2">********</div>}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(changePassword)}
            className="flex flex-col md:flex-row gap-4"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <FormItem className="w-full md:w-80">
                  <FormControl>
                    <PasswordInput
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
      )}
    </div>
  );
};
export default PasswordField;
