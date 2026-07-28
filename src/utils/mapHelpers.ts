import L from "leaflet";

export interface Attraction {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  municipio: string;
  estado: string;
  lat: string;
  long: string;
  imagenes?: string[];
  direccion?: string;
  precio?: string;
  hora_apertura?: string;
  hora_cierre?: string;
}

const mayaAzul = "#395c6b";
const mayaVerde = "#517a5e";
const mayaRojo = "#9a382d";
const mayaAmarillo = "#cca044";
const mayaBlanco = "#eaddc9";
const mayaNegro = "#2c2e2f";
const mayaMorado = "#654b6b";
const mayaRosa = "#b55375";
const mayaNaranja = "#b86a3d";

export const getMarkerColor = (categoria: string) => {
  switch (categoria) {
    case "Pueblos Mágicos":
      return mayaRojo;
    case "Haciendas":
      return mayaVerde;
    case "Zonas Arqueológicas":
      return mayaAmarillo;
    case "Cenotes":
      return mayaAzul;
    case "Grutas":
      return mayaNegro;
    case "Pueblos Fantasmas":
      return mayaMorado;
    case "Joyas Ocultas":
      return mayaRosa;
    case "Paradores Turísticos":
      return mayaNaranja;
    default:
      return "#517a5e";
  }
};

export const createCustomIcon = (color: string) =>
  new L.DivIcon({
    className: "bg-transparent border-none",
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid #eaddc9; box-shadow: 0 4px 6px rgba(0,0,0,0.3); transition: transform 0.2s;"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
