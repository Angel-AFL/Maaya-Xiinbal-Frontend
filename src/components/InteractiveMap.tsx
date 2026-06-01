import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 1. Interfaz actualizada EXACTAMENTE como la devuelve tu API
interface Attraction {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  municipio: string;
  estado: string;
  lat: string; // Viene como string desde la BD
  long: string; // Viene como string desde la BD
}

const createCustomIcon = (color: string) =>
  new L.DivIcon({
    className: "bg-transparent border-none",
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid #eaddc9; box-shadow: 0 4px 6px rgba(0,0,0,0.3); transition: transform 0.2s;"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });

const mayaRojo = "#9a382d";
const mayaAmarillo = "#cca044";
const mayaAzul = "#395c6b";
const mayaNegro = "#2c2e2f";

// 2. Colores actualizados para incluir "Grutas"
const getMarkerColor = (categoria: string) => {
  switch (categoria) {
    case "Cultura Viva":
      return mayaRojo;
    case "Arqueología":
      return mayaAmarillo;
    case "Cenote":
      return mayaAzul;
    case "Grutas":
      return mayaNegro;
    default:
      return "#517a5e"; // Verde por defecto
  }
};

export default function InteractiveMap() {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [locations, setLocations] = useState<Attraction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/atractivos");

        if (!response.ok)
          throw new Error(`Error del servidor: ${response.status}`);

        const responseData = await response.json();

        // 3. Extraemos el arreglo de la propiedad "data"
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
      className="relative w-full bg-maya-blanco/20"
      style={{ height: "85vh" }}
    >
      {/* Panel Flotante */}
      <div className="absolute top-6 left-6 z-[1000] w-80 bg-white/95 backdrop-blur-md border border-maya-negro/10 rounded-2xl shadow-xl p-5 hidden md:flex flex-col">
        <h2 className="text-xl font-bold text-maya-negro mb-1">
          Explora la Península
        </h2>
        <p className="text-sm text-maya-negro/70 mb-4">
          Descubre joyas ocultas y rutas ancestrales.
        </p>

        {/* 4. Filtros actualizados con las categorías de tu BD */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["Todos", "Cultura Viva", "Arqueología", "Cenote", "Grutas"].map(
            (filter) => (
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
            ),
          )}
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

        <div className="mt-auto pt-4 border-t border-maya-negro/10">
          <div className="bg-maya-verde/10 p-3 rounded-xl border border-maya-verde/20 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-maya-verde flex items-center justify-center text-white font-bold">
              IA
            </div>
            <div>
              <p className="text-xs font-bold text-maya-negro">
                Asistente Maaya
              </p>
              <p className="text-xs text-maya-negro/60">
                ¿Qué te gustaría visitar hoy?
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          height: "100%",
          width: "100%",
          position: "relative",
          zIndex: 0,
        }}
      >
        <MapContainer
          center={[20.56, -89.97]} // Centrado cerca de Maxcanú
          zoom={9}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {!isLoading &&
            locations
              .filter(
                (loc) =>
                  activeFilter === "Todos" || loc.categoria === activeFilter,
              )
              .map((location) => (
                <Marker
                  key={location.id}
                  // 5. Convertimos los strings a números flotantes
                  position={[
                    parseFloat(location.lat),
                    parseFloat(location.long),
                  ]}
                  icon={createCustomIcon(getMarkerColor(location.categoria))}
                >
                  <Popup className="rounded-xl overflow-hidden">
                    <div className="p-1 min-w-[200px]">
                      <span className="text-xs font-bold text-maya-azul uppercase tracking-wider">
                        {location.categoria}
                      </span>
                      <h3 className="text-lg font-bold text-maya-negro mt-1 mb-2">
                        {location.nombre}
                      </h3>
                      <p className="text-xs text-maya-negro/60 mb-2">
                        {location.municipio}, {location.estado}
                      </p>
                      <p className="text-sm text-maya-negro/80 mb-3 line-clamp-3">
                        {location.descripcion}
                      </p>
                      <button className="w-full bg-maya-verde text-white text-xs font-bold py-2 rounded-lg hover:bg-maya-negro transition-colors">
                        Ver detalles
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
        </MapContainer>
      </div>
    </div>
  );
}
