import { useEffect, useState, useMemo, memo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Attraction } from "../../utils/mapHelpers";
import { createCustomIcon, getMarkerColor } from "../../utils/mapHelpers";

interface MapCanvasProps {
  locations: Attraction[];
  activeFilter: string;
  isLoading: boolean;
}

function createClusterIcon(cluster: any) {
  const count = cluster.getChildCount();
  let size = 36;
  if (count >= 50) size = 50;
  else if (count >= 20) size = 44;
  else if (count >= 5) size = 38;

  return L.divIcon({
    html: `<div style="width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;background:#395c6b;color:#eaddc9;border-radius:50%;font-weight:bold;font-size:${size * 0.35}px;border:3px solid #eaddc9;box-shadow:0 2px 6px rgba(0,0,0,0.3)">${count}</div>`,
    className: "bg-transparent border-none",
    iconSize: L.point(size, size),
  });
}

function PopupContent({ location }: { location: Attraction }) {
  return (
    <div className="p-1 min-w-50">
      {location.imagenes && location.imagenes.length > 0 && (
        <img
          src={location.imagenes[0]}
          alt={location.nombre}
          loading="lazy"
          className="w-full h-32 object-cover rounded-lg mb-3"
        />
      )}
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
      <button
        onClick={() => {
          window.location.href = `/atractivo/${location.id}`;
        }}
        className="block w-full text-center bg-white text-maya-verde border border-maya-verde text-xs font-bold py-2 rounded-lg hover:bg-maya-verde hover:text-white transition-colors"
      >
        Ver detalles
      </button>
    </div>
  );
}

const PopupContentMemo = memo(PopupContent);

function MarkerLayer({ locations, activeFilter }: { locations: Attraction[]; activeFilter: string }) {
  const map = useMap();
  const [bounds, setBounds] = useState(map.getBounds());

  useEffect(() => {
    const handler = () => setBounds(map.getBounds());
    map.on("moveend zoomend", handler);
    return () => {
      map.off("moveend zoomend", handler);
    };
  }, [map]);

  const filtered = useMemo(() => {
    if (activeFilter === "Todos") return locations;
    return locations.filter((loc) => loc.categoria === activeFilter);
  }, [locations, activeFilter]);

  const visible = useMemo(() => {
    // Add padding to bounds to render slightly beyond viewport
    const padded = bounds.pad(0.2);
    return filtered.filter((loc) => {
      return padded.contains([parseFloat(loc.lat), parseFloat(loc.long)]);
    });
  }, [filtered, bounds]);

  return (
    <MarkerClusterGroup
      chunkedLoading
      maxClusterRadius={50}
      iconCreateFunction={createClusterIcon}
    >
      {visible.map((location) => (
        <Marker
          key={location.id}
          position={[parseFloat(location.lat), parseFloat(location.long)]}
          icon={createCustomIcon(getMarkerColor(location.categoria))}
        >
          <Popup className="rounded-xl overflow-hidden">
            <PopupContentMemo location={location} />
          </Popup>
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
}

function MapCanvas({
  locations,
  activeFilter,
  isLoading,
}: MapCanvasProps) {
  return (
    <div
      className="absolute inset-0 z-0"
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

        {!isLoading && (
          <MarkerLayer locations={locations} activeFilter={activeFilter} />
        )}
      </MapContainer>
    </div>
  );
}

export default memo(MapCanvas);
