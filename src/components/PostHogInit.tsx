import {
  useEffect,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";

type PostHogBoundaryProps = {
  children: ReactNode;
};

export default function PostHogInit({ children }: PostHogBoundaryProps) {
  const [PostHogBoundary, setPostHogBoundary] =
    useState<ComponentType<PostHogBoundaryProps> | null>(null);

  useEffect(() => {
    void Promise.all([import("@posthog/react"), import("@/lib/posthog.client")]).then(
      ([{ PostHogErrorBoundary, PostHogProvider }, { default: posthog }]) => {
        setPostHogBoundary(() =>
          function PostHogBoundary({ children }: PostHogBoundaryProps) {
            return (
              <PostHogProvider client={posthog}>
                <PostHogErrorBoundary
                  fallback={<div role="alert">Something went wrong. Please refresh the page.</div>}
                >
                  {children}
                </PostHogErrorBoundary>
              </PostHogProvider>
            );
          },
        );
      },
    );
  }, []);

  return PostHogBoundary ? <PostHogBoundary>{children}</PostHogBoundary> : children;
}
