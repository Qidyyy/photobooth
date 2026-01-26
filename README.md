# Photobooth

A modern, responsive web-based photobooth application built with Next.js and TypeScript. This project provides a seamless and interactive experience for capturing moments, customizing photo layouts, and sharing memories.

## 🌟 Features

- **Dual Capture Modes**: Integrated hardware access for **Live Camera** feed and file system integration for **Uploads**.
- **Interactive Session Flow**: Custom-built state machine managing `idle` -> `countdown` -> `capture` -> `review` states.
- **Smart Layout Engine**: unique algorithms to fit photos of varying aspect ratios into fixed templates (Strips, Grids) without distortion.
- **Gesture Control**: Drag-and-drop customization for photo positioning.
- **Instant Sharing**: integrated QR code generation and print-ready CSS modules.
- **Responsive Design**: Fluid UI that adapts across mobile, tablet, and desktop viewports.

## 🏗️ Technical Architecture & Challenges

This project goes beyond simple UI to handle real-world browser capabilities and complex state.

### 🔌 Hardware Integration (`useCamera`)

- Implemented secure, browser-compatible access to `UserMedia` API.
- Handled permission states, stream lifecycle management, and clean track disposal to prevent memory leaks.
- Added fallback mechanisms for mobile and non-secure contexts.

### ⏱️ Session State Machine (`usePhotoSession`)

- Engineered a robust custom hook to manage the asynchronous nature of a photo session.
- Coordinates precise timing for:
  - Countdown timers (3s)
  - Flash animation synchronization
  - Sequential image capture (4 photos per burst)
  - Transition handling between capture and review phases.

### 🎨 Responsive Canvas Logic

- Developed config-driven layout system (`layout-config.ts`) to decouple design from logic.
- Implemented `useResponsiveScale` and `useResponsiveContain` hooks to ensure the canvas and interactive elements maintain aspect ratios regardless of the screen size (vital for the "Preview" vs "Print" consistency).

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State**: React Hooks (useRef, useState, useReducer patterns)
- **Testing**: [Vitest](https://vitest.dev/) & React Testing Library

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/mvp-photobooth.git
    cd mvp-photobooth
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run logic locally:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser. Allow camera permissions when prompted.

---

## 📂 Project Structure

- `src/hooks`: Contains the core business logic and hardware integration.
- `src/lib`: Layout configurations and pure utility functions.
- `src/components`: UI components separated by feature responsibility.
