import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Attraction } from "../../utils/mapHelpers";
import { createCustomIcon, getMarkerColor } from "../../utils/mapHelpers";

interface MapCanvasProps {
  locations: Attraction[];
  activeFilter: string;
  isLoading: boolean;
}

export default function MapCanvas({
  locations,
  activeFilter,
  isLoading,
}: MapCanvasProps) {
  return (
    <div
      style={{ height: "100%", width: "100%", position: "relative", zIndex: 0 }}
    >
      <MapContainer
        center={[20.56, -89.97]}
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
                position={[parseFloat(location.lat), parseFloat(location.long)]}
                icon={createCustomIcon(getMarkerColor(location.categoria))}
              >
                <Popup className="rounded-xl overflow-hidden">
                  <div className="p-1 min-w-50">
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
  );
}
