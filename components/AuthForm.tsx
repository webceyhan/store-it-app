"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createAccount, signInUser } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import OTPModal from "./OTPModal";

type FormType = "sign-in" | "sign-up";

type Props = {
  type: FormType;
};

const getFormSchema = (isSignUp: boolean) =>
  z.object({
    email: z.string().email(),
    fullName: isSignUp ? z.string().min(2).max(50) : z.optional(z.string()),
  });

export default function AuthForm({ type }: Props) {
  // define variables
  const isSignUp = type === "sign-up";
  const formSchema = getFormSchema(isSignUp);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountId, setAccountId] = useState<string | undefined>();

  // 1. define the form schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullName: "",
    },
  });

  // 2. define submit handler
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const user = isSignUp
        ? await createAccount({
            fullName: data.fullName ?? "",
            email: data.email,
          })
        : await signInUser({
            email: data.email,
          });

      setAccountId(user?.accountId);
    } catch (error) {
      console.error("Error during authentication:", error);
      setErrorMessage("Failed to create account. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className="form-title">{isSignUp ? "Sign Up" : "Sign In"}</h1>

          {isSignUp && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="shad-form-item">
                  <FormLabel className="shad-form-label">Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>

                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="shad-form-item">
                <FormLabel className="shad-form-label">Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
                </FormControl>

                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="form-submit-button"
            disabled={isLoading}>
            {isSignUp ? "Sign Up" : "Sign In"}
            {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                alt="Loading..."
                width={24}
                height={24}
                className="ml-2 animate-spin"
              />
            )}
          </Button>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <div className="body-2 flex justify-center">
            <p className="text-light-100">
              {isSignUp
                ? "Already have an account? "
                : "Don't have an account? "}
            </p>

            <Link
              href={isSignUp ? "/sign-in" : "/sign-up"}
              className="ml-1 font-medium text-brand">
              {isSignUp ? "Sign In" : "Sign Up"}
            </Link>
          </div>
        </form>
      </Form>

      {accountId && (
        <OTPModal email={form.getValues("email")} accountId={accountId} />
      )}
    </>
  );
}
