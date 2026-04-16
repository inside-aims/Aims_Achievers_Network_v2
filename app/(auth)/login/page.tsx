import type { Metadata } from "next";
import LoginForm from "@/components/features/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your AIMS Achievers Network account.",
};

const LoginPage = () => {
  return <LoginForm />;
};

export default LoginPage;
