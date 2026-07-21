"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useRef } from "react";
import type { LatLng, Store } from "@/lib/types";

// default marker icons break under bundlers; point at CDN copies
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

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
    <MapContainer center={[center.lat, center.lng]} zoom={14} className="h-full w-full rounded-xl">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Recenter center={center} />
      <SelectedPopup selectedId={selectedId} markers={markers} />
      {stores.map((s) => (
        <Marker
          key={s.id}
          position={[s.location.lat, s.location.lng]}
          icon={icon}
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
