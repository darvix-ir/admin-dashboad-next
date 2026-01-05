"use client";

import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Checkbox } from "@/components/ui/checkbox";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileUpload } from "@/components/ui/file-upload";
import { toast } from "@/lib/toast";
import { exportToCSV, exportToExcel } from "@/lib/export";
import {
  importUsersFromCSV,
  mergeUsers,
  type ImportResult,
} from "@/lib/import";
import {
  Search,
  ArrowUpDown,
  Trash2,
  Ban,
  CheckCircle2,
  Download,
  Upload,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import { User } from "@/types";

export default function UsersPage() {
  const { t, dir } = useLanguage();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof User>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const itemsPerPage = 5;

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: api.getUsers,
  });

  const filteredAndSortedUsers = useMemo(() => {
    if (!users) return [];

    const filtered = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

    return filtered;
  }, [users, searchTerm, sortField, sortDirection, roleFilter, statusFilter]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedUsers, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(paginatedUsers.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedUsers.length === 0) return;

    // Simulate API call
    setTimeout(() => {
      queryClient.setQueryData(["users"], (old: any) =>
        old?.filter((user: User) => !selectedUsers.includes(user.id))
      );
      toast.success(
        `${selectedUsers.length} ${t.users.title.toLowerCase()} ${t.common.delete.toLowerCase()}`
      );
      setSelectedUsers([]);
    }, 500);
  };

  const handleBulkStatusChange = (status: "active" | "inactive") => {
    if (selectedUsers.length === 0) return;

    // Simulate API call
    setTimeout(() => {
      queryClient.setQueryData(["users"], (old: any) =>
        old?.map((user: User) =>
          selectedUsers.includes(user.id) ? { ...user, status } : user
        )
      );
      const statusText =
        status === "active" ? t.users.active : t.users.inactive;
      toast.success(
        `${selectedUsers.length} ${t.users.title.toLowerCase()} ${statusText.toLowerCase()}`
      );
      setSelectedUsers([]);
    }, 500);
  };

  const handleExportCSV = () => {
    try {
      const dataToExport = filteredAndSortedUsers.map((user) => ({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
      }));
      exportToCSV(dataToExport, "users");
      toast.success(t.common.exportToCSV);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t.common.somethingWentWrong
      );
    }
  };

  const handleExportExcel = () => {
    try {
      const dataToExport = filteredAndSortedUsers.map((user) => ({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
      }));
      exportToExcel(dataToExport, "users", "Users");
      toast.success(t.common.exportToExcel);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t.common.somethingWentWrong
      );
    }
  };

  const handleFileSelect = async (file: File) => {
    setIsImporting(true);
    setImportResult(null);

    try {
      const result = await importUsersFromCSV(file);
      setImportResult(result);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t.common.importError
      );
      setIsImporting(false);
    } finally {
      setIsImporting(false);
    }
  };

  const handleConfirmImport = () => {
    if (!importResult || !importResult.success || importResult.data.length === 0) {
      return;
    }

    queryClient.setQueryData(["users"], (old: any) => {
      const existingUsers = old || [];
      return mergeUsers(importResult.data, existingUsers);
    });

    toast.success(
      `${importResult.validRows} ${t.common.usersImported}`
    );
    setImportDialogOpen(false);
    setImportResult(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: t.nav.users }]} />

      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.users.title}</h1>
        <p className="text-muted-foreground">{t.users.subtitle}</p>
      </div>

      {/* Bulk Actions Bar */}
      {selectedUsers.length > 0 && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {selectedUsers.length} {t.common.selected}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkStatusChange("active")}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {t.users.active}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkStatusChange("inactive")}
              >
                <Ban className="mr-2 h-4 w-4" />
                {t.users.inactive}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t.common.delete}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedUsers([])}
              >
                {t.common.cancel}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search & Filters Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">{t.common.filter}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t.users.searchUsers}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>

          {/* Role Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t.users.role}</Label>
            <div className="flex flex-wrap gap-2">
              {["all", "Admin", "Editor", "Viewer"].map((role) => (
                <Button
                  key={role}
                  variant={roleFilter === role ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setRoleFilter(role);
                    setCurrentPage(1);
                  }}
                  className="min-w-[80px]"
                >
                  {role === "all"
                    ? t.users.allRoles
                    : t.users[role.toLowerCase() as keyof typeof t.users]}
                </Button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t.users.status}</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setStatusFilter("all");
                  setCurrentPage(1);
                }}
                className="min-w-[80px]"
              >
                {t.users.allStatus}
              </Button>
              <Button
                variant={statusFilter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setStatusFilter("active");
                  setCurrentPage(1);
                }}
                className="min-w-[80px]"
              >
                <span className="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
                {t.users.active}
              </Button>
              <Button
                variant={statusFilter === "inactive" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setStatusFilter("inactive");
                  setCurrentPage(1);
                }}
                className="min-w-[80px]"
              >
                <span className="mr-2 h-2 w-2 rounded-full bg-gray-400"></span>
                {t.users.inactive}
              </Button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || roleFilter !== "all" || statusFilter !== "all") && (
            <div className="flex items-center gap-2 rounded-md bg-muted p-3">
              <span className="text-sm font-medium">{t.common.filter}:</span>
              {searchTerm && (
                <Badge variant="secondary" className="gap-1">
                  {t.common.search}: {searchTerm}
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {roleFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {t.users.role}: {roleFilter}
                  <button
                    onClick={() => setRoleFilter("all")}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {statusFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {t.users.status}: {statusFilter}
                  <button
                    onClick={() => setStatusFilter("all")}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t.users.allUsers}</CardTitle>
              <CardDescription>
                {filteredAndSortedUsers.length} {t.users.of} {users?.length || 0}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setImportDialogOpen(true)}
              >
                <Upload className="mr-2 h-4 w-4" />
                {t.common.importCSV}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    {t.common.export}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleExportCSV}>
                    <FileText className="mr-2 h-4 w-4" />
                    {t.common.exportToCSV}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportExcel}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    {t.common.exportToExcel}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      paginatedUsers.length > 0 &&
                      selectedUsers.length === paginatedUsers.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => handleSort("name")}
                  >
                    {t.users.name}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => handleSort("email")}
                  >
                    {t.users.email}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>{t.users.role}</TableHead>
                <TableHead>{t.users.status}</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => handleSort("createdAt")}
                  >
                    {t.users.created}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    {t.users.noUsers}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={(checked) =>
                          handleSelectUser(user.id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "active" ? "default" : "secondary"
                        }
                      >
                        {t.users[user.status as keyof typeof t.users]}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.createdAt}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredAndSortedUsers.length}
            itemsPerPage={itemsPerPage}
          />
        </CardContent>
      </Card>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t.common.importUsers}</DialogTitle>
            <DialogDescription>
              {t.common.dragAndDrop}. {t.common.onlyCSVFiles}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <FileUpload
              accept=".csv"
              onFileSelect={handleFileSelect}
              disabled={isImporting}
            />

            {isImporting && (
              <div className="flex items-center justify-center py-4">
                <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"></div>
                <span className="ml-2 text-sm text-muted-foreground">
                  {t.common.importingUsers}
                </span>
              </div>
            )}

            {importResult && (
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">{t.common.totalRows}</p>
                      <p className="text-lg font-semibold">{importResult.totalRows}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t.common.validRows}</p>
                      <p className="text-lg font-semibold text-green-600">
                        {importResult.validRows}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t.common.invalidRows}</p>
                      <p className="text-lg font-semibold text-red-600">
                        {importResult.invalidRows}
                      </p>
                    </div>
                  </div>
                </div>

                {importResult.errors.length > 0 && (
                  <div className="max-h-40 overflow-y-auto rounded-md border border-destructive/50 bg-destructive/10 p-3">
                    <p className="mb-2 text-sm font-semibold text-destructive">
                      {t.common.error}:
                    </p>
                    <ul className="list-inside list-disc space-y-1 text-xs text-destructive">
                      {importResult.errors.slice(0, 10).map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                      {importResult.errors.length > 10 && (
                        <li>... and {importResult.errors.length - 10} more errors</li>
                      )}
                    </ul>
                  </div>
                )}

                {importResult.data.length > 0 && (
                  <div className="max-h-60 overflow-y-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t.users.name}</TableHead>
                          <TableHead>{t.users.email}</TableHead>
                          <TableHead>{t.users.role}</TableHead>
                          <TableHead>{t.users.status}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {importResult.data.slice(0, 5).map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{user.role}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  user.status === "active" ? "default" : "secondary"
                                }
                              >
                                {t.users[user.status as keyof typeof t.users]}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {importResult.data.length > 5 && (
                      <p className="p-2 text-center text-xs text-muted-foreground">
                        Showing first 5 of {importResult.data.length} users
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setImportDialogOpen(false);
                setImportResult(null);
              }}
            >
              {t.common.cancel}
            </Button>
            <Button
              onClick={handleConfirmImport}
              disabled={!importResult?.success || importResult.data.length === 0}
            >
              {t.common.confirmImport}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
