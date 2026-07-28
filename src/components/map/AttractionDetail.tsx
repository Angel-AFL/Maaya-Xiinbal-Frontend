import { useState, useEffect } from "react";
import type { Attraction } from "../../utils/mapHelpers";

interface Props {
  id: string;
}

export default function AttractionDetail({ id }: Props) {
  const [attraction, setAttraction] = useState<Attraction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(
          `${import.meta.env.PUBLIC_API_URL}/atractivos/${id}`,
          { headers },
        );
        if (!res.ok) throw new Error("No se encontró el atractivo");
        const json = await res.json();
        if (json.success) {
          setAttraction(json.data);
          if (json.data.imagenes && json.data.imagenes.length > 0) {
            setSelectedImage(json.data.imagenes[0]);
          }
        } else {
          throw new Error(json.message);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-maya-blanco/20">
        <div className="text-maya-azul font-semibold animate-pulse text-lg">
          Cargando...
        </div>
      </div>
    );
  }

  if (error || !attraction) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-maya-blanco/20 gap-4">
        <div className="text-maya-rojo font-semibold text-lg">
          {error || "Atractivo no encontrado"}
        </div>
        <a
          href="/map"
          className="text-maya-azul hover:text-maya-verde font-semibold underline"
        >
          Volver al mapa
        </a>
      </div>
    );
  }

  const imagenes = attraction.imagenes || [];

  return (
    <div className="min-h-screen bg-maya-blanco/20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <a
          href="/map"
          className="inline-flex items-center gap-2 text-sm font-semibold text-maya-azul hover:text-maya-verde transition-colors mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver al mapa
        </a>

        {imagenes.length > 0 && (
          <div className="mb-10">
            <div className="rounded-2xl overflow-hidden h-80 md:h-96 mb-4 bg-maya-negro/10">
              <img
                src={selectedImage || imagenes[0]}
                alt={attraction.nombre}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            {imagenes.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {imagenes.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${
                      selectedImage === img
                        ? "border-maya-azul"
                        : "border-transparent hover:border-maya-blanco"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-maya-azul/10 text-maya-azul mb-4">
              {attraction.categoria}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-maya-negro mb-3">
              {attraction.nombre}
            </h1>
            <p className="text-maya-negro/60 mb-6">
              {attraction.municipio}, {attraction.estado}
            </p>
            <p className="text-maya-negro/80 leading-relaxed text-lg">
              {attraction.descripcion}
            </p>
          </div>

          <div className="space-y-4">
            {attraction.direccion && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-maya-negro/5">
                <div className="flex items-center gap-2 text-maya-azul mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Dirección
                  </span>
                </div>
                <p className="text-sm text-maya-negro/80">
                  {attraction.direccion}
                </p>
              </div>
            )}

            {attraction.precio && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-maya-negro/5">
                <div className="flex items-center gap-2 text-maya-verde mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Precio
                  </span>
                </div>
                <p className="text-sm text-maya-negro/80">
                  ${attraction.precio} MXN
                </p>
              </div>
            )}

            {(attraction.hora_apertura || attraction.hora_cierre) && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-maya-negro/5">
                <div className="flex items-center gap-2 text-maya-amarillo mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Horario
                  </span>
                </div>
                <p className="text-sm text-maya-negro/80">
                  {attraction.hora_apertura}
                  {attraction.hora_cierre && ` — ${attraction.hora_cierre}`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
