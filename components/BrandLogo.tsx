import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

type BrandLogoProps = {
  /** header: 36–44px desktop; auth: 52–64px; dashboard: 36–48px */
  variant?: 'header' | 'auth' | 'dashboard' | 'footer';
  linkToHome?: boolean;
  className?: string;
  onClick?: () => void;
};

const variantClasses = {
  header: 'h-9 w-auto sm:h-10',      // 36–40px, prominent
  auth: 'h-14 w-auto sm:h-16',      // 52–64px
  dashboard: 'h-9 w-auto sm:h-10',  // 36–40px
  footer: 'h-8 w-auto',             // small brand mark
};

/**
 * Logo only — no "CeluPublic" text next to it.
 */
export function BrandLogo({
  variant = 'header',
  linkToHome = true,
  className = '',
  onClick,
}: BrandLogoProps) {
  const logoPath = '/assets/logo.png';

  const img = (
    <img
      src={logoPath}
      alt={APP_NAME}
      className={`shrink-0 rounded-lg object-contain ${variantClasses[variant]} ${className}`.trim()}
      loading={variant === 'footer' ? 'lazy' : undefined}
    />
  );

  if (linkToHome) {
    return (
      <Link
        href="/"
        className="inline-flex shrink-0 items-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&:focus]:outline-none"
        onClick={onClick}
      >
        {img}
      </Link>
    );
  }
  return <span className="inline-flex items-center">{img}</span>;
}
