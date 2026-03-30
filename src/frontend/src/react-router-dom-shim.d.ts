// Type override for the react-router-dom shim used in this Caffeine project.
// The shim re-exports from @tanstack/react-router at runtime, but we need
// react-router-dom v6-compatible TypeScript types throughout the codebase.

declare module "react-router-dom" {
  import type React from "react";

  export interface RouteProps {
    path?: string;
    element?: React.ReactNode;
    children?: React.ReactNode;
    index?: boolean;
  }

  export interface NavigateProps {
    to: string;
    replace?: boolean;
    state?: unknown;
  }

  export function BrowserRouter(props: {
    children?: React.ReactNode;
  }): React.ReactElement | null;
  export function Routes(props: {
    children?: React.ReactNode;
  }): React.ReactElement | null;
  export function Route(props: RouteProps): React.ReactElement | null;
  export function Navigate(props: NavigateProps): React.ReactElement | null;

  export interface Location {
    pathname: string;
    search: string;
    hash: string;
    state: unknown;
    key: string;
  }

  export interface Params<_Key extends string = string> {
    readonly [key: string]: string | undefined;
  }

  export type NavigateFunction = (
    to: string,
    options?: { replace?: boolean; state?: unknown },
  ) => void;

  export function useNavigate(): NavigateFunction;
  export function useLocation(): Location;
  export function useParams<
    Params extends Record<string, string | undefined> = Record<
      string,
      string | undefined
    >,
  >(): Params;
}
