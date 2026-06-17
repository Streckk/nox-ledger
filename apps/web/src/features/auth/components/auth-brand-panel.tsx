import { Sparkles, LineChart, ShieldCheck } from "lucide-react";
import { Brand } from "@/components/layout/brand";

const HIGHLIGHTS = [
  {
    icon: Sparkles,
    title: "Simulador inteligente",
    description: "Comprueba al instante si una compra a meses afecta tu ahorro.",
  },
  {
    icon: LineChart,
    title: "Proyección de ahorro",
    description: "Visualiza tu progreso real frente a tu objetivo mes a mes.",
  },
  {
    icon: ShieldCheck,
    title: "Tus tarjetas, en orden",
    description: "Cortes, fechas límite y pagos del mes en un solo lugar.",
  },
];

/** Panel lateral de marca (oscuro) para las pantallas de autenticación. Solo en lg+. */
export function AuthBrandPanel() {
  return (
    <aside className="nx-fade relative hidden w-[44%] max-w-[520px] flex-col justify-between overflow-hidden bg-invert p-12 text-invert-ink lg:flex">
      <Brand tone="onDark" size="lg" />

      <div className="max-w-[380px]">
        <h2 className="text-[32px] font-extrabold leading-tight tracking-tight">
          Controla tus tarjetas y tu ahorro en un solo lugar.
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-invert-muted">
          Nox Ledger reúne tus finanzas personales con la claridad de una fintech
          moderna.
        </p>

        <ul className="mt-10 flex flex-col gap-5">
          {HIGHLIGHTS.map((item, index) => {
            const Icon = item.icon;
            return (
              <li
                key={item.title}
                className="nx-rise flex gap-3.5"
                style={{ animationDelay: `${160 + index * 90}ms` }}
              >
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5">
                  <Icon className="size-[18px]" strokeWidth={2} />
                </span>
                <div>
                  <p className="text-sm font-bold">{item.title}</p>
                  <p className="mt-0.5 text-[13px] leading-snug text-invert-muted">
                    {item.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="font-mono text-[11px] uppercase tracking-widest text-invert-muted">
        Nox Ledger · Finanzas personales
      </p>
    </aside>
  );
}
