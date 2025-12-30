# Improved WrenchMC Prompt - Enhanced Visual Design

You are an expert full-stack developer and UI/UX designer building a **production-ready, visually stunning MVP** for a web app called "WrenchMC" – a community-driven technical specs database for Harley-Davidson motorcycles. The goal is to create a **beautiful, modern, engaging application** that allows users to create accounts, save their bike's year/model/details to a profile, search/query personalized torque specs, bolt sizes, and other technical data (filtered by their saved bike), and have a hands-free voice feature where they can verbally ask for a spec (e.g., "What's the torque for the transmission cover on my 2018 Softail?") and have the app speak the answer back aloud.

**CRITICAL: This app must be visually exceptional** – think modern SaaS design, polished mobile apps, and premium tool aesthetics. Prioritize visual appeal, smooth animations, and delightful user experience throughout.

The repo is at https://github.com/joetabora/WrenchMC – initialize or update it as a modern Next.js project.

## Tech Stack (all free to start, no paid services required initially):
- **Next.js 16+** with App Router (for SSR, server actions, and optimal Vercel performance)
- **TypeScript** (strict mode)
- **Tailwind CSS + shadcn/ui** (for beautiful, accessible, mobile-first UI components – use shadcn init with a modern theme)
- **Framer Motion** (for smooth animations and micro-interactions)
- **Supabase** (free tier) for:
  - Authentication (email/password + Google OAuth if easy)
  - PostgreSQL database
  - Row Level Security (RLS) enabled for user-specific data
- **Web Speech API** (browser-native SpeechRecognition and SpeechSynthesis) for hands-free voice query → search → text-to-speech response (client-side only, no external APIs)
- **Vercel** for deployment (connect the repo directly)

## Visual Design Requirements (CRITICAL):

### Color Scheme & Theming:
- **Primary colors**: Use a sophisticated palette inspired by Harley-Davidson (deep blacks, rich oranges/ambers, chrome accents)
- **Dark mode**: Must be beautiful and well-designed, not an afterthought
- **Gradients**: Use subtle gradients for backgrounds, buttons, and cards (e.g., dark-to-darker, orange-to-amber)
- **Accent colors**: Vibrant orange/amber (#F97316, #EA580C) for CTAs and highlights
- **Neutral palette**: Rich grays with good contrast (not flat #000/#FFF)

### Typography:
- Use a modern, readable font stack (Inter, system-ui, or similar)
- Clear hierarchy: large, bold headings; readable body text
- Proper line-height and letter-spacing for readability

### Component Design:
- **Cards**: Elevated with subtle shadows, rounded corners (lg/xl), hover effects with scale/glow
- **Buttons**: Rounded, with hover states, active states, loading states, smooth transitions
- **Inputs**: Clean borders, focus states with ring effects, proper spacing
- **Icons**: Use lucide-react extensively for visual interest and clarity
- **Badges/Tags**: For bike models, status indicators, etc.

### Animations & Interactions:
- **Page transitions**: Smooth fade-ins for content
- **Hover effects**: Subtle scale, shadow, or color transitions (200-300ms)
- **Loading states**: Skeleton loaders, spinners, progress indicators
- **Voice interface**: Animated microphone button with pulse effect when listening
- **Search results**: Staggered fade-in animations
- **Form submissions**: Success/error animations

### Layout & Spacing:
- **Generous whitespace**: Don't cram content together
- **Consistent padding**: 4/6/8/12 spacing units
- **Max-width containers**: For readability (max-w-6xl or similar)
- **Mobile-first**: Touch-friendly buttons (min 44x44px), proper spacing on mobile

### Visual Elements:
- **Hero section**: On homepage with gradient background, compelling copy, large CTA buttons
- **Empty states**: Beautiful illustrations or icons with helpful text
- **Error states**: Friendly, helpful error messages with icons
- **Loading states**: Elegant skeletons or spinners
- **Status indicators**: Visual feedback for all actions (success, error, loading)

## Core Features for the MVP:

### 1. Authentication & Profile:
- **Login/Signup pages**: Beautiful, centered forms with gradient backgrounds or subtle patterns
- **Protected routes**: Smooth redirects with loading states
- **Profile page**: 
  - Clean, card-based layout
  - Bike selector with visual bike icons or illustrations
  - Dropdowns/selections for common Harleys (styled beautifully)
  - Save/edit with smooth transitions

### 2. Database Schema (set up in Supabase):
- `users` table (auto from Supabase auth)
- `user_profiles`: user_id (fk), bike_year, bike_model, bike_variant, etc.
- `specs` table: id, component_name, bolt_size, torque_spec_low, torque_spec_high, sequence_notes, applicable_years (array/json), applicable_models (array/json), submitted_by (user_id), approved (boolean default false), source_notes (text)
- Add voting/flagging system if possible

### 3. Community-driven Data:
- **Submit page**: Beautiful form with proper validation, success animations
- **Moderation queue**: Clean admin interface with cards, approve/reject actions
- Visual indicators for pending/approved/rejected status

### 4. Search Page:
- **Hero search bar**: Large, prominent, with icon, gradient background
- **Filters**: Visual filter chips/badges for bike model, year, etc.
- **Results**: 
  - Beautiful card grid (responsive: 1 col mobile, 2-3 col desktop)
  - Each card: Elevated, with hover effects, clear typography
  - Icons for different spec types
  - Color-coded torque ranges or visual indicators
- **Empty state**: Friendly message with illustration/icon
- **Loading state**: Skeleton cards

### 5. Voice Feature (VISUALLY EXCEPTIONAL):
- **Large, prominent microphone button**:
  - Circular, 120-150px diameter on mobile
  - Gradient background (orange to amber)
  - Animated pulse effect when listening (scale + glow)
  - Icon changes based on state (mic → stop)
  - Smooth transitions between states
- **Visual feedback**:
  - Waveform animation or sound waves when listening
  - Text display of what was heard
  - Loading spinner while searching
  - Results appear with smooth animations
- **Mobile-optimized**: Large touch target, clear visual states
- **Error handling**: Beautiful error messages, retry button

### 6. Homepage:
- **Hero section**: 
  - Large, bold headline
  - Compelling subheadline
  - Gradient background or subtle pattern
  - Large CTA buttons (Search, Voice, Get Started)
  - Smooth scroll animations
- **Feature cards**: 3-4 cards showcasing key features with icons
- **How it works**: Simple 3-step visual guide
- **CTA section**: Final call-to-action

### 7. Progressive Web App (PWA):
- Manifest with proper icons (192px, 512px)
- Service worker for installability and basic offline caching
- Install prompt UI (custom banner)
- Offline indicator

### 8. Legal & Safety:
- Prominent but non-intrusive disclaimers
- Styled as info boxes or banners
- "Community-submitted info – always verify with official Harley-Davidson manual"

## Project Structure Best Practices:
- `app/` for routes (page.tsx for home, dashboard/, search/, voice/, profile/, auth/, admin/)
- `components/` for reusable UI:
  - `ui/` for shadcn components (Button, Card, Input, etc.)
  - `VoiceController.tsx` (beautiful, animated)
  - `SpecCard.tsx` (elevated, polished)
  - `BikeSelector.tsx` (visual, engaging)
  - `HeaderActions.tsx` (clean navigation)
- `lib/` for supabase clients (browser and server), utils
- `actions/` for server actions (e.g., save profile, submit spec)
- Use React Server Components where possible, Server Actions for mutations

## Implementation Details:

### Setup Instructions (include in README.md):
- How to create a free Supabase project, get env vars (SUPABASE_URL, SUPABASE_ANON_KEY), add to .env.local
- Enable auth providers
- Run local dev: `npm run dev`
- Deploy to Vercel: connect GitHub repo, add env vars there
- Seed some sample data for popular models

### Key Files to Generate:
1. **package.json**: Include framer-motion, all dependencies
2. **tailwind.config.ts**: Extended theme with custom colors, animations
3. **components.json**: shadcn config with modern theme
4. **tsconfig.json**: Strict TypeScript
5. **next.config.js**: Optimized for Vercel
6. **All page components**: Beautiful, polished, animated
7. **All UI components**: Elevated, with proper states and animations

### Code Quality:
- **Type-safe**: Full TypeScript coverage
- **Accessible**: ARIA labels, keyboard navigation, screen reader support
- **Performant**: Optimized images, lazy loading, code splitting
- **Responsive**: Mobile-first, works beautifully on all screen sizes
- **Modern patterns**: Latest Next.js patterns, no deprecated code

## Visual Inspiration:
Think: Linear, Vercel, Stripe dashboard, modern mobile apps. Clean, modern, professional, but with personality. Use gradients, shadows, animations, and thoughtful spacing to create a premium feel.

## Success Criteria:
- Users should say "wow, this looks amazing" when they first see it
- Every interaction should feel smooth and polished
- Mobile experience should be as good as desktop
- Voice feature should be visually engaging and fun to use
- Overall: Professional, modern, and delightful to use

**Start by creating the Next.js app with:**
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

Then add shadcn/ui, Supabase SDK (@supabase/supabase-js and @supabase/ssr), framer-motion, and build from there.

**Remember: Visual excellence is not optional – it's a core requirement. Make it stunning.**

Go!

