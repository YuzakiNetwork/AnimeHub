# AnimeHub - Portal Informasi Anime

Portal informasi anime terlengkap dengan berita terbaru, jadwal tayang, dan komunitas otaku Indonesia.

## 🚀 Fitur Utama

### 🏠 Halaman Utama
- **Anime Populer**: Menampilkan anime dengan rating tertinggi dari MyAnimeList
- **Anime Musim Ini**: Daftar anime yang sedang tayang di musim saat ini
- **Hero Section**: Design modern dengan gradient dan call-to-action
- **Responsive Design**: Optimal untuk desktop dan mobile

### 🔍 Pencarian & Jadwal
- **Pencarian Anime**: Cari anime berdasarkan judul dengan Jikan API
- **Jadwal Tayang**: Lihat jadwal anime per hari (Senin-Minggu)
- **Filter Hari**: Navigasi mudah dengan highlight hari ini
- **Real-time Search**: Hasil pencarian yang cepat dan akurat

### 📺 Detail Anime
- **Informasi Lengkap**: Sinopsis, rating, studio, genre, dll.
- **Trailer Integration**: Embedded YouTube trailer
- **Sistem Komentar**: Pengguna dapat berkomentar di setiap anime
- **Responsive Layout**: Layout yang optimal di semua device

### 📰 Sistem Berita
- **Daftar Berita**: Halaman berita dengan pagination
- **Detail Berita**: Artikel lengkap dengan gambar dan sharing
- **Admin CRUD**: Create, Read, Update, Delete berita
- **Image Upload**: Upload gambar untuk artikel

### 👤 Admin Panel
- **Authentication**: Login system dengan session management
- **Dashboard**: Statistik dan overview sistem
- **News Management**: Kelola berita dengan interface yang user-friendly
- **Secure Access**: Proteksi dengan middleware authentication

## 🛠️ Teknologi

### Frontend
- **Next.js 14**: React framework dengan App Router
- **TypeScript**: Type safety dan better development experience
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach

### Backend
- **Next.js API Routes**: Serverless functions
- **SQLite**: Local database untuk news dan comments
- **Jikan API**: MyAnimeList data integration
- **Session Management**: Cookie-based authentication

### Deployment
- **Vercel Ready**: Optimized untuk deployment di Vercel
- **Static Generation**: SSG untuk performa optimal
- **API Routes**: Serverless backend functions

## 📦 Instalasi

### Prerequisites
- Node.js 18+ 
- npm atau yarn

### Setup Lokal

1. **Clone Repository**
```bash
git clone https://github.com/YuzakiNetwork/AnimeHub.git
cd AnimeHub
```

2. **Install Dependencies**
```bash
npm install
```

3. **Setup Database**
Database SQLite akan dibuat otomatis saat pertama kali menjalankan aplikasi.

4. **Jalankan Development Server**
```bash
npm run dev
```

5. **Buka Browser**
```
http://localhost:3000
```

## 🔧 Konfigurasi

### Environment Variables
Buat file `.env.local` di root directory:

```env
# Database
DATABASE_URL="./data/animehub.db"

# Session Secret
SESSION_SECRET="your-secret-key-here"

# API Configuration
JIKAN_API_URL="https://api.jikan.moe/v4"
```

### Default Admin
- **Username**: `admin`
- **Password**: `password`

## 📁 Struktur Proyek

```
animehub-next/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── anime/         # Anime endpoints
│   │   │   ├── news/          # News endpoints
│   │   │   ├── admin/         # Admin endpoints
│   │   │   └── comments/      # Comments endpoints
│   │   ├── anime/[id]/        # Dynamic anime detail pages
│   │   ├── news/              # News pages
│   │   ├── admin/             # Admin pages
│   │   ├── search/            # Search page
│   │   ├── schedule/          # Schedule page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   └── components/            # Reusable components
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       ├── AnimeCard.tsx
│       └── LoadingSpinner.tsx
├── lib/                       # Utility libraries
│   ├── database.ts           # Database configuration
│   ├── animeAPI.ts           # Jikan API integration
│   └── auth.ts               # Authentication helpers
├── data/                     # Database files
├── public/                   # Static assets
│   └── uploads/              # Uploaded images
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Push ke GitHub**
```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

2. **Connect ke Vercel**
- Login ke [Vercel](https://vercel.com)
- Import repository dari GitHub
- Deploy otomatis akan berjalan

3. **Environment Variables**
Set environment variables di Vercel dashboard sesuai dengan `.env.local`

### Manual Deployment

1. **Build Production**
```bash
npm run build
```

2. **Start Production Server**
```bash
npm start
```

## 📊 API Endpoints

### Anime API
- `GET /api/anime/top` - Top anime
- `GET /api/anime/season` - Current season anime
- `GET /api/anime/search` - Search anime
- `GET /api/anime/schedule` - Anime schedule
- `GET /api/anime/[id]` - Anime details

### News API
- `GET /api/news` - Get all news
- `GET /api/news/[id]` - Get news by ID
- `POST /api/news` - Create news (Admin only)
- `PUT /api/news/[id]` - Update news (Admin only)
- `DELETE /api/news/[id]` - Delete news (Admin only)

### Admin API
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/me` - Get current admin

### Comments API
- `GET /api/comments` - Get comments by anime_id
- `POST /api/comments` - Create comment

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6)
- **Secondary**: Purple (#8B5CF6)
- **Background**: Dark Gray (#111827)
- **Surface**: Gray (#1F2937)
- **Text**: White (#FFFFFF)

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, various sizes
- **Body**: Regular, 16px base

### Components
- **Cards**: Rounded corners, shadow, hover effects
- **Buttons**: Gradient backgrounds, hover animations
- **Forms**: Dark theme, focus states
- **Navigation**: Sticky header, mobile responsive

## 🔒 Security

### Authentication
- Session-based authentication
- Password hashing dengan bcrypt
- Protected admin routes
- CSRF protection

### Data Validation
- Input sanitization
- SQL injection prevention
- XSS protection
- File upload validation

## 🧪 Testing

### Manual Testing
- ✅ Homepage loading
- ✅ Anime search functionality
- ✅ Schedule navigation
- ✅ News CRUD operations
- ✅ Admin authentication
- ✅ Comment system
- ✅ Responsive design

### Automated Testing (Future)
- Unit tests dengan Jest
- Integration tests
- E2E tests dengan Playwright

## 📈 Performance

### Optimizations
- **Next.js Image**: Optimized image loading
- **Static Generation**: Pre-rendered pages
- **Code Splitting**: Automatic bundle optimization
- **Caching**: API response caching
- **Lazy Loading**: Component lazy loading

### Metrics
- **Lighthouse Score**: 90+ (Target)
- **Core Web Vitals**: Optimized
- **Bundle Size**: Minimized

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👥 Team

- **Developer**: YuzakiNetwork
- **Email**: yuzakinetwork@gmail.com
- **GitHub**: [@YuzakiNetwork](https://github.com/YuzakiNetwork)

## 🙏 Acknowledgments

- [Jikan API](https://jikan.moe/) - MyAnimeList API
- [Next.js](https://nextjs.org/) - React Framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Vercel](https://vercel.com/) - Deployment Platform

## 📞 Support

Jika Anda mengalami masalah atau memiliki pertanyaan:

1. Check [Issues](https://github.com/YuzakiNetwork/AnimeHub/issues)
2. Create new issue jika belum ada
3. Contact: yuzakinetwork@gmail.com

---

**AnimeHub** - Portal Informasi Anime Terlengkap 🎌

Made with ❤️ by YuzakiNetwork

