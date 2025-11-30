/**
 * Custom 404 Page
 * Professional not-found page with governmental design
 */

"use client";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <Container className="py-12 md:py-24">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-8">
          <div className="rounded-full bg-primary-50 p-8">
            <FileQuestion className="w-16 h-16 text-primary-600" />
          </div>
        </div>

        <div className="mb-6">
          <Text
            variant="small"
            className="text-primary-600 font-semibold tracking-wide uppercase mb-2"
          >
            404 Error
          </Text>
          <Heading level={1} className="mb-4">
            Page not found
          </Heading>
        </div>

        <Text variant="lead" muted className="mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </Text>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/">
            <Button
              variant="primary"
              className="inline-flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go to homepage
            </Button>
          </Link>

          <Button
            onClick={() => window.history.back()}
            variant="secondary"
            className="inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back
          </Button>
        </div>

        <div className="pt-8 border-t border-gray-200">
          <Text variant="small" muted className="mb-4">
            Looking for something specific?
          </Text>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/projects">
              <Button variant="ghost" size="sm">View Projects</Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" size="sm">About</Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" size="sm">Contact</Button>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
