/**
 * Re-exports useActor from @caffeineai/core-infrastructure, pre-bound to
 * the backend's createActor function so callers don't need to pass it.
 *
 * The actor is cast to BackendActor so all method calls are type-checked
 * against the full canister interface defined in types/actor.ts.
 */
import { useActor as useActorBase } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";
import type { BackendActor } from "../types/actor";

// eslint-disable-next-line react-refresh/only-export-components
export function useActor() {
  const { actor, isFetching } = useActorBase(createActor);
  return {
    actor: actor as BackendActor | null,
    isFetching,
  };
}
