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
  hexId?: string;
  respawnAt?: string;
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

export interface HexCell {
  hexId: string;
  ownerId: string | null;
  owner?: { id: string; username: string } | null;
  level: number;
  bonusMultiplier: number;
  claimedAt: string;
}

export type WSMessage =
  | { type: 'PLAYER_MOVE'; position: Position }
  | { type: 'COLLECT_RESOURCE'; resourceId: string }
  | { type: 'CLAIM_HEX'; hexId: string; playerId: string }
  | { type: 'UPGRADE_HEX'; hexId: string; playerId: string }
  | { type: 'RESOURCES_UPDATE'; resources: Resource[] }
  | { type: 'HEXES_UPDATE'; hexes: HexCell[] }
  | { type: 'HEX_CLAIMED'; hex: HexCell }
  | { type: 'HEX_UPGRADED'; hex: HexCell }
  | { type: 'COLLECT_SUCCESS'; resourceId: string; item: InventoryItem }
  | { type: 'COLLECT_FAIL'; reason: string }
  | { type: 'CLAIM_HEX_RESULT'; success: boolean; reason?: string; hex?: HexCell }
  | { type: 'UPGRADE_HEX_RESULT'; success: boolean; reason?: string; hex?: HexCell };
