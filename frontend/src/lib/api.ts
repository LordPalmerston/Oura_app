import { dataService } from './localDataService';
import { Browser } from '@capacitor/browser';

export interface AutomationStatusResponse {
    status: 'idle' | 'login_needed' | 'otp_needed' | 'logged_in' | 'exporting' | 'ready_to_download' | 'downloading' | 'completed' | 'error';
    message?: string;
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    thoughts?: any[];
}

export const api = {
    // --- Settings & Automation ---
    getSettings: async () => {
        return dataService.getSettings();
    },

    saveSettings: async (settings: { daily_sync_time: string; email?: string }) => {
        return dataService.saveSettings(settings);
    },

    clearSession: async () => {
        return { status: 'success' };
    },

    startLogin: async (_email: string) => {
        return { status: 'success' };
    },

    submitOtp: async (_otp: string) => {
        return { status: 'success' };
    },

    requestExport: async () => {
        // Open Oura Export page in Capacitor Browser
        await Browser.open({ url: 'https://membership.ouraring.com/data-export' });
        return { status: 'success', message: 'Opened Oura Export Page' };
    },

    checkStatus: async (): Promise<AutomationStatusResponse> => {
        return { status: 'completed' };
    },

    downloadExport: async () => {
        return { status: 'success' };
    },

    uploadZip: async (file: File) => {
        return dataService.ingestZip(file);
    },

    // --- Dashboard Data ---
    getDailyData: async (date: string) => {
        return dataService.getDailyData(date);
    },

    getQuery: async (path: string, startDate?: string, endDate?: string) => {
        return dataService.getQuery(path, startDate, endDate);
    },

    getSchema: async () => {
        return {
            sleep: [
                { name: "score" },
                { name: "total_sleep_duration" },
                { name: "restless_sleep" },
                { name: "rem_sleep_duration" },
                { name: "light_sleep_duration" },
                { name: "deep_sleep_duration" },
                { name: "lowest_resting_heart_rate" }
            ],
            readiness: [
                { name: "score" },
                { name: "previous_night_score" },
                { name: "sleep_balance_score" },
                { name: "previous_day_activity_score" },
                { name: "activity_balance_score" },
                { name: "temperature_score" },
                { name: "resting_heart_rate_score" },
                { name: "hrv_balance_score" },
                { name: "recovery_index_score" }
            ],
            activity: [
                { name: "score" },
                { name: "stay_active_score" },
                { name: "move_every_hour_score" },
                { name: "meet_daily_targets_score" },
                { name: "training_frequency_score" },
                { name: "training_volume_score" },
                { name: "recovery_time_score" },
                { name: "steps" },
                { name: "daily_movement" },
                { name: "inactive_time" },
                { name: "rest_time" }
            ]
        };
    },

    getTrends: async (metric: string, startDate: string, endDate: string) => {
        return api.getQuery(metric, startDate, endDate);
    },

    // --- Layout ---
    getLayout: async () => {
        return dataService.getLayout();
    },

    saveLayout: async (layout: any) => {
        return dataService.saveLayout(layout);
    },

    // --- Chat ---
    sendChatMessage: async (_message: string, _history: ChatMessage[], _context?: any) => {
        return {
            reply: "AI Chat is disabled in the mobile version.",
            thoughts: ["User asked for AI, but I am just a local mobile app now."]
        };
    }
};
