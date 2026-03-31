# Office Trip Tracker (MileTrack)

## Current State
New project — no existing app files.

## Requested Changes (Diff)

### Add
- Trip logging: date/time, purpose (kya lene gya), destination, kilometers
- Daily km summary with per-day breakdown
- Trip history list with all logged trips
- Stats: total trips, total km, last trip
- Edit/delete trips
- Authorization so data is per-user

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Backend: Trip entity with fields — id, date, purpose, destination, kilometers, createdAt. CRUD operations. Daily summary query. Total stats query.
2. Frontend: Dashboard with today summary + stats cards + bar chart of daily km. Log Trip form (modal). Trip History table. Navigation tabs.
3. Authorization component for per-user data.
