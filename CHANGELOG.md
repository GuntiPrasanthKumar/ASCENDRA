# Changelog - ASCENDRA Enterprise v1.0

All notable changes to the ASCENDRA Enterprise Platform are documented in this file.

## [1.0.0] - 2026-08-07

### Added
- **Sprint 7: AI Proctoring Platform** — Four independent proctoring engines (Identity, Behavior, Environment, Integrity) with MediaPipe face mesh and gaze tracking.
- **Sprint 8: Centralized AI Core & Orchestrator** — Multi-provider router (`Gemini 1.5 Flash`, `GPT-4o-mini`, `Heuristic Fallback`), sliding window session memory, and Server-Sent Events (SSE) streaming chat.
- **Sprint 9: Enterprise CodeLab Workspace** — Sandboxed Node.js VM code execution (2000ms limit), automated Judge Engine evaluating public & hidden test cases, 3-tier progressive AI hints, and AI Debugger.
- **Sprint 10: Enterprise AI Interview Studio** — Speech analytics (WPM & filler extraction), real-time AI follow-up questions, multi-dimensional technical evaluation, and placement readiness scoring (`TIER_1_READY`).
- **Sprint 11: Enterprise Career Hub** — ATS Resume Analyzer with versioning, GitHub repository intelligence, skill gap graph mapping, and target company readiness scores.
- **Sprint 12: Insights & Intelligence Engine** — Narrative AI Analyst summaries, 30/60/90-day predictive placement probabilities, topic mastery forgetting-curve analytics, and self-explaining recommendations.
- **Sprint 13: Notification & Communication Platform** — Action-oriented notification engine with priority, category, action URLs, and expiry validation.
- **Sprint 14: Enterprise Admin Control Center** — RBAC permission system, immutable audit logs (`AuditLog.model.js`), AI model routing console, and live feature flag toggles.
- **Sprint 15: Enterprise Faculty Portal** — Educator workspace, AI lesson content drafting (`DRAFT_REQUIRES_REVIEW`), AI student risk detection, and AI grading assistant requiring human faculty confirmation.
- **Sprint 16: Production Hardening & Infrastructure** — Multi-stage production `Dockerfile`, `docker-compose.yml`, Kubernetes deployment manifests (`k8s/deployment.yaml`), GitHub Actions CI/CD (`.github/workflows/ci.yml`), and 9 automated test suites.

### Security
- Enforced AES-256-GCM encryption for stored biometric facial descriptors.
- Input regex sanitization preventing malicious code execution (`child_process`, `fs`, `eval`).
- RBAC middleware (`requireAdmin`, `requireFaculty`) guarding all operational endpoints.
