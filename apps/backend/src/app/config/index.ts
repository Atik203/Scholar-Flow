import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const parseBoolean = (value: string | undefined, defaultValue = false) => {
  if (value === undefined) {
    return defaultValue;
  }
  const normalized = value.trim().toLowerCase();
  if (["false", "0", "no"].includes(normalized)) {
    return false;
  }
  if (["true", "1", "yes"].includes(normalized)) {
    return true;
  }
  return defaultValue;
};

const parseNumber = (value: string | undefined, defaultValue: number) => {
  if (value === undefined) {
    return defaultValue;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : defaultValue;
};

const parseFallbackOrder = (value: string | undefined) =>
  (value || "openai,gemini,deepseek")
    .split(",")
    .map((provider) => provider.trim().toLowerCase())
    .filter(Boolean);

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    expires_in: process.env.EXPIRES_IN,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
    reset_pass_secret: process.env.RESET_PASS_TOKEN,
    reset_pass_token_expires_in: process.env.RESET_PASS_TOKEN_EXPIRES_IN,
  },
  reset_pass_link: process.env.RESET_PASS_LINK,
  verify_email_link:
    process.env.VERIFY_EMAIL_LINK ||
    process.env.RESET_PASS_LINK?.replace("/reset-password", "/verify-email") ||
    "http://localhost:3000/verify-email",
  emailSender: {
    email: process.env.EMAIL,
    app_pass: process.env.APP_PASS,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
  },
  // Add other configurations as needed
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
  },
  deepseek: {
    apiKey: process.env.DEEPSEAK_API_KEY,
  },
  ai: {
    featuresEnabled: parseBoolean(process.env.AI_FEATURES_ENABLED, true),
    requestTimeoutMs: parseNumber(process.env.AI_REQUEST_TIMEOUT_MS, 15000),
    providerFallbackOrder: parseFallbackOrder(
      process.env.AI_PROVIDER_FALLBACK_ORDER
    ),
  },
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseNumber(process.env.REDIS_PORT, 6379),
    password: process.env.REDIS_PASSWORD,
    db: parseNumber(process.env.REDIS_DB, 0),
    tls: parseBoolean(process.env.REDIS_TLS_ENABLED, false),
  },
  aws: {
    access_key_id: process.env.AWS_ACCESS_KEY_ID,
    secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
    bucket_name: process.env.AWS_BUCKET_NAME,
    region: process.env.AWS_REGION,
  },
  featureFlags: {
    uploads: parseBoolean(process.env.FEATURE_UPLOADS, true),
    aiEnabled: parseBoolean(process.env.AI_FEATURES_ENABLED, true),
  },
  stripe: {
    secret_key: process.env.STRIPE_SECRET_KEY,
    webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  // Document conversion / preview configuration
  docxToPdf: {
    engine: process.env.DOCX_TO_PDF_ENGINE || "soffice",
    gotenbergUrl: process.env.GOTENBERG_URL,
    // Optional timeout in ms for external requests
    requestTimeoutMs: process.env.GOTENBERG_TIMEOUT_MS
      ? Number(process.env.GOTENBERG_TIMEOUT_MS)
      : 10000,
  },
  ssl: {
    storeId: process.env.STORE_ID,
    storePass: process.env.STORE_PASS,
    successUrl: process.env.SUCCESS_URL,
    cancelUrl: process.env.CANCEL_URL,
    failUrl: process.env.FAIL_URL,
    sslPaymentApi: process.env.SSL_PAYMENT_API,
    sslValidationApi: process.env.SSL_VALIDATIOIN_API,
  },
};
