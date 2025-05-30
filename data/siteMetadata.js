/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'Dariusz Woźniak | Blog',
  author: 'Dariusz Woźniak',
  headerTitle: 'Dariusz Woźniak',
  description: 'Blogging about dev, .NET and Optimizely',
  language: 'en-us',
  theme: 'system', // system, dark or light
  siteUrl: 'https://dariuszwozniak.net',
  siteRepo: 'https://github.com/dariusz-wozniak/dariuszwozniak.net-v2',
  siteLogo: '',
  socialBanner: '/static/images/socialbanner.png',
  mastodon: '',
  email: '',
  github: 'https://github.com/dariusz-wozniak',
  twitter: 'https://twitter.com/dwozn',
  facebook: '',
  youtube: '',
  linkedin: 'https://www.linkedin.com/in/wozniakdariusz',
  instagram: 'https://www.instagram.com/darek_wozn/',
  goodReads: 'https://www.goodreads.com/author/show/18135947.Dariusz_Wo_niak',
  stackOverflow: 'https://stackoverflow.com/users/297823/dariusz-wo%C5%BAniak',
  stackExchange: 'https://stackexchange.com/users/112989/dariusz-wo%c5%baniak?tab=accounts',
  kofi: 'https://ko-fi.com/dariuszwozniak',
  locale: 'en-US',
  analytics: {
    // If you want to use an analytics provider you have to add it to the
    // content security policy in the `next.config.js` file.
    // supports Plausible, Simple Analytics, Umami, Posthog or Google Analytics.
    umamiAnalytics: {
      // We use an env variable for this site to avoid other users cloning our analytics ID
      umamiWebsiteId: process.env.NEXT_UMAMI_ID, // e.g. 123e4567-e89b-12d3-a456-426614174000
    },
    // plausibleAnalytics: {
    //   plausibleDataDomain: '', // e.g. dariuszwozniak.net
    // },
    // simpleAnalytics: {},
    // posthogAnalytics: {
    //   posthogProjectApiKey: '', // e.g. 123e4567-e89b-12d3-a456-426614174000
    // },
    googleAnalytics: {
      googleAnalyticsId: 'G-NX9LP7Y2HW', // e.g. G-XXXXXXX
    },
  },
  newsletter: {
    // supports mailchimp, buttondown, convertkit, klaviyo, revue, emailoctopus
    // Please add your .env file and modify it according to your selection
    provider: 'buttondown',
  },
  comments: {
    // If you want to use an analytics provider you have to add it to the
    // content security policy in the `next.config.js` file.
    // Select a provider and use the environment variables associated to it
    // https://vercel.com/docs/environment-variables
    provider: 'giscus', // supported providers: giscus, utterances, disqus
    giscusConfig: {
      // Visit the link below, and follow the steps in the 'configuration' section
      // https://giscus.app/
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
      repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
      mapping: 'pathname', // supported options: pathname, url, title
      reactions: '1', // Emoji reactions: 1 = enable / 0 = disable
      // Send discussion metadata periodically to the parent window: 1 = enable / 0 = disable
      metadata: '0',
      // theme example: light, dark, dark_dimmed, dark_high_contrast
      // transparent_dark, preferred_color_scheme, custom
      theme: 'light',
      // theme when dark mode
      darkTheme: 'transparent_dark',
      // If the theme option above is set to 'custom`
      // please provide a link below to your custom theme css file.
      // example: https://giscus.app/themes/custom_example.css
      themeURL: '',
      // This corresponds to the `data-lang="en"` in giscus's configurations
      lang: 'en',
    },
  },
  search: {
    provider: 'kbar', // kbar or algolia
    kbarConfig: {
      searchDocumentsPath: 'search.json', // path to load documents to search
    },
    // provider: 'algolia',
    // algoliaConfig: {
    //   // The application ID provided by Algolia
    //   appId: 'R2IYF7ETH7',
    //   // Public API key: it is safe to commit it
    //   apiKey: '599cec31baffa4868cae4e79f180729b',
    //   indexName: 'docsearch',
    // },
  },
}

module.exports = siteMetadata
