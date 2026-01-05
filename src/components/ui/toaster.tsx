"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();
  const { dir } = useLanguage();
  const fontFamily =
    dir === "rtl"
      ? "var(--font-vazirmatn), sans-serif"
      : "var(--font-inter), sans-serif";

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className={cn(
        "toaster group",
        dir === "rtl" ? "font-vazirmatn" : "font-inter"
      )}
      toastOptions={{
        style: {
          fontFamily,
        },
        classNames: {
          toast: cn(
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
            dir === "rtl" ? "font-vazirmatn" : "font-inter"
          ),
          description: cn(
            "group-[.toast]:text-muted-foreground",
            dir === "rtl" ? "font-vazirmatn" : "font-inter"
          ),
          actionButton: cn(
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
            dir === "rtl" ? "font-vazirmatn" : "font-inter"
          ),
          cancelButton: cn(
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
            dir === "rtl" ? "font-vazirmatn" : "font-inter"
          ),
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

