import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  AttributionControl,
  useMap
} from "react-leaflet";
import L from "leaflet";

// Antena: usada nas torres individuais.
const towerSvg = `
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4.9 16.1C1 12.2 1 5.8 4.9 1.9"/><path d="M7.8 4.7a6.14 6.14 0 0 0 0 8.6"/>
    <circle cx="12" cy="9" r="2"/><path d="M16.2 4.7a6.14 6.14 0 0 1 0 8.6"/>
    <path d="M19.1 1.9a9 9 0 0 1 0 14.2"/><path d="M12 11v10"/><path d="m8 21 4-2 4 2"/>
  </svg>`;

// Prédios: usado nas CIDADES, para diferenciar à primeira vista de uma torre.
const citySvg = `
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none"
       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 22V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v18"/>
    <path d="M14 9h3a1 1 0 0 1 1 1v12"/>
    <path d="M3 22h18"/>
    <path d="M9 7h1"/><path d="M9 11h1"/><path d="M9 15h1"/>
  </svg>`;

/**
 * Marcador de CIDADE: só o ícone de prédios, em círculo branco (as torres
 * são círculos escuros com antena). O nome aparece no tooltip — uma
 * etiqueta fixa ao lado cobria as torres da própria cidade.
 */
function cityIcon(active) {
  return L.divIcon({
    className: "nc-city-icon",
    html: `<div class="nc-city ${active ? "is-active" : ""}">
        ${active ? '<span class="nc-city-ring"></span>' : ""}
        <span class="nc-city-badge">${citySvg}</span>
      </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
}

// Ícone de torre individual (menor, formato redondo).
function pointIcon() {
  return L.divIcon({
    className: "nc-tower-icon",
    html: `<div class="nc-tower nc-tower--sm">
        <span class="nc-tower-badge">${towerSvg}</span>
      </div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  });
}

// Reenquadra o mapa: se a cidade ativa tem torres, centraliza NA CIDADE e
// afasta o zoom até todas as torres caberem; senão, mostra todas as cidades.
function FitBounds({ cidades, cidadeAtiva }) {
  const map = useMap();
  useEffect(() => {
    if (cidadeAtiva?.pontos?.length) {
      // Enquadramento simétrico em volta da cidade: a distância até a torre
      // mais afastada em cada eixo vira a "folga" dos dois lados. Assim a
      // cidade fica no meio do mapa, e não no meio do conjunto de torres.
      const { lat, lng } = cidadeAtiva;
      let dLat = 0.01;
      let dLng = 0.01;
      cidadeAtiva.pontos.forEach((p) => {
        dLat = Math.max(dLat, Math.abs(p.lat - lat));
        dLng = Math.max(dLng, Math.abs(p.lng - lng));
      });
      const bounds = L.latLngBounds(
        [lat - dLat, lng - dLng],
        [lat + dLat, lng + dLng]
      );
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    } else if (cidades.length) {
      const bounds = L.latLngBounds(cidades.map((c) => [c.lat, c.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
    const t = setTimeout(() => map.invalidateSize(), 200);
    return () => clearTimeout(t);
  }, [cidades, cidadeAtiva, map]);
  return null;
}

// Zoom com a rodinha só quando o mouse está sobre o mapa.
function HoverScrollZoom() {
  const map = useMap();
  useEffect(() => {
    const enable = () => map.scrollWheelZoom.enable();
    const disable = () => map.scrollWheelZoom.disable();
    disable();
    const el = map.getContainer();
    el.addEventListener("mouseenter", enable);
    el.addEventListener("mouseleave", disable);
    return () => {
      el.removeEventListener("mouseenter", enable);
      el.removeEventListener("mouseleave", disable);
    };
  }, [map]);
  return null;
}

export default function SatelliteMap({ cidades, ativa, onSelect }) {
  const cidadeAtiva = cidades.find((c) => c.id === ativa) || cidades[0];
  const pontos = cidadeAtiva?.pontos || [];

  const center = cidades.length
    ? [cidades[0].lat, cidades[0].lng]
    : [-28.24, -53.78];

  return (
    <MapContainer
      center={center}
      zoom={10}
      // Zoom fracionado: com níveis inteiros o enquadramento "arredondava"
      // para baixo e deixava tudo pequeno demais.
      zoomSnap={0.25}
      zoomDelta={0.5}
      scrollWheelZoom={false}
      attributionControl={false}
      className="h-full w-full"
      style={{ background: "#070d18" }}
    >
      {/* Crédito mínimo exigido pela licença das imagens (sem prefixo "Leaflet") */}
      <AttributionControl position="bottomright" prefix={false} />
      <TileLayer
        attribution="&copy; Esri"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        maxZoom={18}
      />

      {/* Marcadores das cidades atendidas */}
      {cidades.map((c) => (
        <Marker
          key={c.id}
          position={[c.lat, c.lng]}
          icon={cityIcon(c.id === ativa)}
          eventHandlers={{ click: () => onSelect(c.id) }}
          keyboard
          title={c.nome}
          zIndexOffset={1000}
        >
          <Tooltip direction="top" offset={[0, -14]} opacity={1} className="nc-tooltip">
            <strong>{c.nome}</strong>
          </Tooltip>
        </Marker>
      ))}

      {/* Torres individuais da cidade ativa */}
      {pontos.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lng]} icon={pointIcon()}>
          <Tooltip direction="top" offset={[0, -10]} opacity={1} className="nc-tooltip">
            {p.nome}
          </Tooltip>
        </Marker>
      ))}

      <FitBounds cidades={cidades} cidadeAtiva={cidadeAtiva} />
      <HoverScrollZoom />
    </MapContainer>
  );
}
