import { useMemo, memo } from "react";
import type { Attraction } from "../../utils/mapHelpers";
import MaayaChat from "../map/MaayaChat";

interface MapSidebarProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  isLoading: boolean;
  error: string | null;
  locations: Attraction[];
}

const filters = [
  "Todos",
  "Pueblos Mágicos",
  "Haciendas",
  "Zonas Arqueológicas",
  "Cenotes",
  "Grutas",
  "Pueblos Fantasmas",
  "Joyas Ocultas",
  "Paradores Turísticos",
];

function MapSidebar({
  activeFilter,
  setActiveFilter,
  isLoading,
  error,
  locations,
}: MapSidebarProps) {
  const filteredLocations = useMemo(() => {
    if (activeFilter === "Todos") return locations;
    return locations.filter((loc) => loc.categoria === activeFilter);
  }, [locations, activeFilter]);

  return (
    <div className="absolute top-6 left-6 z-1000 w-80 bg-white/95 backdrop-blur-md border border-maya-negro/10 rounded-2xl shadow-xl p-5 hidden md:flex flex-col" style={{ maxHeight: "calc(100vh - 3rem)" }}>
      <h2 className="text-xl font-bold text-maya-negro mb-1">
        Explora la Península
      </h2>
      <p className="text-sm text-maya-negro/70 mb-4">
        Descubre joyas ocultas y rutas ancestrales.
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
              activeFilter === filter
                ? "bg-maya-azul text-white"
                : "bg-maya-negro/5 text-maya-negro/70 hover:bg-maya-negro/10"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="text-sm text-maya-azul font-semibold animate-pulse mb-4">
          Cargando atractivos...
        </div>
      )}

      {error && (
        <div className="text-xs text-maya-rojo font-semibold mb-4 bg-red-100 p-2 rounded">
          Fallo la conexión: {error}
        </div>
      )}

      {!isLoading && !error && (
        <div className="flex-1 overflow-y-auto min-h-0 mb-4">
          <h3 className="text-xs font-semibold text-maya-negro/50 uppercase tracking-wider mb-2">
            {activeFilter === "Todos" ? "Todos los atractivos" : activeFilter} ({filteredLocations.length})
          </h3>
          <div className="space-y-1.5 pr-1">
            {filteredLocations.map((loc) => (
              <a
                key={loc.id}
                href={`/atractivo/${loc.id}`}
                className="flex gap-3 p-2 rounded-xl hover:bg-maya-verde/10 transition-colors group"
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-maya-negro/10">
                  {loc.imagenes && loc.imagenes.length > 0 ? (
                    <img
                      src={loc.imagenes[0]}
                      alt={loc.nombre}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-maya-negro/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-maya-negro group-hover:text-maya-azul transition-colors truncate">
                    {loc.nombre}
                  </h4>
                  <span className="text-xs text-maya-negro/50">{loc.categoria}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <MaayaChat />
    </div>
  );
}

export default memo(MapSidebar, (prev, next) =>
  prev.activeFilter === next.activeFilter &&
  prev.isLoading === next.isLoading &&
  prev.error === next.error &&
  prev.locations === next.locations &&
  prev.setActiveFilter === next.setActiveFilter
);
