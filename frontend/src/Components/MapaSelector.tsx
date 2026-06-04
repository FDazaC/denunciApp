import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";

interface Props {
    onLocationSelect: (lat: number, lng: number) => void;
}

function LocationMarker({ onLocationSelect }: Props) {
    const [position, setPosition] = useState<any>(null);

    useMapEvents({
        click(e) {
            setPosition(e.latlng);
            onLocationSelect(e.latlng.lat,e.latlng.lng);
        },
    });

    return position ? (<Marker position={position} />) : null;
}

export default function MapaSelector({ onLocationSelect }: Props) {
    return (
        <MapContainer
            center={[-33.4489, -70.6693]}
            zoom={13}
            style={{
                height: "400px",
                width: "100%",
                borderRadius: "12px",
            }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <LocationMarker
                onLocationSelect={onLocationSelect}
            />
        </MapContainer>
    );
}