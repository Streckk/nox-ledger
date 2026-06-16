"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "./password-input";
import { PasswordStrengthMeter } from "./password-strength-meter";
import { GoogleButton } from "./google-button";
import { Field, AuthDivider } from "./field";
import { registerSchema, type RegisterValues } from "../schemas/auth.schema";

export function RegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const password = useWatch({ control, name: "password" }) ?? "";

  // Sin backend todavía: simulamos el alta y entramos al dashboard.
  const onSubmit = handleSubmit(() => {
    router.push("/dashboard");
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

          <Button type="submit" size="lg" className="mt-1 w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creando cuenta…" : "Crear cuenta"}
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
