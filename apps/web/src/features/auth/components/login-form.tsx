"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useLoginMutation, useMeQuery } from "@/gql";
import { PasswordInput } from "./password-input";
import { GoogleButton } from "./google-button";
import { Field, AuthDivider } from "./field";
import { loginSchema, type LoginValues } from "../schemas/auth.schema";

export function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const loginMutation = useLoginMutation({
    onSuccess: async () => {
      // La sesión la marca la cookie httpOnly; refrescamos `me` y entramos.
      await queryClient.invalidateQueries({ queryKey: useMeQuery.getKey() });
      router.push("/dashboard");
    },
    onError: () => {
      setServerError("Correo o contraseña incorrectos.");
    },
  });

  const onSubmit = handleSubmit((values) => {
    setServerError(null);
    loginMutation.mutate({
      input: { email: values.email, password: values.password },
    });
  });

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-[26px] font-extrabold tracking-tight">
          Iniciar sesión
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Bienvenido de vuelta a Nox Ledger.
        </p>
      </header>

      <div className="flex flex-col gap-5">
        <GoogleButton label="Continuar con Google" />
        <AuthDivider label="o con tu correo" />

        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          {serverError && (
            <p className="rounded-xl border border-negative/20 bg-negative/10 px-3.5 py-2.5 text-[13px] font-medium text-negative">
              {serverError}
            </p>
          )}

          <Field label="Correo electrónico" htmlFor="email" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="tucorreo@ejemplo.com"
              {...register("email")}
            />
          </Field>

          <Field
            label="Contraseña"
            htmlFor="password"
            error={errors.password?.message}
            action={
              <Link
                href="/recuperar"
                className="text-[12px] font-semibold text-muted transition-colors hover:text-ink"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            }
          >
            <PasswordInput
              id="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...register("password")}
            />
          </Field>

          <Checkbox label="Recordarme" {...register("rememberMe")} />

          <Button
            type="submit"
            size="lg"
            className="mt-1 w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Entrando…" : "Entrar"}
          </Button>
        </form>
      </div>

      <p className="mt-8 text-center text-sm text-muted">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="font-semibold text-ink hover:underline">
          Crear cuenta
        </Link>
      </p>
    </div>
  );
}
