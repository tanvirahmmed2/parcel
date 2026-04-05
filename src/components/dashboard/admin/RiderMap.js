"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Loader2 } from "lucide-react";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});
export default function RiderMap({ parcels }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return <div className="h-96 bg-gray-100 animate-pulse rounded-xl flex items-center justify-center"><Loader2 className="animate-spin text-gray-400" /></div>;
  const activeLocations = parcels?.filter(p => p.lastLocation?.lat && p.lastLocation?.lng);
  const center = activeLocations?.length > 0 
    ? [activeLocations[0].lastLocation.lat, activeLocations[0].lastLocation.lng] 
    : [23.8103, 90.4125]; 
  return (
    <div className="h-96 rounded-2xl overflow-hidden border border-gray-200 z-0 relative">
      <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {activeLocations?.map(parcel => (
          <Marker key={parcel._id} position={[parcel.lastLocation.lat, parcel.lastLocation.lng]}>
            <Popup>
              <div className="text-sm">
                <p className="font-bold">Parcel: {parcel.trackingId}</p>
                <p>Status: {parcel.status}</p>
                <p>Receiver: {parcel.receiverName}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
