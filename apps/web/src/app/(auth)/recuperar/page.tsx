import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export const metadata: Metadata = {
  title: "Recuperar contraseña — Nox Ledger",
};

export default function RecuperarPage() {
  return <ForgotPasswordForm />;
}
