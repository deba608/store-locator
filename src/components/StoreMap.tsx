"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useRef } from "react";
import type { LatLng, Store } from "@/lib/types";

// Numbered pin matching the corresponding result card index.
function numberIcon(n: number, selected: boolean) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:28px;height:28px;border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      background:${selected ? "#134E4A" : "#0F766E"};
      border:2px solid #fff;
      box-shadow:0 2px 6px rgba(0,0,0,.35);
      display:flex;align-items:center;justify-content:center;
      ${selected ? "scale:1.2;" : ""}
    "><span style="
      transform:rotate(45deg);
      color:#fff;font:700 11px/1 system-ui,sans-serif;
    ">${n}</span></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

function Recenter({ center }: { center: LatLng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], 14);
  }, [center, map]);
  return null;
}

function SelectedPopup({
  selectedId,
  markers,
}: {
  selectedId: string | null;
  markers: React.MutableRefObject<Map<string, L.Marker>>;
}) {
  useEffect(() => {
    if (selectedId) markers.current.get(selectedId)?.openPopup();
  }, [selectedId, markers]);
  return null;
}

export default function StoreMap({
  center,
  stores,
  selectedId,
  onSelect,
}: {
  center: LatLng;
  stores: Store[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const markers = useRef(new Map<string, L.Marker>());
  return (
    <MapContainer center={[center.lat, center.lng]} zoom={14} className="h-full w-full" zoomControl={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Recenter center={center} />
      <SelectedPopup selectedId={selectedId} markers={markers} />
      {stores.map((s, i) => (
        <Marker
          key={s.id}
          position={[s.location.lat, s.location.lng]}
          icon={numberIcon(i + 1, s.id === selectedId)}
          ref={(m) => {
            if (m) markers.current.set(s.id, m);
          }}
          eventHandlers={{ click: () => onSelect(s.id) }}
        >
          <Popup>
            <b>{s.name}</b>
            <br />
            {s.address}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
