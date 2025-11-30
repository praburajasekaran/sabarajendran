# Quick Reference - Governmental Design System

## Import Statement
```tsx
import { ComponentName } from '@/components';
```

## Common Patterns

### Layout Structure
```tsx
<Container size="default">
  <Section variant="muted" spacing="comfortable">
    <Heading level={1}>Title</Heading>
    <Grid cols={3} gap="lg">
      {/* content */}
    </Grid>
  </Section>
</Container>
```

### Project Card
```tsx
<ProjectCard
  title="Project Name"
  slug="project-slug"
  description="Brief description"
  image="/path/to/image.jpg"
  status="ongoing"
  location="Location"
  date="Date"
  budget="₹X Lakhs"
  category="Category"
/>
```

### Form Example
```tsx
<form onSubmit={handleSubmit}>
  <Input
    label="Name"
    type="text"
    required
    error={errors.name}
  />
  <Select
    label="Category"
    options={options}
    required
  />
  <Button type="submit" loading={isSubmitting}>
    Submit
  </Button>
</form>
```

### Loading State
```tsx
{loading ? (
  <LoadingSpinner label="Loading..." />
) : (
  <ProjectGrid projects={data} />
)}
```

### Error Handling
```tsx
{error && (
  <ErrorMessage
    severity="error"
    title="Failed to load"
    message={error}
    action={<Button onClick={retry}>Retry</Button>}
  />
)}
```

## Component Props Cheatsheet

### Button
- `variant`: primary | secondary | outline | ghost | link
- `size`: sm | md | lg | xl
- `loading`: boolean
- `icon`: ReactNode

### Badge
- `variant`: completed | ongoing | planned | default
- `size`: sm | md | lg
- `showIcon`: boolean

### Card
- `variant`: flat | elevated | outlined
- `hoverable`: boolean

### Heading
- `level`: 1 | 2 | 3 | 4 | 5 | 6 (required)
- `variant`: default | primary | secondary | muted
- `align`: left | center | right

### Grid
- `cols`: 1 | 2 | 3 | 4 | auto
- `gap`: sm | md | lg | xl

### Section
- `variant`: default | muted | primary | accent
- `spacing`: compact | default | comfortable | spacious

## Color Classes

### Background Colors
```css
bg-blue-600   /* Primary actions */
bg-orange-600 /* Secondary actions */
bg-green-600  /* Success states */
bg-gray-100   /* Muted backgrounds */
```

### Text Colors
```css
text-gray-900 /* Primary text */
text-gray-600 /* Muted text */
text-blue-600 /* Primary links */
```

## Spacing Scale
```css
gap-4  /* 16px */
gap-6  /* 24px */
gap-8  /* 32px */
p-6    /* 24px padding */
mb-4   /* 16px margin bottom */
```

## Responsive Breakpoints
```css
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

## Icons (Lucide React)
```tsx
import { Icon, CheckCircle, Clock } from 'lucide-react';

<Icon size={20} className="text-blue-600" />
<CheckCircle size={24} />
```

## Common Component Combinations

### Hero Section
```tsx
<Section variant="primary" spacing="comfortable">
  <Container>
    <Heading level={1} align="center">Title</Heading>
    <Text variant="lead" align="center">Description</Text>
  </Container>
</Section>
```

### Stats Section
```tsx
<Section variant="muted">
  <Container>
    <ProjectStats stats={statsData} />
  </Container>
</Section>
```

### Content Section
```tsx
<Section spacing="comfortable">
  <Container>
    <Heading level={2}>Section Title</Heading>
    <Grid cols={3} gap="lg">
      {/* cards or content */}
    </Grid>
  </Container>
</Section>
```

### Search & Filter Section
```tsx
<div className="space-y-6">
  <ProjectSearch onSearch={setQuery} />
  <ProjectFilters
    categories={categories}
    onCategoryChange={setCategory}
    onStatusChange={setStatus}
    onReset={clearFilters}
  />
</div>
```

## Accessibility Checklist

- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Buttons have descriptive text or aria-label
- [ ] Use semantic HTML (h1, nav, main, article)
- [ ] Focus indicators visible
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Error messages use role="alert"

## File Locations

```
/components/
  ui/                    # Base components
  projects/              # Project components
  index.ts               # Barrel exports
  README.md              # Full documentation
  EXAMPLES.md            # Usage examples
  COMPONENT_SHOWCASE.tsx # Visual demo
  QUICK_REFERENCE.md     # This file
```

## Getting Help

1. **Component API**: See `components/README.md`
2. **Usage Examples**: See `components/EXAMPLES.md`
3. **Visual Demo**: Use `COMPONENT_SHOWCASE.tsx`
4. **TypeScript**: Check prop interfaces in component files
