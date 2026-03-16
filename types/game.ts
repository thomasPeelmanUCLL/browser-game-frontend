export interface Position {
  lat: number;
  lng: number;
}

export type ResourceType = 'wood' | 'stone' | 'food' | 'water' | 'rare';

export interface Resource {
  id: string;
  type: ResourceType;
  position: Position;
  amount: number;
  respawnAt?: string; // ISO timestamp
}

export interface Player {
  id: string;
  username: string;
  position: Position;
  inventory: InventoryItem[];
}

export interface InventoryItem {
  type: ResourceType;
  amount: number;
}

export type WSMessage =
  | { type: 'PLAYER_MOVE'; position: Position }
  | { type: 'COLLECT_RESOURCE'; resourceId: string }
  | { type: 'RESOURCES_UPDATE'; resources: Resource[] }
  | { type: 'COLLECT_SUCCESS'; resourceId: string; item: InventoryItem }
  | { type: 'COLLECT_FAIL'; reason: string };
