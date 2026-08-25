import { useCallback, useEffect, useState } from "react";

// Custom hook: encapsula el patron fetch + loading + error + refetch
// para no repetirlo en cada componente que consulta al Gateway.
export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadIndex, setReloadIndex] = useState(0);

  const refetch = useCallback(() => setReloadIndex((i) => i + 1), []);

  useEffect(() => {
    if (!url) return;

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status} al consultar ${url}`);
        }
        return response.json();
      })
      .then((json) => setData(json))
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [url, reloadIndex]);

  return { data, loading, error, refetch };
}
