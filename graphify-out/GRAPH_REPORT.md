# Graph Report - checking golf member  (2026-09-19)

## Corpus Check
- Corpus is ~13,658 words - fits in a single context window. You may not need a graph.

## Summary
- 28 nodes · 30 edges · 7 communities (6 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 12,000 input · 3,500 output

## Community Hubs (Navigation)
- Check-in Flow & Thermal Printing
- Backend Server & Environments
- Member Management & Validation
- Hardware Integration & LAN
- Knowledge Graph & Documentation
- UI Modes & Presentation
- Staff Management & Security

## God Nodes (most connected - your core abstractions)
1. `Golf Member Check-in System` - 6 edges
2. `Electron Desktop Client (Win 10/11)` - 5 edges
3. `Express.js Backend API Server` - 4 edges
4. `Fingerprint Check-in Engine` - 4 edges
5. `PostgreSQL Central Database` - 3 edges
6. `React 18 + Vite UI Frontend` - 3 edges
7. `node-zklib Socket Client (Port 4370)` - 3 edges
8. `Graphify Knowledge Graph Skill` - 3 edges
9. `Windows Server (Server Room)` - 2 edges
10. `Internal LAN Network (TCP/IP)` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Graphify Knowledge Graph Skill` --references--> `Golf Member Check-in System`  [EXTRACTED]
  HUONG_DAN_GRAPHIFY.md → PLAN_VI.md

## Communities (7 total, 1 thin omitted)

### Community 0 - "Check-in Flow & Thermal Printing"
Cohesion: 0.33
Nodes (6): Check-in History & Analytics, Fingerprint Check-in Engine, Check-in Log Model (checkin_logs table), node-thermal-printer (ESC/POS), Thermal Receipt Printing Service, XPrinter XP-T80Q Thermal Printer

### Community 1 - "Backend Server & Environments"
Cohesion: 0.47
Nodes (6): Development Environment (SQLite/Mock), Golf Member Check-in System, Production Go-Live Environment, Express.js Backend API Server, PostgreSQL Central Database, Windows Server (Server Room)

### Community 2 - "Member Management & Validation"
Cohesion: 0.50
Nodes (4): Card Expiry & Anti-Sharing Validator, Excel/CSV Migration Engine, Member Management CRUD Module, Member Data Model (members table)

### Community 3 - "Hardware Integration & LAN"
Cohesion: 0.67
Nodes (4): Electron Desktop Client (Win 10/11), Internal LAN Network (TCP/IP), node-zklib Socket Client (Port 4370), ZKTeco K60 Biometric Terminal

### Community 4 - "Knowledge Graph & Documentation"
Cohesion: 0.67
Nodes (3): GRAPH_REPORT.md Architecture Audit, Graphify Knowledge Graph Skill, graph.html Interactive Visualizer

### Community 5 - "UI Modes & Presentation"
Cohesion: 0.67
Nodes (3): Kiosk Self-Service Mode, React 18 + Vite UI Frontend, Receptionist Counter Mode

## Knowledge Gaps
- **11 isolated node(s):** `XPrinter XP-T80Q Thermal Printer`, `Staff & RBAC Management Module`, `Check-in History & Analytics`, `Excel/CSV Migration Engine`, `System User Model (users table)` (+6 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 11 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Electron Desktop Client (Win 10/11)` connect `Hardware Integration & LAN` to `Backend Server & Environments`, `UI Modes & Presentation`?**
  _High betweenness centrality (0.537) - this node is a cross-community bridge._
- **Why does `Fingerprint Check-in Engine` connect `Check-in Flow & Thermal Printing` to `Member Management & Validation`, `Hardware Integration & LAN`?**
  _High betweenness centrality (0.484) - this node is a cross-community bridge._
- **Why does `node-zklib Socket Client (Port 4370)` connect `Hardware Integration & LAN` to `Check-in Flow & Thermal Printing`?**
  _High betweenness centrality (0.446) - this node is a cross-community bridge._
- **What connects `XPrinter XP-T80Q Thermal Printer`, `Staff & RBAC Management Module`, `Check-in History & Analytics` to the rest of the system?**
  _11 weakly-connected nodes found - possible documentation gaps or missing edges._