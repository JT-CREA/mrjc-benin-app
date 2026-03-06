"use client";

/**
 * Composant — LeafletMap
 * Carte interactive Leaflet.js (client-side uniquement)
 * Utilisé dans la page Contact pour localiser MRJC-BÉNIN à Cotonou
 */

import { useEffect, useRef } from "react";

interface LeafletMapProps {
  lat: number;
  lng: number;
  zoom?: number;
  popupText?: string;
}

export default function LeafletMap({
  lat,
  lng,
  zoom = 14,
  popupText,
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<import("leaflet").Map | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current || mapInstance.current)
      return;

    // Import dynamique Leaflet
    import("leaflet").then((L) => {
      // Fix icônes par défaut Leaflet (CDN)
      delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })
        ._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Injection CSS Leaflet
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      const map = L.map(mapRef.current!, {
        zoomControl: true,
        scrollWheelZoom: false,
      }).setView([lat, lng], zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Marqueur personnalisé (couleur primary)
      const customIcon = L.divIcon({
        className: "",
        html: `
          <div style="
            width: 36px; height: 36px;
            background: #2d6a2d;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex; align-items: center; justify-content: center;
          ">
            <div style="transform: rotate(45deg); font-size: 14px;">📍</div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -40],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      if (popupText) {
        marker
          .bindPopup(
            `
          <div style="font-family: Inter, sans-serif; padding: 4px; min-width: 160px;">
            <div style="font-weight: 700; color: #2d6a2d; margin-bottom: 4px;">${popupText}</div>
            <div style="font-size: 12px; color: #666;">Cliquez pour itinéraire</div>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}"
               target="_blank"
               style="display: inline-block; margin-top: 6px; padding: 4px 10px; background: #2d6a2d; color: white; border-radius: 6px; text-decoration: none; font-size: 12px;">
              Itinéraire Google Maps
            </a>
          </div>
        `,
            { maxWidth: 220 },
          )
          .openPopup();
      }

      mapInstance.current = map;

      // Resize fix
      setTimeout(() => map.invalidateSize(), 200);
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [lat, lng, zoom, popupText]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-2xl z-0"
      aria-label="Carte de localisation MRJC-BÉNIN"
    />
  );
}
