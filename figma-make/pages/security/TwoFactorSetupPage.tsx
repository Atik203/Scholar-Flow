"use client";

import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle,
  ChevronRight,
  Copy,
  Download,
  Eye,
  EyeOff,
  HelpCircle,
  Key,
  Loader2,
  QrCode,
  Shield,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";

import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

interface TwoFactorSetupPageProps {
  onNavigate: (path: string) => void;
  role?: UserRole;
}

type SetupStep = "intro" | "scan" | "verify" | "backup" | "complete";

const mockBackupCodes = [
  "ABCD-1234-EFGH",
  "IJKL-5678-MNOP",
  "QRST-9012-UVWX",
  "YZAB-3456-CDEF",
  "GHIJ-7890-KLMN",
  "OPQR-1234-STUV",
  "WXYZ-5678-ABCD",
  "EFGH-9012-IJKL",
];

const defaultUser = {
  name: "John Researcher",
  email: "john@research.edu",
  role: "pro_researcher" as const,
};

export function TwoFactorSetupPage({
  onNavigate,
  role: propRole,
}: TwoFactorSetupPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  const [currentStep, setCurrentStep] = useState<SetupStep>("intro");
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [codesCopied, setCodesCopied] = useState(false);
  const [codesDownloaded, setCodesDownloaded] = useState(false);
  const [verificationError, setVerificationError] = useState(false);

  const secretKey = "JBSWY3DPEHPK3PXP";

  // Safe clipboard copy with fallback
  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers or restricted contexts
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand("copy");
          return true;
        } catch {
          return false;
        } finally {
          textArea.remove();
        }
      }
    } catch {
      // Final fallback - create textarea for manual copy
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        return true;
      } catch {
        return false;
      } finally {
        textArea.remove();
      }
    }
  };

  const handleCodeInput = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const chars = value.slice(0, 6).split("");
      const newCode = [...verificationCode];
      chars.forEach((char, i) => {
        if (index + i < 6) {
          newCode[index + i] = char;
        }
      });
      setVerificationCode(newCode);
      // Focus last filled or next empty
      const nextIndex = Math.min(index + chars.length, 5);
      document.getElementById(`code-${nextIndex}`)?.focus();
    } else {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      if (value && index < 5) {
        document.getElementById(`code-${index + 1}`)?.focus();
      }
    }
    setVerificationError(false);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const code = verificationCode.join("");
      if (code === "123456") {
        setCurrentStep("backup");
      } else {
        setVerificationError(true);
      }
    }, 1500);
  };

  const copyBackupCodes = async () => {
    const success = await copyToClipboard(mockBackupCodes.join("\n"));
    if (success) {
      setCodesCopied(true);
      setTimeout(() => setCodesCopied(false), 2000);
    }
  };

  const downloadBackupCodes = () => {
    const content = `ScholarFlow Two-Factor Authentication Backup Codes
=================================================

These backup codes can be used to access your account if you lose access to your authenticator app.
Each code can only be used once.

${mockBackupCodes.map((code, i) => `${i + 1}. ${code}`).join("\n")}

Generated: ${new Date().toLocaleString()}
Account: ${user.email}

Keep these codes in a safe place. Do not share them with anyone.
`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "scholarflow-backup-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
    setCodesDownloaded(true);
  };

  const steps = [
    { id: "intro", label: "Introduction" },
    { id: "scan", label: "Scan QR Code" },
    { id: "verify", label: "Verify" },
    { id: "backup", label: "Backup Codes" },
    { id: "complete", label: "Complete" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <DashboardLayout user={user} onNavigate={onNavigate}>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Two-Factor Authentication
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate("/security")}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Back to Security
          </button>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor:
                        index <= currentStepIndex ? "#10b981" : "#e2e8f0",
                      scale: index === currentStepIndex ? 1.1 : 1,
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                      ${index <= currentStepIndex ? "text-white" : "text-slate-500 dark:text-slate-400"}`}
                  >
                    {index < currentStepIndex ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      index + 1
                    )}
                  </motion.div>
                  <span
                    className={`text-xs mt-2 ${
                      index === currentStepIndex
                        ? "text-emerald-600 font-medium"
                        : "text-slate-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-slate-200 dark:bg-slate-700 mx-2">
                    <motion.div
                      initial={false}
                      animate={{
                        width: index < currentStepIndex ? "100%" : "0%",
                      }}
                      transition={{ duration: 0.3 }}
                      className="h-full bg-emerald-500"
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* Step Content */}
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Introduction Step */}
            {currentStep === "intro" && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8"
              >
                <div className="text-center mb-8">
                  <div className="inline-flex p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                    <ShieldCheck className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Secure Your Account
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                    Two-factor authentication adds an extra layer of security by
                    requiring a code from your phone in addition to your
                    password.
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {[
                    {
                      icon: <Smartphone className="h-5 w-5" />,
                      title: "Install an Authenticator App",
                      description:
                        "Download Google Authenticator, Authy, or Microsoft Authenticator",
                    },
                    {
                      icon: <QrCode className="h-5 w-5" />,
                      title: "Scan QR Code",
                      description:
                        "Use the app to scan a QR code we'll show you",
                    },
                    {
                      icon: <Key className="h-5 w-5" />,
                      title: "Enter Verification Code",
                      description:
                        "Enter the 6-digit code from your authenticator app",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50"
                    >
                      <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900 dark:text-white">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => setCurrentStep("scan")}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 text-white font-medium
                             hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/25"
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Scan QR Code Step */}
            {currentStep === "scan" && (
              <motion.div
                key="scan"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8"
              >
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center">
                  Scan QR Code
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-center mb-8">
                  Open your authenticator app and scan this QR code
                </p>

                {/* QR Code Placeholder */}
                <div className="flex justify-center mb-8">
                  <div className="p-6 bg-white rounded-2xl shadow-lg">
                    <div className="w-48 h-48 bg-slate-900 rounded-lg flex items-center justify-center">
                      {/* Simulated QR Code Pattern */}
                      <div className="grid grid-cols-7 gap-1 p-4">
                        {Array(49)
                          .fill(0)
                          .map((_, i) => (
                            <div
                              key={i}
                              className={`w-4 h-4 rounded-sm ${
                                Math.random() > 0.5
                                  ? "bg-white"
                                  : "bg-slate-900"
                              }`}
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Manual Entry */}
                <div className="mb-8">
                  <p className="text-sm text-slate-500 text-center mb-4">
                    Can't scan? Enter this code manually:
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <div className="relative">
                      <input
                        type={showSecret ? "text" : "password"}
                        value={secretKey}
                        readOnly
                        className="pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700
                                 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono
                                 text-center tracking-widest"
                      />
                      <button
                        onClick={() => setShowSecret(!showSecret)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showSecret ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <button
                      onClick={() => copyToClipboard(secretKey)}
                      className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400
                               hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setCurrentStep("intro")}
                    className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 
                             text-slate-700 dark:text-slate-300 font-medium
                             hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep("verify")}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-medium
                             hover:bg-emerald-700 transition-colors"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Verify Step */}
            {currentStep === "verify" && (
              <motion.div
                key="verify"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8"
              >
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center">
                  Enter Verification Code
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-center mb-8">
                  Enter the 6-digit code from your authenticator app
                </p>

                {/* Code Input */}
                <div className="flex justify-center gap-3 mb-6">
                  {verificationCode.map((digit, index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) =>
                        handleCodeInput(
                          index,
                          e.target.value.replace(/\D/g, "")
                        )
                      }
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 
                               bg-white dark:bg-slate-900 text-slate-900 dark:text-white
                               focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors
                               ${
                                 verificationError
                                   ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                   : "border-slate-200 dark:border-slate-700"
                               }`}
                    />
                  ))}
                </div>

                {verificationError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 text-red-500 mb-6"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">
                      Invalid code. Please try again.
                    </span>
                  </motion.div>
                )}

                <p className="text-xs text-slate-500 text-center mb-8">
                  <HelpCircle className="h-3 w-3 inline mr-1" />
                  For testing, use code: 123456
                </p>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setCurrentStep("scan")}
                    className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 
                             text-slate-700 dark:text-slate-300 font-medium
                             hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleVerify}
                    disabled={isVerifying || verificationCode.some((d) => !d)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-medium
                             hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Backup Codes Step */}
            {currentStep === "backup" && (
              <motion.div
                key="backup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8"
              >
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center">
                  Save Your Backup Codes
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-center mb-6">
                  Save these codes in a safe place. You can use them to access
                  your account if you lose your phone.
                </p>

                {/* Backup Codes Grid */}
                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 mb-6">
                  <div className="grid grid-cols-2 gap-3">
                    {mockBackupCodes.map((code, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-slate-800 
                                 border border-slate-200 dark:border-slate-700"
                      >
                        <span className="text-xs text-slate-400 w-4">
                          {index + 1}.
                        </span>
                        <code className="font-mono text-sm text-slate-900 dark:text-white">
                          {code}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-center mb-8">
                  <button
                    onClick={copyBackupCodes}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border 
                             transition-colors ${
                               codesCopied
                                 ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600"
                                 : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                             }`}
                  >
                    {codesCopied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Codes
                      </>
                    )}
                  </button>
                  <button
                    onClick={downloadBackupCodes}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border 
                             transition-colors ${
                               codesDownloaded
                                 ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600"
                                 : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                             }`}
                  >
                    {codesDownloaded ? (
                      <>
                        <Check className="h-4 w-4" />
                        Downloaded!
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Download
                      </>
                    )}
                  </button>
                </div>

                {/* Warning */}
                <div
                  className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 
                              border border-amber-200 dark:border-amber-800 mb-6"
                >
                  <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800 dark:text-amber-200">
                    <p className="font-medium mb-1">Important!</p>
                    <p>
                      Each backup code can only be used once. Keep them secure
                      and don't share them with anyone.
                    </p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => setCurrentStep("complete")}
                    disabled={!codesCopied && !codesDownloaded}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 text-white font-medium
                             hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    I've Saved My Codes
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Complete Step */}
            {currentStep === "complete" && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex p-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-6"
                >
                  <ShieldCheck className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />
                </motion.div>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Two-Factor Authentication Enabled!
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                  Your account is now protected with an extra layer of security.
                  You'll need to enter a code from your authenticator app each
                  time you sign in.
                </p>

                <div className="space-y-3 max-w-sm mx-auto mb-8">
                  {[
                    "Keep your backup codes safe",
                    "Never share your codes with anyone",
                    "Use a password manager for backup codes",
                  ].map((tip, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 text-left"
                    >
                      <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {tip}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onNavigate("/security")}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 text-white font-medium
                           hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/25"
                >
                  Go to Security Settings
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TwoFactorSetupPage;
