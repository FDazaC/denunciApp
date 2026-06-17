import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
    onLocationSelect: (lat: number, lng: number) => void;
}

const blueIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function LocationMarker({ onLocationSelect }: Props) {
    const [position, setPosition] = useState<any>(null);

    useMapEvents({
        click(e) {
            setPosition(e.latlng);
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });

    return position ? (<Marker position={position} icon={blueIcon} />) : null;
}

export default function MapaSelector({ onLocationSelect }: Props) {
    return (
        <MapContainer
            center={[-33.4489, -70.6693]}
            zoom={13}
            style={{
                height: "300px",
                width: "100%",
                borderRadius: "12px",
            }}
            className="mapa-selector"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />

            <LocationMarker
                onLocationSelect={onLocationSelect}
            />
        </MapContainer>
    );
}