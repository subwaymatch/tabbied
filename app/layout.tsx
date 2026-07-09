import type { Metadata, Viewport } from 'next';
import 'styles/globals.css';

export const metadata: Metadata = {
  title: 'Tabbied',
  description:
    'Tabbied lets you easily create timeless and beautifully generated patterns or artwork to use for wall art, websites, print materials and more.',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#5bbad5' },
    ],
  },
  other: {
    'msapplication-TileColor': '#00a300',
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* proxima-nova (Adobe Fonts). Linked here instead of an @import in
            globals.css so the browser discovers it from the HTML right away
            (an @import is only found after the CSS bundle downloads), and
            preconnected so the font files skip connection setup. React hoists
            both links into <head>; stylesheets need `precedence` for that. */}
        <link
          rel="preconnect"
          href="https://use.typekit.net"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://use.typekit.net/nws2bge.css"
          precedence="default"
        />
        {children}
      </body>
    </html>
  );
}
