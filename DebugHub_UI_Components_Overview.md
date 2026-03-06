# DebugHub UI & Project Overview

This document provides a high-level overview of the UI components, pages, and the overall tech stack used in the DebugHub project.

## Tech Stack Overview

### Frontend
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **State Management**: Zustand
- **Routing**: React Router DOM (v7)
- **Key Libraries**: 
  - `@monaco-editor/react` (Code execution/editing)
  - `lucide-react` (Icons)
  - `html-to-image` & `jimp` (Image processing)

### Backend
- **Framework**: Express.js (Node.js)
- **Database/ORM**: Prisma
- **Authentication**: Passport.js (Google OAuth 2.0) & JWT
- **AI Integration**: `@google/genai`
- **Other utilities**: `node-cron` for scheduling tasks, `nodemailer` for emails

---

## UI Architecture & Components (`frontend/src/components`)

The UI is built using a component-driven architecture, heavily utilizing Tailwind CSS for styling. Components are logically grouped by feature:

### 1. General UI Elements (`/ui`)
Reusable, base-level components used across the application:
- `Badge.tsx`
- `Button.tsx`
- `Card.tsx`
- `SplitPathView.tsx`
- `Toast.tsx`

### 2. Layout & Navigation (`/layout` & Root)
Components responsible for the application's shell and navigation routing:
- `Layout.tsx`
- `Sidebar.tsx`
- `Topbar.tsx`
- `Navbar.tsx` (Root level)

### 3. Incident Simulation (`/incidents`)
Components specific to the immersive incident response scenarios:
- **Shared Elements**: `CrashOverlay.tsx`, `DebriefScreen.tsx`, `DecisionBar.tsx`, `PLCounter.tsx`, `TimerBar.tsx`
- **Core Views**: `RoleSelector.tsx`, `SimulationCanvas.tsx`
- **Role-specific Views** (`/roles`): `DevOpsEngineerView.tsx`, `RiskOfficerView.tsx`, `SystemsEngineerView.tsx`

### 4. General Simulator (`/simulator`)
Tools and visualizers for debugging and tracking simulations:
- `BlastRadius.tsx`
- `ExternalComms.tsx`
- `LogViewer.tsx`
- `PostMortemReview.tsx`
- `RevenueGraph.tsx`
- `RunbookPanel.tsx`

### 5. Community (`/community`)
Components for social/collaborative features:
- `CreateRoomModal.tsx`

---

## Application Pages (`frontend/src/pages`)

The core views accessible via routing:

- **Core/User**: `Login.tsx`, `Dashboard.tsx`, `Settings.tsx`, `Profile` modules.
- **Practice & Challenges**: `Practice.tsx`, `Challenge.tsx`, `DailyChallengesTracker.tsx`.
- **Debugging & Collaboration**: `DebugRoom.tsx`, `DebugReplay.tsx`, `Community.tsx`.
- **Simulation**: `Incidents.tsx`, `simulator/Simulator.tsx`, `incidents/KnightCapital.tsx`.
- **Meta/Tracking**: `Notifications.tsx`, `Portfolio.tsx`.

## Summary
The project is a robust full-stack application. The frontend revolves around interactive elements like a Monaco code editor and detailed incident simulations (e.g., charts, log viewers, timers). The backend securely handles authentication, database logic, and generation of dynamic debugging scenarios via Google's AI models.
