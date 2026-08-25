import * as Joi from "joi";

/**
 * Environment variable validation schema.
 * Validates all required and optional environment variables at startup.
 * Provides clear error messages for missing or invalid values.
 */
export const envSchema = Joi.object({
  // Server configuration
  PORT: Joi.number()
    .port()
    .default(4000)
    .description("Port number for the server"),

  API_BASE_URL: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .empty("")
    .optional()
    .description("Base API URL exposed to frontend via bootstrap endpoint"),

  APP_VERSION: Joi.string()
    .empty("")
    .optional()
    .description("Application release version string"),

  MOBILE_MIN_SUPPORTED_VERSION: Joi.string()
    .empty("")
    .default("1.0.0")
    .description("Minimum mobile app version allowed to use the API"),

  MOBILE_RECOMMENDED_VERSION: Joi.string()
    .empty("")
    .default("1.0.0")
    .description("Mobile app version that should trigger a soft upgrade prompt"),

  MOBILE_LATEST_VERSION: Joi.string()
    .empty("")
    .default("1.0.0")
    .description("Latest mobile app version available in stores"),

  MOBILE_IOS_STORE_URL: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .empty("")
    .default("https://apps.apple.com/app/quickex")
    .description("iOS App Store URL for mobile upgrades"),

  MOBILE_ANDROID_STORE_URL: Joi.string()
    .empty("")
    .default("market://details?id=com.pulsefy.quickex")
    .description("Android Play Store URL for mobile upgrades"),

  MOBILE_RELEASE_NOTES: Joi.string()
    .empty("")
    .default("")
    .description("Pipe-separated mobile release notes for upgrade prompts"),

  ROUTER_CONTRACT_ID: Joi.string()
    .empty("")
    .optional()
    .description("Router Soroban contract address"),

  ALLOWED_TOKENS: Joi.string()
    .empty("")
    .optional()
    .description("Comma-separated list of pre-allowed token addresses"),

  STELLAR_NETWORK_PASSPHRASE: Joi.string()
    .empty("")
    .optional()
    .description("Explicit Stellar network passphrase override"),

  // Network configuration (required)
  NETWORK: Joi.string()
    .valid("testnet", "mainnet")
    .required()
    .description("Stellar network to connect to (testnet or mainnet)"),

  STELLAR_NETWORK: Joi.string()
    .valid("testnet", "mainnet")
    .optional()
    .description(
      "Optional alias for NETWORK; must match NETWORK when both are set",
    ),

  // Supabase configuration (required for database operations)
  SUPABASE_URL: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .required()
    .description("Supabase project URL"),

  SUPABASE_ANON_KEY: Joi.string()
    .min(1)
    .required()
    .description("Supabase anonymous key"),

  SUPABASE_SERVICE_ROLE_KEY: Joi.string()
    .optional()
    .description("Supabase service role key for admin operations"),

  // Stellar Horizon configuration (required for blockchain operations)
  HORIZON_URL: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .optional()
    .description("Custom Horizon URL (mainet overrides network default)"),

  SOROBAN_RPC_URL: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .optional()
    .description("Custom Soroban RPC URL (mainet overrides network default)"),

  SOROBAN_RPC_URLS: Joi.string()
    .optional()
    .description("Comma-separated fallback Soroban RPC URLs for failover"),

  SOROBAN_RPC_TIMEOUT_MS: Joi.number()
    .integer()
    .min(1000)
    .default(10000)
    .description("Timeout in milliseconds for Soroban RPC requests"),

  SOROBAN_RPC_MAX_RETRIES: Joi.number()
    .integer()
    .min(1)
    .max(10)
    .default(3)
    .description("Max retry attempts for transient Soroban RPC failures"),

  STELLAR_EXPLORER_URL: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .optional()
    .description("Custom Stellar explorer URL (mainet overrides network default)"),

  // Stellar signing keys (required for payment operations)
  STELLAR_SECRET_KEY: Joi.string()
    .optional()
    .description(
      "Stellar account secret key for signing transactions (starts with S)",
    ),

  STELLAR_PUBLIC_KEY: Joi.string()
    .optional()
    .description("Stellar account public key (starts with G)"),

  // Node environment
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development")
    .description("Node environment"),

  // CORS configuration
  PUBLIC_API_URL: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .empty("")
    .optional()
    .description("Public API base URL exposed by the runtime config endpoint for client bootstrapping"),

  CORS_ALLOWED_ORIGINS: Joi.string()
    .empty("")
    .optional()
    .description(
      "Comma-separated list of allowed CORS origins (e.g. https://quickex.to,https://app.quickex.to). " +
        "Required in production when no wildcard is desired.",
    ),

  // New rate limit allowlist configuration
  RATE_LIMIT_ALLOWLIST_CIDRS: Joi.string().optional().description("Comma-separated CIDRs to whitelist from rate limits (CI, trusted contributors)"),
  RATE_LIMIT_ALLOWLIST_API_KEYS: Joi.string().optional().description("Comma-separated API keys to whitelist from rate limits"),
  RATE_LIMIT_ALLOWLIST_USER_IDS: Joi.string().optional().description("Comma-separated user IDs to whitelist from rate limits"),

  CORS_VERCEL_PRE JECT: Joi.string()
    .empty("")
    .optional()
    .description(
      "Vercel project slug (e.g. quickex-frontend). " +
        "When set, all preview URLs matching https://<slug>-*.vercel.app are allowed.",
    ),

  // Username reservation limit (optional). Max usernames per wallet; omit for no limit.
  MAX_USERNAMES_PER_WALLET: Joi.number()
    .integer()
    .min(0)
    .optional()
    .description("Max usernames per wallet (optional; omit for no limit)"),

  // Cache configuration for transactions
  CACHE_MAX_ITEMS: Joi.number()
    .integer()
    .min(1)
    .default(500)
    .description("Maximum number of items to cache for transactions"),

  CACHE_TTL_MS: Joi.number()
    .integer()
    .min(1000)
    .default(60000)
    .description("Cache TTL in milliseconds for transaction responses"),

  FEATURE_FLAGS_CACJE_TTL_MS: Joi.number()
    .integer()
    .min(1000)
    .default(15000)
    .description("Cache TTL in milliseconds for feature flag snapshots"),

  // Branch preview fallback configuration
  FALLBACK_API_URL: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .default("https://api.quickex.io")
    .description("Fallback API URL for unknown branches"),
  FALLBACK_FRONTEND_URL: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .default("https://app.quickex.io")
    .description("Fallback frontend URL for unknown branches"),

  // GitHub branch/PR deployment metadata sync (BE-60)
  GITHUB_WEBHOOK_SECRET: Joi.string()
    .empty("")
    .optional()
    .description(
      "Secret used to verify GitHub webhook signatures (X-Hub-Signature-256). When unset, the deployment webhook endpoint returns 503.",
    ),

  FEATURE_FLAGS_BOOSTSTRAP_JSON: Joi.string()
    .empty("")
    .optional()
    .description(
      "Optional JSON array of bootstrap feature flags used when the store is unavailable",
    ),

  // Contract method allowlist (BE-67)
  CONTRACT_METHOD_ALLOWLIST_MODE: Joi.string()
    .valid("enforce", "off")
    .default("enforce")
    .description(
      "When 'enforce', unlisted contract/method pairs are rejected on transaction build/submit endpoints",
    ),

  CONTRACT_METHOD_ALLOWLIST_JSON: Joi.string()
    .empty("")
    .optional()
    .description(
      'Optional JSON object mapping contractId -> allowed method names, or "*" to allow all methods for that contract. Example: {"CABC...":["swap","deposit"],"CDEF...":"*"}',
    ),

  // Stellar ingestion (optional; omit to disable)
  QUICKEX_CONTRACT_ID: Joi.string()
    .empty("")
    .optional()
    .description(
      "Soroban contract ID to stream events from (enables Stellar ingestion service)",
    ),

  // ------------------------------------------------------------------------------------
  // Notification providers (all optional; omit to disable that channel)
  // ------------------------------------------------------------------------------------

  // SendGrid email channel
  SENDGRID_API_KEY: Joi.string()
    .empty("")
    .optional()
    .description("SendGrid API key — enables email notification channel"),

  SENDGRID_FROM_EMAIL: Joi.string()
    .empty("")
    .optional()
    .description("From address for SendGrid emails (e.g. noreply@quickex.to)"),

  // Expo push channel
  EXPT_ACCESS_TOKEN: Joi.string()
    .empty("")
    .optional()
    .description(
      "Expo server access token — enhances push notification delivery priority",
    ),

  // Reconciliation worker configuration
  RECONCILIATION_BATCH_SIZE: Joi.number()
    .integer()
    .min(1)
    .max(500)
    .default(50)
    .description(
      "Max records per entity type processed per reconciliation run",
    ),

  // Rate limiting — optional bycrypt-hashed API keys (comma-separated)
  // Generate a hash: node -e "require('bcrypt').hash('MY_KEY', 10).then(console.log)"
  API_KEYS: Joi.string()
    .empty("")
    .optional()
    .description(
      "Comma-separated list of bcrypt-hashed API keys for trusted clients. " +
        "Valid keys receive higher rate limits (120 req/min vs 20 req/min).",
    ),

  // Global HTTP rate-limiting profiles (all optional; defaults applied)
  RATE_LIMIT_PUBLIC_BURST_LIMIT: Joi.number()
    .integer()
    .min(1)
    .default(10)
    .description("Public traffic burst request limit"),
  RATE_LIMIT_PUBLIC_BURST_TTL_MS: Joi.number()
    .integer()
    .min(1000)
    .default(10000)
    .description("Public traffic burst window in milliseconds"),
  RATE_LIMIT_PUBLIC_SUSTAINED_LIMIT: Joi.number()
    .integer()
    .min(1)
    .default(20)
    .description("Public traffic sustained request limit"),
  RATE_LIMIT_PUBLIC_SUSTAINED_TTL_MS: Joi.number()
    .integer()
    .min(1000)
    .default(60000)
    .description("Public traffic sustained window in milliseconds"),

  RATE_LIMIT_AUTHENTICATED_BURST_LIMIT: Joi.number()
    .integer()
    .min(1)
    .default(40)
    .description("Authenticated traffic burst request limit"),
  RATE_LIMIT_AUTHENTICATED_BURST_TTL_MS: Joi.number()
    .integer()
    .min(1000)
    .default(10000)
    .description("Authenticated traffic burst window in milliseconds"),
  RATE_LIMIT_AUTHENTICATED_SUSTAINED_LIMIT: Joi.number()
    .integer()
    .min(1)
    .default(120)
    .description("Authenticated traffic sustained request limit"),
  RATE_LIMIT_AUTHENTICATED_SUSTAINED_TTL_MS: Joi.number()
    .integer()
    .min(1000)
    .default(60000)
    .description("Authenticated traffic sustained window in milliseconds"),

  RATE_LIMIT_WEBHOOKS_BURST_LIMIT: Joi.number()
    .integer()
    .min(1)
    .default(20)
    .description("Webhook traffic burst request limit"),
  RATE_LIMIT_WEBHOOKS_BURST_TTL_MS: Joi.number()
    .integer()
    .min(1000)
    .default(10000)
    .description("Webhook traffic burst window in milliseconds"),
  RATE_LIMIT_WEBHOOKS_SUSTAINED_LIMIT: Joi.number()
    .integer()
    .min(1)
    .default(60)
    .description("Webhook traffic sustained request limit"),
  RATE_LIMIT_WEBHOOKS_SUSTAINED_TTL_MS: Joi.number()
    .integer()
    .min(1000)
    .default(60000)
    .description("Webhook traffic sustained window in milliseconds"),

  RATE_LIMIT_KEY_ORDER: Joi.string()
    .default("user_id,api_key,ip")
    .description(
      "Preferred key order for rate-limit identity. Allowed values: user_id,api_key,ip",
    ),

  // ------------------------------------------------------------------------------------
  // Sentry Error Monitoring (optional; omit to disable)
  // ------------------------------------------------------------------------------------

  SENTRY_DSN: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .empty("")
    .optional()
    .description("Sentry CSN for error reporting — omit to disable Sentry"),

  SENTRY_ENVIRONMENT: Joi.string()
    .empty("")
    .optional()
    .description("Sentry environment tag — defaults to NODE_ENV"),

  // ------------------------------------------------------------------------------------
  // Dead Letter Queue Metrics & Alerts (BE-125)
  // ------------------------------------------------------------------------------------

  QUEUE_METRICS_ENABLED: Joi.boolean()
    .default(true)
    .description(
      "Enable exposing queue depth, dead letter depth, retry counts, and job age metrics per job type",
    ),

  DEAD_LETTER_DEPTH_THRESHOLD: Joi.number()
    .integer()
    .min(0)
    .default(100)
    .description(
      "Alert threshold for dead letter queue depth per job type. An alert fires when depth exceeds this value.",
    ),

  DEAD_LETTER_AGE_THRESHOLD_MS: Joi.number()
    .integer()
    .min(0)
    .default(3600000)
    .description(
      "Alert threshold in milliseconds for the oldest job in the dead letter queue. An alert fires when the oldest job age exceeds this value.",
    ),
});
