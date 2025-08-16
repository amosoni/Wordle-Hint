export const generateStructuredData = (page: string) => {
  const baseUrl = 'https://wordle-hint-pro.com'
  
  const baseData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Wordle Hint Pro",
    "description": "Smart progressive hint system for Wordle puzzles",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Wordle Hint Pro",
      "url": baseUrl
    }
  }

  const pageSpecificData = {
    home: {
      "@type": "WebPage",
      "name": "Wordle Hint Pro - Smart Progressive Hints",
      "description": "Get smart progressive hints for Wordle puzzles. Our AI-powered hint system provides 3 levels of assistance.",
      "url": baseUrl,
      "mainEntity": {
        "@type": "SoftwareApplication",
        "name": "Wordle Hint Pro",
        "applicationCategory": "Game",
        "operatingSystem": "Web Browser",
        "description": "AI-powered progressive hint system for Wordle puzzles"
      }
    },
    hints: {
      "@type": "WebPage",
      "name": "Daily Wordle Hints - Progressive Hint System",
      "description": "Get daily Wordle hints with our progressive hint system. Choose from 3 levels of assistance.",
      "url": `${baseUrl}/hints`,
      "mainEntity": {
        "@type": "Service",
        "name": "Wordle Hint System",
        "description": "Progressive hint system for Wordle puzzles",
        "provider": {
          "@type": "Organization",
          "name": "Wordle Hint Pro"
        }
      }
    },
    online: {
      "@type": "WebPage",
      "name": "Online Wordle Hints - Access Anywhere",
      "description": "Access Wordle hints online from anywhere! Cross-device compatibility and real-time updates.",
      "url": `${baseUrl}/online`,
      "mainEntity": {
        "@type": "WebApplication",
        "name": "Online Wordle Hints",
        "description": "Web-based Wordle hint platform",
        "applicationCategory": "Game",
        "operatingSystem": "Web Browser"
      }
    },
    game: {
      "@type": "WebPage",
      "name": "Play Wordle Online - Enhanced Wordle Game",
      "description": "Play Wordle online with our enhanced interface! Experience the classic Wordle game with improved UI.",
      "url": `${baseUrl}/game`,
      "mainEntity": {
        "@type": "Game",
        "name": "Wordle",
        "description": "Word guessing game with enhanced interface",
        "gamePlatform": "Web Browser",
        "genre": "Puzzle Game"
      }
    }
  }

  return {
    ...baseData,
    ...pageSpecificData[page as keyof typeof pageSpecificData]
  }
}

export const generateFAQStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Wordle Hint Pro?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Wordle Hint Pro is an AI-powered progressive hint system that provides 3 levels of assistance to help you solve Wordle puzzles while improving your skills."
      }
    },
    {
      "@type": "Question",
      "name": "How does the progressive hint system work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our hint system offers 3 levels: Level 1 provides gentle nudges, Level 2 gives strategic guidance, and Level 3 offers direct clues when you're really stuck."
      }
    },
    {
      "@type": "Question",
      "name": "Are the hints free to use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! All our Wordle hints are completely free to use. We believe in making Wordle help accessible to everyone."
      }
    },
    {
      "@type": "Question",
      "name": "Can I access hints on mobile devices?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely! Our platform is fully responsive and works perfectly on all devices including smartphones, tablets, and desktop computers."
      }
    }
  ]
}) 