"use client";

import {
  Button,
  ButtonGroup,
  CardWithVariants,
  FeatureCard,
  FloatingInput,
  ScholarForm,
  SearchInput,
  SelectField,
  StatCard,
  cardPresets,
} from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BarChart3,
  BookOpen,
  FileText,
  Lightbulb,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const demoFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type DemoFormData = z.infer<typeof demoFormSchema>;

const categoryOptions = [
  { value: "research", label: "Research Papers" },
  { value: "collections", label: "Collections" },
  { value: "collaboration", label: "Collaboration" },
  { value: "ai-insights", label: "AI Insights" },
];

export default function Phase2DemoPage() {
  const form = useForm<DemoFormData>({
    resolver: zodResolver(demoFormSchema),
    defaultValues: {
      email: "",
      name: "",
      category: "",
      description: "",
    },
  });

  const onSubmit = (data: DemoFormData) => {
    console.log("Form submitted:", data);
    alert("Form submitted successfully! Check console for data.");
  };

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
  };

  const handleCategoryChange = (value: string) => {
    form.setValue("category", value);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-5 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Phase 2: Component Library Enhancement
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Showcasing enhanced button system, ScholarFlow form system, and
            advanced card variants
          </p>
        </div>

        {/* Enhanced Button System */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-foreground mb-8 text-center">
            Enhanced Button System
          </h2>

          <div className="space-y-8">
            {/* Button Loading States */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-foreground">
                Loading States
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button loading>Loading Button</Button>
                <Button loading loadingText="Processing...">
                  Submit
                </Button>
                <Button variant="destructive" loading>
                  Delete
                </Button>
                <Button variant="outline" loading>
                  Save
                </Button>
              </div>
            </div>

            {/* Button Group */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-foreground">
                Button Groups
              </h3>
              <div className="flex flex-wrap gap-8">
                <ButtonGroup>
                  <Button variant="outline">Previous</Button>
                  <Button>Next</Button>
                </ButtonGroup>

                <ButtonGroup orientation="vertical">
                  <Button variant="outline">Option 1</Button>
                  <Button variant="outline">Option 2</Button>
                  <Button variant="outline">Option 3</Button>
                </ButtonGroup>

                <ButtonGroup size="sm">
                  <Button size="sm">Small</Button>
                  <Button size="sm" variant="outline">
                    Group
                  </Button>
                </ButtonGroup>
              </div>
            </div>
          </div>
        </section>

        {/* ScholarFlow Form System */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-foreground mb-8 text-center">
            ScholarFlow Form System
          </h2>

          <div className="max-w-2xl mx-auto">
            <ScholarForm.Root onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div>
                  <ScholarForm.Label htmlFor="email" required>
                    Email Address
                  </ScholarForm.Label>
                  <ScholarForm.Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    error={form.formState.errors.email?.message}
                    {...form.register("email")}
                  />
                </div>

                <div>
                  <ScholarForm.Label htmlFor="name" required>
                    Full Name
                  </ScholarForm.Label>
                  <ScholarForm.Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    error={form.formState.errors.name?.message}
                    {...form.register("name")}
                  />
                </div>

                <div>
                  <ScholarForm.Label htmlFor="category" required>
                    Category
                  </ScholarForm.Label>
                  <SelectField
                    options={categoryOptions}
                    value={form.watch("category")}
                    onChange={handleCategoryChange}
                    placeholder="Select a category"
                    searchable
                    error={!!form.formState.errors.category}
                  />
                  {form.formState.errors.category?.message && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.category.message}
                    </p>
                  )}
                </div>

                <div>
                  <ScholarForm.Label htmlFor="description" required>
                    Description
                  </ScholarForm.Label>
                  <textarea
                    id="description"
                    className="w-full min-h-[100px] rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter description"
                    {...form.register("description")}
                  />
                  {form.formState.errors.description?.message && (
                    <ScholarForm.Error>
                      {form.formState.errors.description.message}
                    </ScholarForm.Error>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  loading={form.formState.isSubmitting}
                >
                  Submit Form
                </Button>
              </div>
            </ScholarForm.Root>
          </div>
        </section>

        {/* Advanced Form Components */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-foreground mb-8 text-center">
            Advanced Form Components
          </h2>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Floating Input */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-foreground">
                Floating Label Input
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FloatingInput
                  label="Email Address"
                  type="email"
                  required
                  helperText="We'll never share your email"
                />
                <FloatingInput
                  label="Full Name"
                  type="text"
                  required
                  error
                  helperText="This field has an error"
                />
              </div>
            </div>

            {/* Search Input */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-foreground">
                Search Input
              </h3>
              <div className="max-w-md">
                <SearchInput
                  placeholder="Search papers, authors, or topics..."
                  onSearch={handleSearch}
                  showClearButton
                />
              </div>
            </div>

            {/* Select Field */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-foreground">
                Select Field with Search
              </h3>
              <div className="max-w-md">
                <SelectField
                  label="Select Category"
                  options={categoryOptions}
                  placeholder="Choose a category"
                  searchable
                  helperText="You can search through the options"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Card System Enhancement */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-foreground mb-8 text-center">
            Card System Enhancement
          </h2>

          <div className="space-y-12">
            {/* Card Variants */}
            <div className="space-y-6">
              <h3 className="text-2xl font-medium text-foreground">
                Card Variants
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CardWithVariants variant="default" padding="md">
                  <h4 className="font-semibold mb-2">Default Card</h4>
                  <p className="text-muted-foreground">
                    Standard card with default styling
                  </p>
                </CardWithVariants>

                <CardWithVariants variant="elevated" padding="md" hover="lift">
                  <h4 className="font-semibold mb-2">Elevated Card</h4>
                  <p className="text-muted-foreground">
                    Card with enhanced shadows and hover effects
                  </p>
                </CardWithVariants>

                <CardWithVariants
                  variant="interactive"
                  padding="md"
                  hover="scale"
                >
                  <h4 className="font-semibold mb-2">Interactive Card</h4>
                  <p className="text-muted-foreground">
                    Clickable card with hover animations
                  </p>
                </CardWithVariants>

                <CardWithVariants variant="ghost" padding="md" hover="border">
                  <h4 className="font-semibold mb-2">Ghost Card</h4>
                  <p className="text-muted-foreground">
                    Subtle card that shows borders on hover
                  </p>
                </CardWithVariants>

                <CardWithVariants variant="gradient" padding="md" hover="glow">
                  <h4 className="font-semibold mb-2">Gradient Card</h4>
                  <p className="text-muted-foreground">
                    Card with gradient background and glow effect
                  </p>
                </CardWithVariants>

                <CardWithVariants variant="outline" padding="md" hover="border">
                  <h4 className="font-semibold mb-2">Outline Card</h4>
                  <p className="text-muted-foreground">
                    Card with border and hover background
                  </p>
                </CardWithVariants>
              </div>
            </div>

            {/* Specialized Cards */}
            <div className="space-y-6">
              <h3 className="text-2xl font-medium text-foreground">
                Specialized Cards
              </h3>

              {/* Stat Cards */}
              <div className="space-y-4">
                <h4 className="text-xl font-medium text-foreground">
                  Stat Cards
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Total Papers"
                    value="1,234"
                    change={12.5}
                    trend="up"
                    icon={FileText}
                    description="Research papers in database"
                  />
                  <StatCard
                    title="Active Users"
                    value="567"
                    change={-3.2}
                    trend="down"
                    icon={Users}
                    description="Users this month"
                  />
                  <StatCard
                    title="Citations"
                    value="89.2K"
                    change={8.7}
                    trend="up"
                    icon={TrendingUp}
                    description="Total citations"
                  />
                  <StatCard
                    title="Collections"
                    value="45"
                    change={0}
                    trend="neutral"
                    icon={BookOpen}
                    description="User collections"
                  />
                </div>
              </div>

              {/* Feature Cards */}
              <div className="space-y-4">
                <h4 className="text-xl font-medium text-foreground">
                  Feature Cards
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FeatureCard
                    title="AI-Powered Search"
                    description="Advanced search with machine learning algorithms to find relevant papers quickly"
                    icon={Search}
                    showArrow
                    variant="gradient"
                    hover="lift"
                  />
                  <FeatureCard
                    title="Smart Collections"
                    description="Organize your research with intelligent tagging and categorization"
                    icon={Lightbulb}
                    showArrow
                    variant="filled"
                    hover="scale"
                  />
                  <FeatureCard
                    title="Analytics Dashboard"
                    description="Track your research progress with comprehensive analytics and insights"
                    icon={BarChart3}
                    showArrow
                    variant="gradient"
                    hover="glow"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Card Presets */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-foreground mb-8 text-center">
            Card Presets
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className={cardPresets.basic}>
              <h4 className="font-semibold mb-2">Basic Preset</h4>
              <p className="text-muted-foreground">
                Simple card with basic styling
              </p>
            </div>

            <div className={cardPresets.interactive}>
              <h4 className="font-semibold mb-2">Interactive Preset</h4>
              <p className="text-muted-foreground">
                Card with hover effects and animations
              </p>
            </div>

            <div className={cardPresets.elevated}>
              <h4 className="font-semibold mb-2">Elevated Preset</h4>
              <p className="text-muted-foreground">
                Card with enhanced shadows
              </p>
            </div>

            <div className={cardPresets.ghost}>
              <h4 className="font-semibold mb-2">Ghost Preset</h4>
              <p className="text-muted-foreground">
                Subtle card with hover interactions
              </p>
            </div>

            <div className={cardPresets.gradient}>
              <h4 className="font-semibold mb-2">Gradient Preset</h4>
              <p className="text-muted-foreground">
                Card with gradient background
              </p>
            </div>

            <div className={cardPresets.compact}>
              <h4 className="font-semibold mb-2">Compact Preset</h4>
              <p className="text-muted-foreground">Smaller card for lists</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
