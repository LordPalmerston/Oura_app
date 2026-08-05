import localforage from 'localforage';
import JSZip from 'jszip';
import Papa from 'papaparse';

const store = localforage.createInstance({
  name: "CrackedOura",
  storeName: "oura_data"
});

const settingsStore = localforage.createInstance({
  name: "CrackedOura",
  storeName: "settings"
});

export const dataService = {
  async ingestZip(file: File): Promise<any> {
    const zip = new JSZip();
    const loadedZip = await zip.loadAsync(file);
    
    let processedFiles = 0;
    
    for (const [filename, zipEntry] of Object.entries(loadedZip.files)) {
      if (!zipEntry.dir && filename.endsWith('.csv')) {
        const content = await zipEntry.async("string");
        const parsed = Papa.parse(content, { header: true, dynamicTyping: true, skipEmptyLines: true });
        
        const normalizedData = parsed.data.map((row: any) => {
            const newRow: any = {};
            for (const [k, v] of Object.entries(row)) {
                let newKey = k.toLowerCase().replace(/ /g, '_');
                if (newKey === 'summary_date') newRow['date'] = v;
                newRow[newKey] = v;
            }
            return newRow;
        });

        const key = filename.replace('.csv', '');
        await store.setItem(key, normalizedData);
        processedFiles++;
      }
    }
    
    return { status: 'success', message: `Processed ${processedFiles} files.` };
  },

  async getDailyData(date: string): Promise<any> {
    const sleepData: any[] = (await store.getItem('sleep')) || [];
    const readinessData: any[] = (await store.getItem('readiness')) || [];
    const activityData: any[] = (await store.getItem('activity')) || [];

    const findByDate = (data: any[]) => data.find(row => 
        (row['date'] === date || row['summary_date'] === date || row['Summary date'] === date)
    );

    return {
      date,
      sleep: findByDate(sleepData) || null,
      readiness: findByDate(readinessData) || null,
      activity: findByDate(activityData) || null,
    };
  },

  async getQuery(path: string, startDate?: string, endDate?: string): Promise<any> {
    const parts = path.split('.');
    const table = parts[0];
    const column = parts.slice(1).join('.'); // e.g. 'score'
    
    const data: any[] = (await store.getItem(table)) || [];
    
    let filtered = data;
    if (startDate || endDate) {
        filtered = data.filter(row => {
            const rowDate = row['date'] || row['summary_date'] || row['Summary date'];
            if (!rowDate) return true;
            let valid = true;
            if (startDate && rowDate < startDate) valid = false;
            if (endDate && rowDate > endDate) valid = false;
            return valid;
        });
    }
    
    if (column) {
        return filtered.map(row => ({
            ...row,
            value: row[column],
            [path]: row[column] // Add the full path key for data-processing.ts
        }));
    }
    
    return filtered;
  },
  
  async getSettings(): Promise<any> {
      return (await settingsStore.getItem('app_settings')) || { daily_sync_time: '08:00' };
  },

  async saveSettings(settings: any): Promise<any> {
      await settingsStore.setItem('app_settings', settings);
      return settings;
  },

  async getLayout(): Promise<any> {
      return (await settingsStore.getItem('dashboard_layout')) || {};
  },

  async saveLayout(layout: any): Promise<any> {
      await settingsStore.setItem('dashboard_layout', layout);
      return layout;
  }
};
