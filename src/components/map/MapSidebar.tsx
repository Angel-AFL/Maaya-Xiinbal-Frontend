import MaayaChat from "../map/MaayaChat";

interface MapSidebarProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  isLoading: boolean;
  error: string | null;
}

export default function MapSidebar({
  activeFilter,
  setActiveFilter,
  isLoading,
  error,
}: MapSidebarProps) {
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

  return (
    <div className="absolute top-6 left-6 z-1000 w-80 bg-white/95 backdrop-blur-md border border-maya-negro/10 rounded-2xl shadow-xl p-5 hidden md:flex flex-col">
      <h2 className="text-xl font-bold text-maya-negro mb-1">
        Explora la Península
      </h2>
      <p className="text-sm text-maya-negro/70 mb-4">
        Descubre joyas ocultas y rutas ancestrales.
      </p>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
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

      {/* Estados de Carga y Error */}
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

      {/* Asistente de IA */}
      <MaayaChat />
    </div>
  );
}
