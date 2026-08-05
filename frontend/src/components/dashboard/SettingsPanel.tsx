import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, ExternalLink, Upload, Copy } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { api } from '@/lib/api';

interface SettingsPanelProps {
    onClose: () => void;
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<'automation' | 'layout'>('automation');

    const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

    const handleRequestExport = async () => {
        setLoading(true);
        setError(null);
        addLog(`Opening Oura Export page in browser...`);
        try {
            const data = await api.requestExport();
            addLog(data.message || 'Browser opened');
        } catch (err: any) {
            setError(err.message);
            addLog(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setError(null);
        addLog(`Processing ${file.name}...`);

        try {
            const data = await api.uploadZip(file);
            addLog(data.message || "Upload and processing complete!");
            alert("Data successfully imported!");
            window.location.reload();
        } catch (err: any) {
            setError(err.message);
            addLog(`Error: ${err.message}`);
        } finally {
            setLoading(false);
            event.target.value = '';
        }
    };

    return (
        <div className="w-[400px] border-l bg-card flex flex-col h-full">
            <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold">Settings</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex border-b">
                <button
                    className={cn(
                        "flex-1 py-3 text-sm font-medium border-b-2 transition-colors",
                        activeTab === 'automation'
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => setActiveTab('automation')}
                >
                    Data Sync
                </button>
                <button
                    className={cn(
                        "flex-1 py-3 text-sm font-medium border-b-2 transition-colors",
                        activeTab === 'layout'
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => setActiveTab('layout')}
                >
                    Layout
                </button>
            </div>

            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                {activeTab === 'automation' && (
                    <>
                        <div className="space-y-4">
                            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">How to Sync</h3>
                            <p className="text-sm text-muted-foreground">
                                Since you are on mobile, Oura data sync is manual. Tap the button below to open the Oura website, log in, and request a data export. Once Oura emails you the file, download it and import it here.
                            </p>
                            <Button
                                variant="outline"
                                onClick={handleRequestExport}
                                disabled={loading}
                                className="w-full h-auto py-3 flex items-center gap-2"
                            >
                                <ExternalLink className="h-4 w-4" />
                                <span className="font-semibold">Open Oura Export Page</span>
                            </Button>
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Import Data</h3>
                            <div className="space-y-2">
                                <Label>Upload Oura ZIP File</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="file"
                                        accept=".zip"
                                        onChange={handleFileUpload}
                                        disabled={loading}
                                        className="cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label>Activity Log</Label>
                            <div className="bg-black/50 rounded-md p-3 h-32 overflow-y-auto font-mono text-xs text-muted-foreground space-y-1">
                                {logs.length === 0 && <span className="opacity-50">No activity yet...</span>}
                                {logs.map((log, i) => (
                                    <div key={i}>{log}</div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'layout' && (
                    <div className="space-y-4">
                        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Layout Actions</h3>
                        <div className="grid grid-cols-1 gap-3">
                            <Button variant="outline" onClick={() => {
                                api.getLayout()
                                    .then(data => {
                                        const layoutJson = JSON.stringify(data, null, 2);
                                        navigator.clipboard.writeText(layoutJson);
                                        addLog("Layout config copied to clipboard.");
                                    })
                                    .catch(err => {
                                        console.error("Failed to fetch layout", err);
                                    });
                            }}>
                                <Copy className="mr-2 h-4 w-4" />
                                Copy Layout to Clipboard
                            </Button>

                            <div className="space-y-2">
                                <Label>Import Layout</Label>
                                <textarea
                                    placeholder="Paste layout JSON here..."
                                    className="flex min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono text-[10px]"
                                    id="import-layout-area"
                                />
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={async () => {
                                        const el = document.getElementById('import-layout-area') as HTMLTextAreaElement;
                                        if (!el || !el.value) return;

                                        try {
                                            const rawJson = JSON.parse(el.value);
                                            let payload = rawJson;

                                            if (rawJson.dashboard && rawJson.dashboard.dashboards) {
                                                payload = rawJson.dashboard;
                                            }

                                            if (!payload.dashboards && !payload.widgets) {
                                                alert("Invalid JSON: Must contain 'dashboards' or 'widgets' property.");
                                                return;
                                            }

                                            await api.saveLayout(payload);
                                            alert("Layout imported successfully! The page will reload.");
                                            window.location.reload();
                                            el.value = "";
                                        } catch (e: any) {
                                            alert("Import Failed: " + e.message);
                                        }
                                    }}
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Import Layout
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
