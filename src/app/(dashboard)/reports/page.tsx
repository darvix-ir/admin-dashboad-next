"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useLanguage } from "@/contexts/language-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { toast } from "@/lib/toast";
import { exportToPDF } from "@/lib/export";
import { BarChart3, TrendingUp, DollarSign, Users, FileText, Download } from "lucide-react";

export default function ReportsPage() {
  const { t } = useLanguage();
  const [isExporting, setIsExporting] = useState(false);
  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ["chart-data"],
    queryFn: api.getChartData,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: api.getDashboardStats,
  });

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportToPDF("reports-content", "reports");
      toast.success(t.common.exportToPDF);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t.common.somethingWentWrong
      );
    } finally {
      setIsExporting(false);
    }
  };

  if (chartLoading || statsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: t.nav.reports }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.reports.title}</h1>
          <p className="text-muted-foreground">{t.reports.subtitle}</p>
        </div>
        <Button
          variant="outline"
          onClick={handleExportPDF}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              {t.common.loading}
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              {t.common.exportToPDF}
            </>
          )}
        </Button>
      </div>

      <div id="reports-content">

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.reports.totalRevenue}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats?.revenue.value.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +{stats?.revenue.change}% {t.dashboard.fromLastMonth}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.reports.totalSales}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.sales.value.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +{stats?.sales.change}% {t.dashboard.fromLastMonth}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.reports.activeUsers}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.users.value.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +{stats?.users.change}% {t.dashboard.fromLastMonth}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.reports.growthRate}</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.3%</div>
            <p className="text-xs text-muted-foreground">
              {t.reports.comparedToPrevious}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <OverviewChart data={chartData || []} />

      {/* Additional Report Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t.reports.salesByCategory}</CardTitle>
            <CardDescription>{t.reports.salesByCategoryDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium">{t.reports.electronics}</p>
                  <div className="mt-1 h-2 w-full rounded-full bg-muted">
                    <div className="h-2 w-[60%] rounded-full bg-primary" />
                  </div>
                </div>
                <span className="ml-4 text-sm font-medium">60%</span>
              </div>
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium">{t.reports.clothing}</p>
                  <div className="mt-1 h-2 w-full rounded-full bg-muted">
                    <div className="h-2 w-[30%] rounded-full bg-primary" />
                  </div>
                </div>
                <span className="ml-4 text-sm font-medium">30%</span>
              </div>
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium">{t.reports.accessories}</p>
                  <div className="mt-1 h-2 w-full rounded-full bg-muted">
                    <div className="h-2 w-[10%] rounded-full bg-primary" />
                  </div>
                </div>
                <span className="ml-4 text-sm font-medium">10%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.reports.topProducts}</CardTitle>
            <CardDescription>{t.reports.topProductsDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Premium Subscription", sales: 234 },
                { name: "Enterprise Package", sales: 189 },
                { name: "Standard Plan", sales: 156 },
              ].map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.sales} {t.reports.sales}
                    </p>
                  </div>
                  <div className="text-sm font-medium">#{index + 1}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}
