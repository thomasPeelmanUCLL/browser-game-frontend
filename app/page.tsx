'use client';
import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useWebSocket } from '@/hooks/useWebSocket';
import Inventory from '@/components/Inventory';
import HexActionPanel from '@/components/HexActionPanel';
import { InventoryItem, HexCell } from '@/types/game';

const GameMap = dynamic(() => import('@/components/GameMap'), { ssr: false });

// Temp player ID until auth is added
const TEMP_PLAYER_ID = 'player-' + Math.random().toString(36).slice(2, 8);

export default function Home() {
  const { position, error, loading } = useGeolocation();
  const { resources, hexes, connected, send } = useWebSocket();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedHexId, setSelectedHexId] = useState<string | null>(null);
  const [selectedHexOwned, setSelectedHexOwned] = useState(false);
  const [selectedHexMine, setSelectedHexMine] = useState(false);

  const selectedHexData = hexes.find((h) => h.hexId === selectedHexId) ?? null;

  const handleCollect = (resourceId: string) => {
    send({ type: 'COLLECT_RESOURCE', resourceId });
    const resource = resources.find((r) => r.id === resourceId);
    if (!resource) return;
    setInventory((prev) => {
      const existing = prev.find((i) => i.type === resource.type);
      if (existing) return prev.map((i) => i.type === resource.type ? { ...i, amount: i.amount + resource.amount } : i);
      return [...prev, { type: resource.type, amount: resource.amount }];
    });
  };

  const handleHexClick = useCallback((hexId: string, isOwned: boolean, isMine: boolean) => {
    setSelectedHexId(hexId);
    setSelectedHexOwned(isOwned);
    setSelectedHexMine(isMine);
  }, []);

  const handleClaim = () => {
    if (!selectedHexId) return;
    send({ type: 'CLAIM_HEX', hexId: selectedHexId, playerId: TEMP_PLAYER_ID });
    setSelectedHexId(null);
  };

  const handleUpgrade = () => {
    if (!selectedHexId) return;
    send({ type: 'UPGRADE_HEX', hexId: selectedHexId, playerId: TEMP_PLAYER_ID });
    setSelectedHexId(null);
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-black text-white">Getting your location...</div>;
  if (error) return <div className="flex h-screen items-center justify-center bg-black text-red-400">Location error: {error}</div>;
  if (!position) return null;

  return (
    <div className="relative w-full h-screen">
      <div className={`absolute top-4 right-4 z-[1000] px-3 py-1 rounded-full text-xs font-bold ${ connected ? 'bg-green-600 text-white' : 'bg-red-600 text-white' }`}>
        {connected ? '● Live' : '○ Offline'}
      </div>
      <HexActionPanel
        hexId={selectedHexId}
        hexData={selectedHexData}
        isMine={selectedHexMine}
        isOwned={selectedHexOwned}
        onClaim={handleClaim}
        onUpgrade={handleUpgrade}
        onClose={() => setSelectedHexId(null)}
      />
      <GameMap
        playerPosition={position}
        resources={resources}
        claimedHexes={hexes}
        currentPlayerId={TEMP_PLAYER_ID}
        onCollect={handleCollect}
        onHexClick={handleHexClick}
      />
      <Inventory items={inventory} />
    </div>
  );
}
