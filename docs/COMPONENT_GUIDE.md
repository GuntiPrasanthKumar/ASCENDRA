# Component Guide - ASCENDRA v2

This document describes the core reusable UI components, layout structures, and feedback interfaces inside ASCENDRA v2.

---

## 1. Authentication & Route Guards

### `ProtectedRoute`
A wrapper component that verifies if the current user session is authorized.
*   **Props**:
    *   `children` (`ReactNode`): Elements to render if authorized.
    *   `allowedRoles` (`string[]`): Array of permitted roles (e.g. `['student', 'teacher', 'admin']`). If the user does not have a permitted role, they are redirected to `/dashboard`.
*   **Usage**:
    ```jsx
    <Route path="/admin" element={
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminDashboard />
      </ProtectedRoute>
    } />
    ```

---

## 2. Global Safety wrappers

### `ErrorBoundary`
A React class component wrapping active route layouts to prevent white-screen crashes on rendering exceptions.
*   **Fallback UI**: Displays a user-friendly error screen with traceback outputs and a recovery reset button redirecting to `/dashboard`.

---

## 3. Feedback & State Management

### `EmptyState`
A clean placeholder card component to indicate missing data sets.
*   **Props**:
    *   `icon` (`LucideIcon`): The central visual icon.
    *   `title` (`string`): Header title text.
    *   `description` (`string`): Helper description paragraph.
    *   `actionText` (`string`, optional): Button CTA text.
    *   `onAction` (`function`, optional): Button action click handler.

### `Skeletons`
*   `PageSkeleton`: Visual block placeholders for page-loading states.
*   `CardSkeleton`: Loading placeholder cards.
*   `TableSkeleton`: Shimmering row placeholders for table loading states.
*   `AISkeleton`: Loading placeholder for conversational panels.
