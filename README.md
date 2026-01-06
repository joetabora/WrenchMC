# WrenchMC Goliath 🏍️

**The Ultimate AI-Powered Harley-Davidson Maintenance Database**

WrenchMC Goliath is a comprehensive, AI-powered platform that crushes the frustration of Harley owners and mechanics hunting for specs, tutorials, and fixes. It's the ultimate digital shop manual that knows every bolt, torque value, fluid spec, and repair trick for all Harley models from 1903 to now.

## 🚀 Features

### Core Capabilities
- **AI-Powered Queries**: Ask natural language questions like "Torque specs for transmission cover on 2005 Road King" and get instant, accurate answers
- **Massive Database**: Thousands of technical specifications, torque values, and repair procedures
- **Video Tutorials**: Searchable YouTube gallery with top repair videos from expert channels
- **Community Forum**: Threaded discussions for sharing tips and knowledge
- **Model Profiles**: Dedicated pages for each Harley model with timelines and common issues
- **Voice Search**: Hands-free queries using Web Speech API with AI transcription
- **Offline Mode**: PWA with service worker for offline access
- **Part Finder**: Integration with parts databases for buying links

### Tech Stack
- **Framework**: Next.js 16+ with App Router
- **Database**: Vercel Postgres with Prisma ORM
- **Authentication**: NextAuth.js (Google OAuth + Email/Password)
- **AI**: xAI Grok API for natural language queries
- **RAG**: Vector embeddings with Pinecone/Hugging Face for accurate context retrieval
- **Video**: YouTube Data API for tutorial integration
- **UI**: Tailwind CSS + shadcn/ui components + Framer Motion animations
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ and npm
- Vercel account (for Postgres database)
- API keys:
  - xAI Grok API key
  - YouTube Data API key
  - (Optional) Pinecone API key for vector storage
  - (Optional) Hugging Face API key for embeddings
  - (Optional) OpenAI API key (fallback for embeddings)

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/WrenchMC.git
cd WrenchMC
npm install
```

### 2. Set Up Vercel Postgres

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create a new Postgres database
3. Copy the connection strings:
   - `POSTGRES_PRISMA_URL` (pooled connection)
   - `POSTGRES_URL_NON_POOLING` (direct connection)

### 3. Configure Environment Variables

Create a `.env.local` file:

```env
# Database
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here" # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# OAuth (Google)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI APIs
XAI_API_KEY="your-xai-grok-api-key"

# YouTube
YOUTUBE_API_KEY="your-youtube-api-key"

# Optional: Vector Storage
PINECONE_API_KEY="your-pinecone-api-key"
PINECONE_INDEX_NAME="wrenchmc"
PINECONE_ENVIRONMENT="us-east-1"

# Optional: Embeddings
HUGGINGFACE_API_KEY="your-huggingface-api-key"
OPENAI_API_KEY="your-openai-api-key" # Fallback
```

### 4. Set Up Database

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Open Prisma Studio to view data
npm run db:studio
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the app!

## 📊 Data Automation

### PDF Parsing Script

The app includes a script to automatically parse free Harley-Davidson service manuals:

```bash
npm run parse-pdfs
```

**How it works:**
1. Downloads PDFs from configured sources (CarlSalter.com, Lowbrow Customs, etc.)
2. Extracts text using `pdf-parse`
3. Uses regex patterns to identify torque specs, bolt sizes, and component names
4. Saves extracted specs to database (pending moderation)

**Adding Sources:**
Edit `scripts/parse-pdfs.ts` and add new sources to the `PDF_SOURCES` array.

### Manual Data Entry

Users can submit specs through:
- Web interface (`/specs/new`)
- AI import page (`/admin/import`) - upload PDFs or paste text

All submissions require moderation before appearing in search results.

## 🏗️ Project Structure

```
WrenchMC/
├── prisma/
│   └── schema.prisma          # Database schema
├── scripts/
│   └── parse-pdfs.ts           # PDF parsing automation
├── src/
│   ├── app/
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # NextAuth handlers
│   │   │   ├── query/          # AI query endpoint
│   │   │   ├── tutorials/     # YouTube integration
│   │   │   └── ...
│   │   ├── query/              # AI query page
│   │   ├── database/           # Database browser
│   │   ├── tutorials/          # Video tutorials
│   │   ├── forum/              # Community forum
│   │   └── models/             # Model profiles
│   ├── components/
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   ├── ui/                 # shadcn/ui components
│   │   └── ...
│   └── lib/
│       ├── prisma.ts           # Prisma client
│       ├── auth.ts             # NextAuth config
│       ├── grok.ts              # xAI Grok integration
│       ├── youtube.ts          # YouTube API
│       └── embeddings.ts       # Vector embeddings
└── README.md
```

## 🔑 API Endpoints

### Public Endpoints
- `POST /api/query` - AI-powered query with RAG
- `GET /api/tutorials?q=...` - Search YouTube tutorials
- `GET /api/search?q=...` - Search specs database

### Authenticated Endpoints
- `POST /api/specs` - Submit new spec
- `POST /api/specs/vote` - Vote on spec
- `GET /api/profile` - Get user profile
- `POST /api/profile` - Update user profile

## 🎨 Design System

### Color Palette
- **Background**: Deep black (`#000000`, `#0a0a0a`)
- **Accent**: Orange-red (`#ff4500`)
- **Chrome**: Metallic silver (`#e8e8e8`, `#c0c0c0`)
- **Text**: Light gray (`#e8e8e8`)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300-800

### Components
All UI components use Tailwind CSS with custom utilities:
- `.card` - Glass morphism card with hover effects
- `.gradient-text` - Orange-red gradient text
- `.chrome` - Metallic/chrome effect

## 🚢 Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy!

Vercel will automatically:
- Detect Next.js
- Run `npm run build`
- Set up Postgres connection
- Deploy to production

### Database Migrations

After deployment, run migrations:

```bash
npx prisma migrate deploy
```

## 🔒 Security

- All API routes require authentication (except public search)
- User-submitted content requires moderation
- RLS (Row Level Security) via Prisma
- API keys stored in environment variables
- NextAuth handles secure session management

## 📈 Roadmap

- [ ] Part finder integration (RevZilla API)
- [ ] Diagnostic troubleshooter (AI decision tree)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] PDF viewer for manuals
- [ ] 3D parts diagrams

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Harley-Davidson community for knowledge sharing
- xAI for Grok API
- YouTube creators for excellent repair videos
- All contributors and users

---

**Built with ❤️ for the Harley-Davidson community**

For questions or support, open an issue on GitHub.
