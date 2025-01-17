import type { Metadata } from 'next';
import { Toaster } from 'sonner';

import { ThemeProvider } from '@/components/theme-provider';
import CookiesConsent from '@/components/cookies-consent';

import './globals.css';

export const metadata: Metadata = {
  title: 'My Dear IA | Un Assistant Plus Proche de Vous',
  description: 'My Dear IA est un assistant personnel qui te permet de discuter avec une intelligence artificielle pour te divertir, t\'informer et t\'aider dans ton quotidien.',
  icons: {
    icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"%3E%3Ccircle cx="16" cy="16" r="16" fill="%23F8E1E8"/%3E%3Ccircle cx="16" cy="16" r="12" fill="%23E8B4BC"/%3E%3Ccircle cx="16" cy="16" r="8" fill="%23B4D7D9"/%3E%3Ccircle cx="16" cy="16" r="3" fill="%23F8E1E8"/%3E%3Ccircle cx="16" cy="10" r="2" fill="%23F8E1E8"/%3E%3C/svg%3E',
  },
  openGraph: {
    images: [{
      url: '/images/banner.png',
      alt: 'My Dear IA - Un assistant IA qui vous comprend',
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
