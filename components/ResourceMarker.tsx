'use client';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Resource, ResourceType } from '@/types/game';

const RESOURCE_COLORS: Record<ResourceType, string> = {
  wood: '#8B4513',
  stone: '#808080',
  food: '#228B22',
  water: '#1E90FF',
  rare: '#FFD700',
};

function resourceIcon(type: ResourceType) {
  return L.divIcon({
    className: '',
    html: `<div style="background:${RESOURCE_COLORS[type]};width:20px;height:20px;border-radius:50%;border:2px solid white;"></div>`,
    iconSize: [20, 20],
  });
}

interface ResourceMarkerProps {
  resource: Resource;
  onCollect: (id: string) => void;
}

export default function ResourceMarker({ resource, onCollect }: ResourceMarkerProps) {
  return (
    <Marker
      position={[resource.position.lat, resource.position.lng]}
      icon={resourceIcon(resource.type)}
    >
      <Popup>
        <div className="text-center">
          <p className="font-bold capitalize">{resource.type}</p>
          <p>Amount: {resource.amount}</p>
          <button
            onClick={() => onCollect(resource.id)}
            className="mt-2 px-3 py-1 bg-green-600 text-white rounded text-sm"
          >
            Collect
          </button>
        </div>
      </Popup>
    </Marker>
  );
}
