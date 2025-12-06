<objective>
Fix pagination buttons on the projects page so that clicking Next/Previous actually changes the displayed page and updates the URL correctly. Currently, clicking pagination buttons does nothing - the page parameter in the URL should update and different projects should be displayed.

The issue occurs at http://localhost:3000/projects?page=1&statuses=completed where pagination controls are visible but non-functional.
</objective>

<context>
This is a Next.js 15 application with a projects listing page that uses client-side filtering and pagination. The page fetches all projects server-side, then filters and paginates them on the client.

Key files:
- `./projects-frontend/app/projects/page.tsx` - Server component that fetches all projects
- `./projects-frontend/components/projects/projects-client.tsx` - Client wrapper with pagination UI
- `./projects-frontend/lib/hooks/use-project-filters.ts` - Hook managing filters and pagination state
- `./projects-frontend/lib/hooks/use-url-state.ts` - URL state synchronization hook

The pagination buttons call `pagination.setPage()` but the page doesn't change. The URL should update (e.g., `?page=2&statuses=completed`) and different projects should be displayed.
</context>

<requirements>
1. **Fix pagination button functionality**: Clicking Next/Previous must update the URL parameter and display the correct page of results
2. **Maintain filter state**: When changing pages, existing filters (like `statuses=completed`) must be preserved in the URL
3. **Fix useEffect dependency issues**: The `useEffect` in `use-project-filters.ts` that resets page to 1 when filters change may have dependency issues causing problems
4. **Ensure URL synchronization**: The page number in the URL must stay in sync with the displayed page
5. **Handle edge cases**: 
   - Prevent going to page 0 or negative pages
   - Prevent going beyond the last page
   - Reset to page 1 only when filters actually change, not on every render

Examine the current implementation thoroughly to identify why `setPage` isn't working.
</requirements>

<implementation>
1. **Examine the pagination flow**:
   - Read `./projects-frontend/lib/hooks/use-project-filters.ts` to understand how `setPage` works
   - Check how `useUrlState` handles parameter updates
   - Verify the `useEffect` dependencies and logic for resetting page on filter changes

2. **Identify the root cause**:
   - Check if `setParam` is being called correctly
   - Verify if the URL is updating but the component isn't re-reading it
   - Check for dependency array issues in `useEffect` that might cause infinite loops or stale closures
   - Ensure `currentPage` is being read from URL params correctly

3. **Fix the issues**:
   - Fix any dependency array problems in `useEffect`
   - Ensure `setPage` properly updates the URL using `setParam`
   - Verify that reading `page` from URL params works correctly when combined with other params
   - Make sure the paginated results update when `currentPage` changes

4. **Test the fix**:
   - Navigate to `http://localhost:3000/projects?page=1&statuses=completed`
   - Click Next button - URL should change to `?page=2&statuses=completed` and show different projects
   - Click Previous button - should go back to page 1
   - Change a filter - should reset to page 1
   - Try going beyond last page - should be disabled

WHY these fixes matter:
- The `useEffect` dependency array likely has issues causing stale closures or infinite loops
- The URL state might not be triggering re-renders when the page param changes
- The page reset logic might be interfering with manual page changes
</implementation>

<output>
Modify the following files:
- `./projects-frontend/lib/hooks/use-project-filters.ts` - Fix pagination state management and useEffect dependencies
- `./projects-frontend/lib/hooks/use-url-state.ts` - Verify URL parameter updates work correctly (may need fixes)
- `./projects-frontend/components/projects/projects-client.tsx` - Verify pagination buttons are wired correctly (may need fixes)

Ensure all changes maintain existing functionality while fixing the pagination issue.
</output>

<verification>
After implementing the fix, verify:
1. Navigate to `http://localhost:3000/projects?page=1&statuses=completed`
2. Click "Next" button - URL should update to `?page=2&statuses=completed` and show different projects (items 13-24 if 12 per page)
3. Click "Previous" button - should go back to page 1 with correct projects
4. Change the status filter - should reset to page 1 automatically
5. Try clicking Next on the last page - button should be disabled
6. Directly navigate to `?page=5&statuses=completed` - should show page 5 results
7. Check browser console for any errors or warnings
</verification>

<success_criteria>
- Pagination buttons (Next/Previous) successfully change the page when clicked
- URL parameter `page` updates correctly (e.g., `?page=2&statuses=completed`)
- Different projects are displayed on different pages
- Filters are preserved when changing pages
- Page resets to 1 when filters change
- No console errors or warnings
- Edge cases handled (page 0, beyond last page, etc.)
</success_criteria>




