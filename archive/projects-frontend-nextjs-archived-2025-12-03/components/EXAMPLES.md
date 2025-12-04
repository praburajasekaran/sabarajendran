# Design System Examples

Complete examples showing how to use the governmental design system components.

## Example 1: Project Listing Page

```tsx
"use client";

import { useState } from 'react';
import {
  Container,
  Section,
  Heading,
  Text,
  ProjectGrid,
  ProjectFilters,
  ProjectSearch,
  ProjectStats,
} from '@/components';
import { Folder, CheckCircle, Clock, Circle } from 'lucide-react';

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');

  const stats = [
    { label: 'Total Projects', value: '156', icon: Folder, variant: 'default' },
    { label: 'Completed', value: '89', icon: CheckCircle, variant: 'success' },
    { label: 'Ongoing', value: '45', icon: Clock, variant: 'warning' },
    { label: 'Planned', value: '22', icon: Circle, variant: 'primary' },
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'water', label: 'Water & Sanitation' },
  ];

  const projects = [
    {
      title: 'Rural Road Development Phase 2',
      slug: 'rural-road-development-phase-2',
      description: 'Improving connectivity between 15 villages with 25km of new paved roads.',
      image: '/projects/road-dev.jpg',
      status: 'ongoing' as const,
      location: 'District North',
      date: 'Jan 2024 - Dec 2024',
      budget: '₹5.2 Crores',
      category: 'Infrastructure',
    },
    // Add more projects...
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || project.category.toLowerCase() === category;
    const matchesStatus = status === 'all' || project.status === status;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const activeFiltersCount = [category !== 'all', status !== 'all'].filter(Boolean).length;

  return (
    <>
      {/* Hero Section */}
      <Section variant="primary" spacing="comfortable">
        <Container>
          <Heading level={1} align="center" className="mb-4">
            Constituency Projects
          </Heading>
          <Text variant="lead" align="center" className="max-w-3xl mx-auto">
            Transforming our community through dedicated development initiatives.
            Track progress and explore completed, ongoing, and planned projects.
          </Text>
        </Container>
      </Section>

      {/* Stats Section */}
      <Section variant="muted" spacing="default">
        <Container>
          <ProjectStats stats={stats} />
        </Container>
      </Section>

      {/* Projects Section */}
      <Section spacing="comfortable">
        <Container>
          {/* Search and Filters */}
          <div className="mb-8 space-y-6">
            <ProjectSearch
              onSearch={setSearchQuery}
              placeholder="Search by project name or description..."
            />
            <ProjectFilters
              categories={categories}
              selectedCategory={category}
              onCategoryChange={setCategory}
              selectedStatus={status}
              onStatusChange={setStatus}
              activeFiltersCount={activeFiltersCount}
              onReset={() => {
                setCategory('all');
                setStatus('all');
                setSearchQuery('');
              }}
            />
          </div>

          {/* Projects Grid */}
          <ProjectGrid
            projects={filteredProjects}
            emptyMessage="No projects match your filters"
            onReset={() => {
              setCategory('all');
              setStatus('all');
            }}
          />
        </Container>
      </Section>
    </>
  );
}
```

## Example 2: Project Detail Page

```tsx
import {
  Container,
  Section,
  Heading,
  Text,
  Badge,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Grid,
} from '@/components';
import { Calendar, MapPin, IndianRupee, Users, Download } from 'lucide-react';
import Image from 'next/image';

export default function ProjectDetailPage({ project }) {
  return (
    <>
      {/* Hero Section */}
      <Section variant="muted" spacing="default">
        <Container>
          <div className="flex items-center gap-3 mb-4">
            <Badge variant={project.status} size="lg">
              {project.status}
            </Badge>
            <Text variant="small" muted>
              {project.category}
            </Text>
          </div>
          <Heading level={1} className="mb-4">
            {project.title}
          </Heading>
          <Text variant="lead" className="max-w-3xl">
            {project.description}
          </Text>
        </Container>
      </Section>

      {/* Project Image */}
      <Section spacing="compact">
        <Container>
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </Container>
      </Section>

      {/* Project Details */}
      <Section spacing="comfortable">
        <Container>
          <Grid cols={2} gap="lg">
            {/* Main Content */}
            <div className="lg:col-span-1">
              <Heading level={2} className="mb-6">
                Project Overview
              </Heading>
              <div className="prose max-w-none">
                <Text className="mb-4">
                  {project.fullDescription}
                </Text>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="lg:col-span-1">
              <Card variant="outlined">
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 text-gray-400" size={20} />
                    <div>
                      <Text variant="small" className="font-semibold">
                        Location
                      </Text>
                      <Text variant="small">{project.location}</Text>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-1 text-gray-400" size={20} />
                    <div>
                      <Text variant="small" className="font-semibold">
                        Timeline
                      </Text>
                      <Text variant="small">{project.timeline}</Text>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <IndianRupee className="mt-1 text-gray-400" size={20} />
                    <div>
                      <Text variant="small" className="font-semibold">
                        Budget
                      </Text>
                      <Text variant="small">{project.budget}</Text>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="mt-1 text-gray-400" size={20} />
                    <div>
                      <Text variant="small" className="font-semibold">
                        Beneficiaries
                      </Text>
                      <Text variant="small">{project.beneficiaries}</Text>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                variant="primary"
                fullWidth
                icon={<Download size={18} />}
                className="mt-6"
              >
                Download Project Report
              </Button>
            </div>
          </Grid>
        </Container>
      </Section>
    </>
  );
}
```

## Example 3: Contact Form

```tsx
"use client";

import { useState } from 'react';
import {
  Container,
  Section,
  Heading,
  Text,
  Input,
  Select,
  Button,
  Card,
  CardContent,
  ErrorMessage,
} from '@/components';
import { Send } from 'lucide-react';

export default function ContactForm() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    category: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const categoryOptions = [
    { value: '', label: 'Select a category' },
    { value: 'project-inquiry', label: 'Project Inquiry' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'complaint', label: 'Complaint' },
    { value: 'suggestion', label: 'Suggestion' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Submit form...
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitSuccess(true);
      setFormState({ name: '', email: '', category: '', message: '' });
    } catch (error) {
      setSubmitError('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section spacing="comfortable">
      <Container size="narrow">
        <Heading level={1} align="center" className="mb-4">
          Get in Touch
        </Heading>
        <Text variant="lead" align="center" className="mb-12">
          Have questions about our projects? We're here to help.
        </Text>

        <Card variant="elevated">
          <CardContent className="p-8">
            {submitSuccess && (
              <ErrorMessage
                severity="info"
                title="Message Sent!"
                message="Thank you for contacting us. We'll respond soon."
                className="mb-6"
              />
            )}

            {submitError && (
              <ErrorMessage
                severity="error"
                title="Submission Failed"
                message={submitError}
                action={<Button onClick={() => setSubmitError(null)}>Dismiss</Button>}
                className="mb-6"
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Full Name"
                type="text"
                required
                placeholder="Enter your name"
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                error={errors.name}
              />

              <Input
                label="Email Address"
                type="email"
                required
                placeholder="your.email@example.com"
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                error={errors.email}
                helperText="We'll never share your email"
              />

              <Select
                label="Category"
                required
                options={categoryOptions}
                value={formState.category}
                onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                error={errors.category}
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  Message <span className="text-red-600">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tell us how we can help..."
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2.5 text-base transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isSubmitting}
                icon={<Send size={18} />}
              >
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Section>
  );
}
```

## Example 4: Stats Dashboard

```tsx
import {
  Container,
  Section,
  Heading,
  ProjectStats,
  Grid,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Text,
} from '@/components';
import {
  Folder,
  CheckCircle,
  Clock,
  Circle,
  TrendingUp,
  Users,
  IndianRupee,
  Award,
} from 'lucide-react';

export default function Dashboard() {
  const mainStats = [
    {
      label: 'Total Projects',
      value: '156',
      icon: Folder,
      variant: 'default' as const,
      change: { value: '+12 this year', trend: 'up' as const },
    },
    {
      label: 'Completed',
      value: '89',
      icon: CheckCircle,
      variant: 'success' as const,
      change: { value: '+8 this month', trend: 'up' as const },
    },
    {
      label: 'Total Investment',
      value: '₹250 Cr',
      icon: IndianRupee,
      variant: 'primary' as const,
    },
    {
      label: 'Beneficiaries',
      value: '2.5M+',
      icon: Users,
      variant: 'warning' as const,
    },
  ];

  const recentProjects = [
    {
      title: 'Community Health Center',
      status: 'completed' as const,
      date: 'Completed Dec 2024',
    },
    {
      title: 'School Building Renovation',
      status: 'ongoing' as const,
      date: 'In Progress',
    },
    {
      title: 'Water Pipeline Extension',
      status: 'planned' as const,
      date: 'Starts Feb 2025',
    },
  ];

  return (
    <>
      <Section variant="primary" spacing="default">
        <Container>
          <Heading level={1}>Dashboard</Heading>
          <Text variant="lead" className="mt-2">
            Overview of constituency development projects
          </Text>
        </Container>
      </Section>

      <Section spacing="comfortable">
        <Container>
          <ProjectStats stats={mainStats} className="mb-12" />

          <Grid cols={2} gap="lg">
            <Card variant="outlined">
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProjects.map((project, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between border-b border-gray-200 pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <Text className="font-semibold">{project.title}</Text>
                        <Text variant="small" muted>{project.date}</Text>
                      </div>
                      <Badge variant={project.status} size="sm">
                        {project.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Award className="text-blue-600" size={20} />
                    <Text variant="small">Best Performing District 2024</Text>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="text-green-600" size={20} />
                    <Text variant="small">95% Project Completion Rate</Text>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-600" size={20} />
                    <Text variant="small">Zero Pending Grievances</Text>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Container>
      </Section>
    </>
  );
}
```

## Tips for Usage

### 1. Consistent Spacing
Always use the spacing utilities from the design system:
```tsx
<div className="mb-4">   {/* 16px */}
<div className="gap-6">  {/* 24px */}
<div className="p-8">    {/* 32px */}
```

### 2. Proper Semantic HTML
Use correct heading hierarchy:
```tsx
<Heading level={1}>Page Title</Heading>
<Heading level={2}>Section</Heading>
<Heading level={3}>Subsection</Heading>
```

### 3. Accessibility
Always provide labels and ARIA attributes:
```tsx
<Button icon={<Icon />} aria-label="Close dialog">
  <Icon />
</Button>
```

### 4. Responsive Design
Use responsive utilities:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### 5. Loading States
Show loading feedback:
```tsx
{loading ? <LoadingSpinner /> : <ProjectGrid projects={data} />}
```
