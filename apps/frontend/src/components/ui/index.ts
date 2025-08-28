// Base UI Components
export { Button, buttonVariants } from "./button";
export { ButtonGroup } from "./button-group";
export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
export {
  cardPresets,
  cardVariants,
  CardWithVariants,
  type CardVariants,
} from "./card-variants";

// Specialized Cards
export { FeatureCard } from "./cards/FeatureCard";
export { PricingCard } from "./cards/PricingCard";
export { ProfileCard } from "./cards/ProfileCard";
export { StatCard } from "./cards/StatCard";
export { TestimonialCard } from "./cards/TestimonialCard";

// Form Components
export { FloatingInput } from "../customUI/form/FloatingInput";
export {
  FormDescription,
  FormError,
  FormField,
  FormInput,
  FormLabel,
  FormProvider,
  ScholarForm,
} from "../customUI/form/ScholarFlowForm";
export { SearchInput } from "../customUI/form/SearchInput";
export { SelectField } from "../customUI/form/SelectField";

// Other UI Components
export { Avatar, AvatarFallback, AvatarImage } from "./avatar";
export { Badge, badgeVariants } from "./badge";
export { Checkbox } from "./checkbox";
export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
export { Input } from "./input";
export { Label } from "./label";
export { Separator } from "./separator";
export {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
export { Sidebar } from "./sidebar";
export { Skeleton } from "./skeleton";
export { Switch } from "./switch";
export {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
export { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
export { Textarea } from "./textarea";
export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

// Phase 3: Performance & UX Components
export {
  HoverCard,
  LoadingSpinner,
  PageTransition,
  StaggerContainer,
} from "../transitions/PageTransition";
export {
  ContentLoader,
  LoadingSkeleton,
  ProgressBar,
  Shimmer,
  Spinner,
} from "./loading-states";
export { OptimizedImage } from "./optimized-image";
export { VirtualList, VirtualTable } from "./virtual-list";

// Phase 4: Advanced UI Components
export { DataTable } from "./data-table/DataTable";
export {
  Modal,
  ModalBody,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "./modal/Modal";

// Navigation Components
export {
  Breadcrumbs,
  BreadcrumbsWithBack,
  CompactBreadcrumbs,
} from "../navigation/Breadcrumbs";
export { CommandPalette } from "../navigation/CommandPalette";
