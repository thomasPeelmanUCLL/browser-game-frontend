import { useEffect, useRef, useState, useCallback } from 'react';
import { WSMessage, Resource } from '@/types/game';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:4000';

export function useWebSocket() {
  const ws = useRef<WebSocket | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => setConnected(true);
    ws.current.onclose = () => setConnected(false);

    ws.current.onmessage = (event) => {
      const msg: WSMessage = JSON.parse(event.data);
      if (msg.type === 'RESOURCES_UPDATE') {
        setResources(msg.resources);
      }
    };

    return () => ws.current?.close();
  }, []);

  const send = useCallback((msg: WSMessage) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(msg));
    }
  }, []);

  return { resources, connected, send };
}
