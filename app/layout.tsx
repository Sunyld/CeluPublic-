import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import '@/styles/globals.css'
import { Providers } from './providers'
import { WelcomePopup } from '@/components/shared/WelcomePopup'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'CeluPublic – Marketplace de Eletrônicos',
    description: 'Compre e venda celulares e eletrônicos em Moçambique.',
    other: {
        monetag: 'a0baaf6b88736b9af7ae429af8ee91bb',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt" suppressHydrationWarning>
            <head>
                <script src="" data-zone="260994" async data-cfasync="false"></script>
            </head>
            <body className={inter.className} suppressHydrationWarning>
                <Providers>
                    {children}
                    <WelcomePopup />
                </Providers>
                <Script
                    id="nap5k-ad-script"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `(function(s){s.dataset.zone='11342682',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`
                    }}
                />
                <Script
                    id="quge5-ad-script"
                    src="https://quge5.com/88/tag.min.js"
                    data-zone="261048"
                    async
                    strategy="afterInteractive"
                />
            </body>
        </html>
    )
}
