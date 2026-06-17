"use client";

import { useState } from "react";
import { Link, useTransitionRouter } from "next-view-transitions";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMeQuery, useRegisterMutation } from "@/gql";
import { PasswordInput } from "./password-input";
import { PasswordStrengthMeter } from "./password-strength-meter";
import { GoogleButton } from "./google-button";
import { Field, AuthDivider } from "./field";
import { registerSchema, type RegisterValues } from "../schemas/auth.schema";

export function RegisterForm() {
  const router = useTransitionRouter();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const password = useWatch({ control, name: "password" }) ?? "";

  const registerMutation = useRegisterMutation({
    onSuccess: async () => {
      // Precargamos `me` antes de navegar para evitar el spinner del guard.
      try {
        await queryClient.fetchQuery({
          queryKey: useMeQuery.getKey(),
          queryFn: useMeQuery.fetcher(),
        });
      } catch {
        // El AuthGuard se encarga si algo falla.
      }
      router.push("/dashboard");
    },
    onError: () => {
      setServerError("No se pudo crear la cuenta. ¿El correo ya está registrado?");
    },
  });

  const onSubmit = handleSubmit((values) => {
    setServerError(null);
    registerMutation.mutate({
      input: { name: values.name, email: values.email, password: values.password },
    });
  });

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-[26px] font-extrabold tracking-tight">Crear cuenta</h1>
        <p className="mt-1.5 text-sm text-muted">
          Empieza a ordenar tus finanzas en minutos.
        </p>
      </header>

      <div className="flex flex-col gap-5">
        <GoogleButton label="Registrarme con Google" />
        <AuthDivider label="o con tu correo" />

        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          {serverError && (
            <p className="rounded-xl border border-negative/20 bg-negative/10 px-3.5 py-2.5 text-[13px] font-medium text-negative">
              {serverError}
            </p>
          )}

          <Field label="Nombre completo" htmlFor="name" error={errors.name?.message}>
            <Input
              id="name"
              autoComplete="name"
              placeholder="Diego Rivas"
              {...register("name")}
            />
          </Field>

          <Field label="Correo electrónico" htmlFor="email" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="tucorreo@ejemplo.com"
              {...register("email")}
            />
          </Field>

          <Field label="Contraseña" htmlFor="password" error={errors.password?.message}>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              {...register("password")}
            />
            <PasswordStrengthMeter password={password} />
          </Field>

          <Field
            label="Confirmar contraseña"
            htmlFor="confirmPassword"
            error={errors.confirmPassword?.message}
          >
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              placeholder="Repite tu contraseña"
              {...register("confirmPassword")}
            />
          </Field>

          <Button
            type="submit"
            size="lg"
            className="mt-1 w-full"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? "Creando cuenta…" : "Crear cuenta"}
          </Button>
        </form>
      </div>

      <p className="mt-8 text-center text-sm text-muted">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-semibold text-ink hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
