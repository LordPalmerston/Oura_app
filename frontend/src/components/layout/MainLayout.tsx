import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Dashboard } from "@/types";
import { ModeToggle } from "@/components/mode-toggle";
import { useState } from "react";

interface MainLayoutProps {
    children: React.ReactNode;
    rightPanel?: React.ReactNode;
    selectedDate?: Date;
    onDateChange?: (date: Date | undefined) => void;
    onSettingsClick?: () => void;
    headerActions?: React.ReactNode;

    // Dashboard Props
    dashboards: Dashboard[];
    activeDashboardId: string;
    onDashboardSelect: (id: string) => void;
    onDashboardAdd: () => void;
    onDashboardDelete: (id: string) => void;
    onDashboardRename: (id: string, newName: string) => void;
}

export function MainLayout({
    children,
    rightPanel,
    selectedDate = new Date(),
    onDateChange,
    onSettingsClick,
    headerActions,
    dashboards,
    activeDashboardId,
    onDashboardSelect,
    onDashboardAdd,
    onDashboardDelete,
    onDashboardRename,
}: MainLayoutProps) {
    const activeDashboardName = dashboards.find(d => d.id === activeDashboardId)?.name || "Dashboard";
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
            {/* Left Sidebar (Desktop & Mobile) */}
            <div className={cn(
                "fixed inset-0 z-40 sm:relative sm:z-auto sm:flex sm:inset-auto",
                sidebarOpen ? "flex" : "hidden sm:flex"
            )}>
                {/* Mobile overlay */}
                {sidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm sm:hidden" 
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
                <div className="relative z-50 h-full w-[250px]">
                    <AppSidebar
                        onSettingsClick={() => {
                            if (onSettingsClick) onSettingsClick();
                            setSidebarOpen(false);
                        }}
                        dashboards={dashboards}
                        activeDashboardId={activeDashboardId}
                        onDashboardSelect={(id) => {
                            onDashboardSelect(id);
                            setSidebarOpen(false);
                        }}
                        onDashboardAdd={onDashboardAdd}
                        onDashboardDelete={onDashboardDelete}
                        onDashboardRename={onDashboardRename}
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 relative">
                {/* Header */}
                <header className="h-16 border-b flex items-center justify-between px-4 sm:px-6 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
                    <div className="flex items-center gap-2 sm:gap-4 flex-1">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="sm:hidden -ml-2"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        <h1 className="text-lg sm:text-xl font-semibold truncate max-w-[120px] sm:max-w-none">{activeDashboardName}</h1>
                        <div className="h-6 w-px bg-border hidden sm:block" />

                        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0"
                                onClick={() => {
                                    if (onDateChange && selectedDate) {
                                        const prevDay = new Date(selectedDate);
                                        prevDay.setDate(prevDay.getDate() - 1);
                                        onDateChange(prevDay);
                                    }
                                }}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-auto sm:w-[240px] h-8 sm:h-9 justify-start text-left font-normal text-xs sm:text-sm whitespace-nowrap",
                                            !selectedDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                        {selectedDate ? format(selectedDate, "MMM d, yyyy") : <span>Pick</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={onDateChange}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>

                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0"
                                onClick={() => {
                                    if (onDateChange && selectedDate) {
                                        const nextDay = new Date(selectedDate);
                                        nextDay.setDate(nextDay.getDate() + 1);
                                        onDateChange(nextDay);
                                    }
                                }}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {headerActions}
                        <ModeToggle />
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="flex-1 flex overflow-hidden relative">
                    <main className="flex-1 overflow-auto p-4 sm:p-6 relative">
                        {children}
                    </main>

                    {/* Persistent Right Panel */}
                    {rightPanel && (
                        <div className="absolute inset-y-0 right-0 z-40 w-full sm:w-[400px] sm:relative sm:z-auto bg-card sm:border-l shadow-xl sm:shadow-none">
                            {rightPanel}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
