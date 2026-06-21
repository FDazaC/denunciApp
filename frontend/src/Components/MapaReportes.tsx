import { useEffect } from "react";
import {MapContainer,TileLayer,Marker,Popup,useMap} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { DeviceLocation } from "../Services/device.service";
import type { Reporte } from "../Types/reportes";

interface Props {
    reportes: Reporte[];
    currentLocation?: DeviceLocation | null;
}

const redIcon = new L.Icon({
    iconUrl:"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const yellowIcon = new L.Icon({
    iconUrl:"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png",
    shadowUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const greenIcon = new L.Icon({
    iconUrl:"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    shadowUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const blueIcon = new L.Icon({
    iconUrl:"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    shadowUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

function CenterMap({ currentLocation }: { currentLocation?: DeviceLocation | null }) {
    const map = useMap();

    useEffect(() => {
        if (currentLocation) {
            map.setView([currentLocation.lat, currentLocation.lng], 14);
        }
    }, [currentLocation, map]);

    return null;
}

function getEstadoIcon(estado: string) {
    switch (estado) {
        case "pendiente":
            return redIcon;

        case "en_revision":
            return yellowIcon;

        case "resuelto":
            return greenIcon;

        default:
            return redIcon;
    }
}

export default function MapaReportes({reportes, currentLocation}: Props) {
    const center: L.LatLngExpression = currentLocation
        ? [currentLocation.lat, currentLocation.lng]
        : [-29.9027, -71.2519];

    return (
        <MapContainer
            center={center}
            zoom={12}
            style={{
                height: "600px",
                width: "100%",
                borderRadius: "12px",
            }}
            className="mapa-reportes"
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors'/>
            <CenterMap currentLocation={currentLocation} />

            {currentLocation && (
                <Marker
                    position={[currentLocation.lat, currentLocation.lng]}
                    icon={blueIcon}
                >
                    <Popup>
                        <span className="text-sm font-semibold text-gray-800">
                            Tu ubicacion actual
                        </span>
                    </Popup>
                </Marker>
            )}

            {reportes.map((reporte) => (
                <Marker
                    key={reporte.id}
                    position={[Number(reporte.latitud),Number(reporte.longitud)]}
                    icon={getEstadoIcon(reporte.estado)}
                >
                    <Popup>
                        <div className="text-sm">
                            <h3 className="font-bold text-gray-800">{reporte.titulo}</h3>
                            <p className="text-xs text-gray-600">Estado: {reporte.estado}</p>
                            <p className="text-xs text-gray-600">Usuario: {reporte.usuario?.nombre}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>

        
    );
}
