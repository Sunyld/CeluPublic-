import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
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
            </body>
        </html>
    )
}
