# Coding Guidelines - SkillTrove v2

This document defines the coding standards, patterns, and conventions to maintain code quality and scalability on the SkillTrove v2 platform.

---

## 1. Zero-Warning Policy
All code must compile with **zero ESLint warnings** and **zero errors**. Common guidelines:
*   **React Hook Dependency Arrays**: All variables referenced inside hooks (like `useEffect` or `useCallback`) must be included in the dependency arrays.
*   **Mount Effects Safety**: If a hook or function is intended to run only once on component mount, capture dynamic props/dependencies inside a `useRef` rather than leaving dependency arrays empty.

---

## 2. Directory & Import Rules
*   **Absolute Paths**: Avoid deep relative imports. Always group files in the designated directory (`hooks/`, `components/`, `pages/`, etc.).
*   **Lazy Loading**: All routed pages inside `App.jsx` must be lazy-loaded using `React.lazy()` to maintain small bundle sizes.
*   **Single Responsibility**: Keep components focused on a single function. Extraneous logic should be extracted into custom hooks.

---

## 3. Style & Theme Standards
*   **Tailwind Consistency**: Rely on tailwind helper utility classes. Avoid custom CSS declarations unless necessary.
*   **Semantic Markup**: Always write accessible HTML. Buttons must have explicit `type` definitions and screen-reader `aria` tags where appropriate.
