"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
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
import { signIn, signUp } from "@/actions/auth";
import { authSchema } from "@/lib/zod-schema";

export default function AuthForm({ type }: { type: "sign-in" | "sign-up" }) {
  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof authSchema>) {
    const body = new FormData();

    Object.entries(values).forEach(([key, value]) => body.append(key, value));

    const response =
      type === "sign-in"
        ? await signIn(body as FormData)
        : await signUp(body as FormData);

    if (!response.error) {
      form.setError("root", { message: response.error });
    }
  }

  return (
    <main className="max-w-screen-md px-4 mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            disabled={form.formState.isSubmitting}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} name="username" />
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
            disabled={form.formState.isSubmitting}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" type="password" {...field} />
                </FormControl>
                <FormDescription>
                  Must be at least 8 characters long.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
            )}
            {type === "sign-in" ? "Sign in" : "Sign up"}
          </Button>
        </form>
      </Form>
    </main>
  );
}
