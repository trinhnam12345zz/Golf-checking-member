---
type: community
cohesion: 0.50
members: 4
---

# Member Management & Validation

**Cohesion:** 0.50 - moderately connected
**Members:** 4 nodes

## Members
- [[Card Expiry & Anti-Sharing Validator]] - document - PLAN_VI.md
- [[ExcelCSV Migration Engine]] - document - PLAN_VI.md
- [[Member Data Model (members table)]] - document - PLAN_VI.md
- [[Member Management CRUD Module]] - document - PLAN_VI.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Member_Management__Validation
SORT file.name ASC
```

## Connections to other communities
- 1 edge to [[_COMMUNITY_Check-in Flow & Thermal Printing]]

## Top bridge nodes
- [[Card Expiry & Anti-Sharing Validator]] - degree 2, connects to 1 community