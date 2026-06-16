"use client";

import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { CreditCard } from "@/types/card";
import { addCardSchema, type AddCardValues } from "../schemas/card.schema";

interface AddCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (card: CreditCard) => void;
}

function FormField({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-muted">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
      {error && (
        <p className="mt-1 text-[11.5px] font-medium text-negative">{error}</p>
      )}
    </label>
  );
}

export function AddCardModal({ open, onOpenChange, onAdd }: AddCardModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddCardValues>({
    resolver: zodResolver(addCardSchema),
    defaultValues: {
      name: "",
      network: "Mastercard",
      last4: "",
      statementDate: "",
      dueDate: "",
      monthlyPayment: 0,
      tone: "dark",
    },
  });

  const onSubmit = handleSubmit((values) => {
    const card: CreditCard = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `card-${values.last4}-${values.name}`,
      name: values.name,
      bank: `Crédito · ${values.network}`,
      network: values.network,
      last4: values.last4,
      statementDate: values.statementDate,
      dueDate: values.dueDate,
      monthlyPayment: values.monthlyPayment,
      floatDays: 15,
      tone: values.tone,
    };
    onAdd(card);
    reset();
    onOpenChange(false);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Agregar tarjeta"
      description="Registra una tarjeta de crédito para dar seguimiento a sus pagos."
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <FormField label="Nombre de la tarjeta" htmlFor="card-name" error={errors.name?.message}>
          <Input id="card-name" placeholder="Ej. Nu Bank" {...register("name")} />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Red" htmlFor="card-network" error={errors.network?.message}>
            <Select id="card-network" {...register("network")}>
              <option value="Visa">Visa</option>
              <option value="Mastercard">Mastercard</option>
              <option value="Amex">Amex</option>
            </Select>
          </FormField>
          <FormField label="Últimos 4 dígitos" htmlFor="card-last4" error={errors.last4?.message}>
            <Input
              id="card-last4"
              inputMode="numeric"
              maxLength={4}
              placeholder="4821"
              {...register("last4")}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Fecha de corte" htmlFor="card-cut" error={errors.statementDate?.message}>
            <Input id="card-cut" placeholder="15 jun" {...register("statementDate")} />
          </FormField>
          <FormField label="Fecha límite de pago" htmlFor="card-due" error={errors.dueDate?.message}>
            <Input id="card-due" placeholder="02 jul" {...register("dueDate")} />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField
            label="Pago mensual"
            htmlFor="card-payment"
            error={errors.monthlyPayment?.message}
          >
            <Input
              id="card-payment"
              type="number"
              inputMode="numeric"
              placeholder="2840"
              {...register("monthlyPayment", { valueAsNumber: true })}
            />
          </FormField>
          <FormField label="Color" htmlFor="card-tone" error={errors.tone?.message}>
            <Select id="card-tone" {...register("tone")}>
              <option value="dark">Grafito</option>
              <option value="darker">Negro</option>
              <option value="light">Platino</option>
            </Select>
          </FormField>
        </div>

        <div className="mt-2 flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button type="submit" className="flex-1">
            Agregar tarjeta
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
