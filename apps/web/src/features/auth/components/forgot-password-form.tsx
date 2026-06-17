"use client";

import { useState } from "react";
import { Link } from "next-view-transitions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "./field";
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "../schemas/auth.schema";

export function ForgotPasswordForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  // Sin backend todavía: simulamos el envío del enlace de recuperación.
  const onSubmit = handleSubmit((values) => {
    setSentTo(values.email);
  });

  if (sentTo) {
    return (
      <div>
        <span className="flex size-12 items-center justify-center rounded-2xl border border-hairline bg-elevated">
          <MailCheck className="size-6 text-ink" />
        </span>
        <h1 className="mt-5 text-[26px] font-extrabold tracking-tight">
          Revisa tu correo
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          Si <span className="font-semibold text-ink">{sentTo}</span> tiene una
          cuenta, te enviamos un enlace para restablecer tu contraseña.
        </p>
        <Link
          href="/login"
          className="mt-8 flex items-center gap-2 text-sm font-semibold text-ink hover:underline"
        >
          <ArrowLeft className="size-4" /> Volver a iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-[26px] font-extrabold tracking-tight">
          Recuperar contraseña
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Te enviaremos un enlace para restablecerla.
        </p>
      </header>

      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Field label="Correo electrónico" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="tucorreo@ejemplo.com"
            {...register("email")}
          />
        </Field>

        <Button type="submit" size="lg" className="mt-1 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Enviando…" : "Enviar enlace"}
        </Button>
      </form>

      <Link
        href="/login"
        className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-muted hover:text-ink"
      >
        <ArrowLeft className="size-4" /> Volver a iniciar sesión
      </Link>
    </div>
  );
}
