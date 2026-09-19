---
type: community
cohesion: 0.33
members: 6
---

# Check-in Flow & Thermal Printing

**Cohesion:** 0.33 - loosely connected
**Members:** 6 nodes

## Members
- [[Check-in History & Analytics]] - document - PLAN_VI.md
- [[Check-in Log Model (checkin_logs table)]] - document - PLAN_VI.md
- [[Fingerprint Check-in Engine]] - document - PLAN_VI.md
- [[Thermal Receipt Printing Service]] - document - PLAN_VI.md
- [[XPrinter XP-T80Q Thermal Printer]] - document - PLAN_VI.md
- [[node-thermal-printer (ESCPOS)]] - document - PLAN_VI.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Check-in_Flow__Thermal_Printing
SORT file.name ASC
```

## Connections to other communities
- 1 edge to [[_COMMUNITY_Hardware Integration & LAN]]
- 1 edge to [[_COMMUNITY_Member Management & Validation]]

## Top bridge nodes
- [[Fingerprint Check-in Engine]] - degree 4, connects to 2 communities