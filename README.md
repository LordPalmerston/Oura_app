<div align="center">
  <img src="frontend/public/icon.png" alt="Cracked Oura Logo" width="128">
  <h1>Cracked Oura</h1>
  <p><b>Free, local-first web and mobile application that gives you full access to your Oura ring data.</b></p>
  
  [![GitHub release](https://img.shields.io/github/v/release/LordPalmerston/Oura_app?label=Latest%20Release)](https://github.com/LordPalmerston/Oura_app/releases/latest)
  ![Status](https://img.shields.io/badge/Status-Alpha-red)
</div>

---

### Pay for the ring, not for the app that is not even that good
Oura ring paywalls the data behind a subscription, but luckily you can export your data from Oura and import it to Cracked Oura.

**Cracked Oura** is an open-source application that provides full access to your health metrics, stored locally on your device.

**Key Benefits**
- **No Subscription:** See all of your Oura ring data without subscription. 
- **Privacy First:** Your data is stored locally via IndexedDB. It never leaves your device.
- **Advanced Analytics:** Visualize trends, correlations, and deeper insights than the standard app provides. 
- **Cross-Platform:** Runs directly in your browser or natively on iOS/Android via Capacitor.

---

## Features

### Oura ring data without subscription
See all of your Oura ring data without a subscription. Thanks to the EU's right to data portability, you can export your data from Oura and import it to Cracked Oura. 

**Manual ZIP Import:** Populate the local database with your data by simply importing the data export zip file from Oura (available at https://membership.ouraring.com/data-export). 

### Fully Customizable Dashboard
View your Sleep, Readiness, and Activity scores on a dashboard that is as good as the official Oura app. The dashboards can be customized to show exactly the data and trends that you want to see. 

---

## Getting Started

### Installation & Usage

Since the app is local-first, you can run it entirely in your browser or build it for your mobile device.

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/LordPalmerston/Oura_app.git
    cd Oura_app
    ```
2.  **Start the Web App**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
3.  **Import Data**: Once the app is running (usually at `http://localhost:5173`), go to the Settings panel and upload your Oura export ZIP file.

> [!NOTE]
> This project is not affiliated with, associated with, or endorsed by Oura Health Oy. Use at your own risk.

---

## For Developers

We welcome contributions.

### Tech Stack
-   **Frontend:** React, TypeScript, Tailwind CSS, Vite
-   **Mobile/Native wrapper:** Capacitor
-   **Database:** localforage (IndexedDB)

### Build for Mobile
To create native mobile apps:
```bash
cd frontend
npm install
npm run build
npx cap sync
npx cap open android # Or ios
```
