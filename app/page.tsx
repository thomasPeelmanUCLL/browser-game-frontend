'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useWebSocket } from '@/hooks/useWebSocket';
import Inventory from '@/components/Inventory';
import { InventoryItem, ResourceType } from '@/types/game';

// Leaflet must be dynamically imported (no SSR)
const GameMap = dynamic(() => import('@/components/GameMap'), { ssr: false });

export default function Home() {
  const { position, error, loading } = useGeolocation();
  const { resources, connected, send } = useWebSocket();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const handleCollect = (resourceId: string) => {
    send({ type: 'COLLECT_RESOURCE', resourceId });
    // Optimistically update inventory for demo purposes
    const resource = resources.find((r) => r.id === resourceId);
    if (!resource) return;
    setInventory((prev) => {
      const existing = prev.find((i) => i.type === resource.type);
      if (existing) return prev.map((i) => i.type === resource.type ? { ...i, amount: i.amount + resource.amount } : i);
      return [...prev, { type: resource.type, amount: resource.amount }];
    });
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-black text-white">Getting your location...</div>;
  if (error) return <div className="flex h-screen items-center justify-center bg-black text-red-400">Location error: {error}</div>;
  if (!position) return null;

  return (
    <div className="relative w-full h-screen">
      <div className={`absolute top-4 right-4 z-[1000] px-3 py-1 rounded-full text-xs font-bold ${ connected ? 'bg-green-600 text-white' : 'bg-red-600 text-white' }`}>
        {connected ? '● Live' : '○ Offline'}
      </div>
      <GameMap playerPosition={position} resources={resources} onCollect={handleCollect} />
      <Inventory items={inventory} />
    </div>
  );
}
