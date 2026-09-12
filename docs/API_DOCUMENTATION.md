# ASCENDRA Enterprise v1.0 — API Reference Manual

ASCENDRA provides a comprehensive RESTful API suite. All endpoints accept and return JSON following the standard enterprise response schema:

```json
{
  "success": true,
  "data": { ... },
  "metadata": { "timestamp": "2026-08-07T11:51:55Z" }
}
```

---

## Key Endpoint Domains

### 1. AI Core & Orchestrator (`/api/v1/ai`)
- `POST /api/v1/ai/chat` — Context-aware AI tutoring with sliding window session memory.
- `POST /api/v1/ai/chat/stream` — Real-time Server-Sent Events (SSE) streaming chat response.
- `POST /api/v1/ai/discover` — Dynamic knowledge domain discovery.
- `GET /api/v1/ai/recommendations` — Personalized learning recommendations.

### 2. CodeLab Execution & Judge (`/api/v1/codelab`)
- `POST /api/v1/codelab/run` — Sandboxed code execution against public test cases.
- `POST /api/v1/codelab/submit` — Automated Judge Engine submission (evaluates public & hidden test suites, generates AI code review & complexity analysis).
- `POST /api/v1/codelab/hints` — 3-Tier Progressive AI Hint System.
- `POST /api/v1/codelab/debug` — AI Code Debugger error diagnosis & fix suggestions.

### 3. AI Interview Studio (`/api/v1/interview`)
- `POST /api/v1/interview/evaluate` — Evaluate completed interview session (generates WPM, filler word count, technical score, and readiness badge).
- `POST /api/v1/interview/followup` — Generate real-time AI follow-up probing questions.
- `GET /api/v1/interview/report/:interviewId` — Retrieve saved evaluation report.

### 4. Career Hub (`/api/v1/career`)
- `POST /api/v1/career/ats/analyze` — Evaluate resume text against ATS compliance benchmarks.
- `POST /api/v1/career/resume/save` — Version and save resume drafts.
- `GET /api/v1/career/readiness` — Overall job readiness score & target company match percentages.

### 5. Insights & Intelligence (`/api/v1/insights`)
- `GET /api/v1/insights/summary` — Executive AI Analyst summary.
- `GET /api/v1/insights/predictions` — 30/60/90-day placement probabilities and salary band estimations.
- `GET /api/v1/insights/mastery` — Topic mastery index & decaying skill warnings.

### 6. Notifications & Communication (`/api/v1/notifications`)
- `GET /api/v1/notifications` — Fetch active action-oriented notifications.
- `PUT /api/v1/notifications/read-all` — Mark notifications as read.
- `GET /api/v1/notifications/digest` — Generate daily/weekly notification action digest.

### 7. Admin Control Center (`/api/v1/admin`)
- `GET /api/v1/admin/metrics` — System health & platform metrics.
- `PUT /api/v1/admin/users/:userId/role` — Update user role with mandatory audit logging.
- `GET /api/v1/admin/audit-logs` — Administrative audit trail viewer.
- `PUT /api/v1/admin/feature-flags` — Toggle platform feature flags.

### 8. Faculty Portal (`/api/v1/faculty`)
- `GET /api/v1/faculty/workspace` — Educator workspace overview.
- `POST /api/v1/faculty/ai/generate-content` — AI Content Generator (`DRAFT_REQUIRES_REVIEW`).
- `POST /api/v1/faculty/assignments/grade` — AI Grading Assistant (requires human faculty confirmation).
