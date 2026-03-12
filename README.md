# Task Management Application

A modern, full-stack task management application built with Next.js 16, React 19, and TypeScript. Features include user authentication, task CRUD operations, and a responsive dashboard with real-time statistics.

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Production Deployment

This project is configured for automated deployment to AWS using GitHub Actions.

**📚 See [DEPLOYMENT_README.md](./DEPLOYMENT_README.md) for complete deployment guide**

## 📖 Documentation

| Document                                                       | Purpose                                 |
| -------------------------------------------------------------- | --------------------------------------- |
| **[DEPLOYMENT_README.md](./DEPLOYMENT_README.md)**             | 🎯 Start here - Overview and navigation |
| **[DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)**           | 📊 Quick reference - One-page summary   |
| **[DEVELOPER_DOCUMENTATION.md](./DEVELOPER_DOCUMENTATION.md)** | 👨‍💻 Complete development guide           |
| **[AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md)**       | ☁️ Full AWS deployment guide            |

## ✨ Features

- 🔐 **Authentication** - JWT-based user authentication
- ✅ **Task Management** - Create, read, update, delete tasks
- 📊 **Dashboard** - Real-time task statistics
- 📱 **Responsive Design** - Mobile-first approach
- 🎨 **Modern UI** - Tailwind CSS with glassmorphism effects
- ⚡ **Performance** - React Compiler optimization
- 🔒 **Security** - WAF protection, rate limiting, HTTPS

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **React**: 19.2.3
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 4.x
- **HTTP Client**: Axios 1.13.6
- **Icons**: Lucide React
- **Deployment**: AWS (S3 + CloudFront + WAF)
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
frontend/
├── .github/workflows/     # CI/CD pipeline
├── src/
│   ├── app/              # Next.js pages
│   ├── components/       # React components
│   ├── context/          # React Context
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Utilities & API
│   └── @types/           # TypeScript types
├── public/               # Static assets
└── docs/                 # Documentation
```

## 🚀 Deployment

### Automated Deployment (Recommended)

1. Push to `main` branch
2. GitHub Actions automatically:
   - Builds the application
   - Deploys to AWS S3
   - Invalidates CloudFront cache
3. Changes live in 5-10 minutes

### Manual Deployment

See [AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-api-url.com/api/v1
```

### Next.js Configuration

For static export deployment:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};
```

## 📊 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🔒 Security

- WAF (Web Application Firewall) protection
- Rate limiting on API endpoints
- HTTPS enforced
- Security headers configured
- DDoS protection via AWS Shield

## 💰 Cost Estimate

- **Small app** (< 10k visitors): $15-30/month
- **Medium app** (10k-100k visitors): $35-90/month
- **Large app** (> 100k visitors): $100-500+/month

## 🤝 Contributing

1. Read [DEVELOPER_DOCUMENTATION.md](./DEVELOPER_DOCUMENTATION.md)
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is private and proprietary.

## 📞 Support

- 📚 Documentation: See docs folder
- 🐛 Issues: Create a GitHub issue
- 💬 Questions: Contact the development team

---

**For detailed setup and deployment instructions, start with [DEPLOYMENT_README.md](./DEPLOYMENT_README.md)**
