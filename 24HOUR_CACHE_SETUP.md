# 24-Hour Cache Setup for GitHub Profile Stats

This guide implements both cache control and cache warming to ensure your GitHub profile stats are refreshed every 24 hours.

## ✅ Implementation Complete

### Option 1: Cache Control URLs
Your README URLs now include `cache_seconds=86400` (24 hours) to ensure consistent caching:

```markdown
<img align="left" width="60%" alt="CodenificienT GitHub Stats" src="https://github-readme-stat-codenificient.vercel.app/api?username=codenificient&show_icons=true&theme=tokyonight&count_private=true&include_all_commits=true&cache_seconds=86400" />

[![Top 4 Langs](https://github-readme-stat-codenificient.vercel.app/api/top-langs/?username=codenificient&langs_count=4&theme=tokyonight&cache_seconds=86400)](https://github.com/codenificient?tab=repositories)

<img align="left" width="60%" alt="CodenificienT WakaTime stats" src="https://github-readme-stat-codenificient.vercel.app/api/wakatime?username=codenificient&theme=tokyonight&langs_count=20&cache_seconds=86400" />

[![Top 15 Langs](https://github-readme-stat-codenificient.vercel.app/api/top-langs/?username=codenificient&langs_count=14&theme=tokyonight&cache_seconds=86400)](https://github.com/codenificient?tab=repositories)
```

### Option 2: Cache Warming Workflow
The `.github/workflows/cache-warming.yml` workflow will:
- Run daily at 6 AM UTC
- Pre-warm all your card caches
- Ensure fresh data is available immediately

## 🚀 Next Steps

### 1. Update Your GitHub Profile README
Copy the updated URLs above to your GitHub profile README file.

### 2. Enable the Workflow
1. Go to your repository's **Actions** tab
2. Find "Daily Cache Warming" workflow
3. Click **Enable workflow**

### 3. Test the Setup
You can manually trigger the workflow:
1. Go to **Actions** → **Daily Cache Warming**
2. Click **Run workflow**
3. Click **Run workflow** button

### 4. Monitor the Results
- Check the workflow logs to ensure it's running successfully
- Visit your profile to see the updated stats
- The workflow will show "✅" messages when each cache is warmed

## 📊 How It Works

### Cache Control (`cache_seconds=86400`)
- Forces Vercel to cache cards for exactly 24 hours
- Ensures consistent refresh timing across all cards
- Prevents random cache durations

### Cache Warming (Daily at 6 AM UTC)
- Makes requests to all your card URLs
- Forces fresh data fetch from GitHub/WakaTime APIs
- Pre-warms the cache so visitors see fresh data immediately

### Timeline
```
6:00 AM UTC: Cache warming runs → Fresh data fetched
6:00 AM - 6:00 AM+1: Cards show fresh data (cached)
6:00 AM+1: Next cache warming → Fresh data again
```

## 🔧 Customization Options

### Change Cache Duration
To update more frequently, change `cache_seconds`:
- 6 hours: `cache_seconds=21600`
- 12 hours: `cache_seconds=43200`
- 24 hours: `cache_seconds=86400` (current)

### Change Warming Schedule
Edit `.github/workflows/cache-warming.yml`:
```yaml
schedule:
  # Every 12 hours
  - cron: "0 */12 * * *"
  # Every 6 hours
  - cron: "0 */6 * * *"
  # Twice daily (6 AM and 6 PM UTC)
  - cron: "0 6,18 * * *"
```

### Add More Cards
To warm additional cards, add more curl commands:
```yaml
- name: Warm Additional Cards
  run: |
    curl -s "https://github-readme-stat-codenificient.vercel.app/api/pin?username=codenificient&repo=REPO_NAME&cache_seconds=86400" > /dev/null
```

## 📈 Benefits

✅ **Guaranteed Fresh Data**: Cards update every 24 hours  
✅ **Consistent Timing**: All cards refresh at the same time  
✅ **Better Performance**: Pre-warmed cache means faster loading  
✅ **No Manual Intervention**: Fully automated  
✅ **Easy Monitoring**: GitHub Actions logs show status  

## 🐛 Troubleshooting

### Workflow Not Running
- Check if workflow is enabled in Actions tab
- Verify cron syntax is correct
- Check repository permissions

### Cards Not Updating
- Verify URLs include `cache_seconds=86400`
- Check if Vercel deployment is working
- Test URLs manually in browser

### Cache Warming Failing
- Check curl commands in workflow logs
- Verify Vercel URLs are accessible
- Check network connectivity in workflow

## 📝 Verification Checklist

- [ ] Updated README with new URLs
- [ ] Workflow enabled in Actions tab
- [ ] Manual test run successful
- [ ] Cards showing fresh data
- [ ] Workflow running on schedule

Your GitHub profile stats will now be automatically refreshed every 24 hours! 🎉
