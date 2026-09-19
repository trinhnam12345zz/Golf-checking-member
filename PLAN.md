# Implementation Plan: Golf Member Fingerprint Check-in System

## 1. Project Overview

**Goal:** Build a desktop application that authenticates golf club members using **fingerprint scanning** to prevent membership card sharing. Upon successful authentication, the system prints a **confirmation bill** via thermal printer.

**Key Problem Solved:** Current card-based check-in allows members to lend their cards to non-members. Fingerprint biometrics ensures only the registered member can check in.

---

## 2. Technology Stack Recommendation

### 2.1. Application Framework: **Electron + React**

| Why Electron? | Detail |
| :--- | :--- |
| Runs on **Windows PC** | Electron creates native Windows desktop apps |
| **USB hardware access** | Node.js backend can communicate directly with fingerprint scanner SDK and thermal printer |
| **Multi-station support** | Built-in HTTP server allows 2-3 PCs to share a central database over LAN |
| **Offline capable** | Works without internet, data stored locally |
| Familiar tech | Built with HTML/CSS/JavaScript - easy to maintain and customize |

### 2.2. Full Stack

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite | UI components, dual mode (Kiosk / Receptionist) |
| **Desktop Shell** | Electron 30+ | Windows app wrapper, USB device access, printer access |
| **Backend API** | Express.js (inside Electron) | REST API for member CRUD, check-in logic, reports |
| **Database** | PostgreSQL (on company server) | Member data, fingerprint templates, check-in history |
| **Fingerprint SDK** | DigitalPersona / SecuGen Node.js SDK | Capture, enroll, and verify fingerprints |
| **Thermal Printing** | `node-thermal-printer` or `escpos` library | Format and send bill to Epson TM-T82 compatible printers |

> [!IMPORTANT]
> **Why not a web app?** A regular web browser **cannot** access USB fingerprint scanners or thermal printers directly. Electron solves this by providing Node.js-level hardware access while keeping the UI as a modern web interface.

### 2.3. Hardware Recommendation: Fingerprint Scanner

| Model | Price (VND) | SDK Support | Pros |
| :--- | :--- | :--- | :--- |
| **(Recommended) DigitalPersona U.are.U 4500** | ~2,000,000 - 3,000,000 | Windows SDK + Node.js wrapper available | Industry standard, excellent accuracy, widely used in Vietnam |
| SecuGen Hamster Pro 20 (HU20) | ~1,500,000 - 2,500,000 | Windows SDK + C#/Node bindings | Good accuracy, compact, budget-friendly |
| ZKTeco ZK4500 | ~1,200,000 - 1,800,000 | Windows SDK | Cheapest option, decent for basic use |

> [!TIP]
> **Recommendation:** The **DigitalPersona U.are.U 4500** is the safest choice. It has the most mature SDK, widest community support, and is commonly used in banking/enterprise biometric systems in Vietnam. Simply plug the USB scanner into the PC and the app detects it automatically.

---

## 3. System Architecture

The company has a **dedicated server room with Windows Server**. The database and API server will run centrally on this server. All reception PCs connect to it via the internal LAN network.

```
┌──────────────── Server Room ────────────────┐
│                                             │
│   Windows Server                            │
│   ┌───────────────────────────────────┐     │
│   │  PostgreSQL Database              │     │
│   │  (members, fingerprints, logs)    │     │
│   ├───────────────────────────────────┤     │
│   │  Node.js API Server (Express)    │     │
│   │  (REST API for all operations)    │     │
│   └──────────────┬────────────────────┘     │
│                  │                          │
└──────────────────┼──────────────────────────┘
                   │ LAN Network
        ┌──────────┼──────────┐
        │          │          │
   ┌────▼────┐ ┌───▼────┐ ┌───▼────┐
   │  PC #1  │ │ PC #2  │ │ PC #3  │
   │Counter 1│ │Counter 2│ │ Admin  │
   │         │ │         │ │        │
   │Electron │ │Electron │ │Electron│
   │  App    │ │  App    │ │  App   │
   │         │ │         │ │        │
   │[USB FP] │ │[USB FP] │ │        │
   │[Printer]│ │[Printer]│ │        │
   └─────────┘ └─────────┘ └────────┘
```

**How it works:**
- **Server (Server Room):** Runs PostgreSQL database + Node.js API server 24/7. All member data, fingerprint templates, and check-in logs are stored here. IT team manages backups.
- **Client PCs (Reception counters):** Run the Electron desktop app. The app connects to the API server over LAN to read/write data. Each PC has its own USB fingerprint scanner and thermal printer attached locally.
- **Admin PC:** Same Electron app but logged in as Admin role. No hardware needed — used for member management, reports, and data export.

> [!TIP]
> **Benefit of this architecture:** If a reception PC breaks down, just replace it and install the app — all data is safe on the server. IT team can also schedule automatic PostgreSQL backups on the server.

---

## 4. Feature Breakdown by Phase

### Phase 1: Core Check-in Flow (MVP)
> Priority: 🔴 Must Have

- [ ] Fingerprint scanner integration (capture, enroll, verify)
- [ ] Member check-in via fingerprint verification
- [ ] New member registration with fingerprint enrollment
- [ ] Check-in result screen (success / failed / expired card)
- [ ] Block check-in if membership expired → show alert to receptionist
- [ ] Print confirmation bill via thermal printer
- [ ] Basic member management (Add, Edit, Delete)
- [ ] Search members (by name, member ID, phone number)
- [ ] Login screen with role-based access (Admin / Receptionist)
- [ ] Staff account management — Admin only (Create, Edit, Delete receptionist accounts, reset passwords, lock/unlock accounts)

### Phase 2: Data Management & Import
> Priority: 🟡 Important

- [ ] Import members from Excel/CSV file (bulk)
- [ ] Renew membership (extend expiry date, add rounds)
- [ ] Check-in history log per member
- [ ] Dual mode UI toggle (Kiosk mode / Receptionist mode)

### Phase 3: Reporting & Export
> Priority: 🟢 Nice to Have

- [ ] Dashboard: daily/monthly check-in count, active vs expired members
- [ ] Members expiring soon alert list
- [ ] Export check-in history to Excel/PDF
- [ ] Export member list to Excel/PDF
- [ ] Multi-station shared database (LAN setup)

---

## 5. Data Model (Database Schema)

### Table: `users` (System Users - Admin & Receptionist)
| Column | Type | Description |
| :--- | :--- | :--- |
| id | INTEGER PK | Auto-increment |
| username | TEXT UNIQUE | Login username |
| password_hash | TEXT | Bcrypt hashed password |
| full_name | TEXT | Display name |
| role | TEXT | `admin` or `receptionist` |
| created_at | DATETIME | Account creation date |

### Table: `members` (Golf Club Members)
| Column | Type | Description |
| :--- | :--- | :--- |
| id | INTEGER PK | Auto-increment |
| member_code | TEXT UNIQUE | Member ID (e.g., GM-0001) |
| full_name | TEXT | Full name |
| gender | TEXT | Male / Female |
| phone | TEXT | Phone number |
| email | TEXT | Email (optional) |
| date_of_birth | DATE | Date of birth |
| id_card | TEXT | National ID / Passport |
| membership_tier | TEXT | VIP / Gold / Platinum / Diamond / Standard |
| status | TEXT | `active`, `expired`, `suspended` |
| start_date | DATE | Membership start date |
| expiry_date | DATE | Membership expiry date |
| remaining_rounds | INTEGER | Remaining play rounds (nullable) |
| photo_path | TEXT | Path to member photo file |
| fingerprint_template | BLOB | Encoded fingerprint template data |
| fingerprint_registered | BOOLEAN | Whether fingerprint has been enrolled |
| notes | TEXT | Additional notes |
| created_at | DATETIME | Record creation date |
| updated_at | DATETIME | Last update date |

### Table: `checkin_logs` (Check-in History)
| Column | Type | Description |
| :--- | :--- | :--- |
| id | INTEGER PK | Auto-increment |
| member_id | INTEGER FK | Reference to members.id |
| checkin_time | DATETIME | Exact check-in timestamp |
| station_name | TEXT | Which counter/PC performed the check-in |
| verified_by | TEXT | Fingerprint / Manual override |
| operator_id | INTEGER FK | Which user (receptionist) was logged in |
| bill_printed | BOOLEAN | Whether bill was printed successfully |
| notes | TEXT | Any special notes |

---

## 6. UI Screens Overview

### 6.1. Login Screen
- Username + Password fields
- Role displayed after login (Admin badge / Receptionist badge)

### 6.2. Check-in Screen (Main Screen)
- **Large fingerprint scan area** with visual feedback (animated fingerprint icon)
- "Place your finger on the scanner" instruction
- After scan: Show member photo, name, tier, status
- If **success**: Green confirmation → Auto-print bill → Reset after 5 seconds
- If **expired**: Red alert → "Membership expired. Please contact reception" → Block check-in
- If **not found**: "Fingerprint not registered" → Option to register new member
- **Mode toggle button**: Switch between Kiosk (large UI, member-facing) and Receptionist (compact, staff-facing)

### 6.3. Member Management (Admin only)
- Searchable table with all members
- Add / Edit / Delete member forms
- Fingerprint enrollment button (opens scanner capture flow)
- Renew membership form
- Import from Excel/CSV button

### 6.4. Check-in History
- Filterable table (by date range, member, station)
- Export to Excel / PDF buttons

### 6.5. Staff Management (Admin only)
- Staff accounts table (username, full name, role, status)
- Create new receptionist account (username, default password, full name, role)
- Edit account / Change role
- Reset password (Admin resets password for staff who forgot theirs)
- Lock / Unlock account (lock when staff leaves, no need to delete — preserves history)
- View activity log per staff (who checked in which member, when)

### 6.6. Dashboard (Admin only)
- Today's check-in count
- Active vs Expired member count
- Members expiring within 30 days
- Monthly check-in trend chart

---

## 7. Bill Template (Placeholder)

A basic default bill structure (you will provide the final design later):

```
================================
    [GOLF CLUB NAME]
    Member Check-in Receipt
================================
Member:     [Full Name]
ID:         [GM-XXXX]
Tier:       [Diamond VIP]
Status:     [ACTIVE ✓]
--------------------------------
Check-in:   [19/09/2026 12:30]
Station:    [Counter 1]
Verified:   [Fingerprint ✓]
================================
   Thank you for visiting!
================================
```

---

## 8. Risks & Mitigations

| Risk | Impact | Mitigation |
| :--- | :--- | :--- |
| Fingerprint scanner SDK compatibility with Node.js | Could block entire project | Research SDK availability BEFORE purchasing hardware. Prototype fingerprint capture first |
| Wet/dirty fingers fail to scan | Member frustration | Allow manual override by Admin (enter member code + receptionist confirmation) |
| Database corruption on power outage | Data loss | SQLite WAL mode + automatic daily backups to USB drive |
| Multi-station sync conflicts | Data inconsistency | Use PostgreSQL with proper transaction locking for production |

---

## 9. Verification Plan

### Phase 1 Verification:
1. **Fingerprint SDK test:** Connect scanner → Capture fingerprint → Verify match → Print result
2. **Check-in flow test:** Register a test member → Enroll fingerprint → Check-in → Verify bill prints correctly
3. **Expired member test:** Set a test member's expiry to yesterday → Attempt check-in → Verify block + alert
4. **Login test:** Login as Admin → Verify all features visible. Login as Receptionist → Verify management features hidden

### Phase 2-3 Verification:
1. **Import test:** Prepare a 50-row Excel file → Import → Verify all members created correctly
2. **History test:** Perform 10 check-ins → Export to Excel → Verify data accuracy
3. **Multi-station test:** Install app on 2 PCs → Check-in on PC1 → Verify history visible on PC2
