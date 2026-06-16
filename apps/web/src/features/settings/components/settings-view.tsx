"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { CurrencyCode } from "@/types/finance";
import { currentUser } from "@/mocks/financial-dashboard.mock";
import { ProfileSummaryCard } from "./profile-summary-card";
import { SettingsSection } from "./settings-section";
import { ThemeSegment } from "./theme-segment";
import { SecuritySection } from "./security-section";
import { profileSchema, type ProfileValues } from "../schemas/profile.schema";
import {
  currencyOptions,
  notificationDefaults,
  type NotificationPref,
} from "../data/settings.mock";

/** Panel de administración de la cuenta del usuario. */
export function SettingsView() {
  const [saved, setSaved] = useState(false);
  const [currency, setCurrency] = useState<CurrencyCode>("MXN");
  const [notifications, setNotifications] =
    useState<NotificationPref[]>(notificationDefaults);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: currentUser.name, email: currentUser.email },
  });

  const name = useWatch({ control, name: "name" }) ?? "";
  const email = useWatch({ control, name: "email" }) ?? "";

  // Sin backend todavía: confirmamos el guardado localmente.
  const onSubmit = handleSubmit(() => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  });

  const toggleNotification = (id: string, enabled: boolean) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled } : item)),
    );
  };

  return (
    <form onSubmit={onSubmit} className="mx-auto flex max-w-[940px] flex-col gap-3.5">
      <ProfileSummaryCard name={name} email={email} saved={saved} />

      <div className="overflow-hidden rounded-2xl border border-hairline bg-surface">
        <SettingsSection
          index="01"
          title="Datos personales"
          description="El nombre y correo asociados a tu cuenta Nox Ledger."
        >
          <div className="flex flex-col gap-5">
            <label className="block">
              <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-muted">
                Nombre completo
              </span>
              <Input className="mt-2" {...register("name")} />
              {errors.name && (
                <p className="mt-1.5 text-[12px] font-medium text-negative">
                  {errors.name.message}
                </p>
              )}
            </label>
            <label className="block">
              <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-muted">
                Correo electrónico
              </span>
              <Input type="email" className="mt-2" {...register("email")} />
              {errors.email && (
                <p className="mt-1.5 text-[12px] font-medium text-negative">
                  {errors.email.message}
                </p>
              )}
            </label>
          </div>
        </SettingsSection>

        <SettingsSection
          index="02"
          title="Preferencias"
          description="Apariencia, moneda y los avisos que quieres recibir."
        >
          <div className="flex items-center justify-between gap-4 border-b border-hairline pb-5">
            <span className="text-sm font-semibold">Tema</span>
            <ThemeSegment />
          </div>

          <div className="flex items-center justify-between gap-4 border-b border-hairline py-5">
            <span className="text-sm font-semibold">Moneda</span>
            <Select
              value={currency}
              onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
              className="max-w-[220px]"
            >
              {currencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <p className="mt-5 font-mono text-[10.5px] font-bold uppercase tracking-wider text-muted">
            Notificaciones
          </p>
          <div className="flex flex-col">
            {notifications.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 border-b border-hairline py-4 last:border-b-0"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="mt-0.5 text-xs text-muted">{item.description}</p>
                </div>
                <Switch
                  checked={item.enabled}
                  onCheckedChange={(enabled) => toggleNotification(item.id, enabled)}
                  aria-label={item.label}
                />
              </div>
            ))}
          </div>
        </SettingsSection>

        <SecuritySection />
      </div>

      {/* Cerrar sesión */}
      <div className="flex items-center justify-between gap-4 px-2 py-2">
        <p className="font-mono text-xs text-muted">
          Sesión iniciada en este dispositivo
        </p>
        <Button type="button" variant="outline">
          Cerrar sesión
        </Button>
      </div>
    </form>
  );
}
