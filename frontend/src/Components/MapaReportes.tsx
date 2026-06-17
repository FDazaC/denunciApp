import {MapContainer,TileLayer,Marker,Popup} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
interface Props {
    reportes: any[];
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

export default function MapaReportes({reportes}: Props) {
    return (
        <MapContainer
            center={[-29.9027, -71.2519]}
            zoom={12}
            style={{
                height: "600px",
                width: "100%",
                borderRadius: "12px",
            }}
            className="mapa-reportes"
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors'/>

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