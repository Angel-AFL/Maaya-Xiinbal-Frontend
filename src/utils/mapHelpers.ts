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
}

const mayaRojo = "#9a382d";
const mayaAmarillo = "#cca044";
const mayaAzul = "#395c6b";
const mayaNegro = "#2c2e2f";

export const getMarkerColor = (categoria: string) => {
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
