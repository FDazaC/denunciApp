import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
    initialLocation?: {
        lat: number;
        lng: number;
    } | null;
    onLocationSelect: (lat: number, lng: number) => void;
}

const blueIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

function LocationMarker({ initialLocation, onLocationSelect }: Props) {
    const map = useMap();
    const [clickedPosition, setClickedPosition] = useState<L.LatLng | null>(null);
    const invalidated = useRef(false);

    const initialPosition = useMemo<L.LatLngExpression | null>(() => {
        if (initialLocation?.lat != null && initialLocation?.lng != null) {
            return [initialLocation.lat, initialLocation.lng];
        }
        return null;
    }, [initialLocation?.lat, initialLocation?.lng]);

    useEffect(() => {
        if (!initialPosition) return;
        map.setView(initialPosition, 15, { animate: false });
    }, [initialPosition, map]);

    useEffect(() => {
        if (invalidated.current) return;

        const attempts = [100, 300, 600, 1000];
        const timers = attempts.map((delay) =>
            window.setTimeout(() => {
                map.invalidateSize({ animate: false });
            }, delay)
        );

        function onVisibility() {
            if (!document.hidden) map.invalidateSize({ animate: false });
        }
        document.addEventListener("visibilitychange", onVisibility);

        invalidated.current = true;

        return () => {
            timers.forEach(clearTimeout);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, [map]);

    useMapEvents({
        click(e) {
            setClickedPosition(e.latlng);
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });

    const position: L.LatLngExpression | null =
        clickedPosition ?? (initialPosition as L.LatLngExpression | null);

    return position ? <Marker position={position} icon={blueIcon} /> : null;
}

export default function MapaSelector({ initialLocation, onLocationSelect }: Props) {
    const center: L.LatLngExpression =
        initialLocation?.lat != null && initialLocation?.lng != null
            ? [initialLocation.lat, initialLocation.lng]
            : [-29.9027, -71.2519];

    return (
        <div style={{ width: "100%", height: "300px", borderRadius: "12px", overflow: "hidden" }}>
            <MapContainer
                center={center}
                zoom={14}
                style={{ height: "100%", width: "100%" }}
                className="mapa-selector"
                scrollWheelZoom={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                <LocationMarker
                    initialLocation={initialLocation}
                    onLocationSelect={onLocationSelect}
                />
            </MapContainer>
        </div>
    );
}