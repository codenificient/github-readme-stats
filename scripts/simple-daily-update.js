#!/usr/bin/env node

/**
 * Simple Daily Stats Update Script
 * 
 * This script can be run by external cron services like:
 * - GitHub Actions (recommended)
 * - Vercel Cron Jobs
 * - Railway Cron
 * - Your own server
 * 
 * Usage:
 * node scripts/simple-daily-update.js
 */

import fs from 'fs'
import https from 'https'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  githubUsername: process.env.GITHUB_USERNAME || 'codenificient',
  wakatimeUsername: process.env.WAKATIME_USERNAME || 'codenificient',
  outputDir: path.join(__dirname, '../generated-cards'),
  // Card URLs - you can customize these
  githubCardUrl: `https://github-readme-stat-codenificient.vercel.app/api?username=${process.env.GITHUB_USERNAME || 'codenificient'}&theme=dark&show_icons=true&hide_border=true`,
  wakatimeCardUrl: `https://github-readme-stat-codenificient.vercel.app/api/wakatime?username=${process.env.WAKATIME_USERNAME || 'codenificient'}&theme=dark&hide_border=true`,
};

/**
 * Download a file from URL and save it
 */
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${path.basename(filepath)}`);
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(filepath, () => {}); // Delete the file on error
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Generate HTML dashboard
 */
function generateDashboard() {
  const dashboardHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Daily Stats Dashboard</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            color: white;
            margin-bottom: 30px;
        }
        .header h1 {
            font-size: 2.5rem;
            margin: 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
            gap: 30px;
            margin-bottom: 30px;
        }
        .card-wrapper {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        .card-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 15px;
            text-align: center;
        }
        .card-content {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .footer {
            text-align: center;
            color: white;
            opacity: 0.8;
        }
        .last-updated {
            background: rgba(255,255,255,0.1);
            padding: 10px 20px;
            border-radius: 20px;
            display: inline-block;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Daily Coding Stats</h1>
            <p>Automatically updated GitHub and WakaTime statistics</p>
        </div>
        
        <div class="cards-grid">
            <div class="card-wrapper">
                <div class="card-title">🐙 GitHub Activity</div>
                <div class="card-content">
                    <img src="./github-stats.svg" alt="GitHub Stats" style="max-width: 100%; height: auto;">
                </div>
            </div>
            
            <div class="card-wrapper">
                <div class="card-title">⏰ Coding Time</div>
                <div class="card-content">
                    <img src="./wakatime-stats.svg" alt="WakaTime Stats" style="max-width: 100%; height: auto;">
                </div>
            </div>
        </div>
        
        <div class="footer">
            <div class="last-updated">
                Last updated: ${new Date().toLocaleString()}
            </div>
        </div>
    </div>
</body>
</html>`;

  const dashboardPath = path.join(CONFIG.outputDir, 'dashboard.html');
  fs.writeFileSync(dashboardPath, dashboardHtml);
  console.log(`✅ Generated dashboard: ${dashboardPath}`);
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting simple daily stats update...');
  console.log('=====================================');
  
  try {
    // Ensure output directory exists
    if (!fs.existsSync(CONFIG.outputDir)) {
      fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    }

    // Download GitHub stats card
    console.log('\n📊 Downloading GitHub stats...');
    const githubPath = path.join(CONFIG.outputDir, 'github-stats.svg');
    await downloadFile(CONFIG.githubCardUrl, githubPath);

    // Download WakaTime stats card
    console.log('\n⏰ Downloading WakaTime stats...');
    const wakatimePath = path.join(CONFIG.outputDir, 'wakatime-stats.svg');
    await downloadFile(CONFIG.wakatimeCardUrl, wakatimePath);

    // Generate dashboard
    console.log('\n📄 Generating dashboard...');
    generateDashboard();

    console.log('\n✅ All stats updated successfully!');
    console.log('=====================================');
    console.log(`📁 Files saved to: ${CONFIG.outputDir}`);
    console.log('🌐 View dashboard: ./generated-cards/dashboard.html');

  } catch (error) {
    console.error('❌ Error updating stats:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
