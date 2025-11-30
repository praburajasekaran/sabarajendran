<objective>
Create a comprehensive, production-ready design system with reusable UI components following modern governmental design principles. This system will provide the foundation for a professional, trustworthy, and accessible projects showcase.

The design system will embody the professionalism and reliability expected of a political constituency website while maintaining modern UX standards.
</objective>

<context>
Design requirements based on modern governmental aesthetics:
- Professional, trustworthy appearance suitable for political portfolio
- Excellent accessibility (WCAG 2.1 AA compliance minimum)
- Clear visual hierarchy following @erik-kennedy-ui-heuristics.md
- Indian governmental color inspiration (blues, saffron, greens)
- Clean, spacious layouts (not cluttered)
- Subtle, purposeful animations (not distracting)
- Mobile-first responsive design

Reference existing governmental sites for inspiration:
- National Portal of India (clean, professional)
- MyGov (modern, engaging)
- Indian government ministry sites (authoritative)

Use Lucide React icons throughout as specified in CLAUDE.md.
</context>

<requirements>
Create a complete component library including:

**Layout Components:**
1. Container - Responsive width container with proper padding
2. Section - Page sections with consistent spacing
3. Grid - Flexible grid system for project cards

**Typography Components:**
4. Heading - H1-H6 with governmental styling
5. Text - Body text, lead text, small text variants
6. Badge - Status indicators (Completed, Ongoing, Planned)

**UI Components:**
7. Button - Primary, secondary, outline variants
8. Card - Project card with image, title, meta, description
9. FilterButton - Toggle filters (active/inactive states)
10. SearchInput - Search bar with icon
11. Select - Dropdown for filtering
12. LoadingSpinner - Loading states
13. ErrorMessage - User-friendly error display
14. EmptyState - No results found state

**Icon Components:**
15. Icon wrapper using Lucide React

All components must:
- Use TypeScript with proper prop types
- Be fully accessible (ARIA labels, keyboard nav)
- Support dark mode (future-proof)
- Include hover/focus states
- Be documented with JSDoc comments
- Follow Tailwind utility-first approach
- Use governmental color palette from tailwind.config
</requirements>

<implementation>
Follow these principles for spectacular, production-ready components:

**Visual Design:**
WHY: Governmental sites need to convey trust and authority
- High contrast ratios (minimum 4.5:1 for text)
- Generous white space (16px minimum between elements)
- Professional typography scale (base 16px, scale 1.25)
- Subtle shadows (never harsh)
- Rounded corners (4-8px, not too rounded)
- Consistent padding/margin using 4px grid

**Color System:**
- Primary blue (#1e40af): Main actions, links, authority
- Saffron (#f97316): Accents, highlights, energy
- Green (#16a34a): Success, completed projects
- Orange (#ea580c): Ongoing projects, progress
- Pink (#db2777): Planned projects
- Grays: Backgrounds, borders, disabled states

**Component Architecture:**
WHY: Production sites need maintainable, scalable code
- Small, focused components (single responsibility)
- Composition over inheritance
- Variants using TypeScript discriminated unions
- Consistent API across similar components
- Proper TypeScript generics for reusable patterns

**Accessibility:**
WHY: Government sites must serve all citizens including those with disabilities
- Semantic HTML (button, nav, main, article, etc.)
- ARIA labels for icon-only buttons
- Keyboard navigation (tab order, focus visible)
- Screen reader friendly text
- Color is never the only indicator (icons + text)

**Animation:**
WHY: Subtle animations enhance UX without distraction
- Smooth transitions (200-300ms)
- Transform and opacity (GPU-accelerated)
- Purposeful hover states
- Loading skeletons for better perceived performance
- Respect prefers-reduced-motion

Go beyond basics: Include comprehensive variants, states, and thoughtful micro-interactions that make the interface feel polished and professional.
</implementation>

<output>
Create in `./projects-frontend/components/`:

**ui/** (Base components):
- `ui/container.tsx`
- `ui/section.tsx`
- `ui/grid.tsx`
- `ui/heading.tsx`
- `ui/text.tsx`
- `ui/badge.tsx`
- `ui/button.tsx`
- `ui/card.tsx`
- `ui/input.tsx`
- `ui/select.tsx`
- `ui/loading-spinner.tsx`
- `ui/error-message.tsx`
- `ui/empty-state.tsx`
- `ui/icon.tsx`

**projects/** (Project-specific components):
- `projects/project-card.tsx` - Main project display card
- `projects/project-grid.tsx` - Grid layout for projects
- `projects/project-filters.tsx` - Filter controls
- `projects/project-search.tsx` - Search functionality
- `projects/project-stats.tsx` - Statistics display

**Update:**
- `app/globals.css` - Add governmental design system custom CSS
- Create `components/index.ts` - Barrel exports

For maximum efficiency, create related components in parallel where possible.
</output>

<verification>
Before declaring complete:
1. All components render without TypeScript errors
2. Governmental color palette applied correctly
3. Accessibility: Test keyboard navigation through all interactive elements
4. Accessibility: Verify ARIA labels present on icon-only buttons
5. Responsive: Components look good on mobile (375px) and desktop (1440px)
6. Test all component variants (primary/secondary buttons, different badge colors)
7. Confirm Lucide React icons imported and displaying correctly
8. Hover and focus states work smoothly
9. Loading and error states display appropriately
10. Check contrast ratios meet WCAG AA standards
</verification>

<success_criteria>
- Complete component library with 15+ reusable components
- All components fully typed with TypeScript
- Governmental design aesthetic consistently applied
- WCAG 2.1 AA accessibility compliance
- Smooth, purposeful animations
- Mobile-first responsive design
- Lucide React icons integrated throughout
- Professional, trustworthy appearance suitable for political portfolio
- Components documented with clear prop types and usage examples
- No accessibility warnings in browser console
- Design system ready for building project showcase pages
</success_criteria>
