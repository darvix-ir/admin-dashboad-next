"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/language-context";
import {
  Bell,
  Check,
  Trash2,
  ShoppingCart,
  AlertCircle,
  MessageSquare,
  UserPlus,
} from "lucide-react";

interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "message";
  titleKey: string;
  messageKey: string;
  timeKey: string;
  read: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

export default function NotificationsPage() {
  const { t, language } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "success",
      titleKey: "newOrder",
      messageKey: "newOrderDesc",
      timeKey: "twoMinutesAgo",
      read: false,
      icon: ShoppingCart,
    },
    {
      id: "2",
      type: "info",
      titleKey: "newUser",
      messageKey: "newUserDesc",
      timeKey: "fifteenMinutesAgo",
      read: false,
      icon: UserPlus,
    },
    {
      id: "3",
      type: "message",
      titleKey: "newMessage",
      messageKey: "newMessageDesc",
      timeKey: "oneHourAgo",
      read: false,
      icon: MessageSquare,
    },
    {
      id: "4",
      type: "warning",
      titleKey: "lowStock",
      messageKey: "lowStockDesc",
      timeKey: "threeHoursAgo",
      read: true,
      icon: AlertCircle,
    },
    {
      id: "5",
      type: "info",
      titleKey: "systemUpdate",
      messageKey: "systemUpdateDesc",
      timeKey: "fiveHoursAgo",
      read: true,
      icon: Bell,
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "message":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.notifications.title}</h1>
          <p className="text-muted-foreground">
            {unreadCount} {t.notifications.unreadCount}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="mr-2 h-4 w-4" />
            {t.notifications.markAllRead}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">
            {t.notifications.all} ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            {language === "fa" ? "خوانده نشده" : "Unread"} ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="read">
            {t.notifications.read} ({notifications.length - unreadCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">{t.notifications.noNotifications}</p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card
                key={notification.id}
                className={notification.read ? "opacity-60" : ""}
              >
                <CardContent className="flex items-start gap-4 p-4">
                  <div
                    className={`mt-1 rounded-full p-2 ${getTypeColor(notification.type)}`}
                  >
                    <notification.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            {t.notifications[notification.titleKey as keyof typeof t.notifications]}
                          </h3>
                          {!notification.read && (
                            <Badge variant="default" className="text-xs">
                              {t.notifications.new}
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {t.notifications[notification.messageKey as keyof typeof t.notifications]}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                        {t.notifications[notification.timeKey as keyof typeof t.notifications]}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          {notifications.filter((n) => !n.read).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Check className="mb-4 h-12 w-12 text-green-600" />
                <p className="text-muted-foreground">{t.notifications.allCaughtUp}</p>
              </CardContent>
            </Card>
          ) : (
            notifications
              .filter((n) => !n.read)
              .map((notification) => (
                <Card key={notification.id}>
                  <CardContent className="flex items-start gap-4 p-4">
                    <div
                      className={`mt-1 rounded-full p-2 ${getTypeColor(notification.type)}`}
                    >
                      <notification.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">
                              {t.notifications[notification.titleKey as keyof typeof t.notifications]}
                            </h3>
                            <Badge variant="default" className="text-xs">
                              {t.notifications.new}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {t.notifications[notification.messageKey as keyof typeof t.notifications]}
                          </p>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {t.notifications[notification.timeKey as keyof typeof t.notifications]}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>

        <TabsContent value="read" className="space-y-4">
          {notifications
            .filter((n) => n.read)
            .map((notification) => (
              <Card key={notification.id} className="opacity-60">
                <CardContent className="flex items-start gap-4 p-4">
                  <div
                    className={`mt-1 rounded-full p-2 ${getTypeColor(notification.type)}`}
                  >
                    <notification.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {t.notifications[notification.titleKey as keyof typeof t.notifications]}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {t.notifications[notification.messageKey as keyof typeof t.notifications]}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {t.notifications[notification.timeKey as keyof typeof t.notifications]}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
