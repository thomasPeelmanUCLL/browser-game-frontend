# browser-game-frontend

Next.js + TypeScript frontend for a real-world location-based resource gathering game.

## Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Leaflet.js + react-leaflet (map rendering)
- OpenStreetMap tiles (free, no API key)

## Setup

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app
npm install leaflet react-leaflet
npm install -D @types/leaflet
```

## Run
```bash
npm run dev
```

## Structure
```
app/           - Next.js app router pages
components/    - GameMap, ResourceMarker, Inventory
hooks/         - useGeolocation, useWebSocket
types/         - Shared TypeScript interfaces
```
