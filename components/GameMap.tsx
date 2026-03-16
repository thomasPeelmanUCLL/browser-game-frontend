'use client';
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Position, Resource, HexCell } from '@/types/game';
import ResourceMarker from './ResourceMarker';
import HexGrid from './HexGrid';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

function RecenterMap({ position }: { position: Position }) {
  const map = useMap();
  useEffect(() => { map.setView([position.lat, position.lng]); }, [position, map]);
  return null;
}

interface GameMapProps {
  playerPosition: Position;
  resources: Resource[];
  claimedHexes: HexCell[];
  currentPlayerId?: string;
  onCollect: (resourceId: string) => void;
  onHexClick: (hexId: string, isOwned: boolean, isMine: boolean) => void;
}

export default function GameMap({ playerPosition, resources, claimedHexes, currentPlayerId, onCollect, onHexClick }: GameMapProps) {
  return (
    <MapContainer
      center={[playerPosition.lat, playerPosition.lng]}
      zoom={17}
      className="w-full h-screen"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <RecenterMap position={playerPosition} />
      <HexGrid
        resources={resources}
        claimedHexes={claimedHexes}
        currentPlayerId={currentPlayerId}
        onHexClick={onHexClick}
      />
      <Marker position={[playerPosition.lat, playerPosition.lng]}>
        <Popup>You are here</Popup>
      </Marker>
      {resources.map((r) => (
        <ResourceMarker key={r.id} resource={r} onCollect={onCollect} />
      ))}
    </MapContainer>
  );
}
