# WrenchMC Mobile Edition - Testing Guide

## 🏍️ Overview
WrenchMC Mobile Edition is a mobile-first PWA designed for Harley-Davidson mechanics. This guide covers how to test the mobile experience across different devices.

## 📱 Mobile Testing Methods

### Chrome DevTools Device Mode
1. Open Chrome and navigate to your local dev server (`http://localhost:3000`)
2. Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows) to open DevTools
3. Click the **Toggle Device Toolbar** icon (📱) or press `Cmd+Shift+M`
4. Select a device from the dropdown:
   - **iPhone 14 Pro** (390 x 844) - iOS test baseline
   - **iPhone SE** (375 x 667) - Small screen test
   - **Pixel 7** (412 x 915) - Android test baseline
   - **iPad Air** (820 x 1180) - Tablet test
5. Refresh the page to load mobile-specific styles

### Real Device Testing
1. Connect your phone to the same WiFi as your dev machine
2. Find your local IP: `ifconfig | grep inet` (Mac) or `ipconfig` (Windows)
3. Run the dev server with host flag: `npm run dev -- --host`
4. On your phone, visit `http://YOUR_IP:3000`

### iOS Safari Testing
1. On your iPhone, open Safari and navigate to your dev URL
2. To inspect: Connect iPhone via USB, open Safari on Mac
3. Go to **Develop** menu → Your iPhone → Your page
4. Use Web Inspector to debug

### Android Chrome Testing
1. Enable USB debugging on your Android device
2. Connect via USB, open `chrome://inspect` in desktop Chrome
3. Click "inspect" under your device's browser tab

## 🧪 Key Test Scenarios

### Touch Interactions
- [ ] Tap targets are at least 44x44px
- [ ] Bottom nav items respond to taps with visual feedback
- [ ] Swipe carousel works smoothly (tutorials, YouTube videos)
- [ ] Pull-to-refresh gesture (where implemented)
- [ ] Long-press doesn't trigger unwanted browser actions

### Navigation
- [ ] Bottom nav shows on mobile, hides on desktop (lg breakpoint)
- [ ] Sidebar shows on desktop, hidden on mobile
- [ ] Active nav state updates correctly
- [ ] All routes load without errors

### Forms & Input
- [ ] Input fields don't trigger zoom on iOS (font-size: 16px)
- [ ] Keyboard doesn't obscure inputs
- [ ] Voice input button is easily tappable
- [ ] Search submission works on mobile

### PWA Features
- [ ] App can be installed via "Add to Home Screen"
- [ ] Standalone mode shows no browser chrome
- [ ] Offline page displays when network is unavailable
- [ ] Theme color matches status bar

### Visual Design
- [ ] Glassmorphism cards render correctly
- [ ] Orange accent colors are visible and consistent
- [ ] Text is readable (sufficient contrast)
- [ ] Animations are smooth (60fps)
- [ ] Safe areas respected (notch, home indicator)

## 📐 Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile (default) | < 768px | Bottom nav, single column, full-width cards |
| Tablet (md) | 768px - 1023px | Bottom nav, 2-column grids |
| Desktop (lg) | ≥ 1024px | Sidebar nav, multi-column grids |

## 🔧 Performance Testing

### Lighthouse Audit
1. Open DevTools → Lighthouse tab
2. Select "Mobile" and check PWA category
3. Run audit and target:
   - Performance: > 90
   - Accessibility: > 90
   - Best Practices: > 90
   - PWA: All checks pass

### Network Throttling
1. DevTools → Network tab → Throttle dropdown
2. Test with "Fast 3G" and "Slow 3G"
3. Verify loading states appear
4. Ensure skeleton loaders show for slow connections

## 🎨 Design Tokens Reference

### Colors
- Background: `#000000` (wrench-dark)
- Surface: `#0d0d0d` (wrench-surface)
- Accent: `#FF4500` (Harley Orange)
- Text Primary: `#ffffff`
- Text Secondary: `#a3a3a3`
- Text Muted: `#737373`

### Spacing
- Safe area bottom: `env(safe-area-inset-bottom)`
- Bottom nav height: `5rem` (80px)
- Default padding: `1rem` (mobile), `1.5rem` (desktop)

### Border Radius
- Cards: `1rem` (rounded-2xl)
- Buttons: `1rem` (rounded-2xl)
- Inputs: `1rem` (rounded-2xl)
- Pills/Chips: `9999px` (rounded-full)

## 🚀 Pre-deployment Checklist

- [ ] All pages render correctly on iPhone SE (smallest target)
- [ ] All pages render correctly on iPad
- [ ] No horizontal scroll on any page
- [ ] All images have appropriate dimensions
- [ ] Touch targets meet minimum size
- [ ] Lighthouse PWA audit passes
- [ ] Service worker caches essential assets
- [ ] Manifest.json is valid
- [ ] Meta tags set correctly for iOS/Android

## 📝 Known Issues

1. **iOS Safari 100vh issue**: Use `min-h-screen` or `min-h-[100dvh]` for full-height layouts
2. **iOS input zoom**: Ensure all inputs have `font-size: 16px` or larger
3. **Android keyboard**: Use `visual-viewport` API if content needs to adjust

## 🛠️ Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start

# Lint check
npm run lint
```

## 📚 Resources

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design 3](https://m3.material.io/)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
