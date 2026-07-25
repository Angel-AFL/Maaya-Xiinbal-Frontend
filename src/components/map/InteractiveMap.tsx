import { useState, useEffect, useRef, useCallback } from "react";
import MapSidebar from "./MapSidebar";
import MapCanvas from "./MapCanvas";
import type { Attraction } from "../../utils/mapHelpers";

export default function InteractiveMap() {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [debouncedFilter, setDebouncedFilter] = useState("Todos");
  const [locations, setLocations] = useState<Attraction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const handleFilterChange = useCallback((filter: string) => {
    setActiveFilter(filter);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedFilter(filter);
    }, 150);
  }, []);

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/atractivos`, {
          headers,
        });

        if (!response.ok) {
          throw new Error(`Error del servidor: ${response.status}`);
        }

        const responseData = await response.json();

        if (responseData.success && Array.isArray(responseData.data)) {
          setLocations(responseData.data);
        } else {
          throw new Error("Estructura de API irreconocible");
        }
      } catch (err: any) {
        setError(err.message);
        console.error("Error cargando el mapa:", err);
        setLocations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttractions();
  }, []);

  return (
    <div
      className="relative w-full flex-1 bg-maya-blanco/20"
    >
      <MapSidebar
        activeFilter={activeFilter}
        setActiveFilter={handleFilterChange}
        isLoading={isLoading}
        error={error}
        locations={locations}
      />

      <MapCanvas
        locations={locations}
        activeFilter={debouncedFilter}
        isLoading={isLoading}
      />
    </div>
  );
}
