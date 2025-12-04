/**
 * Component Showcase
 *
 * This file demonstrates all components in the design system.
 * Use this as a visual reference and testing ground.
 *
 * To view: Create a new page in app/showcase/page.tsx and import this component.
 */

import {
  Container,
  Section,
  Grid,
  Heading,
  Text,
  Badge,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  SearchInput,
  Select,
  LoadingSpinner,
  LoadingSkeleton,
  ErrorMessage,
  InlineError,
  EmptyState,
  Icon,
  ProjectCard,
  ProjectGrid,
  ProjectFilters,
  ProjectSearch,
  ProjectStats,
} from "@/components";

import {
  Search,
  Download,
  CheckCircle,
  Clock,
  Circle,
  Folder,
  Users,
  IndianRupee,
  Mail,
  Phone,
} from "lucide-react";

export default function ComponentShowcase() {
  // Sample data
  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "infrastructure", label: "Infrastructure" },
    { value: "healthcare", label: "Healthcare" },
    { value: "education", label: "Education" },
  ];

  const sampleProjects = [
    {
      title: "Rural Road Development",
      slug: "rural-road-development",
      description: "Improving connectivity between villages with new paved roads.",
      image: "/images/projects/placeholder.jpg",
      status: "ongoing" as const,
      location: "District North",
      date: "Jan 2024",
      budget: "₹5 Crores",
      category: "Infrastructure",
    },
    {
      title: "Community Health Center",
      slug: "community-health-center",
      description: "New healthcare facility serving 50,000+ residents.",
      image: "/images/projects/placeholder.jpg",
      status: "completed" as const,
      location: "District South",
      date: "Dec 2023",
      budget: "₹3.2 Crores",
      category: "Healthcare",
    },
    {
      title: "School Modernization",
      slug: "school-modernization",
      description: "Upgrading facilities and infrastructure in 15 schools.",
      image: "/images/projects/placeholder.jpg",
      status: "planned" as const,
      location: "District East",
      date: "Mar 2025",
      budget: "₹4.5 Crores",
      category: "Education",
    },
  ];

  const stats = [
    { label: "Total Projects", value: "156", icon: Folder, variant: "default" as const },
    { label: "Completed", value: "89", icon: CheckCircle, variant: "success" as const },
    { label: "Ongoing", value: "45", icon: Clock, variant: "warning" as const },
    { label: "Planned", value: "22", icon: Circle, variant: "primary" as const },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Section variant="primary" spacing="default">
        <Container>
          <Heading level={1} className="mb-2">
            Design System Showcase
          </Heading>
          <Text variant="lead">
            Complete component library for governmental constituency websites
          </Text>
        </Container>
      </Section>

      {/* Typography Showcase */}
      <Section spacing="comfortable">
        <Container>
          <Heading level={2} className="mb-8">
            Typography
          </Heading>
          <div className="space-y-4">
            <Heading level={1}>Heading Level 1</Heading>
            <Heading level={2}>Heading Level 2</Heading>
            <Heading level={3}>Heading Level 3</Heading>
            <Heading level={4}>Heading Level 4</Heading>
            <Heading level={5}>Heading Level 5</Heading>
            <Heading level={6}>Heading Level 6</Heading>
            <Text variant="lead">Lead text - Larger introductory paragraph</Text>
            <Text variant="body">Body text - Regular paragraph content</Text>
            <Text variant="small">Small text - Helper or caption text</Text>
            <Text variant="xs">Extra small text - Fine print</Text>
          </div>
        </Container>
      </Section>

      {/* Badges Showcase */}
      <Section variant="muted" spacing="comfortable">
        <Container>
          <Heading level={2} className="mb-8">
            Badges
          </Heading>
          <div className="flex flex-wrap gap-4">
            <Badge variant="completed">Completed</Badge>
            <Badge variant="ongoing">Ongoing</Badge>
            <Badge variant="planned">Planned</Badge>
            <Badge variant="default">Default</Badge>
            <Badge variant="completed" size="sm">
              Small
            </Badge>
            <Badge variant="ongoing" size="lg">
              Large
            </Badge>
            <Badge variant="completed" showIcon={false}>
              No Icon
            </Badge>
          </div>
        </Container>
      </Section>

      {/* Buttons Showcase */}
      <Section spacing="comfortable">
        <Container>
          <Heading level={2} className="mb-8">
            Buttons
          </Heading>
          <Grid cols={2} gap="lg">
            <div className="space-y-4">
              <Heading level={5}>Variants</Heading>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>
            <div className="space-y-4">
              <Heading level={5}>Sizes</Heading>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>
            </div>
            <div className="space-y-4">
              <Heading level={5}>With Icons</Heading>
              <div className="flex flex-wrap gap-3">
                <Button icon={<Download size={16} />}>Download</Button>
                <Button icon={<Mail size={16} />} iconPosition="right">
                  Email
                </Button>
                <Button variant="outline" icon={<Phone size={16} />}>
                  Call
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <Heading level={5}>States</Heading>
              <div className="flex flex-wrap gap-3">
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
                <Button fullWidth>Full Width</Button>
              </div>
            </div>
          </Grid>
        </Container>
      </Section>

      {/* Cards Showcase */}
      <Section variant="muted" spacing="comfortable">
        <Container>
          <Heading level={2} className="mb-8">
            Cards
          </Heading>
          <Grid cols={3} gap="lg">
            <Card variant="flat">
              <CardHeader>
                <CardTitle>Flat Card</CardTitle>
                <CardDescription>No shadow, flat appearance</CardDescription>
              </CardHeader>
              <CardContent>
                <Text variant="small">Card content goes here</Text>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Elevated Card</CardTitle>
                <CardDescription>With shadow elevation</CardDescription>
              </CardHeader>
              <CardContent>
                <Text variant="small">Card content goes here</Text>
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardHeader>
                <CardTitle>Outlined Card</CardTitle>
                <CardDescription>With border outline</CardDescription>
              </CardHeader>
              <CardContent>
                <Text variant="small">Card content goes here</Text>
              </CardContent>
              <CardFooter>
                <Button size="sm">Action</Button>
              </CardFooter>
            </Card>
          </Grid>
        </Container>
      </Section>

      {/* Form Elements Showcase */}
      <Section spacing="comfortable">
        <Container size="narrow">
          <Heading level={2} className="mb-8">
            Form Elements
          </Heading>
          <div className="space-y-6">
            <Input
              label="Text Input"
              type="text"
              placeholder="Enter text..."
              helperText="This is helper text"
            />
            <Input
              label="Email Input"
              type="email"
              placeholder="your.email@example.com"
              required
            />
            <Input
              label="Input with Error"
              type="text"
              error="This field has an error"
            />
            <SearchInput placeholder="Search..." />
            <Select
              label="Select Dropdown"
              options={categoryOptions}
              placeholder="Choose an option"
            />
          </div>
        </Container>
      </Section>

      {/* Loading States Showcase */}
      <Section variant="muted" spacing="comfortable">
        <Container>
          <Heading level={2} className="mb-8">
            Loading States
          </Heading>
          <Grid cols={3} gap="lg">
            <div className="space-y-4">
              <Heading level={5}>Spinners</Heading>
              <div className="flex items-center gap-6">
                <LoadingSpinner size="sm" variant="default" label="" />
                <LoadingSpinner size="md" variant="primary" label="" />
                <LoadingSpinner size="lg" variant="secondary" label="" />
              </div>
            </div>
            <div className="space-y-4">
              <Heading level={5}>With Labels</Heading>
              <LoadingSpinner label="Loading projects..." />
            </div>
            <div className="space-y-4">
              <Heading level={5}>Skeleton</Heading>
              <LoadingSkeleton variant="text" count={3} />
              <LoadingSkeleton className="h-32 w-full" />
            </div>
          </Grid>
        </Container>
      </Section>

      {/* Error States Showcase */}
      <Section spacing="comfortable">
        <Container>
          <Heading level={2} className="mb-8">
            Error & Empty States
          </Heading>
          <div className="space-y-6">
            <ErrorMessage
              severity="error"
              title="Error Message"
              message="This is an error description"
              action={<Button size="sm">Retry</Button>}
            />
            <ErrorMessage
              severity="warning"
              title="Warning Message"
              message="This is a warning description"
            />
            <ErrorMessage
              severity="info"
              title="Info Message"
              message="This is an informational message"
            />
            <EmptyState
              variant="search"
              title="No Results Found"
              message="Try adjusting your search or filter criteria"
              action={<Button variant="outline">Clear Filters</Button>}
            />
          </div>
        </Container>
      </Section>

      {/* Project Components Showcase */}
      <Section variant="muted" spacing="comfortable">
        <Container>
          <Heading level={2} className="mb-8">
            Project Components
          </Heading>

          {/* Stats */}
          <div className="mb-12">
            <Heading level={4} className="mb-6">
              Project Statistics
            </Heading>
            <ProjectStats stats={stats} />
          </div>

          {/* Search & Filters */}
          <div className="mb-8 space-y-6">
            <Heading level={4}>Search & Filters</Heading>
            <ProjectSearch placeholder="Search projects..." />
            <ProjectFilters
              categories={categoryOptions}
              activeFiltersCount={0}
            />
          </div>

          {/* Project Grid */}
          <div>
            <Heading level={4} className="mb-6">
              Project Cards
            </Heading>
            <ProjectGrid projects={sampleProjects} />
          </div>
        </Container>
      </Section>

      {/* Footer */}
      <Section spacing="default">
        <Container>
          <Text variant="small" align="center" muted>
            Design System v1.0 - Built with governmental design principles
          </Text>
        </Container>
      </Section>
    </div>
  );
}
