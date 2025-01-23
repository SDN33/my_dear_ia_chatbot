import type { Metadata } from 'next';
import { Toaster } from 'sonner';

import { ThemeProvider } from '@/components/theme-provider';
import CookiesConsent from '@/components/cookies-consent';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://mydear-ia.com'),
  alternates: {
    canonical: 'https://mydear.xyz',
  },
  title: 'My Dear IA | Un Assistant Plus Proche de Vous',
  description: 'My Dear IA est un assistant personnel qui te permet de discuter avec une intelligence artificielle pour te divertir, t\'informer et t\'aider dans ton quotidien.',
  icons: {
    icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"%3E%3Ccircle cx="16" cy="16" r="16" fill="%23F8E1E8"/%3E%3Ccircle cx="16" cy="16" r="12" fill="%23E8B4BC"/%3E%3Ccircle cx="16" cy="16" r="8" fill="%23B4D7D9"/%3E%3Ccircle cx="16" cy="16" r="3" fill="%23F8E1E8"/%3E%3Ccircle cx="16" cy="10" r="2" fill="%23F8E1E8"/%3E%3C/svg%3E',
  },
  openGraph: {
    title: 'My Dear IA | Un Assistant Plus Proche de Vous',
    description: 'My Dear IA est un assistant personnel connecté qui te permet de discuter avec une intelligence artificielle pour te divertir, t\'informer et t\'aider dans ton quotidien.',
    type: 'website',
    images: [{
      url: '/images/banner.png',
      alt: 'My Dear IA | Un Assistant Plus Proche de Vous',
    }],
  },
};

export const viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
};

const LIGHT_THEME_COLOR = '#E8B4BC';
const DARK_THEME_COLOR = 'hsl(240deg 10% 3.92%)';
const THEME_COLOR_SCRIPT = `\
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  function updateThemeColor() {
    var isDark = html.classList.contains('dark');
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  var observer = new MutationObserver(updateThemeColor);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  updateThemeColor();
})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      // `next-themes` injects an extra classname to the body element to avoid
      // visual flicker before hydration. Hence the `suppressHydrationWarning`
      // prop is necessary to avoid the React hydration mismatch warning.
      // https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: THEME_COLOR_SCRIPT,
          }}
        />
        <meta name="monetag" content="985202062f34f2ad512f3f312a091681"></meta>
        <meta name="google-adsense-account" content="ca-pub-2463769733352328"></meta>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456" crossorigin="anonymous"></script>

        <ins className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-2463769733352328"
          data-ad-slot="1761973122"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
        <script>
          (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-center" />
          {children}
        </ThemeProvider>
        <CookiesConsent />
      </body>
    </html>
  );
}
