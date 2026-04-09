"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";
import { useAction } from "convex/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";

const changePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

/**
 * Full-screen overlay shown to users who are still on their default password.
 * It cannot be dismissed — the user must change their password to proceed.
 */
const ChangePasswordForm = ({ displayName }: { displayName: string }) => {
  const changePassword = useAction(api.users.changePassword);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (values: ChangePasswordValues) => {
    setIsLoading(true);
    try {
      await changePassword({ newPassword: values.newPassword });
      toast.success("Password updated", {
        description: "Your account is now secured. Welcome to your dashboard!",
      });
      // Convex reactivity will re-fetch the profile automatically.
      // The overlay will unmount once isPasswordDefault becomes false.
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error("Failed to update password", { description: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md space-y-7"
      >
        {/* Icon + heading */}
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <KeyRound size={22} className="text-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">
              Set your password
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Hi {displayName}. Your account was created with a temporary password.
              Please set a secure password before you continue.
            </p>
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-muted/50 rounded-lg px-4 py-3 space-y-1.5">
          <p className="text-xs font-medium text-foreground">Password requirements</p>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>At least 8 characters</li>
            <li>At least one uppercase letter (A–Z)</li>
            <li>At least one number (0–9)</li>
          </ul>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* New password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-medium">
              New password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNew ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={isLoading}
                {...register("newPassword")}
                className={cn(
                  "h-11 pr-10",
                  errors.newPassword &&
                    "border-destructive focus-visible:ring-destructive/30"
                )}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowNew((p) => !p)}
                aria-label={showNew ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-destructive text-xs">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirm password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={isLoading}
                {...register("confirmPassword")}
                className={cn(
                  "h-11 pr-10",
                  errors.confirmPassword &&
                    "border-destructive focus-visible:ring-destructive/30"
                )}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirm((p) => !p)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-destructive text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-11 font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Saving…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ShieldCheck size={15} />
                Set password &amp; continue
              </span>
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ChangePasswordForm;
