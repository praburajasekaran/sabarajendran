/**
 * Root Error Boundary
 * Catches and displays errors that occur in the application
 * Provides recovery options for users
 */

"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to error reporting service (e.g., Sentry)
    console.error("Application error:", error);
  }, [error]);

  return (
    <Container className="py-12 md:py-24">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-red-100 p-6">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        <Heading level={1} className="mb-4">
          Something went wrong
        </Heading>

        <Text variant="lead" muted className="mb-8">
          We encountered an unexpected error. This has been logged and we&apos;ll look into it.
        </Text>

        {process.env.NODE_ENV === "development" && (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg text-left overflow-auto">
            <Text variant="small" className="font-mono text-red-600 break-all">
              {error.message}
            </Text>
            {error.digest && (
              <Text variant="xs" className="font-mono text-gray-500 mt-2">
                Error ID: {error.digest}
              </Text>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={reset}
            variant="primary"
            className="inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </Button>

          <Button
            onClick={() => (window.location.href = "/")}
            variant="secondary"
            className="inline-flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go to homepage
          </Button>
        </div>

        <Text variant="small" muted className="mt-8">
          If this problem persists, please contact support with Error ID:{" "}
          {error.digest || "N/A"}
        </Text>
      </div>
    </Container>
  );
}
