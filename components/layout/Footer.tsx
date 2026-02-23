'use client';

import Link from 'next/link';
import { MessageCircle, Mail, MapPin } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { useApp } from '@/context/AppContext';
import { getAdminWhatsapp } from '@/lib/settingsHelpers';
import { BrandLogo } from '@/components/BrandLogo';

const currentYear = new Date().getFullYear();

const linkClass =
  'rounded-md text-muted-foreground transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

export function Footer() {
  const { publicSettings } = useApp();
  const adminWa = getAdminWhatsapp(publicSettings);

  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto min-w-0 max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="min-w-0">
            <BrandLogo variant="footer" linkToHome />
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/" className={linkClass}>
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/ajuda" className={linkClass}>
                  Como funciona
                </Link>
              </li>
              <li>
                <Link href="/termos" className={linkClass}>
                  Termos
                </Link>
              </li>
              <li>
                <Link href="/termos" className={linkClass}>
                  Privacidade
                </Link>
              </li>
            </ul>
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground">Para Vendedores</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/cadastro" className={linkClass}>
                  Criar conta
                </Link>
              </li>
              <li>
                <Link href="/termos" className={linkClass}>
                  Como publicar
                </Link>
              </li>
              <li>
                <Link href="/termos" className={linkClass}>
                  Regras e limites
                </Link>
              </li>
              <li>
                <a
                  href={`https://wa.me/${adminWa}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Suporte
                </a>
              </li>
            </ul>
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground">Explorar</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/anuncios?tipo=product" className={linkClass}>
                  Produtos
                </Link>
              </li>
              <li>
                <Link href="/anuncios?tipo=service" className={linkClass}>
                  Serviços
                </Link>
              </li>
              <li>
                <Link href="/categorias" className={linkClass}>
                  Categorias
                </Link>
              </li>
              <li>
                <Link href="/anuncios" className={linkClass}>
                  Mais curtidos
                </Link>
              </li>
            </ul>
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground">Contacto</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <a
                  href={`https://wa.me/${adminWa}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 ${linkClass}`}
                >
                  <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
                  WhatsApp do Admin
                </a>
              </li>
              <li>
                <a href="mailto:contacto@celupublic.com" className={`inline-flex items-center gap-2 ${linkClass}`}>
                  <Mail className="h-4 w-4 shrink-0" aria-hidden />
                  Email
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                Moçambique
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-8 text-center text-sm text-muted-foreground space-y-1">
          © {currentYear} {APP_NAME}. Todos os direitos reservados.
          <p>
            Powered by{' '}
            <a
              href="https://sunylddev.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Sunyld Matapa
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
