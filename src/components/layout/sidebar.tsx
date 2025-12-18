"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  ChevronLeft,
  UserCircle,
  TrendingUp,
  Bell,
  Boxes,
  ChevronDown,
  FileText,
  PieChart,
  TrendingDown,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { useState } from "react";

interface NavItem {
  name: string;
  href?: string;
  icon: LucideIcon;
  children?: NavItem[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const { t, dir } = useLanguage();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const sections: NavSection[] = [
    {
      title: dir === "rtl" ? "اصلی" : "Main",
      items: [
        {
          name: t.nav.dashboard,
          href: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          name: t.nav.analytics,
          href: "/analytics",
          icon: TrendingUp,
        },
        {
          name: t.nav.users,
          href: "/users",
          icon: Users,
        },
        {
          name: t.nav.orders,
          href: "/orders",
          icon: ShoppingCart,
        },
      ],
    },
    {
      title: dir === "rtl" ? "گزارش‌ها" : "Reports",
      items: [
        {
          name: t.nav.reports,
          icon: BarChart3,
          children: [
            {
              name: dir === "rtl" ? "گزارش فروش" : "Sales Report",
              href: "/reports/sales",
              icon: TrendingUp,
            },
            {
              name: dir === "rtl" ? "گزارش تحلیلی" : "Analytics Report",
              href: "/reports/analytics",
              icon: PieChart,
            },
            {
              name: dir === "rtl" ? "گزارش عملکرد" : "Performance Report",
              href: "/reports/performance",
              icon: TrendingDown,
            },
            {
              name: dir === "rtl" ? "گزارش‌های عمومی" : "General Reports",
              href: "/reports",
              icon: FileText,
            },
          ],
        },
      ],
    },
    {
      title: dir === "rtl" ? "رابط کاربری" : "Interface",
      items: [
        {
          name: t.nav.notifications,
          href: "/notifications",
          icon: Bell,
        },
        {
          name: dir === "rtl" ? "کامپوننت‌ها" : "Components",
          href: "/components-demo",
          icon: Boxes,
        },
      ],
    },
    {
      title: dir === "rtl" ? "حساب کاربری" : "Account",
      items: [
        {
          name: t.nav.profile,
          href: "/profile",
          icon: UserCircle,
        },
        {
          name: t.nav.settings,
          href: "/settings",
          icon: Settings,
        },
      ],
    },
  ];

  const renderNavItem = (item: NavItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openMenus.includes(item.name);
    const isActive = pathname === item.href;
    const isChildActive =
      hasChildren && item.children?.some((child) => pathname === child.href);

    if (hasChildren) {
      return (
        <div key={item.name}>
          <button
            onClick={() => {
              if (isCollapsed) {
                setIsCollapsed(false);
              }
              toggleMenu(item.name);
            }}
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              dir === "rtl" ? "space-x-reverse" : "",
              isChildActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
            title={isCollapsed ? item.name : undefined}
          >
            <div
              className={cn(
                "flex items-center gap-3",
                dir === "rtl" ? "flex-row-reverse" : ""
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </div>
            {!isCollapsed && (
              <ChevronDown
                className={cn(
                  "h-4 w-4 flex-shrink-0 transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            )}
          </button>
          {!isCollapsed && isOpen && (
            <div
              className={cn("mt-1 space-y-1", dir === "rtl" ? "mr-4" : "ml-4")}
            >
              {item.children?.map((child) => renderNavItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.name}
        href={item.href!}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          dir === "rtl" ? "" : "",
          depth > 0 && "py-1.5",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )}
        title={isCollapsed ? item.name : undefined}
      >
        <item.icon className="h-5 w-5 flex-shrink-0" />
        {!isCollapsed && <span>{item.name}</span>}
      </Link>
    );
  };

  return (
    <div
      className={cn(
        "relative flex h-full flex-col border-r bg-card transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-4">
        {!isCollapsed && (
          <Link
            href="/dashboard"
            className={cn("flex items-center gap-2 justify-end", dir === "rtl" ? "" : "")}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">
              {dir === "rtl" ? "پنل مدیریت" : "Admin"}
            </span>
          </Link>
        )}
        {isCollapsed && (
          <Link href="/dashboard" className="mx-auto">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
            </div>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-4 overflow-y-auto p-2">
        {sections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!isCollapsed && (
              <p
                className={cn(
                  "px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                  dir === "rtl" ? "text-right" : "text-left"
                )}
              >
                {section.title}
              </p>
            )}
            {section.items.map((item) => renderNavItem(item))}
          </div>
        ))}
      </nav>

      {/* Collapse button */}
      <div className="border-t p-2">
        <Button
          variant="ghost"
          size="icon"
          className="w-full"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronLeft
            className={cn(
              "h-5 w-5 transition-transform",
              isCollapsed && "rotate-180",
              dir === "rtl" && !isCollapsed && "rotate-180",
              dir === "rtl" && isCollapsed && "rotate-0"
            )}
          />
        </Button>
      </div>
    </div>
  );
}
