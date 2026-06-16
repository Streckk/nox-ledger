"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SettingsSection } from "./settings-section";

export function SecuritySection() {
  const [changingPassword, setChangingPassword] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);

  return (
    <SettingsSection
      index="03"
      title="Seguridad"
      description="Mantén tu cuenta protegida con contraseña y verificación en dos pasos."
    >
      <div className="flex items-center justify-between gap-4 border-b border-hairline pb-5">
        <div>
          <p className="text-sm font-semibold">Contraseña</p>
          <p className="mt-1 font-mono text-xs tracking-widest text-muted">
            •••••••••••
          </p>
        </div>
        <Button
          variant="subtle"
          size="sm"
          onClick={() => setChangingPassword((value) => !value)}
        >
          {changingPassword ? "Cancelar" : "Cambiar"}
        </Button>
      </div>

      {changingPassword && (
        <div className="grid gap-3 border-b border-hairline py-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <label className="block">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
              Actual
            </span>
            <Input type="password" className="mt-1.5" placeholder="••••••••" />
          </label>
          <label className="block">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
              Nueva
            </span>
            <Input type="password" className="mt-1.5" placeholder="••••••••" />
          </label>
          <Button type="button" onClick={() => setChangingPassword(false)}>
            Actualizar
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 pt-5">
        <div className="flex-1">
          <p className="text-sm font-semibold">Verificación en dos pasos</p>
          <p className="mt-1 text-xs text-muted">
            {twoFactor ? "Activada" : "Desactivada"} · pide un código al iniciar
            sesión.
          </p>
        </div>
        <Switch
          checked={twoFactor}
          onCheckedChange={setTwoFactor}
          aria-label="Verificación en dos pasos"
        />
      </div>
    </SettingsSection>
  );
}
