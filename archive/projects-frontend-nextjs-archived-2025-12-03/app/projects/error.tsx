/**
 * Projects Page Error Boundary
 * Catches errors specific to the projects page
 */

"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ProjectsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProjectsError({ error, reset }: ProjectsErrorProps) {
  useEffect(() => {
    console.error("Projects page error:", error);
  }, [error]);

  return (
    <Container className="py-12">
      <div className="max-w-xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-red-100 p-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
        </div>

        <Heading level={2} className="mb-3">
          Failed to load projects
        </Heading>

        <Text className="text-gray-600 mb-6">
          We couldn&apos;t load the projects at this time. This might be due to a
          connection issue or a temporary problem with our servers.
        </Text>

        {process.env.NODE_ENV === "development" && (
          <div className="mb-6 p-3 bg-gray-50 rounded text-left overflow-auto">
            <Text variant="small" className="font-mono text-red-600 break-all">
              {error.message}
            </Text>
          </div>
        )}

        <Button
          onClick={reset}
          variant="primary"
          className="inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </Button>
      </div>
    </Container>
  );
}
