import { AuthBrandPanel } from "@/features/auth/components/auth-brand-panel";
import { Brand } from "@/components/layout/brand";
import { ThemeToggle } from "@/components/layout/theme-toggle";

/** Layout de autenticación: panel de marca (lg+) + área de formulario centrada. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-canvas">
      <AuthBrandPanel />

      <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-8">
        <ThemeToggle className="absolute right-4 top-4 sm:right-6 sm:top-6" />

        <div className="w-full max-w-[400px]">
          {/* Marca visible solo en móvil/tablet (sin panel lateral) */}
          <Brand size="md" className="mb-10 lg:hidden" />
          {children}
        </div>
      </div>
    </div>
  );
}
