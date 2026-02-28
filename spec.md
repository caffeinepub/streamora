# Specification

## Summary
**Goal:** Fix the Admin Dashboard so it is accessible from the Profile page for the admin user, and ensure all admin routes are properly protected.

**Planned changes:**
- Add an "Admin Dashboard" button/link on the Profile page that is only visible when logged in as SHUBOWNER2026, navigating to /admin.
- Ensure AuthContext correctly sets `isAdmin` to true only for the user with secret username SHUBOWNER2026.
- Ensure the admin route guard in App.tsx redirects non-admin or unauthenticated users away from all /admin/* routes.
- Verify the AdminDashboardPage at /admin renders all existing sub-sections and that internal navigation links to sub-pages work correctly.

**User-visible outcome:** When logged in as the admin account, a visible "Admin Dashboard" button appears on the Profile page and clicking it successfully navigates to the admin dashboard. Non-admin users see no such button and cannot access /admin routes.
