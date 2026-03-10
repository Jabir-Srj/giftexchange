import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GiftCircle — Group Gifting Made Joyful',
  description: 'Organize gift exchanges with friends and family. Create wishlists, claim gifts, and make every occasion memorable.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400;1,700&family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-primary-900 text-cream-100">
        {children}
      </body>
    </html>
  )
}
