import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import type { Viewport } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://wordlehint.help'),
  title: 'WordleHint.help - Wordle Hints Today | Wordle of the Day | Free Wordle Help',
  description: 'Get daily Wordle hints today! WordleHint.help provides free Wordle of the day hints, Wordle hints today, and progressive Wordle help to solve NYT Wordle puzzles. Improve your Wordle solving skills with our intelligent hint system.',
  keywords: [
    'Wordle',
    'Wordle hints',
    'Wordle hints today',
    'Wordle of the day',
    'Wordle help',
    'Wordle solver',
    'NYT Wordle',
    'Wordle game',
    'Wordle tips',
    'Wordle strategies',
    'Wordle answers',
    'Wordle clues',
    'Wordle hints daily',
    'Wordle hint system',
    'Wordle puzzle help',
    'Wordle vocabulary',
    'Wordle learning',
    'Wordle practice',
    'Wordle challenge',
    'Wordle community'
  ].join(', '),
  authors: [{ name: 'WordleHint.help Team' }],
  creator: 'WordleHint.help',
  publisher: 'WordleHint.help',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  openGraph: {
    title: 'WordleHint.help - Wordle Hints Today | Wordle of the Day',
    description: 'Get daily Wordle hints today! Free Wordle of the day hints and progressive Wordle help to solve NYT Wordle puzzles.',
    type: 'website',
    locale: 'en_US',
    siteName: 'WordleHint.help',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Wordle Hint Pro - Intelligent Wordle Hint System',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WordleHint.help - Wordle Hints Today | Wordle of the Day',
    description: 'Get daily Wordle hints today! Free Wordle of the day hints and progressive Wordle help to solve NYT Wordle puzzles.',
    images: ['/og-image.jpg'],
  },

  alternates: {
    canonical: 'https://wordlehint.help',
  },
  category: 'Games',
  classification: 'Educational Game',
  other: {
    'baidu-site-verification': 'your-verification-code',
    'google-site-verification': 'your-verification-code',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0ea5e9' },
    { media: '(prefers-color-scheme: dark)', color: '#0369a1' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Windows Tiles */}
        <meta name="msapplication-TileColor" content="#0ea5e9" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="application-name" content="WordleHint.help" />
        <meta name="apple-mobile-web-app-title" content="WordleHint" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-8G0ZQYZGZR"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-8G0ZQYZGZR');
            `
          }}
        />
        
        {/* AI-Friendly Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "WordleHint.help - Wordle Hints Today | Wordle of the Day",
              "description": "Get daily Wordle hints today! Free Wordle of the day hints and progressive Wordle help to solve NYT Wordle puzzles. AI-friendly Wordle solver and hint system.",
              "url": "https://wordlehint.help",
              "applicationCategory": "Game",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "WordleHint.help Team"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "1250"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} h-full antialiased`}>
        <div className="min-h-full bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          {children}
        </div>
      </body>
    </html>
  )
} 