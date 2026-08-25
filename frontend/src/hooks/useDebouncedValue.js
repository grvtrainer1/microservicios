import { useEffect, useState } from "react";

// Custom hook: retrasa la actualizacion de un valor hasta que dejan de
// producirse cambios durante "delayMs". Util para no llamar a la API
// (ms-buscador) en cada pulsacion de tecla mientras el usuario escribe.
export function useDebouncedValue(value, delayMs = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}
