<objective>
Simplify the project status filter to show only two options ("Completed" and "In progress") while preserving detailed status information (like "Corewall Completed", "Earthwork Completed") in the project cards. This improves UX by reducing filter complexity while maintaining detailed status visibility where users need it most.

The end goal is a cleaner, more intuitive filtering experience where users can quickly filter by completion state, while still seeing specific project status details on each project card.
</objective>

<context>
This is a Next.js/React project that displays government projects with filtering capabilities. The current implementation shows all detailed statuses (e.g., "Corewall Completed", "Earthwork Completed", "Ongoing", etc.) in the status filter dropdown, which creates clutter.

The project uses:
- TypeScript/React with Next.js
- WordPress REST API for data
- Custom filtering system with URL state management
- Status taxonomy from WordPress (`project_status`)

Key files to examine:
@projects-frontend/components/projects/filters/status-filter.tsx
@projects-frontend/components/projects/project-card.tsx
@projects-frontend/lib/utils/filter-projects.ts
@projects-frontend/components/projects/projects-client.tsx
@projects-frontend/lib/wordpress/transform.ts
</context>

<requirements>
1. **Status Filter Simplification**:
   - Modify the status filter to show only two options: "Completed" and "In progress"
   - These should be the only selectable options in the filter UI
   - The filter should work with URL state management (existing system)

2. **Status Mapping Logic**:
   - Create a utility function that maps detailed statuses to the two categories
   - "Completed" category should include any status containing "completed" (case-insensitive)
   - "In progress" category should include all other statuses (ongoing, planned, in-progress, etc.)
   - This mapping should be used in the filtering logic

3. **Project Card Display**:
   - Update project cards to display the full detailed status name (e.g., "Corewall Completed", "Earthwork Completed")
   - The detailed status should be visible on the project card badge/indicator
   - Maintain existing styling and visual hierarchy

4. **Filtering Functionality**:
   - When "Completed" is selected, show all projects with any status containing "completed"
   - When "In progress" is selected, show all projects that don't have "completed" in their status
   - Filter counts should reflect the mapped categories, not individual statuses

5. **Backward Compatibility**:
   - Ensure existing URL parameters still work (may need to handle migration)
   - Maintain compatibility with WordPress API responses
</requirements>

<implementation>
1. **Create Status Mapping Utility**:
   - Add a new utility function in `lib/utils/` (or extend `filter-projects.ts`) that:
     - Takes a detailed status name/slug and returns "completed" or "in-progress"
     - Uses case-insensitive matching for "completed" keyword
     - Handles edge cases (empty status, null values)

2. **Update Status Filter Component**:
   - Modify `components/projects/filters/status-filter.tsx` to:
     - Hardcode two options: "Completed" and "In progress" (instead of mapping all statuses)
     - Update the filter counts calculation to aggregate counts by category
     - Maintain existing UI styling and interaction patterns

3. **Update Filter Logic**:
   - Modify `lib/utils/filter-projects.ts` to:
     - Use the status mapping utility when filtering by status
     - Map project statuses to categories before comparison
     - Update filter counts calculation to group by category

4. **Update Project Card**:
   - Modify `components/projects/project-card.tsx` to:
     - Display the full detailed status name from `project.statuses[0].name` instead of simplified status
     - Update the status prop type if needed to accept the full status object
     - Ensure the badge shows the detailed status text

5. **Update Projects Client**:
   - Modify `components/projects/projects-client.tsx` to:
     - Pass the simplified status options to the filter component
     - Calculate filter counts by aggregating detailed statuses into categories
     - Ensure URL state management works with the new simplified statuses

**WHY these constraints matter**:
- The mapping utility ensures consistent categorization across the app
- Hardcoding filter options simplifies the UI while maintaining flexibility in data
- Displaying detailed statuses on cards provides context without cluttering filters
- Aggregating counts prevents confusion about how many projects match each category
</implementation>

<output>
Modify the following files:

1. `projects-frontend/lib/utils/filter-projects.ts` - Add status mapping utility and update filtering logic
2. `projects-frontend/components/projects/filters/status-filter.tsx` - Simplify to two options with aggregated counts
3. `projects-frontend/components/projects/project-card.tsx` - Display detailed status name
4. `projects-frontend/components/projects/projects-client.tsx` - Update to use simplified status categories and calculate aggregated counts
5. `projects-frontend/lib/types.ts` - Update types if needed for status handling

Create new utility file if needed:
- `projects-frontend/lib/utils/status-mapping.ts` - Status categorization utility (if you prefer separation of concerns)
</output>

<verification>
Before declaring complete, verify:

1. **Filter UI**: Status filter shows exactly two options: "Completed" and "In progress"
2. **Filter Functionality**: 
   - Selecting "Completed" shows all projects with "completed" in their status name
   - Selecting "In progress" shows all other projects
   - Filter counts are accurate for each category
3. **Project Cards**: Each project card displays the full detailed status name (e.g., "Corewall Completed", "Earthwork Completed")
4. **URL State**: Filter selections persist in URL parameters and work with browser back/forward
5. **Edge Cases**: 
   - Projects with no status are handled gracefully
   - Case variations in status names work correctly
   - Empty status arrays don't break the UI
</verification>

<success_criteria>
- Status filter displays only "Completed" and "In progress" options
- Filtering correctly categorizes projects based on status content
- Project cards show detailed status names (e.g., "Corewall Completed")
- Filter counts accurately reflect the number of projects in each category
- No TypeScript errors or console warnings
- Existing functionality (other filters, search, pagination) continues to work
- URL state management works correctly with simplified status values
</success_criteria>

