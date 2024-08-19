"use client";

import Link from "next/link";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { SubmitButton } from "@/components/ui/submit-button";
import { ErrorAlert, Error } from "@/components/ui/error-alert";

import { createClient } from "@/utils/supabase/client";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Please enter your password.",
  }),
});

const LoginForm = () => {
  const [isPending, setPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const login = async (values: z.infer<typeof formSchema>) => {
    setPending(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(values);

    setPending(false);

    if (error) {
      error.status === 400
        ? setError({
            title: "Invalid email or password.",
            message: "Please check your credentials and try again.",
          })
        : setError({
            title: "An error occurred.",
            message: error.message,
            code: error.status,
          });
    }
    if (!error) {
      router.push("/budget");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(login)}
        className="grid gap-4"
        aria-label="login form"
      >
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
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
        </div>
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <div className="flex items-center">
                  <FormLabel>Password</FormLabel>
                  <Link
                    href="/recover-password"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
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
        </div>
        <SubmitButton
          className="w-full"
          text={"Login"}
          disabled={!form.formState.isValid}
          isPending={isPending}
        />
      </form>
      {error && <ErrorAlert {...error} />}
    </Form>
  );
};
export default LoginForm;
