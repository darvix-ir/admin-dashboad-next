"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/ui/select";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Check,
  AlertCircle,
  Info,
  AlertTriangle,
  Code,
  Palette,
  ChevronDown,
} from "lucide-react";
import { CodeBlock } from "@/components/ui/code-block";
import { cn } from "@/lib/utils";

export default function ComponentsDemoPage() {
  const { t } = useLanguage();
  const [switchValue, setSwitchValue] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const ComponentSection = ({
    id,
    title,
    description,
    children,
    code,
  }: {
    id: string;
    title: string;
    description?: string;
    children: React.ReactNode;
    code?: string;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preview */}
        <div>
          <p className="mb-2 text-sm font-medium text-muted-foreground">
            {t.components.preview}
          </p>
          <div className="rounded-lg border bg-muted/50 p-6">{children}</div>
        </div>

        {/* Code */}
        {code && (
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSection(id)}
              className="mb-2 w-full justify-between"
            >
              <span className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                {t.components.showCode}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  openSections[id] && "rotate-180"
                )}
              />
            </Button>
            {openSections[id] && <CodeBlock code={code} language="tsx" />}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t.components.title}
        </h1>
        <p className="text-muted-foreground">
          {t.components.subtitle}
        </p>
      </div>

      {/* Buttons */}
      <ComponentSection
        id="buttons"
        title={t.components.buttons.title}
        description={t.components.buttons.description}
        code={`import { Button } from "@/components/ui/button";

<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>

<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>`}
      >
        <div className="flex flex-wrap gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">{t.components.buttons.variants}</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>

          <div className="w-full space-y-2">
            <p className="text-sm font-medium">{t.components.buttons.sizes}</p>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="w-full space-y-2">
            <p className="text-sm font-medium">{t.components.buttons.states}</p>
            <div className="flex flex-wrap gap-2">
              <Button>{t.components.buttons.normal}</Button>
              <Button disabled>{t.components.buttons.disabled}</Button>
            </div>
          </div>
        </div>
      </ComponentSection>

      {/* Badges */}
      <ComponentSection
        id="badges"
        title={t.components.badges.title}
        description={t.components.badges.description}
        code={`import { Badge } from "@/components/ui/badge";

<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>`}
      >
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge>
            <Check className="mr-1 h-3 w-3" />
            {t.components.badges.withIcon}
          </Badge>
        </div>
      </ComponentSection>

      {/* Inputs */}
      <ComponentSection
        id="inputs"
        title={t.components.inputs.title}
        description={t.components.inputs.description}
        code={`import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<Label htmlFor="email">Email</Label>
<Input id="email" type="email" placeholder="Email" />

<Input type="password" placeholder="Password" />
<Input disabled placeholder="Disabled" />`}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="demo-email">{t.components.inputs.email}</Label>
            <Input id="demo-email" type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="demo-password">{t.components.inputs.password}</Label>
            <Input id="demo-password" type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="demo-disabled">{t.components.inputs.disabled}</Label>
            <Input id="demo-disabled" disabled placeholder={t.components.inputs.disabledInput} />
          </div>
        </div>
      </ComponentSection>

      {/* Select */}
      <ComponentSection
        id="select"
        title={t.components.select.title}
        description={t.components.select.description}
        code={`import { Select } from "@/components/ui/select";

<Select>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
  <option value="3">Option 3</option>
</Select>`}
      >
        <div className="space-y-2">
          <Label>{t.components.select.selectOption}</Label>
          <Select>
            <option value="">{t.components.select.selectOption}</option>
            <option value="1">{t.components.select.option} 1</option>
            <option value="2">{t.components.select.option} 2</option>
            <option value="3">{t.components.select.option} 3</option>
          </Select>
        </div>
      </ComponentSection>

      {/* Switch */}
      <ComponentSection
        id="switch"
        title={t.components.switch.title}
        description={t.components.switch.description}
        code={`import { Switch } from "@/components/ui/switch";

const [checked, setChecked] = useState(false);

<Switch checked={checked} onCheckedChange={setChecked} />`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>{t.components.switch.enableNotif}</Label>
            <Switch checked={switchValue} onCheckedChange={setSwitchValue} />
          </div>
          <div className="flex items-center justify-between">
            <Label>{t.components.switch.disabledSwitch}</Label>
            <Switch disabled />
          </div>
        </div>
      </ComponentSection>

      {/* Alerts */}
      <ComponentSection
        id="alerts"
        title={t.components.alerts.title}
        description={t.components.alerts.description}
        code={`import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

<Alert variant="default">
  <Info className="h-4 w-4" />
  <AlertTitle>Info</AlertTitle>
  <AlertDescription>This is an info message.</AlertDescription>
</Alert>`}
      >
        <div className="space-y-4">
          <Alert variant="default">
            <Info className="h-4 w-4" />
            <AlertTitle>{t.components.alerts.info}</AlertTitle>
            <AlertDescription>{t.components.alerts.infoMsg}</AlertDescription>
          </Alert>

          <Alert variant="success">
            <Check className="h-4 w-4" />
            <AlertTitle>{t.components.alerts.success}</AlertTitle>
            <AlertDescription>
              {t.components.alerts.successMsg}
            </AlertDescription>
          </Alert>

          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t.components.alerts.warning}</AlertTitle>
            <AlertDescription>{t.components.alerts.warningMsg}</AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t.components.alerts.error}</AlertTitle>
            <AlertDescription>{t.components.alerts.errorMsg}</AlertDescription>
          </Alert>
        </div>
      </ComponentSection>

      {/* Progress */}
      <ComponentSection
        id="progress"
        title={t.components.progress.title}
        description={t.components.progress.description}
        code={`import { Progress } from "@/components/ui/progress";

<Progress value={25} />
<Progress value={50} />
<Progress value={75} />`}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>25%</span>
            </div>
            <Progress value={25} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>50%</span>
            </div>
            <Progress value={50} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>75%</span>
            </div>
            <Progress value={75} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>100%</span>
            </div>
            <Progress value={100} />
          </div>
        </div>
      </ComponentSection>

      {/* Avatar */}
      <ComponentSection
        id="avatar"
        title={t.components.avatar.title}
        description={t.components.avatar.description}
        code={`import { Avatar, AvatarFallback } from "@/components/ui/avatar";

<Avatar>
  <AvatarFallback>AB</AvatarFallback>
</Avatar>`}
      >
        <div className="flex flex-wrap gap-4">
          <div className="space-y-2 text-center">
            <Avatar className="mx-auto">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <p className="text-xs text-muted-foreground">{t.components.avatar.default}</p>
          </div>
          <div className="space-y-2 text-center">
            <Avatar className="mx-auto h-16 w-16">
              <AvatarFallback className="text-xl">AB</AvatarFallback>
            </Avatar>
            <p className="text-xs text-muted-foreground">{t.components.avatar.large}</p>
          </div>
          <div className="space-y-2 text-center">
            <Avatar className="mx-auto">
              <AvatarFallback className="bg-primary text-primary-foreground">
                UK
              </AvatarFallback>
            </Avatar>
            <p className="text-xs text-muted-foreground">{t.components.avatar.colored}</p>
          </div>
        </div>
      </ComponentSection>

      {/* Skeleton */}
      <ComponentSection
        id="skeleton"
        title={t.components.skeleton.title}
        description={t.components.skeleton.description}
        code={`import { Skeleton } from "@/components/ui/skeleton";

<Skeleton className="h-4 w-[250px]" />
<Skeleton className="h-12 w-12 rounded-full" />`}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div>
      </ComponentSection>

      {/* Cards */}
      <ComponentSection
        id="cards"
        title={t.components.cards.title}
        description={t.components.cards.description}
        code={`import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>`}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t.components.cards.simpleCard}</CardTitle>
              <CardDescription>{t.components.cards.withDescription}</CardDescription>
            </CardHeader>
            <CardContent>{t.components.cards.content}</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                {t.components.cards.withIcon}
              </CardTitle>
            </CardHeader>
            <CardContent>{t.components.cards.iconContent}</CardContent>
          </Card>
        </div>
      </ComponentSection>

      {/* Table */}
      <ComponentSection
        id="table"
        title={t.components.table.title}
        description={t.components.table.description}
        code={`import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>Active</TableCell>
    </TableRow>
  </TableBody>
</Table>`}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.components.table.name}</TableHead>
              <TableHead>{t.components.table.email}</TableHead>
              <TableHead>{t.components.table.status}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">John Doe</TableCell>
              <TableCell>john@example.com</TableCell>
              <TableCell>
                <Badge>{t.users.active}</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Jane Smith</TableCell>
              <TableCell>jane@example.com</TableCell>
              <TableCell>
                <Badge variant="secondary">{t.users.inactive}</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </ComponentSection>

      {/* Tabs */}
      <ComponentSection
        id="tabs"
        title={t.components.tabs.title}
        description={t.components.tabs.description}
        code={`import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>`}
      >
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">{t.components.tabs.account}</TabsTrigger>
            <TabsTrigger value="password">{t.components.tabs.password}</TabsTrigger>
            <TabsTrigger value="settings">{t.components.tabs.settings}</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="space-y-2">
            <h3 className="font-medium">{t.components.tabs.accountSettings}</h3>
            <p className="text-sm text-muted-foreground">
              {t.components.tabs.accountDesc}
            </p>
          </TabsContent>
          <TabsContent value="password" className="space-y-2">
            <h3 className="font-medium">{t.components.tabs.passwordTitle}</h3>
            <p className="text-sm text-muted-foreground">
              {t.components.tabs.passwordDesc}
            </p>
          </TabsContent>
          <TabsContent value="settings" className="space-y-2">
            <h3 className="font-medium">{t.components.tabs.settingsTitle}</h3>
            <p className="text-sm text-muted-foreground">
              {t.components.tabs.settingsDesc}
            </p>
          </TabsContent>
        </Tabs>
      </ComponentSection>

      {/* Dialog */}
      <ComponentSection
        id="dialog"
        title={t.components.dialog.title}
        description={t.components.dialog.description}
        code={`import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    <p>Content goes here</p>
  </DialogContent>
</Dialog>`}
      >
        <Button onClick={() => setDialogOpen(true)}>{t.components.dialog.openDialog}</Button>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogClose onClick={() => setDialogOpen(false)} />
            <DialogHeader>
              <DialogTitle>{t.components.dialog.exampleDialog}</DialogTitle>
              <DialogDescription>
                {t.components.dialog.dialogDesc}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm">
                {t.components.dialog.dialogContent}
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                {t.components.dialog.cancel}
              </Button>
              <Button onClick={() => setDialogOpen(false)}>{t.components.dialog.confirm}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ComponentSection>

      {/* Dropdown Menu */}
      <ComponentSection
        id="dropdown"
        title={t.components.dropdown.title}
        description={t.components.dropdown.description}
        code={`import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Item 1</DropdownMenuItem>
    <DropdownMenuItem>Item 2</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`}
      >
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline">{t.components.dropdown.openMenu}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{t.components.dropdown.myAccount}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t.components.dropdown.profile}</DropdownMenuItem>
            <DropdownMenuItem>{t.components.dropdown.settings}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t.components.dropdown.logout}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ComponentSection>

      {/* Combined Example */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            {t.components.combined.title}
          </CardTitle>
          <CardDescription>
            {t.components.combined.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-base">John Doe</CardTitle>
                <CardDescription>john.doe@example.com</CardDescription>
              </div>
              <Badge>Admin</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>{t.components.combined.emailNotif}</Label>
                <Switch />
              </div>
              <div className="space-y-2">
                <Label>{t.components.combined.completion}</Label>
                <Progress value={65} />
                <p className="text-xs text-muted-foreground">65% {t.components.combined.percentComplete}</p>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1">{t.components.combined.save}</Button>
                <Button variant="outline" className="flex-1">
                  {t.components.combined.cancel}
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Color Palette */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t.components.colorPalette.title}
          </CardTitle>
          <CardDescription>
            {t.components.colorPalette.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Primary", class: "bg-primary text-primary-foreground" },
              {
                name: "Secondary",
                class: "bg-secondary text-secondary-foreground",
              },
              { name: "Muted", class: "bg-muted text-muted-foreground" },
              { name: "Accent", class: "bg-accent text-accent-foreground" },
              {
                name: "Destructive",
                class: "bg-destructive text-destructive-foreground",
              },
              { name: "Card", class: "bg-card text-card-foreground border" },
            ].map((color) => (
              <div
                key={color.name}
                className={`rounded-lg p-4 ${color.class}`}
              >
                <p className="font-medium">{color.name}</p>
                <p className="text-sm opacity-80">{t.components.colorPalette.sampleText}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

