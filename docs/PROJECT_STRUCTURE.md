# Project Structure - SkillTrove v2

This document details the file directory layout and architectural mappings of the SkillTrove v2 project.

---

## Directory Map

```text
SKILLTROVEMAX/
├── backend/                  # Node.js Server Application
│   ├── app/
│   │   ├── config/          # DB config, environment validation
│   │   ├── controllers/     # Business logic layers (Auth, Practice, Chats)
│   │   ├── middleware/      # Role filters, authorization checkers
│   │   ├── models/          # Mongoose collections (User, Result, Chat)
│   │   ├── routes/          # REST Endpoint definitions
│   │   └── services/        # Third-party engines (ai.service.js)
│   └── server.js            # Node startup script
│
├── src/                      # Frontend Application
│   ├── assets/              # Static vector shapes and icons
│   ├── components/
│   │   ├── 3d/              # ThreeJS/Fiber canvases (HeroScene)
│   │   ├── auth/            # ProtectedRoute, WebcamView
│   │   ├── common/          # Navbar, Footer, PageLoader, ErrorBoundary
│   │   └── dashboard/       # Charts, Heatmap components
│   ├── hooks/               # useAuthStore, useFaceDetection, useProctor
│   ├── pages/               # Routed pages (Dashboard, Practice, AIMentor)
│   ├── utils/               # Axios clients (api.js)
│   ├── App.jsx              # Routing configurations
│   ├── index.css            # Custom CSS configurations
│   └── main.jsx             # React startup script
│
└── docs/                     # Architectural documentation guidelines
```

---

## Architectural Mapping
*   **Routing**: Defined inside `src/App.jsx`. Access scopes are guarded via `<ProtectedRoute>`.
*   **Global Styling**: Custom styles are configured inside `src/index.css` alongside Tailwind configurations.
*   **State Management**: Zustand persisted hooks located in `src/hooks/useAuthStore.js`.
