"use client";

/**
 * RegisterPage - User Registration
 *
 * Enhanced with:
 * - Progressive multi-step form with step indicator
 * - Field validation animations with real-time feedback
 * - Institution autocomplete suggestions
 * - Research field suggestions with popular options
 */

import {
  ArrowLeft,
  ArrowRight,
  Beaker,
  BookOpen,
  Building2,
  Check,
  CheckCircle,
  ChevronRight,
  Eye,
  EyeOff,
  Github,
  GraduationCap,
  Loader2,
  Mail,
  Shield,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { Button } from "../components/ui/button";

// Role types for the system
type UserRole = "researcher" | "pro_researcher" | "team_lead" | "admin";

interface RegisterPageProps {
  onNavigate?: (path: string) => void;
  onShowToast?: (message: string, type: "error" | "success" | "info") => void;
}

const benefits = [
  "Unlimited paper uploads and AI analysis",
  "Advanced semantic search capabilities",
  "Real-time collaboration with teams",
  "Export to all major citation formats",
  "Priority customer support",
  "Mobile app access",
];

// Institution suggestions for autocomplete
const institutionSuggestions = [
  "Massachusetts Institute of Technology (MIT)",
  "Stanford University",
  "Harvard University",
  "University of Oxford",
  "University of Cambridge",
  "California Institute of Technology (Caltech)",
  "ETH Zurich",
  "University of Chicago",
  "Imperial College London",
  "Princeton University",
  "Yale University",
  "Columbia University",
  "University of Pennsylvania",
  "Johns Hopkins University",
  "University of California, Berkeley",
  "Cornell University",
  "Duke University",
  "Northwestern University",
  "University of Michigan",
  "Carnegie Mellon University",
];

// Research field suggestions with categories
const researchFieldSuggestions = [
  {
    category: "Sciences",
    fields: [
      "Biology",
      "Chemistry",
      "Physics",
      "Mathematics",
      "Environmental Science",
    ],
  },
  {
    category: "Computer Science",
    fields: [
      "Machine Learning",
      "Artificial Intelligence",
      "Data Science",
      "Cybersecurity",
      "Software Engineering",
    ],
  },
  {
    category: "Engineering",
    fields: [
      "Mechanical Engineering",
      "Electrical Engineering",
      "Civil Engineering",
      "Biomedical Engineering",
      "Aerospace Engineering",
    ],
  },
  {
    category: "Social Sciences",
    fields: [
      "Psychology",
      "Sociology",
      "Economics",
      "Political Science",
      "Anthropology",
    ],
  },
  {
    category: "Humanities",
    fields: [
      "History",
      "Philosophy",
      "Literature",
      "Linguistics",
      "Art History",
    ],
  },
  {
    category: "Medical",
    fields: [
      "Medicine",
      "Neuroscience",
      "Pharmacology",
      "Public Health",
      "Genetics",
    ],
  },
];

// Multi-step form configuration
const formSteps = [
  { id: 1, title: "Personal Info", description: "Your basic details" },
  { id: 2, title: "Academic Profile", description: "Your research background" },
  { id: 3, title: "Security", description: "Secure your account" },
];

// Role email patterns for demo
const roleEmailPatterns: Record<string, UserRole> = {
  "researcher@example.com": "researcher",
  "pro@example.com": "pro_researcher",
  "lead@example.com": "team_lead",
  "admin@example.com": "admin",
};

export function RegisterPage({ onNavigate, onShowToast }: RegisterPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  // Autocomplete state
  const [showInstitutionSuggestions, setShowInstitutionSuggestions] =
    useState(false);
  const [showFieldSuggestions, setShowFieldSuggestions] = useState(false);
  const [filteredInstitutions, setFilteredInstitutions] = useState<string[]>(
    []
  );
  const institutionRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);

  // Field validation state
  const [fieldValidation, setFieldValidation] = useState<
    Record<string, { valid: boolean; message: string }>
  >({});

  // Filter institutions based on input
  useEffect(() => {
    if (institution.length > 0) {
      const filtered = institutionSuggestions.filter((inst) =>
        inst.toLowerCase().includes(institution.toLowerCase())
      );
      setFilteredInstitutions(filtered);
      setShowInstitutionSuggestions(filtered.length > 0);
    } else {
      setShowInstitutionSuggestions(false);
    }
  }, [institution]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        institutionRef.current &&
        !institutionRef.current.contains(e.target as Node)
      ) {
        setShowInstitutionSuggestions(false);
      }
      if (fieldRef.current && !fieldRef.current.contains(e.target as Node)) {
        setShowFieldSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Real-time field validation
  const validateField = (field: string, value: string) => {
    let validation = { valid: true, message: "" };

    switch (field) {
      case "firstName":
        if (value.length === 0)
          validation = { valid: false, message: "Required" };
        else if (value.length < 2)
          validation = { valid: false, message: "Too short" };
        else validation = { valid: true, message: "Looks good!" };
        break;
      case "lastName":
        if (value.length === 0)
          validation = { valid: false, message: "Required" };
        else if (value.length < 2)
          validation = { valid: false, message: "Too short" };
        else validation = { valid: true, message: "Looks good!" };
        break;
      case "email":
        if (value.length === 0)
          validation = { valid: false, message: "Required" };
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          validation = { valid: false, message: "Invalid email" };
        else validation = { valid: true, message: "Valid email" };
        break;
      case "password":
        if (value.length === 0)
          validation = { valid: false, message: "Required" };
        else if (value.length < 8)
          validation = { valid: false, message: "Min 8 characters" };
        else validation = { valid: true, message: "Strong password!" };
        break;
      case "confirmPassword":
        if (value !== password)
          validation = { valid: false, message: "Doesn't match" };
        else if (value.length > 0)
          validation = { valid: true, message: "Passwords match!" };
        break;
    }

    setFieldValidation((prev) => ({ ...prev, [field]: validation }));
  };

  // Step navigation
  const canProceedToStep = (step: number): boolean => {
    switch (step) {
      case 2:
        return (
          firstName.length >= 2 &&
          lastName.length >= 2 &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        );
      case 3:
        return true; // Academic info is optional
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < 3 && canProceedToStep(currentStep + 1)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Determine role from email
  const determineRole = (email: string): UserRole | null => {
    if (roleEmailPatterns[email.toLowerCase()]) {
      return roleEmailPatterns[email.toLowerCase()];
    }
    const lowerEmail = email.toLowerCase();
    if (lowerEmail.startsWith("admin")) return "admin";
    if (lowerEmail.startsWith("lead") || lowerEmail.startsWith("team"))
      return "team_lead";
    if (lowerEmail.startsWith("pro")) return "pro_researcher";
    if (lowerEmail.includes("@")) return "researcher";
    return null;
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, text: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    if (strength <= 2) return { strength, text: "Weak", color: "text-red-500" };
    if (strength <= 3)
      return { strength, text: "Fair", color: "text-yellow-500" };
    if (strength <= 4)
      return { strength, text: "Good", color: "text-green-500" };
    return { strength, text: "Strong", color: "text-green-600" };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!firstName.trim()) {
      onShowToast?.("Please enter your first name", "error");
      return;
    }
    if (!lastName.trim()) {
      onShowToast?.("Please enter your last name", "error");
      return;
    }
    if (!email.trim()) {
      onShowToast?.("Please enter your email address", "error");
      return;
    }

    const role = determineRole(email);
    if (!role) {
      onShowToast?.("Please enter a valid email address", "error");
      return;
    }

    if (!password.trim() || password.length < 8) {
      onShowToast?.("Password must be at least 8 characters", "error");
      return;
    }
    if (password !== confirmPassword) {
      onShowToast?.("Passwords don't match", "error");
      return;
    }
    if (!acceptTerms) {
      onShowToast?.("You must accept the terms and conditions", "error");
      return;
    }

    setIsLoading(true);

    // Simulate registration
    setTimeout(() => {
      setIsLoading(false);
      onShowToast?.(
        "Account created successfully! Welcome to ScholarFlow.",
        "success"
      );

      // Navigate to onboarding for new users
      onNavigate?.("/onboarding");
    }, 1500);
  };

  const handleSocialLogin = (provider: "google" | "github") => {
    setIsLoading(true);
    onShowToast?.(`Signing up with ${provider}...`, "info");

    setTimeout(() => {
      setIsLoading(false);
      // Navigate to onboarding for new users
      onNavigate?.("/onboarding");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <Navbar onNavigate={onNavigate} />

      {/* Main Content */}
      <div className="flex-1">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[calc(100vh-80px)]">
            {/* Left side - Hero Image/Content */}
            <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-[var(--chart-1)]/10 to-primary/5" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,hsl(var(--primary)/0.2),transparent_50%)]" />

              <div className="relative flex flex-col justify-center p-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="mb-8">
                    <img
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop&auto=format"
                      alt="Research team collaboration"
                      className="rounded-2xl shadow-2xl w-[400px] h-[300px] object-cover"
                    />
                  </div>

                  <h2 className="text-3xl font-bold mb-4">
                    Join{" "}
                    <span className="bg-gradient-to-r from-primary to-[var(--chart-1)] bg-clip-text text-transparent">
                      50,000+
                    </span>{" "}
                    researchers
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 max-w-md">
                    Accelerate your research with AI-powered tools trusted by
                    leading institutions worldwide.
                  </p>

                  <div className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                        className="flex items-center gap-3 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
              <div className="w-full max-w-md">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Header */}
                  <div className="text-center mb-8">
                    <button
                      onClick={() => onNavigate?.("/")}
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to home
                    </button>

                    <div className="mb-6">
                      <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-[var(--chart-1)]/20 border border-primary/30 flex items-center justify-center">
                        <Sparkles className="h-8 w-8 text-primary" />
                      </div>
                      <h1 className="text-3xl font-bold tracking-tight">
                        Create account
                      </h1>
                      <p className="text-muted-foreground mt-2">
                        Start your research journey today
                      </p>
                    </div>
                  </div>

                  {/* Social Login Buttons */}
                  <div className="space-y-3 mb-6">
                    <Button
                      onClick={() => handleSocialLogin("google")}
                      disabled={isLoading}
                      variant="outline"
                      className="w-full border-border hover:bg-muted/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed btn-hover-glow"
                      size="lg"
                    >
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Sign up with Google
                    </Button>

                    <Button
                      onClick={() => handleSocialLogin("github")}
                      disabled={isLoading}
                      variant="outline"
                      className="w-full border-border hover:bg-muted/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed btn-hover-glow"
                      size="lg"
                    >
                      <Github className="h-5 w-5 mr-3" />
                      Sign up with GitHub
                    </Button>
                  </div>

                  {/* Divider */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-background text-muted-foreground">
                        Or sign up with email
                      </span>
                    </div>
                  </div>

                  {/* Step Indicator */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between">
                      {formSteps.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                          <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{
                              scale: currentStep >= step.id ? 1 : 0.8,
                              backgroundColor:
                                currentStep >= step.id
                                  ? "hsl(var(--primary))"
                                  : "transparent",
                            }}
                            className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                              currentStep >= step.id
                                ? "border-primary text-primary-foreground"
                                : "border-muted-foreground/30 text-muted-foreground"
                            }`}
                          >
                            {currentStep > step.id ? (
                              <Check className="h-5 w-5" />
                            ) : (
                              <span className="text-sm font-semibold">
                                {step.id}
                              </span>
                            )}
                          </motion.div>
                          {index < formSteps.length - 1 && (
                            <div className="hidden sm:flex mx-2 w-12 lg:w-20">
                              <motion.div className="h-0.5 w-full bg-muted-foreground/20 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{
                                    width:
                                      currentStep > step.id ? "100%" : "0%",
                                  }}
                                  className="h-full bg-primary"
                                  transition={{ duration: 0.3 }}
                                />
                              </motion.div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2">
                      {formSteps.map((step) => (
                        <div key={step.id} className="text-center flex-1">
                          <p
                            className={`text-xs font-medium ${currentStep >= step.id ? "text-foreground" : "text-muted-foreground"}`}
                          >
                            {step.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Multi-Step Registration Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <AnimatePresence mode="wait">
                      {/* Step 1: Personal Info */}
                      {currentStep === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-4"
                        >
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                First name
                              </label>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                  value={firstName}
                                  onChange={(e) => {
                                    setFirstName(e.target.value);
                                    validateField("firstName", e.target.value);
                                  }}
                                  placeholder="John"
                                  className={`w-full pl-10 pr-10 py-3 border rounded-xl bg-background focus:outline-none focus:ring-2 transition-all ${
                                    fieldValidation.firstName?.valid === false
                                      ? "border-red-500 focus:ring-red-500/50"
                                      : fieldValidation.firstName?.valid
                                        ? "border-green-500 focus:ring-green-500/50"
                                        : "border-border focus:ring-primary/50"
                                  }`}
                                />
                                <AnimatePresence>
                                  {fieldValidation.firstName && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.5 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.5 }}
                                      className="absolute right-3 top-1/2 -translate-y-1/2"
                                    >
                                      {fieldValidation.firstName.valid ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <X className="h-4 w-4 text-red-500" />
                                      )}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                              {fieldValidation.firstName && (
                                <motion.p
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className={`text-xs mt-1 ${fieldValidation.firstName.valid ? "text-green-500" : "text-red-500"}`}
                                >
                                  {fieldValidation.firstName.message}
                                </motion.p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Last name
                              </label>
                              <div className="relative">
                                <input
                                  value={lastName}
                                  onChange={(e) => {
                                    setLastName(e.target.value);
                                    validateField("lastName", e.target.value);
                                  }}
                                  placeholder="Doe"
                                  className={`w-full px-4 pr-10 py-3 border rounded-xl bg-background focus:outline-none focus:ring-2 transition-all ${
                                    fieldValidation.lastName?.valid === false
                                      ? "border-red-500 focus:ring-red-500/50"
                                      : fieldValidation.lastName?.valid
                                        ? "border-green-500 focus:ring-green-500/50"
                                        : "border-border focus:ring-primary/50"
                                  }`}
                                />
                                <AnimatePresence>
                                  {fieldValidation.lastName && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.5 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.5 }}
                                      className="absolute right-3 top-1/2 -translate-y-1/2"
                                    >
                                      {fieldValidation.lastName.valid ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <X className="h-4 w-4 text-red-500" />
                                      )}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                              {fieldValidation.lastName && (
                                <motion.p
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className={`text-xs mt-1 ${fieldValidation.lastName.valid ? "text-green-500" : "text-red-500"}`}
                                >
                                  {fieldValidation.lastName.message}
                                </motion.p>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Email address
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                  setEmail(e.target.value);
                                  validateField("email", e.target.value);
                                }}
                                placeholder="john.doe@university.edu"
                                className={`w-full pl-10 pr-10 py-3 border rounded-xl bg-background focus:outline-none focus:ring-2 transition-all ${
                                  fieldValidation.email?.valid === false
                                    ? "border-red-500 focus:ring-red-500/50"
                                    : fieldValidation.email?.valid
                                      ? "border-green-500 focus:ring-green-500/50"
                                      : "border-border focus:ring-primary/50"
                                }`}
                              />
                              <AnimatePresence>
                                {fieldValidation.email && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                  >
                                    {fieldValidation.email.valid ? (
                                      <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <X className="h-4 w-4 text-red-500" />
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                            {fieldValidation.email && (
                              <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`text-xs mt-1 ${fieldValidation.email.valid ? "text-green-500" : "text-red-500"}`}
                              >
                                {fieldValidation.email.message}
                              </motion.p>
                            )}
                          </div>

                          <div className="flex justify-end pt-4">
                            <Button
                              type="button"
                              onClick={nextStep}
                              disabled={!canProceedToStep(2)}
                              variant="gradient"
                              className="px-6 btn-hover-glow"
                            >
                              Next Step
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 2: Academic Profile */}
                      {currentStep === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-4"
                        >
                          {/* Institution with Autocomplete */}
                          <div ref={institutionRef} className="relative">
                            <label className="block text-sm font-medium mb-2">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                Institution{" "}
                                <span className="text-muted-foreground">
                                  (optional)
                                </span>
                              </div>
                            </label>
                            <input
                              value={institution}
                              onChange={(e) => setInstitution(e.target.value)}
                              onFocus={() =>
                                institution.length > 0 &&
                                setShowInstitutionSuggestions(true)
                              }
                              placeholder="Start typing your institution..."
                              className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                            <AnimatePresence>
                              {showInstitutionSuggestions &&
                                filteredInstitutions.length > 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute z-50 w-full mt-1 bg-background border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto"
                                  >
                                    {filteredInstitutions
                                      .slice(0, 5)
                                      .map((inst, index) => (
                                        <button
                                          key={index}
                                          type="button"
                                          onClick={() => {
                                            setInstitution(inst);
                                            setShowInstitutionSuggestions(
                                              false
                                            );
                                          }}
                                          className="w-full px-4 py-2 text-left text-sm hover:bg-muted/50 transition-colors flex items-center gap-2"
                                        >
                                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                          {inst}
                                        </button>
                                      ))}
                                  </motion.div>
                                )}
                            </AnimatePresence>
                          </div>

                          {/* Research Field with Suggestions */}
                          <div ref={fieldRef} className="relative">
                            <label className="block text-sm font-medium mb-2">
                              <div className="flex items-center gap-2">
                                <Beaker className="h-4 w-4 text-muted-foreground" />
                                Field of study{" "}
                                <span className="text-muted-foreground">
                                  (optional)
                                </span>
                              </div>
                            </label>
                            <input
                              value={fieldOfStudy}
                              onChange={(e) => setFieldOfStudy(e.target.value)}
                              onFocus={() => setShowFieldSuggestions(true)}
                              placeholder="e.g., Machine Learning, Biology..."
                              className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                            <AnimatePresence>
                              {showFieldSuggestions && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="absolute z-50 w-full mt-1 bg-background border border-border rounded-xl shadow-lg max-h-64 overflow-y-auto"
                                >
                                  <div className="p-2">
                                    <p className="text-xs text-muted-foreground px-2 py-1">
                                      Popular research fields:
                                    </p>
                                    {researchFieldSuggestions.map(
                                      (category) => (
                                        <div
                                          key={category.category}
                                          className="mt-2"
                                        >
                                          <p className="text-xs font-medium text-primary px-2 py-1 flex items-center gap-1">
                                            <BookOpen className="h-3 w-3" />
                                            {category.category}
                                          </p>
                                          <div className="flex flex-wrap gap-1 px-2">
                                            {category.fields.map((field) => (
                                              <button
                                                key={field}
                                                type="button"
                                                onClick={() => {
                                                  setFieldOfStudy(field);
                                                  setShowFieldSuggestions(
                                                    false
                                                  );
                                                }}
                                                className="px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded-md transition-colors"
                                              >
                                                {field}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          <div className="flex justify-between pt-4">
                            <Button
                              type="button"
                              onClick={prevStep}
                              variant="outline"
                              className="px-6"
                            >
                              <ArrowLeft className="h-4 w-4 mr-1" />
                              Back
                            </Button>
                            <Button
                              type="button"
                              onClick={nextStep}
                              variant="gradient"
                              className="px-6 btn-hover-glow"
                            >
                              Next Step
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 3: Security */}
                      {currentStep === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-4"
                        >
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Password
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => {
                                  setPassword(e.target.value);
                                  validateField("password", e.target.value);
                                }}
                                placeholder="Create a strong password"
                                className={`w-full pr-12 pl-4 py-3 border rounded-xl bg-background focus:outline-none focus:ring-2 transition-all ${
                                  fieldValidation.password?.valid === false
                                    ? "border-red-500 focus:ring-red-500/50"
                                    : fieldValidation.password?.valid
                                      ? "border-green-500 focus:ring-green-500/50"
                                      : "border-border focus:ring-primary/50"
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>

                            {password && (
                              <div className="mt-2 space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{
                                        width: `${(passwordStrength.strength / 5) * 100}%`,
                                      }}
                                      className={`h-full transition-colors ${
                                        passwordStrength.strength <= 2
                                          ? "bg-red-500"
                                          : passwordStrength.strength <= 3
                                            ? "bg-yellow-500"
                                            : passwordStrength.strength <= 4
                                              ? "bg-green-500"
                                              : "bg-green-600"
                                      }`}
                                    />
                                  </div>
                                  <span
                                    className={`text-xs ${passwordStrength.color}`}
                                  >
                                    {passwordStrength.text}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Confirm password
                            </label>
                            <div className="relative">
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => {
                                  setConfirmPassword(e.target.value);
                                  validateField(
                                    "confirmPassword",
                                    e.target.value
                                  );
                                }}
                                placeholder="Confirm your password"
                                className={`w-full pr-12 pl-4 py-3 border rounded-xl bg-background focus:outline-none focus:ring-2 transition-all ${
                                  fieldValidation.confirmPassword?.valid ===
                                  false
                                    ? "border-red-500 focus:ring-red-500/50"
                                    : fieldValidation.confirmPassword?.valid
                                      ? "border-green-500 focus:ring-green-500/50"
                                      : "border-border focus:ring-primary/50"
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                            {fieldValidation.confirmPassword && (
                              <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`text-xs mt-1 ${fieldValidation.confirmPassword.valid ? "text-green-500" : "text-red-500"}`}
                              >
                                {fieldValidation.confirmPassword.message}
                              </motion.p>
                            )}
                          </div>

                          <div className="space-y-3">
                            <label className="flex items-start gap-3 text-sm">
                              <input
                                type="checkbox"
                                checked={acceptTerms}
                                onChange={(e) =>
                                  setAcceptTerms(e.target.checked)
                                }
                                className="h-4 w-4 text-primary border-border rounded focus:ring-primary/50 mt-0.5"
                              />
                              <span>
                                I agree to the{" "}
                                <button
                                  type="button"
                                  onClick={() => onNavigate?.("/terms")}
                                  className="text-primary hover:text-primary/80 transition-colors"
                                >
                                  Terms of Service
                                </button>{" "}
                                and{" "}
                                <button
                                  type="button"
                                  onClick={() => onNavigate?.("/privacy")}
                                  className="text-primary hover:text-primary/80 transition-colors"
                                >
                                  Privacy Policy
                                </button>
                              </span>
                            </label>

                            <label className="flex items-center gap-3 text-sm text-muted-foreground">
                              <input
                                type="checkbox"
                                checked={newsletter}
                                onChange={(e) =>
                                  setNewsletter(e.target.checked)
                                }
                                className="h-4 w-4 text-primary border-border rounded focus:ring-primary/50"
                              />
                              <span>
                                Send me updates about new features and research
                                insights
                              </span>
                            </label>
                          </div>

                          <div className="flex justify-between pt-4">
                            <Button
                              type="button"
                              onClick={prevStep}
                              variant="outline"
                              className="px-6"
                            >
                              <ArrowLeft className="h-4 w-4 mr-1" />
                              Back
                            </Button>
                            <Button
                              type="submit"
                              disabled={
                                isLoading ||
                                !acceptTerms ||
                                password !== confirmPassword ||
                                password.length < 8
                              }
                              variant="gradient"
                              className="px-6 btn-hover-glow btn-shine"
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  Creating...
                                </>
                              ) : (
                                <>
                                  Create account
                                  <ArrowRight className="h-4 w-4 ml-2" />
                                </>
                              )}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>

                  {/* Footer */}
                  <div className="mt-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <button
                        onClick={() => onNavigate?.("/login")}
                        className="text-primary hover:text-primary/80 transition-colors font-medium"
                      >
                        Sign in
                      </button>
                    </p>

                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <Shield className="h-3 w-3" />
                      <span>
                        Your data is protected with enterprise-grade security
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
