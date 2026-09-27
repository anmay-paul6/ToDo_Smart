# 📱 ToDo Smart — Intelligent Task & Productivity App

A modern, high-performance task management and productivity web application built with **React 19**, **TypeScript**, and **Vite**.

![ToDo Smart](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite)

---

## ✨ Features

- 📊 **Interactive Dashboard**: Summary metrics, streak counters, focus time logs, and high-priority overviews.
- 📋 **5 Navigation Views**:
  - **Dashboard**: Unified overview of daily progress.
  - **Task List**: Advanced multi-filter (category, status, priority) and keyword search.
  - **Kanban Board**: Drag-and-drop status columns (`To Do`, `In Progress`, `Completed`).
  - **Calendar View**: Monthly calendar visualizing tasks by due date.
  - **Focus Timer**: Dedicated Pomodoro session timer with sound chimes and task tracking.
  - **Analytics**: Chart.js charts for category distribution and completion trends.
- ⭐ **Top Rated Smart Reminders**: Specialized auto-interval notifications for top priority tasks.
- 🔊 **Web Audio Synthesizer**: Custom sound chimes without external audio assets.
- 💾 **Local Storage Persistence**: Automatic offline data storage with pre-seeded demo tasks.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

> 💡 **Windows PowerShell Note**: If you encounter a script execution policy error, run `npm.cmd run dev` or run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` in your PowerShell window.

---

## 🛠️ Available Scripts

- `npm run dev` — Launch Vite local development server with HMR.
- `npm run build` — Compile TypeScript and build production bundle into `dist/`.
- `npm run preview` — Preview the production build locally.
- `npm run lint` — Lint code using Oxlint.

---

## 📖 Comprehensive Documentation

For a full technical breakdown of the architecture, component directory, state management model, and troubleshooting, see [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md).
