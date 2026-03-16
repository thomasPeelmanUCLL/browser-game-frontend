'use client';
import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import * as h3 from 'h3-js';
import { Resource, HexCell } from '@/types/game';

const HEX_RESOLUTION = 9;

// Generate a deterministic color per player username
function playerColor(username: string): string {
  let hash = 0;
  for (let i = 0; i < username.length; i++) hash = username.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 55%)`;
}

interface HexGridProps {
  resources: Resource[];
  claimedHexes: HexCell[];
  currentPlayerId?: string;
  onHexClick?: (hexId: string, isOwned: boolean, isMine: boolean) => void;
}

export default function HexGrid({ resources, claimedHexes, currentPlayerId, onHexClick }: HexGridProps) {
  const map = useMap();
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!layerRef.current) layerRef.current = L.layerGroup().addTo(map);

    const drawHexes = () => {
      layerRef.current!.clearLayers();
      const center = map.getCenter();
      const centerHex = h3.latLngToCell(center.lat, center.lng, HEX_RESOLUTION);
      const hexes = h3.gridDisk(centerHex, 12);

      const resourceHexIds = new Set(
        resources.map((r) => h3.latLngToCell(r.position.lat, r.position.lng, HEX_RESOLUTION))
      );

      const claimedMap = new Map(claimedHexes.map((h) => [h.hexId, h]));

      hexes.forEach((hexId) => {
        const boundary = h3.cellToBoundary(hexId);
        const latLngs = boundary.map(([lat, lng]) => [lat, lng] as [number, number]);
        const claimed = claimedMap.get(hexId);
        const isMine = claimed?.ownerId === currentPlayerId;
        const hasResource = resourceHexIds.has(hexId);

        let style: L.PathOptions;
        if (claimed) {
          const color = playerColor(claimed.owner?.username ?? claimed.ownerId ?? 'unknown');
          style = {
            color,
            weight: 2,
            opacity: isMine ? 0.9 : 0.6,
            fillColor: color,
            fillOpacity: isMine ? 0.25 : 0.15,
          };
        } else if (hasResource) {
          style = { color: '#ffcc00', weight: 1.5, opacity: 0.7, fillColor: '#ffcc00', fillOpacity: 0.12 };
        } else {
          style = { color: '#00ffcc', weight: 1, opacity: 0.4, fillColor: '#00ffcc', fillOpacity: 0.04 };
        }

        const polygon = L.polygon(latLngs, style);

        // Tooltip
        let tooltipLines: string[] = [];
        if (claimed) {
          tooltipLines.push(`${isMine ? '✅ Your hex' : `👤 ${claimed.owner?.username ?? 'Unknown'}`}`);
          tooltipLines.push(`Level ${claimed.level} · +${((claimed.bonusMultiplier - 1) * 100).toFixed(0)}% bonus`);
        }
        if (hasResource) tooltipLines.push('🟡 Resources nearby');
        if (tooltipLines.length > 0) polygon.bindTooltip(tooltipLines.join('<br>'), { sticky: true });

        polygon.on('click', () => onHexClick?.(hexId, !!claimed, isMine));
        layerRef.current!.addLayer(polygon);
      });
    };

    drawHexes();
    map.on('moveend', drawHexes);
    map.on('zoomend', drawHexes);

    return () => {
      map.off('moveend', drawHexes);
      map.off('zoomend', drawHexes);
      layerRef.current?.clearLayers();
    };
  }, [map, resources, claimedHexes, currentPlayerId, onHexClick]);

  return null;
}
