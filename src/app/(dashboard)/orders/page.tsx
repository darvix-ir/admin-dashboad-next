"use client";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ShoppingCart } from "lucide-react";

export default function OrdersPage() {
  const { t } = useLanguage();
  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: api.getOrders,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: t.nav.orders }]} />

      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.orders.title}</h1>
        <p className="text-muted-foreground">{t.orders.subtitle}</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t.orders.allOrders}</CardTitle>
              <CardDescription>{t.orders.allOrdersDesc}</CardDescription>
            </div>
            <ShoppingCart className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.dashboard.orderId}</TableHead>
                <TableHead>{t.dashboard.customer}</TableHead>
                <TableHead>{t.dashboard.product}</TableHead>
                <TableHead>{t.dashboard.amount}</TableHead>
                <TableHead>{t.dashboard.status}</TableHead>
                <TableHead>{t.dashboard.date}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell>${order.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(order.status)}>
                      {t.orders[order.status as keyof typeof t.orders]}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
