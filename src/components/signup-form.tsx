"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUp, verifyCaptcha } from "@/actions/auth";
import { signUpSchema } from "@/lib/zod-schema";

export default function SignUpForm() {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      // email: "",
      username: "",
      password: "",
      isValidCaptcha: false,
    },
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    if (form.formState.isValid) return;

    const body = new FormData();

    Object.entries(values).forEach(([key, value]) => body.append(key, value));

    const response = await signUp(body as FormData);

    if (response.error) {
      form.setError("root", { message: response.error });
    } else {
      form.reset();
    }
  }

  return (
    <main className="max-w-screen-md px-4 mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* <FormField
            control={form.control}
            name="email"
            disabled={form.formState.isSubmitting}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} name="username" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Username"
                    disabled={form.formState.isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Must be at least 2 characters long.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Password"
                    type="password"
                    disabled={form.formState.isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Must be at least 8 characters long.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isValidCaptcha"
            render={({ field }) => (
              <FormItem>
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                  onChange={async (token) =>
                    await verifyCaptcha(token)
                      .then(() => form.setValue("isValidCaptcha", true))
                      .catch(() => form.setValue("isValidCaptcha", false))
                  }
                />
                <input
                  hidden
                  type="checkbox"
                  checked={form.watch("isValidCaptcha")}
                  name={field.name}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  onChange={() => {
                    if (form.watch("isValidCaptcha")) {
                      form.setValue("isValidCaptcha", false);
                    } else {
                      form.setValue("isValidCaptcha", true);
                    }
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
            )}
            Sign in
          </Button>
        </form>
      </Form>
    </main>
  );
}
