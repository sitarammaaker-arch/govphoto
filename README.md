# Sign Resizer — Government Job Form Photo & Signature Tool

A production-ready Next.js web application for resizing photo and signature images for Indian government job exam forms (SSC, UPSC, Railway, Banking, CET, Police, etc.).

## 🚀 Features

- **Drag & Drop Upload** — JPG/PNG, up to 5MB
- **Exam Presets** — SSC Photo, SSC Signature, Passport, UPSC, Railway, Banking
- **Smart Compression** — Binary search algorithm to hit exact KB target
- **White Background** — Auto-flatten transparency and add white BG
- **Signature Trim** — Auto-remove whitespace around signatures
- **DPI Setting** — Set to 300 DPI for print quality
- **Acceptability Checker** — ✔ Size ✔ Format ✔ Dimensions ✔ White BG
- **Before/After Preview** — Side-by-side comparison
- **Instant Download** — JPG output, filename with preset name
- **Zero Storage** — Images processed in memory only, never saved
- **SEO Optimized** — FAQ schema, meta tags, sitemap

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── resize/
│   │       └── route.ts          # Image processing API endpoint
│   ├── disclaimer/
│   │   └── page.tsx
│   ├── privacy-policy/
│   │   └── page.tsx
│   ├── terms/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx                # Root layout with fonts & SEO metadata
│   ├── page.tsx                  # Main homepage
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── ExamPresets.tsx           # Exam requirements reference grid
│   ├── FAQSection.tsx            # Accordion FAQ with SEO schema
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── HeroSection.tsx
│   ├── HowItWorks.tsx
│   └── ResizerTool.tsx           # Core upload, preset, resize, download UI
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## 🚀 Deployment (Vercel)

1. Push to GitHub
2. Connect to [Vercel](https://vercel.com)
3. Deploy — Vercel auto-detects Next.js

```bash
# Or deploy directly via CLI
npx vercel deploy --prod
```

**Important:** Sharp works on Vercel without any special configuration when using the `nodejs` runtime.

### Environment Variables (Optional)
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX      # Google Analytics
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXX   # Google AdSense publisher ID
```

## 📈 SEO Recommendations

1. **Domain**: Use `govphoto.in` or similar `.in` domain for India targeting
2. **Google Search Console**: Submit sitemap at `/sitemap.xml`
3. **Target Keywords**:
   - "ssc photo size kb" — High volume
   - "how to reduce photo size to 20kb" — High intent  
   - "upsc photo size pixels" — Specific
   - "signature resize for government form" — Conversion
4. **Content**: Add a blog section with posts like "SSC CGL 2025 Photo Requirements"
5. **Backlinks**: Submit to government job portals and forums (Sarkari Result, etc.)
6. **Local SEO**: Add `en_IN` locale, target Hindi keywords

## 💰 AdSense Placement Guide

The code includes 3 AdSense placement comments:

1. **Top Banner** (`page.tsx` line ~14) — Below hero, before tool. 728×90 or responsive.
2. **After Tool** (`page.tsx` line ~24) — After results, high engagement spot. 336×280.
3. **Middle Page** (`page.tsx` line ~33) — Between How It Works and FAQ. 728×90.

To enable, uncomment the `<ins>` tags and replace `ca-pub-YOUR_ID` with your publisher ID.

## 🔧 Advanced Features (Future Roadmap)

### Face-Centered Crop
The `faceCenteredCrop` function in `api/resize/route.ts` is ready for integration:
- Option A: AWS Rekognition (`DetectFaces` API)
- Option B: `face-api.js` (in-browser detection)
- Option C: Google Cloud Vision API

### Planned Features
- [ ] Admit Card Checker — Upload admit card and check photo specs
- [ ] Exam Calendar — State & Central exam schedules
- [ ] Blog Section — SEO content about exam requirements
- [ ] Multi-image batch processing
- [ ] Hindi UI language option
- [ ] WhatsApp share button for mobile users

## 🔒 Security Notes

- All file processing happens in Node.js memory only
- Files are never written to disk or database
- 5MB upload limit enforced server-side
- File type validation on both client and server
- No session data stored

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Image Processing**: Sharp (libvips-based, very fast)
- **Fonts**: Sora + Noto Serif (Google Fonts)
- **Deployment**: Vercel (Node.js runtime)

## 📄 License

MIT License — Free to use and modify.
