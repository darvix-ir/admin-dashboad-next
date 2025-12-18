"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  Home,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { mockAuth } from "@/lib/auth";

export default function NotFoundPage() {
  const router = useRouter();
  const { t, dir } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(mockAuth.isAuthenticated());
  }, []);

  const handleAction = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-xl border border-border shadow-sm">
        <CardHeader className="flex flex-col items-center gap-2 text-center">
          <Badge variant="outline" className="mb-1 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            404
          </Badge>
          <CardTitle className="text-2xl md:text-3xl">
            {t.notFound.title}
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            {t.notFound.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="w-full rounded-lg bg-muted p-4 text-sm text-muted-foreground">
            <p>
              {dir === "rtl"
                ? "آدرس صفحه‌ای که وارد کرده‌اید در این پنل مدیریت پیدا نشد."
                : "The address you entered could not be found in this admin dashboard."}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Button onClick={handleAction} className="min-w-[200px] gap-2">
              {isAuthenticated ? (
                <>
                  {dir === "rtl" ? (
                    <>
                      {t.notFound.actionDashboard}
                      <Home className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <Home className="h-4 w-4" />
                      {t.notFound.actionDashboard}
                    </>
                  )}
                </>
              ) : (
                <>
                  {dir === "rtl" ? (
                    <>
                      {t.notFound.actionLogin}
                      <ArrowLeft className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <ArrowLeft className="h-4 w-4" />
                      {t.notFound.actionLogin}
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


