import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/features/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your AIMS Achievers Network account password.",
};

const ForgotPasswordPage = () => {
  return <ForgotPasswordForm />;
};

export default ForgotPasswordPage;
