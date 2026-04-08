/**
 * Minimal react-router-dom API shim using browser native APIs + @tanstack/react-router.
 * Provides: useNavigate, useLocation, useParams — same signatures as react-router-dom.
 */
import {
  useLocation as useTanstackLocation,
  useNavigate as useTanstackNavigate,
} from "@tanstack/react-router";

// useNavigate — returns navigate(path: string) function matching react-router-dom API
export function useNavigate() {
  const navigate = useTanstackNavigate();
  return (to: string) => {
    navigate({ to });
  };
}

// useLocation — returns { pathname } matching react-router-dom API
export function useLocation() {
  const loc = useTanstackLocation();
  return { pathname: loc.pathname };
}

// useParams — reads path params from URL (simple positional parsing)
// Usage: const { assetType } = useParams<{ assetType: string }>();
export function useParams<T extends Record<string, string>>(): Partial<T> {
  // For the /portfolio/:assetType route, extract from pathname
  const pathname = window.location.pathname;
  const portfolioMatch = pathname.match(/^\/portfolio\/(.+)$/);
  if (portfolioMatch) {
    return { assetType: portfolioMatch[1] } as unknown as Partial<T>;
  }
  return {} as Partial<T>;
}
