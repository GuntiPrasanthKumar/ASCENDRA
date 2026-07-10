# README Architecture - SkillTrove v2

This document provides a high-level overview of the architectural decisions, design philosophies, and technological structures of the SkillTrove v2 platform.

---

## 1. System Topology

SkillTrove v2 operates on a decoupled client-server architecture:

```text
┌─────────────────┐        HTTP / REST        ┌─────────────────┐
│  React Client   │ ────────────────────────> │  Node.js API    │
│  (Vite + React) │ <──────────────────────── │  (Express + DB) │
└─────────────────┘      JSON Payload         └─────────────────┘
```

---

## 2. Core Frontend Foundations

### A. Modular Code-Splitting & Bundling
To maintain instant initial page load speeds, the heavy third-party assets are dynamically code-split in `vite.config.js` via manual rollup chunks:
*   `vendor-three`: Bundles `@react-three/fiber` and `@react-three/drei` dynamically. Loaded asynchronously only when rendering the 3D Hero canvas.
*   `vendor-faceapi`: Encapsulates `face-api.js` client models, keeping standard pages light.
*   `vendor-lucide`: Isolates vector icons to prevent import bloat.

### B. Global State Store
State is maintained via Zustand's persisted hook state (`src/hooks/useAuthStore.js`), managing secure tokens, session validation, and role identification.

---

## 3. Core Backend Framework

*   **Database Models**:
    *   `User`: Holds account profile records, biometric descriptors, streak counts, and accumulated points.
    *   `AssessmentResult`: Stores proctored test results, including gaze strike violation counts and score accuracies.
    *   `Chat`: Caches AI Tutor dialogues for persistent context.
*   **AI Integration**:
    *   `ai.service.js` compiles adaptive questions using `gemini-1.5-flash` on-the-fly and standardizes response parsing via strict JSON schemas based on Bloom's Taxonomy.

---

## 4. Biometric Authentication & Proctoring Lifecycle

*   **Facial Recognition Login**: Matching is executed on the server using Euclidean distance comparison between the captured 128-float face descriptor and the database descriptor. Distance $\le 0.6$ grants access.
*   **Proctoring Tracker**: Eye-gaze vectors, audio thresholds, head rotations, and window focus hooks run on-the-fly to intercept cheat attempts.
