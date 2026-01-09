# How to Fix Authentication Redirect Loop

If you're experiencing a redirect loop or authentication issues, follow these steps:

## Option 1: Clear All Site Data (Recommended)

1. Open Chrome DevTools (F12 or Right-click → Inspect)
2. Go to the **Application** tab
3. In the left sidebar, click on **Storage**
4. Click **Clear site data** button (at the top)
5. Make sure all checkboxes are selected:
   - ✓ Cookies and other site data
   - ✓ Cached images and files
   - ✓ Service Workers
6. Click **Clear data**
7. Close DevTools and refresh the page

## Option 2: Clear Service Worker Manually

1. Open Chrome DevTools (F12)
2. Go to **Application** tab
3. Click **Service Workers** in the left sidebar
4. Click **Unregister** for your site
5. Go to **Cache Storage** in the left sidebar
6. Right-click each cache (wrenchmc-v1, wrenchmc-v2, wrenchmc-v3) and click **Delete**
7. Refresh the page

## Option 3: Clear via Chrome Settings

1. Click the lock icon in the address bar (or info icon)
2. Click **Site settings**
3. Click **Clear data** button
4. Check all boxes and click **Clear**

## Option 4: Use Incognito Mode

If the above doesn't work immediately, use Incognito mode (Ctrl+Shift+N / Cmd+Shift+N) until the service worker updates automatically.

## After Clearing

The new service worker (v3) will automatically register and will NOT cache authentication pages, preventing future issues.
