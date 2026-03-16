'use client';
import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import * as h3 from 'h3-js';
import { Resource } from '@/types/game';

// H3 resolution: 9 = ~city block (~200m), 8 = ~neighborhood (~500m)
const HEX_RESOLUTION = 9;

const HEX_STYLE = {
  color: '#00ffcc',
  weight: 1,
  opacity: 0.4,
  fillColor: '#00ffcc',
  fillOpacity: 0.04,
};

const HEX_HAS_RESOURCE_STYLE = {
  color: '#ffcc00',
  weight: 1.5,
  opacity: 0.7,
  fillColor: '#ffcc00',
  fillOpacity: 0.12,
};

interface HexGridProps {
  resources: Resource[];
  onHexClick?: (hexId: string) => void;
}

export default function HexGrid({ resources, onHexClick }: HexGridProps) {
  const map = useMap();
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (layerRef.current) {
      layerRef.current.clearLayers();
    } else {
      layerRef.current = L.layerGroup().addTo(map);
    }

    const drawHexes = () => {
      layerRef.current!.clearLayers();

      const bounds = map.getBounds();
      const center = map.getCenter();

      // Get the H3 index for the map center
      const centerHex = h3.latLngToCell(center.lat, center.lng, HEX_RESOLUTION);

      // Get all hexes within k-ring radius of center (fills visible viewport)
      const hexes = h3.gridDisk(centerHex, 12);

      // Set of hex IDs that contain resources
      const resourceHexIds = new Set(
        resources.map((r) => h3.latLngToCell(r.position.lat, r.position.lng, HEX_RESOLUTION))
      );

      hexes.forEach((hexId) => {
        // Get hex boundary as [lat, lng] pairs
        const boundary = h3.cellToBoundary(hexId); // returns [lat, lng][]
        const latLngs = boundary.map(([lat, lng]) => [lat, lng] as [number, number]);

        const hasResource = resourceHexIds.has(hexId);
        const style = hasResource ? HEX_HAS_RESOURCE_STYLE : HEX_STYLE;

        const polygon = L.polygon(latLngs, style);

        polygon.on('click', () => onHexClick?.(hexId));

        if (hasResource) {
          const hexResources = resources.filter(
            (r) => h3.latLngToCell(r.position.lat, r.position.lng, HEX_RESOLUTION) === hexId
          );
          polygon.bindTooltip(
            `${hexResources.length} resource${hexResources.length > 1 ? 's' : ''} here`,
            { sticky: true }
          );
        }

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
  }, [map, resources, onHexClick]);

  return null;
}
