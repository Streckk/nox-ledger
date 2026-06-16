import type { CreditCard } from "@/types/card";

/** Tarjetas de crédito del usuario (datos mockeados). */
export const creditCards: CreditCard[] = [
  {
    id: "nu",
    name: "Nu Bank",
    bank: "Crédito · Mastercard",
    network: "Mastercard",
    last4: "4821",
    statementDate: "15 jun",
    dueDate: "02 jul",
    monthlyPayment: 2840,
    floatDays: 17,
    tone: "dark",
  },
  {
    id: "bbva",
    name: "BBVA Azul",
    bank: "Crédito · Visa",
    network: "Visa",
    last4: "1093",
    statementDate: "20 jun",
    dueDate: "08 jul",
    monthlyPayment: 2110,
    floatDays: 18,
    tone: "darker",
  },
  {
    id: "amex",
    name: "Amex Gold",
    bank: "Crédito · Amex",
    network: "Amex",
    last4: "7755",
    statementDate: "28 jun",
    dueDate: "18 jul",
    monthlyPayment: 1500,
    floatDays: 20,
    tone: "light",
  },
];
