"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { mockAuth } from "@/lib/auth";
import { useLanguage } from "@/contexts/language-context";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/error-boundary";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { dir } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mockAuth.isAuthenticated()) {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return <LoadingSpinner fullScreen size="lg" />;
  }

  return (
    <ErrorBoundary>
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex">
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </aside>

        {/* Mobile Sidebar */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <aside
              className={`absolute top-0 h-full transform transition-transform duration-300 ease-out ${
                dir === "rtl" ? "right-0" : "left-0"
              }`}
            >
              <Sidebar
                isCollapsed={false}
                setIsCollapsed={() => setIsMobileMenuOpen(false)}
              />
            </aside>
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Navbar onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
          <main className="flex-1 overflow-y-auto bg-muted/40 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
