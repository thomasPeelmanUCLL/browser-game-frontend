import { useEffect, useRef, useState, useCallback } from 'react';
import { WSMessage, Resource, HexCell } from '@/types/game';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:4000';

export function useWebSocket() {
  const ws = useRef<WebSocket | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [hexes, setHexes] = useState<HexCell[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => setConnected(true);
    ws.current.onclose = () => setConnected(false);

    ws.current.onmessage = (event) => {
      const msg: WSMessage = JSON.parse(event.data);

      if (msg.type === 'RESOURCES_UPDATE') setResources(msg.resources);

      if (msg.type === 'HEXES_UPDATE') setHexes(msg.hexes);

      // Merge single hex updates (claim/upgrade from other players)
      if (msg.type === 'HEX_CLAIMED' || msg.type === 'HEX_UPGRADED') {
        setHexes((prev) => {
          const exists = prev.find((h) => h.hexId === msg.hex.hexId);
          if (exists) return prev.map((h) => h.hexId === msg.hex.hexId ? msg.hex : h);
          return [...prev, msg.hex];
        });
      }
    };

    return () => ws.current?.close();
  }, []);

  const send = useCallback((msg: WSMessage) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(msg));
    }
  }, []);

  return { resources, hexes, connected, send };
}
