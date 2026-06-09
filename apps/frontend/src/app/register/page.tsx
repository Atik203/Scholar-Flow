"use client";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/providers/ToastProvider";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/customUI/form/FloatingInput";
import { ToggleField } from "@/components/customUI/form/ToggleField";
import { useAuthRoute } from "@/hooks/useAuthGuard";
import { signInWithCredentials, signInWithOAuth } from "@/lib/auth/authHelpers";
import { getCallbackUrl } from "@/lib/auth/redirects";
import { setCredentials } from "@/redux/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
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
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    institution: z.string().optional(),
    fieldOfStudy: z.string().optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*\d)/,
        "Password must contain at least one lowercase letter and one number"
      ),
    confirmPassword: z.string(),
    acceptTerms: z
      .boolean()
      .refine((val) => val === true, "You must accept the terms and conditions"),
    newsletter: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const benefits = [
  "Unlimited paper uploads and AI analysis",
  "Advanced semantic search capabilities",
  "Real-time collaboration with teams",
  "Export to all major citation formats",
  "Priority customer support",
  "Mobile app access",
];

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

const researchFieldSuggestions = [
  {
    category: "Sciences",
    fields: ["Biology", "Chemistry", "Physics", "Mathematics", "Environmental Science"],
  },
  {
    category: "Computer Science",
    fields: ["Machine Learning", "Artificial Intelligence", "Data Science", "Cybersecurity", "Software Engineering"],
  },
  {
    category: "Engineering",
    fields: ["Mechanical Engineering", "Electrical Engineering", "Civil Engineering", "Biomedical Engineering", "Aerospace Engineering"],
  },
  {
    category: "Social Sciences",
    fields: ["Psychology", "Sociology", "Economics", "Political Science", "Anthropology"],
  },
  {
    category: "Humanities",
    fields: ["History", "Philosophy", "Literature", "Linguistics", "Art History"],
  },
  {
    category: "Medical",
    fields: ["Medicine", "Neuroscience", "Pharmacology", "Public Health", "Genetics"],
  },
];

const formSteps = [
  { id: 1, title: "Personal Info", description: "Your basic details" },
  { id: 2, title: "Academic Profile", description: "Your research background" },
  { id: 3, title: "Security", description: "Secure your account" },
];

const getPasswordStrength = (password: string) => {
  if (!password) return { strength: 0, text: "", width: "0%" };
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z\d]/.test(password)) strength++;
  const width = `${(strength / 5) * 100}%`;
  if (strength <= 2) return { strength, text: "Weak", color: "bg-red-500", textColor: "text-red-500", width };
  if (strength <= 3) return { strength, text: "Fair", color: "bg-yellow-500", textColor: "text-yellow-500", width };
  if (strength <= 4) return { strength, text: "Good", color: "bg-green-500", textColor: "text-green-500", width };
  return { strength, text: "Strong", color: "bg-green-600", textColor: "text-green-600", width };
};

const PasswordStrengthBar = ({ password }: { password: string }) => {
  const strength = useMemo(() => getPasswordStrength(password), [password]);
  if (!password) return null;
  return (
    <div className="mt-2 flex items-center gap-2">
      <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${strength.color}`}
          style={{ width: strength.width }}
        />
      </div>
      <span className={`text-xs ${strength.textColor}`}>{strength.text}</span>
    </div>
  );
};

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [institution, setInstitution] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [showInstitutionSuggestions, setShowInstitutionSuggestions] = useState(false);
  const [showFieldSuggestions, setShowFieldSuggestions] = useState(false);
  const [filteredInstitutions, setFilteredInstitutions] = useState<string[]>([]);
  const [fieldValidation, setFieldValidation] = useState<Record<string, { valid: boolean; message: string }>>({});
  const institutionRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const { isLoading: authLoading } = useAuthRoute();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      institution: "",
      fieldOfStudy: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
      newsletter: false,
    },
  });

  const watchedFields = watch();

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (institutionRef.current && !institutionRef.current.contains(e.target as Node)) {
        setShowInstitutionSuggestions(false);
      }
      if (fieldRef.current && !fieldRef.current.contains(e.target as Node)) {
        setShowFieldSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validateField = (field: string, value: string) => {
    let validation = { valid: true, message: "" };
    switch (field) {
      case "firstName":
        if (value.length === 0) validation = { valid: false, message: "Required" };
        else if (value.length < 2) validation = { valid: false, message: "Too short" };
        else validation = { valid: true, message: "Looks good!" };
        break;
      case "lastName":
        if (value.length === 0) validation = { valid: false, message: "Required" };
        else if (value.length < 2) validation = { valid: false, message: "Too short" };
        else validation = { valid: true, message: "Looks good!" };
        break;
      case "email":
        if (value.length === 0) validation = { valid: false, message: "Required" };
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) validation = { valid: false, message: "Invalid email" };
        else validation = { valid: true, message: "Valid email" };
        break;
      case "password":
        if (value.length === 0) validation = { valid: false, message: "Required" };
        else if (value.length < 8) validation = { valid: false, message: "Min 8 characters" };
        else validation = { valid: true, message: "Strong password!" };
        break;
      case "confirmPassword":
        if (value !== watchedFields.password) validation = { valid: false, message: "Doesn't match" };
        else if (value.length > 0) validation = { valid: true, message: "Passwords match!" };
        break;
    }
    setFieldValidation((prev) => ({ ...prev, [field]: validation }));
  };

  const canProceedToStep = (step: number): boolean => {
    switch (step) {
      case 2:
        return (
          watchedFields.firstName.length >= 2 &&
          watchedFields.lastName.length >= 2 &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(watchedFields.email)
        );
      case 3:
        return true;
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const password = watchedFields.password;

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          institution: data.institution,
          fieldOfStudy: data.fieldOfStudy,
          password: data.password,
          role: "RESEARCHER",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      showSuccessToast("Account created successfully! Welcome to ScholarFlow.");

      if (result.success && result.data?.user && result.data?.accessToken) {
        dispatch(setCredentials({
          user: result.data.user,
          accessToken: result.data.accessToken,
        }));
        const onboardRedirect = result.data.user.onboardingCompleted
          ? (getCallbackUrl(searchParams) || "/dashboard")
          : "/onboarding";
        router.push(onboardRedirect);
      } else {
        const signInResult = await signInWithCredentials(
          data.email,
          data.password,
          dispatch
        );

        if (signInResult.success) {
          const callbackUrl = getCallbackUrl(searchParams);
          router.push(callbackUrl || "/dashboard");
        } else {
          const callbackUrl = getCallbackUrl(searchParams);
          const loginUrl = new URL("/login", window.location.origin);
          if (callbackUrl !== "/dashboard") {
            loginUrl.searchParams.set("callbackUrl", callbackUrl);
          }
          router.push(loginUrl.toString());
        }
      }
    } catch (error) {
      showErrorToast(
        error instanceof Error ? error.message : "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: "google" | "github") => {
    setIsLoading(true);
    try {
      const callbackUrl = getCallbackUrl(searchParams);
      signInWithOAuth(provider, callbackUrl);
    } catch {
      showErrorToast(`Failed to sign up with ${provider}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-screen">
          <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-chart-1/10 to-primary/5" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,theme(colors.primary/20),transparent_50%)]" />

            <div className="relative flex flex-col justify-center p-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="mb-8">
                  <Image
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop&auto=format"
                    alt="Research team collaboration"
                    width={400}
                    height={300}
                    className="rounded-2xl shadow-2xl"
                  />
                </div>

                <h2 className="text-3xl font-bold mb-4">
                  Join{" "}
                  <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
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

          <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-md">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-center mb-8">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to home
                  </Link>

                  <div className="mb-6">
                    <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-chart-1/20 border border-primary/30 flex items-center justify-center">
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

                <div className="space-y-3 mb-6">
                  <Button
                    onClick={() => handleSocialLogin("google")}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full border-border hover:bg-muted/50 transition-all duration-300 disabled:opacity-50"
                    size="lg"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Sign up with Google
                  </Button>

                  <Button
                    onClick={() => handleSocialLogin("github")}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full border-border hover:bg-muted/50 transition-all duration-300 disabled:opacity-50"
                    size="lg"
                  >
                    <Github className="h-5 w-5 mr-3" />
                    Sign up with GitHub
                  </Button>
                </div>

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
                                  width: currentStep > step.id ? "100%" : "0%",
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

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-5"
                      >
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <FloatingInput
                              label="First name"
                              required
                              value={watchedFields.firstName}
                              onChange={(e) => {
                                setValue("firstName", e.target.value);
                                validateField("firstName", e.target.value);
                              }}
                              error={fieldValidation.firstName?.valid === false}
                              helperText={fieldValidation.firstName?.message}
                            />
                            {watchedFields.firstName && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                              >
                                {fieldValidation.firstName?.valid ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <X className="h-4 w-4 text-red-500" />
                                )}
                              </motion.div>
                            )}
                          </div>

                          <div>
                            <FloatingInput
                              label="Last name"
                              required
                              value={watchedFields.lastName}
                              onChange={(e) => {
                                setValue("lastName", e.target.value);
                                validateField("lastName", e.target.value);
                              }}
                              error={fieldValidation.lastName?.valid === false}
                              helperText={fieldValidation.lastName?.message}
                            />
                          </div>
                        </div>

                        <div>
                          <FloatingInput
                            label="Email address"
                            type="email"
                            required
                            value={watchedFields.email}
                            onChange={(e) => {
                              setValue("email", e.target.value);
                              validateField("email", e.target.value);
                            }}
                            error={fieldValidation.email?.valid === false}
                            helperText={fieldValidation.email?.message}
                          />
                        </div>

                        <div className="flex justify-end pt-2">
                          <Button
                            type="button"
                            onClick={nextStep}
                            disabled={!canProceedToStep(2)}
                            variant="gradient"
                            className="px-6"
                          >
                            Next Step
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-5"
                      >
                        <div ref={institutionRef} className="relative">
                          <label className="block text-sm font-medium mb-2">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              Institution{" "}
                              <span className="text-muted-foreground font-normal">
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
                            className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
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
                                          setValue("institution", inst);
                                          setShowInstitutionSuggestions(false);
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

                        <div ref={fieldRef} className="relative">
                          <label className="block text-sm font-medium mb-2">
                            <div className="flex items-center gap-2">
                              <Beaker className="h-4 w-4 text-muted-foreground" />
                              Field of study{" "}
                              <span className="text-muted-foreground font-normal">
                                (optional)
                              </span>
                            </div>
                          </label>
                          <input
                            value={fieldOfStudy}
                            onChange={(e) => setFieldOfStudy(e.target.value)}
                            onFocus={() => setShowFieldSuggestions(true)}
                            placeholder="e.g., Machine Learning, Biology..."
                            className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
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
                                  {researchFieldSuggestions.map((category) => (
                                    <div key={category.category} className="mt-2">
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
                                              setValue("fieldOfStudy", field);
                                              setShowFieldSuggestions(false);
                                            }}
                                            className="px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded-md transition-colors"
                                          >
                                            {field}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="flex justify-between pt-2">
                          <Button variant="ghost" onClick={prevStep} type="button">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                          </Button>
                          <Button
                            type="button"
                            onClick={nextStep}
                            variant="gradient"
                            className="px-6"
                          >
                            Next Step
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-5"
                      >
                        <div>
                          <div className="relative">
                            <FloatingInput
                              label="Password"
                              type={showPassword ? "text" : "password"}
                              required
                              value={watchedFields.password}
                              onChange={(e) => {
                                setValue("password", e.target.value);
                                validateField("password", e.target.value);
                              }}
                              error={fieldValidation.password?.valid === false}
                              helperText={fieldValidation.password?.message}
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-0 top-3 text-muted-foreground hover:text-foreground transition-colors"
                              tabIndex={-1}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          <PasswordStrengthBar password={password || ""} />
                        </div>

                        <div className="relative">
                          <FloatingInput
                            label="Confirm password"
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={watchedFields.confirmPassword}
                            onChange={(e) => {
                              setValue("confirmPassword", e.target.value);
                              validateField("confirmPassword", e.target.value);
                            }}
                            error={fieldValidation.confirmPassword?.valid === false}
                            helperText={fieldValidation.confirmPassword?.message}
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-0 top-3 text-muted-foreground hover:text-foreground transition-colors"
                            tabIndex={-1}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>

                        <div className="space-y-3">
                          <Controller
                            name="acceptTerms"
                            control={control}
                            render={({ field }) => (
                              <ToggleField
                                checked={field.value ?? false}
                                onCheckedChange={field.onChange}
                                label="I agree to the Terms of Service and Privacy Policy"
                                size="sm"
                              />
                            )}
                          />
                          {errors.acceptTerms ? (
                            <p className="text-destructive text-sm">{errors.acceptTerms.message}</p>
                          ) : null}

                          <Controller
                            name="newsletter"
                            control={control}
                            render={({ field }) => (
                              <ToggleField
                                checked={field.value ?? false}
                                onCheckedChange={field.onChange}
                                label="Send me updates about new features and research insights"
                                size="sm"
                              />
                            )}
                          />
                        </div>

                        <div className="flex justify-between pt-2">
                          <Button variant="ghost" onClick={prevStep} type="button">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                          </Button>
                          <Button
                            type="submit"
                            disabled={isLoading}
                            variant="gradient"
                            className="px-6"
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Creating account...
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

                <div className="mt-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="text-primary hover:text-primary/80 transition-colors font-medium"
                    >
                      Sign in
                    </Link>
                  </p>

                  <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Shield className="h-3 w-3" />
                    <span>Your data is protected with enterprise-grade security</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
