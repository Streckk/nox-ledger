import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";
import { SidebarProvider } from "./use-sidebar";

/** Estructura general de la app: sidebar + header + área de contenido scrollable. */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-canvas">
        <AppSidebar />
        <main className="nx-scroll flex-1 overflow-y-auto overflow-x-hidden">
          <AppHeader />
          <div className="mx-auto max-w-[1240px] px-4 pb-16 pt-6 sm:px-10 sm:pt-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
