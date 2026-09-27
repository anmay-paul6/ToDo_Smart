# 📱 ToDo Smart — Project & Codebase Documentation

Welcome to **ToDo Smart**, a modern, feature-rich task management and productivity application built with React 19, TypeScript, and Vite.

---

## 📋 Table of Contents
1. [Project Overview & Key Features](#1-project-overview--key-features)
2. [Tech Stack](#2-tech-stack)
3. [Codebase Architecture & File Structure](#3-codebase-architecture--file-structure)
4. [Detailed Description of Modules & Components](#4-detailed-description-of-modules--components)
5. [State Management & Data Persistence](#5-state-management--data-persistence)
6. [Developer Guide: How to Setup & Run](#6-developer-guide-how-to-setup--run)
7. [Troubleshooting & Windows PowerShell Fixes](#7-troubleshooting--windows-powershell-fixes)

---

## 1. Project Overview & Key Features

**ToDo Smart** is designed to provide an all-in-one productivity workflow with rich aesthetics, real-time analytics, and automated reminders.

### Key Features:
- 📊 **Interactive Dashboard**: High-level metrics showing completed tasks, total time spent, streak counts, and priority tasks overview.
- 📋 **Multiple View Modes**:
  - **Dashboard**: Comprehensive overview of daily productivity.
  - **List View**: Multi-attribute filtering (category, status, priority), keyword search, and flexible sorting.
  - **Kanban Board**: Drag-and-drop / column-based task status management (`To Do`, `In Progress`, `Completed`).
  - **Calendar View**: Monthly calendar grid visualizing tasks scheduled by due date.
  - **Focus Timer (Pomodoro)**: Task-associated focus mode with custom timer intervals, ambient ticking, and audio chimes.
  - **Analytics View**: Visual charts tracking task completion trends, category breakdowns, and time allocation.
- ⭐ **Top Rated Smart Reminders**: Specialized high-priority task handling with configurable automated periodic reminders.
- ⏰ **Background Reminder Engine**: Scans active tasks every 30 seconds to trigger browser notifications and alert popups.
- 🔔 **Web Audio Chimes**: Built-in sound synthesis via Web Audio API without needing external audio files.
- 💾 **Offline First & Persistence**: Automatic state syncing with browser `localStorage` and built-in mock seed data.

---

## 2. Tech Stack

- **Framework**: React 19 (Functional components, Hooks)
- **Language**: TypeScript 6.0 (Strict mode typing)
- **Build Tool**: Vite 8.3 (Hot Module Replacement / HMR)
- **Icons**: Lucide React (`lucide-react`)
- **Charts**: Chart.js (`chart.js`, `react-chartjs-2`)
- **Date Utilities**: `date-fns`
- **Animations**: `canvas-confetti`
- **Styling**: Modern CSS3, CSS variables, glassmorphism, responsive grid & flex layout.

---

## 3. Codebase Architecture & File Structure

```
ToDo smart/
├── public/                   # Static public assets
├── src/
│   ├── assets/               # Application icons and imagery
│   ├── components/           # UI Components
│   │   ├── AnalyticsView.tsx # Productivity charts & data visualization
│   │   ├── AuthModal.tsx     # User authentication / profile modal
│   │   ├── CalendarView.tsx  # Monthly task calendar component
│   │   ├── Dashboard.tsx     # Main dashboard widgets & metrics summary
│   │   ├── FocusTimer.tsx    # Pomodoro focus session screen
│   │   ├── Header.tsx        # Top header with search bar & action buttons
│   │   ├── KanbanBoard.tsx   # Workflow board with drag-and-drop columns
│   │   ├── SettingsModal.tsx # Application settings (sounds, theme, intervals)
│   │   ├── Sidebar.tsx       # Navigation drawer & category filters
│   │   ├── TaskCard.tsx      # Individual task card with subtasks & progress
│   │   ├── TaskList.tsx      # Sortable and filterable task list view
│   │   ├── TaskModal.tsx     # Modal for creating and editing tasks
│   │   └── TopRatedReminderModal.tsx # Alert popup for Top Rated tasks
│   ├── services/
│   │   └── storage.ts        # LocalStorage wrapper & seed data initializer
│   ├── types/
│   │   └── todo.ts           # Type definitions (Task, Priority, UserProfile, etc.)
│   ├── utils/
│   │   ├── reminderEngine.ts # Background ticker for task reminders
│   │   └── sound.ts          # Web Audio API chime sound generator
│   ├── App.tsx               # Root component (State provider & view router)
│   ├── App.css               # Main application component styles
│   ├── index.css             # Design tokens, variables, & global reset
│   └── main.tsx              # React DOM entry point
├── package.json              # Dependencies and NPM scripts
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript root config
└── PROJECT_DOCUMENTATION.md  # Comprehensive project documentation
```

---

## 4. Detailed Description of Modules & Components

### 4.1 Core Type Definitions (`src/types/todo.ts`)
Defines the core data structures:
- `Task`: Contains `id`, `title`, `description`, `priority` (`low`, `medium`, `high`, `top_rated`), `category`, `subtasks`, `dueDate`, `dueTime`, `estimatedMinutes`, `timeSpentMinutes`, and `reminders`.
- `UserProfile`: Holds user settings including `streakDays`, `topRatedReminderInterval`, `soundEnabled`, `browserNotificationsEnabled`, and `theme`.
- `TaskFilterState`: Controls filtering logic for search query, category, priority, status, and sorting order.

### 4.2 Storage Service (`src/services/storage.ts`)
- Manages reading/writing to `localStorage` under keys `todo_smart_tasks` and `todo_smart_user`.
- Includes initial mock data so new users immediately see demo tasks across categories (Work, Personal, Health, Study, Projects).

### 4.3 Utilities (`src/utils/`)
- **`reminderEngine.ts`**: Subscribes listeners to periodic checks (every 30s) against tasks' due dates and interval reminders for Top Rated items.
- **`sound.ts`**: Uses Web Audio API to create synthetic audio tones for timer completion, reminder alerts, and task completion celebrations.

### 4.4 Major Components (`src/components/`)
- **`Header.tsx`**: Contains global search, view mode toggle shortcuts, quick task add button, and profile menu.
- **`Sidebar.tsx`**: Left navigation drawer providing view selection, category filtering, and productive streak indicator.
- **`Dashboard.tsx`**: Displays hero metrics, upcoming deadlines, task completion progress bars, and top-priority task cards.
- **`TaskList.tsx` & `TaskCard.tsx`**: Detailed list view rendering task cards equipped with subtask checklists, time logs, category tags, and edit/delete actions.
- **`KanbanBoard.tsx`**: Provides drag-and-drop or click-to-move workflow columns (`To Do`, `In Progress`, `Completed`).
- **`CalendarView.tsx`**: Displays tasks mapped onto a monthly calendar grid with daily task counters and modal triggers.
- **`FocusTimer.tsx`**: Pomodoro timer with play/pause/reset controls, task selector, time log accumulator, and completion celebration.
- **`AnalyticsView.tsx`**: Uses Chart.js to render visual insights: category breakdown (doughnut), weekly task completion rates (bar chart), and time allocation stats.
- **Modals (`TaskModal.tsx`, `AuthModal.tsx`, `SettingsModal.tsx`, `TopRatedReminderModal.tsx`)**: Modal overlays handling form creation, user configuration, and high-priority reminders.

---

## 5. State Management & Data Persistence

State is managed centrally inside `src/App.tsx` using React `useState` and `useEffect` hooks:
- Task updates automatically trigger `storageService.saveTasks(updatedTasks)`.
- User preference updates trigger `storageService.saveUser(updatedUser)`.
- Global filter state controls visible tasks across `TaskList`, `KanbanBoard`, and `CalendarView`.

---

## 6. Developer Guide: How to Setup & Run

### Prerequisites
- **Node.js** (Version 18.0 or higher)
- **npm** (Version 9.0 or higher)

### Step-by-Step Instructions

1. **Open Terminal in Project Directory**
   ```cmd
   d:\ToDo smart
   ```

2. **Install Dependencies**
   Run the following command to install all required npm packages:
   ```bash
   npm install
   ```

3. **Start Development Server**
   Start Vite in development mode:
   ```bash
   npm run dev
   ```

4. **Access Application**
   Open your browser and navigate to the address displayed in the terminal output:
   `http://localhost:5173`

5. **Build for Production**
   To generate optimized production build files in the `dist/` directory:
   ```bash
   npm run build
   ```

6. **Preview Production Build**
   To test the production build locally:
   ```bash
   npm run preview
   ```

---

## 7. Troubleshooting & Windows PowerShell Fixes

### Windows Script Execution Policy Error
If running `npm` commands in Windows PowerShell throws the error:
> `npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system...`

You can solve this using one of the following methods:

#### Solution A: Use `npm.cmd` (Quickest & Safest)
Simply append `.cmd` to `npm` commands:
```powershell
npm.cmd install
npm.cmd run dev
```

#### Solution B: Enable Scripts for Current PowerShell Session
Run this once in your terminal window before running `npm`:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm run dev
```

#### Solution C: Permanent Fix for Windows User Account
Run this command in PowerShell to allow signed scripts permanently:
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```
(Type `Y` and press `Enter` when prompted).
