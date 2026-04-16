"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState(false);

  const profile = useQuery(api.users.getMyProfile);

  useEffect(() => {
    console.log("pendingRedirect", pendingRedirect);
    console.log("profile", profile);
    if (!pendingRedirect || !profile) return;
    const path = profile.role === "admin"
      ? `/admin/${profile._id}`
      : `/user/${profile._id}`;
    router.push(path);
  }, [pendingRedirect, profile, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginValues) => {
    setIsLoading(true);
    try {
      await signIn("password", {
        email: values.email.trim().toLowerCase(),
        password: values.password,
        flow: "signIn",
      });
      toast.success("Welcome back!", { description: "Redirecting to your dashboard…" });
      setPendingRedirect(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";

      if (
        msg.includes("InvalidAccountId") ||
        msg.includes("Invalid credentials") ||
        msg.includes("Account not found")
      ) {
        toast.error("Sign in failed", {
          description: "Email or password is incorrect. Please try again.",
        });
      } else if (msg.includes("suspended") || msg.includes("inactive")) {
        toast.error("Account unavailable", {
          description: "Your account has been suspended. Contact your administrator.",
        });
      } else {
        toast.error("Sign in failed", {
          description: "Something went wrong. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
          Welcome back
        </h1>
        <p className="text-muted-foreground text-sm">
          Sign in to your AAN organiser account.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            disabled={isLoading}
            {...register("email")}
            className={cn(
              "h-11",
              errors.email && "border-destructive focus-visible:ring-destructive/30"
            )}
          />
          {errors.email && (
            <p className="text-destructive text-xs">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:underline underline-offset-4 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isLoading}
              {...register("password")}
              className={cn(
                "h-11 pr-10",
                errors.password && "border-destructive focus-visible:ring-destructive/30"
              )}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((p) => !p)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-destructive text-xs">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full h-11 font-semibold mt-1"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Signing in…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <LogIn size={15} />
              Sign in
            </span>
          )}
        </Button>
      </form>

      {/* Help text — no register link, accounts are created by admin */}
      <p className="text-center text-xs text-muted-foreground">
        Don&apos;t have an account? Contact your administrator.
      </p>
    </motion.div>
  );
};

export default LoginForm;
