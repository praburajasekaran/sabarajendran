# Governmental Design System - Component Library

A comprehensive, production-ready design system following modern governmental design principles for political constituency websites. Built with React, TypeScript, and Tailwind CSS.

## Design Philosophy

This design system embodies the professionalism and reliability expected of a political constituency website while maintaining modern UX standards:

- **Trust & Authority**: Deep blue primary colors convey governmental credibility
- **Accessibility First**: WCAG 2.1 AA compliant with proper ARIA labels
- **Clear Hierarchy**: Visual design following Erik Kennedy UI heuristics
- **Cultural Resonance**: Indian governmental color palette (blues, saffron, greens)
- **Purposeful Animation**: Subtle, smooth transitions that enhance UX
- **Mobile-First**: Responsive design that works beautifully on all devices

## Quick Start

```tsx
// Import components
import { Button, Card, Badge, Grid } from '@/components';

// Use in your application
function MyPage() {
  return (
    <Container>
      <Heading level={1} variant="primary">
        Projects Showcase
      </Heading>
      <Grid cols={3} gap="lg">
        <Card>
          <CardHeader>
            <Badge variant="completed">Completed</Badge>
            <CardTitle>Project Name</CardTitle>
          </CardHeader>
          <CardContent>Project details...</CardContent>
        </Card>
      </Grid>
    </Container>
  );
}
```

## Component Categories

### Layout Components

#### Container
Responsive width container with proper padding.

```tsx
<Container size="default">Content</Container>
<Container size="narrow">Narrow content</Container>
<Container size="wide">Wide layout</Container>
```

**Props:**
- `size`: "narrow" | "default" | "wide" | "full"

#### Section
Page sections with consistent vertical spacing.

```tsx
<Section variant="muted" spacing="comfortable">
  Section content
</Section>
```

**Props:**
- `variant`: "default" | "muted" | "primary" | "accent"
- `spacing`: "compact" | "default" | "comfortable" | "spacious"

#### Grid
Flexible responsive grid system.

```tsx
<Grid cols={3} gap="lg">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>
```

**Props:**
- `cols`: 1 | 2 | 3 | 4 | "auto"
- `gap`: "sm" | "md" | "lg" | "xl"

### Typography Components

#### Heading
Semantic headings (H1-H6) with governmental styling.

```tsx
<Heading level={1} variant="primary">Main Title</Heading>
<Heading level={2}>Section Heading</Heading>
<Heading level={3} align="center">Centered</Heading>
```

**Props:**
- `level`: 1 | 2 | 3 | 4 | 5 | 6 (required)
- `variant`: "default" | "primary" | "secondary" | "muted"
- `align`: "left" | "center" | "right"

#### Text
Flexible text component with multiple sizes.

```tsx
<Text variant="lead">Large introductory text</Text>
<Text>Regular body text</Text>
<Text variant="small" muted>Helper text</Text>
```

**Props:**
- `variant`: "lead" | "body" | "small" | "xs"
- `muted`: boolean
- `align`: "left" | "center" | "right" | "justify"

#### Badge
Status indicators for project states.

```tsx
<Badge variant="completed">Completed</Badge>
<Badge variant="ongoing">Ongoing</Badge>
<Badge variant="planned">Planned</Badge>
```

**Props:**
- `variant`: "completed" | "ongoing" | "planned" | "default"
- `size`: "sm" | "md" | "lg"
- `showIcon`: boolean

### UI Components

#### Button
Accessible button with multiple variants and states.

```tsx
<Button variant="primary">Primary Action</Button>
<Button variant="secondary" size="lg">Large Button</Button>
<Button variant="outline" loading>Loading...</Button>
<Button variant="ghost" icon={<Icon />}>With Icon</Button>
```

**Props:**
- `variant`: "primary" | "secondary" | "outline" | "ghost" | "link"
- `size`: "sm" | "md" | "lg" | "xl"
- `loading`: boolean
- `icon`: ReactNode
- `fullWidth`: boolean

#### Card
Versatile card container with subcomponents.

```tsx
<Card variant="elevated" hoverable>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Main content</CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**Props:**
- `variant`: "flat" | "elevated" | "outlined"
- `hoverable`: boolean

#### Input & SearchInput
Accessible form inputs with validation states.

```tsx
<Input
  label="Email"
  type="email"
  placeholder="Enter email..."
  required
/>

<SearchInput
  placeholder="Search projects..."
  onChange={(e) => setQuery(e.target.value)}
/>
```

**Props:**
- `label`: string
- `helperText`: string
- `error`: string
- `icon`: ReactNode

#### Select
Dropdown select with accessibility.

```tsx
<Select
  label="Category"
  options={[
    { value: 'all', label: 'All Categories' },
    { value: 'infra', label: 'Infrastructure' }
  ]}
  onChange={(e) => setCategory(e.target.value)}
/>
```

**Props:**
- `label`: string
- `options`: SelectOption[]
- `placeholder`: string
- `error`: string

#### LoadingSpinner & LoadingSkeleton
Loading indicators and skeleton screens.

```tsx
<LoadingSpinner size="lg" label="Loading projects..." />
<LoadingSkeleton variant="text" count={3} />
<LoadingSkeleton className="h-64 w-full" />
```

**Props:**
- `size`: "sm" | "md" | "lg" | "xl"
- `variant`: "default" | "primary" | "secondary"
- `fullScreen`: boolean

#### ErrorMessage
User-friendly error display.

```tsx
<ErrorMessage
  severity="error"
  title="Failed to load"
  message="Please try again"
  action={<Button onClick={retry}>Retry</Button>}
/>
```

**Props:**
- `severity`: "error" | "warning" | "info"
- `title`: string (required)
- `message`: string
- `action`: ReactNode

#### EmptyState
No results or empty list display.

```tsx
<EmptyState
  variant="search"
  title="No projects found"
  message="Try different filters"
  action={<Button onClick={reset}>Clear Filters</Button>}
/>
```

**Props:**
- `variant`: "default" | "search" | "empty" | "custom"
- `title`: string (required)
- `message`: string
- `action`: ReactNode

### Project-Specific Components

#### ProjectCard
Main project display card with metadata.

```tsx
<ProjectCard
  title="Road Development"
  slug="road-development"
  description="Improving connectivity..."
  image="/projects/road.jpg"
  status="ongoing"
  location="District XYZ"
  date="January 2024"
  budget="₹50 Lakhs"
  category="Infrastructure"
/>
```

#### ProjectGrid
Grid layout with loading/empty states.

```tsx
<ProjectGrid
  projects={projects}
  loading={isLoading}
  emptyMessage="No matching projects"
  onReset={clearFilters}
/>
```

#### ProjectFilters
Filter controls for project listing.

```tsx
<ProjectFilters
  categories={categoryOptions}
  onCategoryChange={setCategory}
  onStatusChange={setStatus}
  onReset={clearFilters}
  activeFiltersCount={2}
/>
```

#### ProjectSearch
Search functionality with debouncing.

```tsx
<ProjectSearch
  onSearch={(query) => filterProjects(query)}
  placeholder="Search projects..."
  debounceMs={300}
/>
```

#### ProjectStats
Statistics display for metrics.

```tsx
<ProjectStats stats={[
  { label: 'Total Projects', value: '156', icon: Folder },
  { label: 'Completed', value: '89', icon: CheckCircle, variant: 'success' }
]} />
```

## Color System

### Primary Colors (Blue - Trust & Authority)
- `blue-50` to `blue-950`
- Main actions, links, authority elements

### Secondary Colors (Saffron/Orange - Energy)
- `orange-50` to `orange-950`
- Accents, highlights, progress indicators

### Accent Colors (Green - Success)
- `green-50` to `green-950`
- Success states, completed projects

### Status Colors
- **Completed**: Green (`#16a34a`)
- **Ongoing**: Orange (`#ea580c`)
- **Planned**: Pink (`#db2777`)

## Accessibility Features

All components include:

- ✅ Semantic HTML elements
- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Focus visible indicators
- ✅ Screen reader friendly
- ✅ High contrast ratios (WCAG AA)
- ✅ Reduced motion support
- ✅ Color + icon indicators

## Icons

Uses Lucide React icons throughout:

```tsx
import { Search, CheckCircle, Calendar } from 'lucide-react';

<Icon icon={Search} size="md" variant="primary" />
```

## Best Practices

### Responsive Design
All components are mobile-first and responsive by default.

### Performance
- Use `LoadingSkeleton` for better perceived performance
- Debounce search inputs
- Lazy load images with Next.js Image component

### Spacing
Follow 4px base grid:
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

### Typography
- Base size: 16px
- Scale ratio: 1.25
- Line height: relaxed (1.625)

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

For use in constituency website projects.

---

Built with ❤️ following governmental design principles.
