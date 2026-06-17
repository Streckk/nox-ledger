import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Devuelve `false` durante el render en servidor y la hidratación inicial,
 * y `true` una vez hidratado en el cliente. Útil para montar componentes que
 * requieren medir el DOM (p. ej. gráficas con ResponsiveContainer).
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
