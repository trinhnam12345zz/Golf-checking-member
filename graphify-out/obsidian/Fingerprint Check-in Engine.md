---
source_file: "PLAN_VI.md"
type: "document"
community: "Check-in Flow & Thermal Printing"
location: "§4.1"
tags:
  - graphify/document
  - graphify/EXTRACTED
  - community/Check-in_Flow__Thermal_Printing
---

# Fingerprint Check-in Engine

## Connections
- [[Card Expiry & Anti-Sharing Validator]] - `calls` [EXTRACTED]
- [[Check-in Log Model (checkin_logs table)]] - `shares_data_with` [EXTRACTED]
- [[Thermal Receipt Printing Service]] - `calls` [EXTRACTED]
- [[node-zklib Socket Client (Port 4370)]] - `triggers` [EXTRACTED]

#graphify/document #graphify/EXTRACTED #community/Check-in_Flow__Thermal_Printing