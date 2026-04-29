# R&R Atlas (Risk & Resilience Atlas) - MERN Mockup

## What this is
A clean UI prototype for a Risk + Resilience data atlas:
- Landing map + big search
- Area profile pages (risk snapshot, resources, live vs past events)
- National fire map + fire-focused area pages

## Dev
1) npm run install:all
2) npm run dev

Server: http://localhost:5050
Client: http://localhost:5173

## Search examples
- LA
- 90001
- fire map
- fire LA
- fire 90001

## Swapping in real data later
Replace server/src/data/* with API adapters (FEMA NRI, NASA FIRMS, etc).
Keep API shape stable for the client.

This mock uses in-memory demo data in server/src/data.

later add Mongo:
- Create collections: places, events, resources, riskSnapshots
- Write a script that upserts by stable IDs (FIPS/ZIP/canonical slug).
- Keep the API routes unchanged so the client UI doesn't need rewrites.
