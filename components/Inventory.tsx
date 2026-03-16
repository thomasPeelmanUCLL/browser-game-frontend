'use client';
import { InventoryItem, ResourceType } from '@/types/game';

const RESOURCE_EMOJI: Record<ResourceType, string> = {
  wood: '🪵',
  stone: '🪨',
  food: '🍎',
  water: '💧',
  rare: '💎',
};

export default function Inventory({ items }: { items: InventoryItem[] }) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white rounded-xl px-4 py-2 flex gap-4 z-[1000]">
      {items.length === 0 && <span className="text-gray-400 text-sm">No resources yet</span>}
      {items.map((item) => (
        <div key={item.type} className="flex items-center gap-1">
          <span>{RESOURCE_EMOJI[item.type]}</span>
          <span className="font-bold">{item.amount}</span>
        </div>
      ))}
    </div>
  );
}
