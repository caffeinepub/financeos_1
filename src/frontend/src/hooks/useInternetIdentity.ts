/**
 * Re-exports useInternetIdentity from @caffeineai/core-infrastructure.
 * This shim exists so existing imports of './hooks/useInternetIdentity' keep working.
 */
export { useInternetIdentity } from "@caffeineai/core-infrastructure";
export type {
  InternetIdentityContext,
  Status,
} from "@caffeineai/core-infrastructure";
