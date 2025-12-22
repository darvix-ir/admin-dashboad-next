"use client";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
  showText?: boolean;
}

export function LoadingSpinner({
  className,
  size = "md",
  text,
  fullScreen = false,
  showText = true,
}: LoadingSpinnerProps) {
  const { t } = useLanguage();
  const displayText = text || t.common.loading;
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  const containerClasses = fullScreen
    ? "flex min-h-screen items-center justify-center"
    : "flex items-center justify-center";

  return (
    <div className={cn(containerClasses, className)}>
      <div className="flex flex-col items-center gap-4">
        {/* Main Spinner */}
        <div className="relative">
          {/* Outer ring */}
          <div
            className={cn(
              "animate-spin rounded-full border-4 border-t-transparent",
              sizeClasses[size],
              "border-primary/20"
            )}
            style={{
              animationDuration: "1s",
            }}
          />
          {/* Inner ring */}
          <div
            className={cn(
              "absolute inset-0 animate-spin rounded-full border-4 border-t-transparent",
              sizeClasses[size],
              "border-primary",
              "opacity-60"
            )}
            style={{
              animationDuration: "0.8s",
              animationDirection: "reverse",
            }}
          />
          {/* Center dot */}
          <div
            className={cn(
              "absolute inset-0 m-auto h-2 w-2 animate-pulse rounded-full bg-primary",
              size === "sm" && "h-1 w-1",
              size === "lg" && "h-3 w-3"
            )}
          />
        </div>

        {/* Loading text */}
        {showText && displayText && (
          <div className="flex items-center gap-2">
            <span className="animate-pulse text-sm font-medium text-muted-foreground">
              {displayText}
            </span>
            <div className="flex gap-1">
              <span
                className="h-1 w-1 animate-bounce rounded-full bg-primary"
                style={{ animationDelay: "0s" }}
              />
              <span
                className="h-1 w-1 animate-bounce rounded-full bg-primary"
                style={{ animationDelay: "0.2s" }}
              />
              <span
                className="h-1 w-1 animate-bounce rounded-full bg-primary"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
