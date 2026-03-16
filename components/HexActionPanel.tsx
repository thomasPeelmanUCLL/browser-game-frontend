'use client';
import { HexCell } from '@/types/game';

interface HexActionPanelProps {
  hexId: string | null;
  hexData: HexCell | null;
  isMine: boolean;
  isOwned: boolean;
  onClaim: () => void;
  onUpgrade: () => void;
  onClose: () => void;
}

export default function HexActionPanel({ hexId, hexData, isMine, isOwned, onClaim, onUpgrade, onClose }: HexActionPanelProps) {
  if (!hexId) return null;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-black/80 text-white rounded-xl px-5 py-3 min-w-64 shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-400 font-mono">{hexId.slice(0, 12)}...</span>
        <button onClick={onClose} className="text-gray-400 hover:text-white text-lg leading-none">&times;</button>
      </div>

      {isOwned && hexData ? (
        <>
          <p className="font-bold">{isMine ? '✅ Your territory' : `👤 Owned by ${hexData.owner?.username ?? 'Unknown'}`}</p>
          <p className="text-sm text-gray-300">Level {hexData.level} · {((hexData.bonusMultiplier - 1) * 100).toFixed(0)}% resource bonus</p>
          {isMine && hexData.level < 5 && (
            <button onClick={onUpgrade} className="mt-2 w-full py-1 bg-blue-600 hover:bg-blue-500 rounded text-sm font-bold">
              ⬆ Upgrade (Level {hexData.level} → {hexData.level + 1})
            </button>
          )}
          {isMine && hexData.level >= 5 && (
            <p className="mt-2 text-yellow-400 text-sm text-center">⭐ Max level!</p>
          )}
        </>
      ) : (
        <>
          <p className="text-gray-300 text-sm mb-2">Unclaimed territory</p>
          <button onClick={onClaim} className="w-full py-1 bg-green-600 hover:bg-green-500 rounded text-sm font-bold">
            🏴 Claim this hex
          </button>
        </>
      )}
    </div>
  );
}
